"use client";

import { STATUS_COPY } from "@/lib/constants";
import { SolarPlanResult } from "@/lib/types";
import { t } from "@/lib/i18n";
import {
  BatteryCharging,
  Leaf,
  PanelsTopLeft,
  PiggyBank,
} from "lucide-react";
import clsx from "clsx";

interface ResultPanelProps {
  plan?: SolarPlanResult;
  loading?: boolean;
}

const LoadingState = () => (
  <div className="rounded-3xl border border-dashed border-emerald-300 bg-white/60 p-8 text-center">
    <p className="text-lg font-semibold text-emerald-900">
      Ready when you are
    </p>
    <p className="text-sm text-slate-500">
      Select appliances and tap “Generate Solar Plan”.
    </p>
  </div>
);

export const ResultPanel = ({ plan, loading }: ResultPanelProps) => {
  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-emerald-100 bg-white p-8" />
    );
  }

  if (!plan) {
    return <LoadingState />;
  }

  const status = STATUS_COPY[plan.healthStatus];

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-100/50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-400">
            Solar Plan
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 break-words">
            {plan.panelCount}×{plan.panelWattEach} W • {plan.batteryCapacityAh} Ah @
            {plan.batterySystemVoltage} V
          </p>
        </div>
        <span
          className={clsx(
            "rounded-full px-3 py-1 text-sm font-semibold capitalize",
            plan.statusColor === "green" && "bg-emerald-100 text-emerald-700",
            plan.statusColor === "yellow" && "bg-amber-100 text-amber-800",
            plan.statusColor === "red" && "bg-rose-100 text-rose-700",
          )}
        >
          {status.title}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-600">{status.copy}</p>
      {plan.explanation && (
        <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
          {plan.explanation}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <DataCard
          icon={<PanelsTopLeft className="h-5 w-5" />}
          label={t().results.panelSize}
          value={`${plan.panelWattage} W array`}
          helper={`${plan.panelCount} panels • ${plan.totalDailyKwh.toFixed(2)} kWh/day`}
        />
        <DataCard
          icon={<BatteryCharging className="h-5 w-5" />}
          label={t().results.battery}
          value={`${plan.batteryCapacityAh} Ah`}
          helper={`${plan.assumptions.autonomyDays} ${t().results.autonomyDays}`}
        />
        <DataCard
          icon={<PiggyBank className="h-5 w-5" />}
          label={t().results.monthlySavings}
          value={`$${plan.monthlySavingsUsd.toFixed(2)}`}
          helper={`${t().results.payback} ${plan.paybackMonths.toFixed(0)} months`}
        />
        <DataCard
          icon={<Leaf className="h-5 w-5" />}
          label={t().results.co2Avoided}
          value={`${plan.co2AvoidedTonsPerYear} t/yr`}
          helper={`${plan.monthlyProductionKwh} ${t().results.monthlyProduction}`}
        />
      </div>
      {plan.refinementNotes?.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">
            {t().results.refinementNotes}
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {plan.refinementNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface DataCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper?: string;
}

const DataCard = ({ icon, label, value, helper }: DataCardProps) => (
  <div className="rounded-2xl border border-slate-100 p-4">
    <div className="flex items-center gap-2 text-emerald-600">{icon}</div>
    <p className="mt-2 text-sm uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <p className="text-xl font-semibold text-slate-900">{value}</p>
    {helper && <p className="text-sm text-slate-500">{helper}</p>}
  </div>
);

