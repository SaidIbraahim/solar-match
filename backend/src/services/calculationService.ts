import {
  BATTERY_SYSTEM_OPTIONS,
  PANEL_SKU_OPTIONS,
  PLAN_STATUS_THRESHOLDS,
  SYSTEM_CONSTANTS,
} from "../constants/usage";
import { APPLIANCE_PRESETS } from "../data/appliancePresets";
import { BUSINESS_TEMPLATES } from "../data/businessTemplates";
import {
  AppliancePreset,
  ApplianceUsageBreakdown,
  BusinessTemplate,
  SolarPlanInput,
  SolarPlanResult,
  UsagePreset,
} from "../types/solar";
import { refineEstimate } from "./refinementService";

const PRESET_MAP = new Map(APPLIANCE_PRESETS.map((preset) => [preset.id, preset]));

const evaluateStatus = (paybackYears: number) => {
  if (paybackYears <= PLAN_STATUS_THRESHOLDS.optimalPaybackYears) {
    return { healthStatus: "optimal" as const, statusColor: "green" as const };
  }
  if (paybackYears <= PLAN_STATUS_THRESHOLDS.cautionPaybackYears) {
    return { healthStatus: "caution" as const, statusColor: "yellow" as const };
  }
  return { healthStatus: "review" as const, statusColor: "red" as const };
};

const pickRunningWatt = (preset: AppliancePreset, usagePreset: UsagePreset) => {
  if (usagePreset === "light") {
    return preset.minWatt ?? preset.avgWatt * 0.85;
  }
  if (usagePreset === "heavy") {
    return preset.maxWatt ?? preset.avgWatt * 1.1;
  }
  return preset.avgWatt;
};

const pickPanelConfig = (targetWattage: number) => {
  let best = { panelWattEach: PANEL_SKU_OPTIONS[0], panelCount: 1 };
  let smallestExcess = Infinity;

  PANEL_SKU_OPTIONS.forEach((sku) => {
    const count = Math.max(1, Math.ceil(targetWattage / sku));
    const total = count * sku;
    const excess = total - targetWattage;
    if (excess < smallestExcess) {
      smallestExcess = excess;
      best = { panelWattEach: sku, panelCount: count };
    }
  });
  return best;
};

const pickBatteryConfig = (requiredWh: number) => {
  for (const option of BATTERY_SYSTEM_OPTIONS) {
    const capacityAh = requiredWh / option.voltage;
    if (capacityAh <= option.maxAh) {
      return {
        voltage: option.voltage,
        capacityAh: Math.ceil(capacityAh / 10) * 10,
      };
    }
  }
  const last = BATTERY_SYSTEM_OPTIONS[BATTERY_SYSTEM_OPTIONS.length - 1];
  const capacityAh = requiredWh / last.voltage;
  return {
    voltage: last.voltage,
    capacityAh: Math.ceil(capacityAh / 10) * 10,
  };
};

const getTemplate = (templateId: BusinessTemplate["id"]): BusinessTemplate =>
  BUSINESS_TEMPLATES[templateId] ?? BUSINESS_TEMPLATES.home;

