export type UsagePreset = "light" | "normal" | "heavy";

export type TemplateId = "home" | "large_home" | "shop" | "clinic";

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

export interface BusinessTemplate {
  id: TemplateId;
  name: string;
  description: string;
  multipliers: Record<string, number>;
  defaultAppliances: ApplianceSelection[];
  typicalDailyKwhRange: [number, number];
}

export interface SolarPlanResult {
  templateId: TemplateId;
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
  healthStatus: "optimal" | "caution" | "review";
  statusColor: "green" | "yellow" | "red";
  explanation?: string;
  refinementNotes: string[];
  applianceBreakdown: Array<{
    id: string;
    name: string;
    category: string;
    preset: UsagePreset;
    quantity: number;
    hoursPerDay: number;
    wattage: number;
    dailyWh: number;
  }>;
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

export interface SavePlanPayload {
  templateId: TemplateId;
  appliances: ApplianceSelection[];
  billAmountUsd?: number;
  billKwhPerMonth?: number;
  location?: string;
  contactName: string;
  contactPhone: string;
  retailerIds?: string[];
}

