import {
  ApplianceSelection,
  BusinessTemplate,
  BusinessTemplateId,
  UsagePreset,
} from "../types/solar";

const selection = (
  applianceId: string,
  preset: UsagePreset,
  quantity: number,
): ApplianceSelection => ({
  applianceId,
  preset,
  quantity,
});

export const BUSINESS_TEMPLATES: Record<BusinessTemplateId, BusinessTemplate> = {
  home: {
    id: "home",
    name: "Small Home",
    description: "Typical 2-3 room home with essential lighting and cooling.",
    typicalDailyKwhRange: [1.5, 4],
    multipliers: {
      lighting: 1,
      cooling: 1,
      refrigeration: 1,
      electronics: 1,
    },
    defaultAppliances: [
      selection("led_bulb", "normal", 4),
      selection("standing_fan", "normal", 1),
      selection("fridge_small", "normal", 1),
      selection("phone_charger", "normal", 1),
      selection("tv_mid", "light", 1),
    ],
  },
  large_home: {
    id: "large_home",
    name: "Large Home",
    description: "Bigger family house with multiple fans and appliances.",
    typicalDailyKwhRange: [3, 8],
    multipliers: {
      lighting: 1.2,
      cooling: 1.4,
      refrigeration: 1.2,
      electronics: 1.15,
    },
    defaultAppliances: [
      selection("led_bulb", "heavy", 6),
      selection("ceiling_fan", "normal", 2),
      selection("standing_fan", "normal", 2),
      selection("fridge_large", "normal", 1),
      selection("tv_mid", "normal", 1),
      selection("laptop", "normal", 1),
    ],
  },
  shop: {
    id: "shop",
    name: "Retail Shop",
    description: "Corner shop / kiosk with lights, freezer and POS.",
    typicalDailyKwhRange: [4, 10],
    multipliers: {
      lighting: 1.4,
      refrigeration: 1.3,
      electronics: 1.2,
      pumps: 1.1,
    },
    defaultAppliances: [
      selection("shop_lighting", "heavy", 1),
      selection("pos_terminal", "normal", 1),
      selection("freezer", "normal", 1),
      selection("phone_charger", "heavy", 1),
    ],
  },
  clinic: {
    id: "clinic",
    name: "Clinic / Pharmacy",
    description: "Basic clinic with diagnostics and cold-chain equipment.",
    typicalDailyKwhRange: [5, 14],
    multipliers: {
      lighting: 1.3,
      medical: 1.4,
      refrigeration: 1.4,
      electronics: 1.2,
    },
    defaultAppliances: [
      selection("led_bulb", "heavy", 6),
      selection("clinic_instruments", "normal", 1),
      selection("incubator", "heavy", 1),
      selection("fridge_large", "heavy", 1),
      selection("pos_terminal", "normal", 1),
    ],
  },
};

