"use client";

import { getIcon } from "@/lib/icon-map";
import { BusinessTemplate, TemplateId } from "@/lib/types";
import clsx from "clsx";

interface ProfileSelectorProps {
  templates: BusinessTemplate[];
  value: TemplateId;
  onChange: (value: TemplateId) => void;
}

export const ProfileSelector = ({
  templates,
  value,
  onChange,
}: ProfileSelectorProps) => {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
      {templates.map((template) => {
        const iconName =
          template.id === "home"
            ? "Home"
            : template.id === "large_home"
              ? "Building"
              : template.id === "shop"
                ? "Store"
                : "Hospital";
        const Icon = getIcon(iconName);
        const isActive = value === template.id;
        const [minKwh, maxKwh] = template.typicalDailyKwhRange;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={clsx(
              "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-[24px] border border-transparent bg-white p-4 sm:p-5 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E90FF]",
              isActive && "ring-2 ring-[#2E90FF]"
            )}
          >
            <span
              className={clsx(
                "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-[#FFD348] text-[#0C3B2E] flex-shrink-0",
                isActive && "shadow-lg"
              )}
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-semibold text-[#0C3B2E]">
                {template.name}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">{template.description}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mt-1">
                {minKwh}-{maxKwh} kWh / day
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

