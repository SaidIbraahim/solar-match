"use client";

import clsx from "clsx";

import { getIcon } from "@/lib/icon-map";
import { AppliancePreset, ApplianceSelection } from "@/lib/types";

interface ApplianceSelectorProps {
  appliances: AppliancePreset[];
  selections: ApplianceSelection[];
  onQuantityChange: (applianceId: string, quantity: number) => void;
  isLoading?: boolean;
}

export const ApplianceSelector = ({
  appliances,
  selections,
  onQuantityChange,
  isLoading,
}: ApplianceSelectorProps) => {
  if (isLoading) {
    return (
      <div className="rounded-[32px] border border-dashed border-[#FFD348] bg-white/70 p-8 text-center text-sm text-slate-500">
        Loading appliances...
      </div>
    );
  }

  const selectionMap = new Map(
    selections.map((selection) => [selection.applianceId, selection]),
  );

  const grouped = appliances.reduce<Record<string, AppliancePreset[]>>(
    (acc, appliance) => {
      const category = appliance.category || "Other";
      acc[category] = acc[category] ?? [];
      acc[category].push(appliance);
      return acc;
    },
    {},
  );

  const sortedCategories = Object.keys(grouped).sort();

  const adjustQuantity = (applianceId: string, next: number) => {
    if (next < 0) return;
    onQuantityChange(applianceId, next);
  };

  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => (
        <div key={category} className="space-y-3">
          <p className="text-lg font-semibold text-slate-700">{category}</p>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {grouped[category].map((appliance) => {
              const Icon = getIcon(appliance.icon);
              const selection = selectionMap.get(appliance.id);
              const quantity = selection?.quantity ?? 0;
              const isSelected = quantity > 0;

              return (
                <div
                  key={appliance.id}
                  className={clsx(
                    "flex flex-col gap-3 rounded-2xl sm:rounded-[28px] border border-transparent bg-white px-4 sm:px-6 py-4 sm:py-5 text-center shadow-md transition",
                    "hover:-translate-y-0.5 hover:shadow-lg",
                    isSelected && "ring-2 ring-[#2E90FF]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() =>
                      adjustQuantity(
                        appliance.id,
                        isSelected ? 0 : Math.max(quantity, 1),
                      )
                    }
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD348] text-[#0C3B2E] shadow-sm">
                      <Icon className="h-7 w-7" />
                    </span>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-[#0C3B2E]">
                        {appliance.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                        {appliance.category}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        ~{appliance.avgWatt} W
                      </p>
                    </div>
                  </button>
                  <div className="mx-auto flex items-center gap-3 rounded-full bg-slate-50 px-4 py-1.5 text-sm font-semibold text-slate-700">
                    <button
                      type="button"
                      onClick={() => adjustQuantity(appliance.id, quantity - 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-700 transition hover:border-[#2E90FF]"
                      disabled={quantity === 0}
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => adjustQuantity(appliance.id, quantity + 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-700 transition hover:border-[#2E90FF]"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
