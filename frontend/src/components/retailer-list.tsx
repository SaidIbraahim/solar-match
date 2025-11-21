"use client";

import { CheckCircle2, MapPin, Phone } from "lucide-react";

import { Retailer } from "@/lib/types";
import clsx from "clsx";

interface RetailerListProps {
  retailers: Retailer[];
  selected: string[];
  onToggle: (id: string) => void;
}

export const RetailerList = ({
  retailers,
  selected,
  onToggle,
}: RetailerListProps) => {
  if (!retailers.length) {
    return (
      <div className="rounded-2xl border border-slate-100 p-6 text-sm text-slate-500">
        Retailer data will appear here once seeded.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {retailers.map((retailer) => {
        const isSelected = selected.includes(retailer.id);
        return (
          <button
            key={retailer.id}
            type="button"
            onClick={() => onToggle(retailer.id)}
            className={clsx(
              "w-full rounded-2xl border p-4 text-left transition",
              isSelected
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-100 hover:border-emerald-200",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{retailer.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {retailer.location} • {retailer.distanceKm} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {retailer.phone}
                  </span>
                </div>
              </div>
              <CheckCircle2
                className={clsx(
                  "h-6 w-6",
                  isSelected ? "text-emerald-600" : "text-slate-300",
                )}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              {retailer.products.map((product) => (
                <span
                  key={product}
                  className="rounded-full bg-white px-3 py-1 shadow-sm"
                >
                  {product}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