export const computeSolarPlan = (payload: SolarPlanInput): SolarPlanResult => {
  const template = getTemplate(payload.templateId);
  const selections =
    payload.appliances.length > 0
      ? payload.appliances
      : template.defaultAppliances;

  const breakdown: ApplianceUsageBreakdown[] = [];
  let totalDailyWh = 0;
  let peakSurge = 0;

  selections.forEach((selection) => {
    const preset = PRESET_MAP.get(selection.applianceId);
    if (!preset) return;

    const qty = Math.max(1, Math.min(3, selection.quantity));
    const templateMultiplier = template.multipliers[preset.category] ?? 1;
    const hours =
      (preset.typicalUsageHours[selection.preset] ?? 0) * templateMultiplier;
    const runningWatt = pickRunningWatt(preset, selection.preset);
    const dailyWh =
      runningWatt * hours * preset.dutyCycle * qty;

    totalDailyWh += dailyWh;
    peakSurge = Math.max(peakSurge, preset.surgeWatt * qty);

    breakdown.push({
      id: preset.id,
      name: preset.name,
      category: preset.category,
      preset: selection.preset,
      quantity: qty,
      hoursPerDay: Number(hours.toFixed(2)),
      wattage: Math.round(runningWatt),
      dailyWh: Math.round(dailyWh),
    });
  });

  if (totalDailyWh < 800) {
    totalDailyWh = 800;
  }

  const refinement = refineEstimate({
    template,
    payload,
    totalDailyWh,
    applianceBreakdown: breakdown,
  });

  const panelTargetWatt =
    (refinement.effectiveDailyKwh / SYSTEM_CONSTANTS.solarIrradianceHours) *
    1000 *
    SYSTEM_CONSTANTS.safetyFactor;

  const { panelCount, panelWattEach } = pickPanelConfig(panelTargetWatt);
  const finalPanelWattage = panelCount * panelWattEach;

  const batteryWhNeeded =
    refinement.adjustedDailyWh * SYSTEM_CONSTANTS.autonomyDays;
  const battery =
    pickBatteryConfig(batteryWhNeeded / SYSTEM_CONSTANTS.depthOfDischarge);

  const estimatedCostUsd = Math.round(
    finalPanelWattage * SYSTEM_CONSTANTS.panelPricePerWatt +
      battery.capacityAh * SYSTEM_CONSTANTS.batteryPricePerAh +
      SYSTEM_CONSTANTS.balanceOfSystemCost,
  );

  const monthlyProductionKwh = Number(
    (
      (finalPanelWattage / 1000) *
      SYSTEM_CONSTANTS.solarIrradianceHours *
      30 *
      SYSTEM_CONSTANTS.inverterEfficiency *
      SYSTEM_CONSTANTS.wiringLosses
    ).toFixed(2),
  );

  const monthlySavingsUsd = Number(
    (monthlyProductionKwh * SYSTEM_CONSTANTS.gridRatePerKwh).toFixed(2),
  );

  const paybackMonths = Number(
    (estimatedCostUsd / Math.max(monthlySavingsUsd, 1)).toFixed(1),
  );
  const paybackYears = Number((paybackMonths / 12).toFixed(2));

  const co2AvoidedTonsPerYear = Number(
    (
      (monthlyProductionKwh * 12 * SYSTEM_CONSTANTS.gridEmissionFactorKg) /
      1000
    ).toFixed(2),
  );

  const { healthStatus, statusColor } = evaluateStatus(paybackYears);

  const inverterSurgeWatt = Math.round(
    peakSurge * SYSTEM_CONSTANTS.concurrencyFactor,
  );

  return {
    templateId: template.id,
    totalDailyWh: Math.round(totalDailyWh),
    totalDailyKwh: Number((totalDailyWh / 1000).toFixed(2)),
    effectiveDailyKwh: Number(refinement.effectiveDailyKwh.toFixed(2)),
    panelWattage: finalPanelWattage,
    panelCount,
    panelWattEach,
    batteryCapacityAh: battery.capacityAh,
    batterySystemVoltage: battery.voltage,
    inverterSurgeWatt,
    estimatedCostUsd,
    monthlySavingsUsd,
    paybackMonths,
    paybackYears,
    co2AvoidedTonsPerYear,
    monthlyProductionKwh,
    healthStatus,
    statusColor,
    applianceBreakdown: breakdown,
    refinementNotes: refinement.notes,
    assumptions: {
      solarIrradianceHours: SYSTEM_CONSTANTS.solarIrradianceHours,
      autonomyDays: SYSTEM_CONSTANTS.autonomyDays,
      safetyFactor: SYSTEM_CONSTANTS.safetyFactor,
      inverterEfficiency: SYSTEM_CONSTANTS.inverterEfficiency,
      wiringLosses: SYSTEM_CONSTANTS.wiringLosses,
      depthOfDischarge: SYSTEM_CONSTANTS.depthOfDischarge,
    },
  };
};

