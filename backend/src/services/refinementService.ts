import { SYSTEM_CONSTANTS } from "../constants/usage";
import {
  ApplianceUsageBreakdown,
  BusinessTemplate,
  SolarPlanInput,
} from "../types/solar";

interface RefinementInput {
  template: BusinessTemplate;
  payload: SolarPlanInput;
  totalDailyWh: number;
  applianceBreakdown: ApplianceUsageBreakdown[];
}

export interface RefinementResult {
  adjustedDailyWh: number;
  effectiveDailyKwh: number;
  notes: string[];
}

const toDailyWhFromBill = (
  payload: SolarPlanInput,
): { value: number; source: string } | null => {
  if (payload.billKwhPerMonth && payload.billKwhPerMonth > 0) {
    return {
      value: (payload.billKwhPerMonth * 1000) / 30,
      source: "kWh",
    };
  }
  if (payload.billAmountUsd && payload.billAmountUsd > 0) {
    const monthlyKwh = payload.billAmountUsd / SYSTEM_CONSTANTS.gridRatePerKwh;
    return { value: (monthlyKwh * 1000) / 30, source: "amount" };
  }
  return null;
};

export const refineEstimate = ({
  template,
  payload,
  totalDailyWh,
}: RefinementInput): RefinementResult => {
  const notes: string[] = [];
  let adjustedDailyWh = totalDailyWh;

  const bill = toDailyWhFromBill(payload);
  if (bill) {
    adjustedDailyWh =
      adjustedDailyWh * 0.3 + bill.value * 0.7; // bill has more weight
    notes.push(
      `Calibrated using monthly bill (${bill.source === "kWh" ? "kWh" : "USD"}).`,
    );
  }

  const [minKwh, maxKwh] = template.typicalDailyKwhRange;
  const minWh = minKwh * 1000;
  const maxWh = maxKwh * 1000;
  if (adjustedDailyWh < minWh) {
    adjustedDailyWh = Math.max(minWh * 0.85, adjustedDailyWh * 0.8);
    notes.push("Raised load to template minimum for reliability.");
  }
  if (adjustedDailyWh > maxWh) {
    adjustedDailyWh = Math.min(maxWh * 1.1, adjustedDailyWh * 0.9);
    notes.push("Trimmed unusually high load to stay within template norms.");
  }

  const effectiveDailyKwh =
    adjustedDailyWh /
    1000 /
    (SYSTEM_CONSTANTS.inverterEfficiency * SYSTEM_CONSTANTS.wiringLosses);

  return { adjustedDailyWh, effectiveDailyKwh, notes };
};

