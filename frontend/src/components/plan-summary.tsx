"use client";

import { SolarPlanResult } from "@/lib/types";

interface PlanSummaryProps {
  plan?: SolarPlanResult;
}

export const PlanSummary = ({ plan }: PlanSummaryProps) => {
  if (!plan) return null;

  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4">
      <p className="text-sm font-semibold text-slate-800">
        Appliance breakdown
      </p>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        {plan.applianceBreakdown.length === 0 && (
          <p>No specific appliances selected. Using baseline load.</p>
        )}
        {plan.applianceBreakdown.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-slate-50 px-3 py-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {item.category} • {item.preset} • qty {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-slate-900">
                {item.dailyWh.toLocaleString()} Wh/day
              </p>
            </div>
            <p className="text-xs text-slate-500">
              {item.hoursPerDay} hrs / day @ {item.wattage} W
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

