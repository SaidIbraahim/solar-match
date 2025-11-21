import { UsagePreset } from "../types/solar";

export const USAGE_PRESET_LABELS: Record<
  UsagePreset,
  { title: string; helper: string }
> = {
  light: { title: "Light", helper: "Short bursts / sometimes" },
  normal: { title: "Normal", helper: "Typical daily use" },
  heavy: { title: "Heavy", helper: "Runs for long hours" },
};

export const SYSTEM_CONSTANTS = {
  solarIrradianceHours: 5.8,
  safetyFactor: 1.25,
  baseSystemVoltage: 12,
  autonomyDays: 1.5,
  panelPricePerWatt: 1.05,
  batteryPricePerAh: 1.35,
  balanceOfSystemCost: 320,
  gridRatePerKwh: 0.62,
  gridEmissionFactorKg: 0.5,
  inverterEfficiency: 0.9,
  wiringLosses: 0.95,
  depthOfDischarge: 0.5,
  concurrencyFactor: 1.15,
};

export const PLAN_STATUS_THRESHOLDS = {
  optimalPaybackYears: 3,
  cautionPaybackYears: 5,
};

export const PANEL_SKU_OPTIONS = [200, 250, 300, 400];

export const BATTERY_SYSTEM_OPTIONS = [
  { voltage: 12, maxAh: 400 },
  { voltage: 24, maxAh: 800 },
  { voltage: 48, maxAh: 1200 },
];

