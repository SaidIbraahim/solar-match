"use client";

import { USAGE_SCHEDULE_OPTIONS } from "@/lib/constants";

export const UsageLegend = () => (
  <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
    {USAGE_SCHEDULE_OPTIONS.map((option) => (
      <div
        key={option.id}
        className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>{option.label}</span>
        {option.subLabel && (
          <span className="text-xs text-slate-400">({option.subLabel})</span>
        )}
      </div>
    ))}
  </div>
);

