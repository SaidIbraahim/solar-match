import { SolarPlanResult } from "../types/solar";

export const generatePlanNarrative = (plan: SolarPlanResult): string => {
  const toneByStatus: Record<typeof plan.healthStatus, string> = {
    optimal:
      "This plan is in the green zone, so you can confidently move forward.",
    caution:
      "This plan is workable, but you should double-check appliance usage or consider a slightly bigger budget.",
    review:
      "This plan needs attention. Please review your appliance list or talk to an installer for a custom quote.",
  };

  const templateLabel = plan.templateId.replace("_", " ");

  return (
    `For the ${templateLabel} setup, SolarMatch recommends ${plan.panelCount} x ${plan.panelWattEach}W panels ` +
    `(${plan.panelWattage}W total) paired with ${plan.batteryCapacityAh}Ah @${plan.batterySystemVoltage}V battery storage. ` +
    `This configuration delivers about ${plan.monthlyProductionKwh} kWh each month and could save roughly $${plan.monthlySavingsUsd.toFixed(2)}. ` +
    `Estimated payback is ${plan.paybackYears.toFixed(1)} years and avoids ${plan.co2AvoidedTonsPerYear.toFixed(2)} tons of CO₂ annually. ` +
    toneByStatus[plan.healthStatus]
  );
};

