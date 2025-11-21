export type UsagePreset = "light" | "normal" | "heavy";

export type BusinessTemplateId = "home" | "large_home" | "shop" | "clinic";

export type PlanStatus = "optimal" | "caution" | "review";

export interface AppliancePreset {
  id: string;
  name: string;
  category: string;
  icon: string;
  imageUrl?: string;
  avgWatt: number;
  minWatt: number;
  maxWatt: number;
  surgeWatt: number;
  dutyCycle: number;
  typicalUsageHours: Record<UsagePreset, number>;
  notes?: string;
}

export interface ApplianceSelection {
  applianceId: string;
  preset: UsagePreset;
  quantity: number;
}

export interface ApplianceUsageBreakdown {
  id: string;
  name: string;
  category: string;
  preset: UsagePreset;
  quantity: number;
  hoursPerDay: number;
  wattage: number;
  dailyWh: number;
}

export interface BusinessTemplate {
  id: BusinessTemplateId;
  name: string;
  description: string;
  multipliers: Record<string, number>;
  defaultAppliances: ApplianceSelection[];
  typicalDailyKwhRange: [number, number];
}

export interface SolarPlanInput {
  templateId: BusinessTemplateId;
  appliances: ApplianceSelection[];
  billAmountUsd?: number;
  billKwhPerMonth?: number;
  location?: string;
}

export interface SolarPlanResult {
  templateId: BusinessTemplateId;
  totalDailyWh: number;
  totalDailyKwh: number;
  effectiveDailyKwh: number;
  panelWattage: number;
  panelCount: number;
  panelWattEach: number;
  batteryCapacityAh: number;
  batterySystemVoltage: number;
  inverterSurgeWatt: number;
  estimatedCostUsd: number;
  monthlySavingsUsd: number;
  paybackMonths: number;
  paybackYears: number;
  co2AvoidedTonsPerYear: number;
  monthlyProductionKwh: number;
  healthStatus: PlanStatus;
  statusColor: "green" | "yellow" | "red";
  applianceBreakdown: ApplianceUsageBreakdown[];
  refinementNotes: string[];
  assumptions: {
    solarIrradianceHours: number;
    autonomyDays: number;
    safetyFactor: number;
    inverterEfficiency: number;
    wiringLosses: number;
    depthOfDischarge: number;
  };
}

export interface RetailerProduct {
  name: string;
  imageUrl?: string;
  description?: string;
}

export interface Retailer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  location: string;
  distanceKm: number;
  rating: number;
  products: string[];
  productDetails?: RetailerProduct[];
  approximatePricesUsd: {
    panelWatt?: number;
    batteryAh?: number;
    package?: number;
  };
  languages: string[];
}

export interface SavedPlan {
  id: string;
  createdAt: string;
  payload: SolarPlanInput;
  result: SolarPlanResult;
  retailerIds: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

