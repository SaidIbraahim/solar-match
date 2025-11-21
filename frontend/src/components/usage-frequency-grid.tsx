"use client";

import clsx from "clsx";
import { Sunrise, Moon, Sun, Clock } from "lucide-react";

import {
  PRESET_TO_DEFAULT_OPTION,
  UsageScheduleOptionId,
  USAGE_SCHEDULE_OPTIONS,
} from "@/lib/constants";
import { getIcon } from "@/lib/icon-map";
import { AppliancePreset, ApplianceSelection } from "@/lib/types";

const SCHEDULE_ICONS: Record<UsageScheduleOptionId, typeof Sunrise> = {
  morning: Sunrise,
  evening: Moon,
  all_day: Sun,
  sometimes: Clock,
};

interface UsageFrequencyGridProps {
  appliances: AppliancePreset[];
  selections: ApplianceSelection[];
  selectedOptions: Record<string, UsageScheduleOptionId | undefined>;
  onOptionChange: (
    applianceId: string,
    optionId: UsageScheduleOptionId,
  ) => void;
}

export const UsageFrequencyGrid = ({
  appliances,
  selections,
  selectedOptions,
  onOptionChange,
}: UsageFrequencyGridProps) => {
  if (!selections.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/60 p-6 text-center text-sm text-slate-500">
        Select at least one appliance first.
      </div>
    );
  }

  const applianceMap = new Map(appliances.map((item) => [item.id, item]));

  const getSelectedOptionId = (
    applianceId: string,
    preset: ApplianceSelection["preset"],
  ) => selectedOptions[applianceId] ?? PRESET_TO_DEFAULT_OPTION[preset];

  return (
    <div className="space-y-6">
      {selections.map((selection) => {
        const preset = applianceMap.get(selection.applianceId);
        if (!preset) return null;
        const Icon = getIcon(preset.icon);
        const currentOptionId = getSelectedOptionId(
          selection.applianceId,
          selection.preset,
        );

        return (
          <div
            key={selection.applianceId}
            className="rounded-[28px] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD348] text-[#0C3B2E]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-[#0C3B2E]">
                      {preset.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Quantity: {selection.quantity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {USAGE_SCHEDULE_OPTIONS.map((option) => {
                  const isActive = currentOptionId === option.id;
                  const Icon = SCHEDULE_ICONS[option.id];
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        onOptionChange(selection.applianceId, option.id)
                      }
                      className={clsx(
                        "flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border px-2 sm:px-3 py-3 sm:py-4 transition",
                        isActive
                          ? "border-[#2E90FF] bg-[#2E90FF]/10 shadow-inner"
                          : "border-slate-200 bg-white hover:border-[#2E90FF]",
                      )}
                    >
                      <Icon
                        className={clsx(
                          "h-5 w-5 sm:h-6 sm:w-6",
                          isActive ? "text-[#2E90FF]" : "text-slate-400",
                        )}
                      />
                      <div className="text-center">
                        <p
                          className={clsx(
                            "text-xs sm:text-sm font-semibold",
                            isActive ? "text-[#0C3B2E]" : "text-slate-700",
                          )}
                        >
                          {option.label}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-500">
                          {option.subLabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

