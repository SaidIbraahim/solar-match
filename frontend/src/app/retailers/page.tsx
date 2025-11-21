"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRetailers } from "@/lib/api";
import { Retailer } from "@/lib/types";
import { Phone, MessageCircle, MapPin, Star, Package, ChevronLeft, ArrowLeft } from "lucide-react";
import { t } from "@/lib/i18n";
import Image from "next/image";

export default function RetailersPage() {
  const router = useRouter();
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const translations = t();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRetailers();
        setRetailers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, "").replace(/\+/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <p className="text-lg text-slate-600">{translations.retailers.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <p className="text-lg text-rose-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <header className="bg-[#0C3B2E] px-3 sm:px-4 py-6 sm:py-8 relative">
        <button
          type="button"
          onClick={() => {
            // Check if we came from step 5
            const returnStep = sessionStorage.getItem("solarmatch_return_step");
            if (returnStep === "5") {
              sessionStorage.removeItem("solarmatch_return_step");
              router.push("/?step=5");
            } else {
              router.push("/");
            }
          }}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 rounded-full bg-white/20 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/30 backdrop-blur-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          {t().common.back}
        </button>
        <div className="mx-auto max-w-7xl pt-10 sm:pt-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {translations.retailers.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100">
            {translations.retailers.subtitle}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {retailers.map((retailer) => (
            <div
              key={retailer.id}
              className="group rounded-[32px] bg-white shadow-xl shadow-emerald-100/60 overflow-hidden transition-all hover:shadow-2xl hover:shadow-emerald-200/80"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">
                      {retailer.name}
                    </h2>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(retailer.rating)
                              ? "fill-[#FFD348] text-[#FFD348]"
                              : "text-white/30"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm opacity-90">
                        {retailer.rating}
                      </span>
                    </div>
                  </div>
                  {retailer.distanceKm && (
                    <span className="text-sm font-semibold bg-white/20 rounded-full px-3 py-1">
                      {retailer.distanceKm} {translations.retailers.distance}
                    </span>
                  )}
                </div>

                {/* Location */}
                {retailer.location && (
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin className="h-4 w-4" />
                    <span>{retailer.location}</span>
                  </div>
                )}
              </div>

              {/* Product Images Section */}
              {retailer.productDetails && retailer.productDetails.length > 0 && (
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-slate-800">
                      {translations.retailers.products}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {retailer.productDetails.slice(0, 3).map((product, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 group/product"
                      >
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover/product:scale-110"
                            sizes="(max-width: 768px) 33vw, 150px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/product:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/product:opacity-100 transition-opacity">
                          <p className="text-xs font-semibold text-white truncate">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {retailer.productDetails.length > 3 && (
                    <div className="mt-3 flex items-center justify-center">
                      <span className="text-xs text-slate-500">
                        +{retailer.productDetails.length - 3} more products
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Product List */}
              {retailer.products && retailer.products.length > 0 && (
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    {retailer.products.map((product, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Section */}
              {retailer.approximatePricesUsd && (
                <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    {translations.retailers.approximatePrices}
                  </p>
                  <div className="space-y-2 text-sm">
                    {retailer.approximatePricesUsd.panelWatt && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Panel:</span>
                        <span className="font-semibold text-emerald-700">
                          ${retailer.approximatePricesUsd.panelWatt}/W
                        </span>
                      </div>
                    )}
                    {retailer.approximatePricesUsd.batteryAh && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Battery:</span>
                        <span className="font-semibold text-emerald-700">
                          ${retailer.approximatePricesUsd.batteryAh}/Ah
                        </span>
                      </div>
                    )}
                    {retailer.approximatePricesUsd.package && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <span className="text-slate-600">Package:</span>
                        <span className="font-bold text-lg text-emerald-700">
                          ${retailer.approximatePricesUsd.package}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact & Languages */}
              <div className="p-6 space-y-4">
                {retailer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <a
                      href={`tel:${retailer.phone}`}
                      className="text-sm font-medium text-[#2E90FF] hover:underline flex-1"
                    >
                      {retailer.phone}
                    </a>
                  </div>
                )}

                {retailer.languages && retailer.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-slate-500">
                      {translations.retailers.languages}:
                    </span>
                    {retailer.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {retailer.phone && (
                <div className="p-4 sm:p-6 pt-0 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleCall(retailer.phone)}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-emerald-700 shadow-md hover:shadow-lg"
                  >
                    <Phone className="h-4 w-4" />
                    {translations.retailers.call}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWhatsApp(retailer.phone)}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-[#20BA5A] shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {translations.retailers.whatsapp}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
