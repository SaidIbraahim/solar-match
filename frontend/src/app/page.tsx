"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { ApplianceSelector } from "@/components/appliance-selector";
import { PdfExportButton } from "@/components/pdf-export-button";
import { PlanSummary } from "@/components/plan-summary";
import { ProfileSelector } from "@/components/profile-selector";
import { ResultPanel } from "@/components/result-panel";
import { UsageFrequencyGrid } from "@/components/usage-frequency-grid";
import { LanguageToggle } from "@/components/language-toggle";
import {
  calculateSolarPlan,
  fetchAppliances,
  fetchTemplates,
} from "@/lib/api";
import {
  AppliancePreset,
  ApplianceSelection,
  BusinessTemplate,
  SolarPlanResult,
  TemplateId,
} from "@/lib/types";
import {
  UsageScheduleOptionId,
  USAGE_SCHEDULE_OPTIONS,
} from "@/lib/constants";
import { t } from "@/lib/i18n";

const steps = [
  { id: 0, title: "Salaan", description: "Welcome to SolarMatch" },
  { id: 1, title: "Choose space", description: "Pick the template that fits you" },
  { id: 2, title: "Select appliances", description: "Tap everything you power" },
  {
    id: 3,
    title: "When do you use",
    description: "Select usage pattern for each appliance",
  },
  {
    id: 4,
    title: "Bill & location",
    description: "Optional bill upload and quick info",
  },
  {
    id: 5,
    title: "Your solar plan",
    description: "Panels, batteries, savings, retailers",
  },
] as const;

const formatFileSize = (file: File) => {
  if (file.size > 1024 * 1024) {
    return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.round(file.size / 1024)} KB`;
};

const mergeTemplateDefaults = (
  template: BusinessTemplate,
  existing: ApplianceSelection[],
) => {
  const map = new Map(existing.map((item) => [item.applianceId, item]));
  template.defaultAppliances.forEach((item) => {
    if (!map.has(item.applianceId)) {
      map.set(item.applianceId, item);
    }
  });
  return Array.from(map.values());
};

export default function Home() {
  const translations = t();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const [templates, setTemplates] = useState<BusinessTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>("home");

  const [appliances, setAppliances] = useState<AppliancePreset[]>([]);
  const [applianceSelections, setApplianceSelections] = useState<
    ApplianceSelection[]
  >([]);
  const [usageScheduleOptions, setUsageScheduleOptions] = useState<
    Record<string, UsageScheduleOptionId | undefined>
  >({});


  const [billEntryMethod, setBillEntryMethod] = useState<"manual" | "upload" | null>(null);
  const [billAmountUsd, setBillAmountUsd] = useState(40);
  const [billKwhPerMonth, setBillKwhPerMonth] = useState<number | undefined>();
  const [location, setLocation] = useState("");
  const [uploadedBill, setUploadedBill] = useState<{
    name: string;
    sizeLabel: string;
  } | null>(null);

  const [plan, setPlan] = useState<SolarPlanResult>();
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [apiError, setApiError] = useState<string>("");


  useEffect(() => {
    const load = async () => {
      try {
        const [applianceData, templateData] = await Promise.all([
          fetchAppliances(),
          fetchTemplates(),
        ]);
        setAppliances(applianceData);
        setTemplates(templateData);
        if (templateData.length) {
          setSelectedTemplateId(templateData[0].id);
          setApplianceSelections(templateData[0].defaultAppliances);
        }
      } catch (error) {
        setApiError((error as Error).message);
      }
    };
    load();
    
    // Check if returning from retailers page or URL param
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get("step");
      const returnStep = sessionStorage.getItem("solarmatch_return_step");
      
      if (stepParam === "5" || returnStep === "5") {
        sessionStorage.removeItem("solarmatch_return_step");
        // Restore plan data from sessionStorage
        const savedPlan = sessionStorage.getItem("solarmatch_plan");
        if (savedPlan) {
          try {
            const parsedPlan = JSON.parse(savedPlan);
            setPlan(parsedPlan);
          } catch (e) {
            console.error("Failed to restore plan:", e);
          }
        }
        // Wait a bit for data to load, then set step
        setTimeout(() => {
          setCurrentStep(5);
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    setApiError("");
  }, [currentStep]);

  const selectedTemplate = templates.find(
    (template) => template.id === selectedTemplateId,
  );

  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplateId(templateId);
    const template = templates.find((item) => item.id === templateId);
    if (template) {
      setApplianceSelections((prev) => mergeTemplateDefaults(template, prev));
    }
  };

  const handleUsageScheduleChange = (
    applianceId: string,
    optionId: UsageScheduleOptionId,
  ) => {
    setUsageScheduleOptions((prev) => ({
      ...prev,
      [applianceId]: optionId,
    }));
    // Update preset based on schedule option
    const option = USAGE_SCHEDULE_OPTIONS.find((opt) => opt.id === optionId);
    if (option) {
      setApplianceSelections((prev) => {
        const exists = prev.find((item) => item.applianceId === applianceId);
        if (!exists) {
          return [...prev, { applianceId, preset: option.preset, quantity: 1 }];
        }
        return prev.map((item) =>
          item.applianceId === applianceId
            ? { ...item, preset: option.preset }
            : item,
        );
      });
    }
  };

  const handleQuantityChange = (applianceId: string, quantity: number) => {
    setApplianceSelections((prev) => {
      const exists = prev.find((item) => item.applianceId === applianceId);
      if (quantity <= 0) {
        return prev.filter((item) => item.applianceId !== applianceId);
      }
      if (!exists) {
        return [...prev, { applianceId, preset: "normal", quantity }];
      }
      // Ensure preset is always valid when updating quantity
      return prev.map((item) =>
        item.applianceId === applianceId
          ? {
              ...item,
              quantity,
              preset: item.preset && ["light", "normal", "heavy"].includes(item.preset)
                ? item.preset
                : "normal", // Fallback to normal if preset is invalid
            }
          : item,
      );
    });
  };

  const handleBillUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedBill({
      name: file.name,
      sizeLabel: formatFileSize(file),
    });
  };

  const handleGeneratePlan = async () => {
    if (applianceSelections.length === 0) {
      setApiError("Please select at least one appliance");
      return false;
    }

    setLoadingPlan(true);
    setApiError("");
    try {
      // Validate templateId
      if (!selectedTemplateId || !["home", "large_home", "shop", "clinic"].includes(selectedTemplateId)) {
        setApiError("Please select a valid space type");
        setLoadingPlan(false);
        return false;
      }

      // Filter and validate appliances - ensure all have valid presets
      const validAppliances = applianceSelections.filter(
        (app) => 
          app.applianceId && 
          app.preset && 
          ["light", "normal", "heavy"].includes(app.preset) &&
          app.quantity > 0 &&
          app.quantity <= 3 &&
          Number.isInteger(app.quantity)
      );

      if (validAppliances.length === 0) {
        setApiError("Please select at least one appliance with a usage pattern");
        setLoadingPlan(false);
        return false;
      }

      // Only include bill data if manual entry was selected and has valid values
      const payload: {
        templateId: TemplateId;
        appliances: ApplianceSelection[];
        billAmountUsd?: number;
        billKwhPerMonth?: number;
        location?: string;
      } = {
        templateId: selectedTemplateId,
        appliances: validAppliances,
      };

      // Only add bill fields if manual entry was selected and has valid values
      if (billEntryMethod === "manual") {
        if (billAmountUsd && billAmountUsd > 0) {
          payload.billAmountUsd = Number(billAmountUsd);
        }
        if (billKwhPerMonth && billKwhPerMonth > 0) {
          payload.billKwhPerMonth = Number(billKwhPerMonth);
        }
      }

      // Location can be added regardless of bill method
      if (location && location.trim()) {
        payload.location = location.trim();
      }

      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      const result = await calculateSolarPlan(payload);
      setPlan(result);
      // Persist plan data to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("solarmatch_plan", JSON.stringify(result));
      }
      return true;
    } catch (error) {
      console.error("Error generating plan:", error);
      const errorMessage = (error as Error).message || "Failed to generate plan";
      setApiError(errorMessage);
      return false;
    } finally {
      setLoadingPlan(false);
    }
  };


  const resetFlow = () => {
    setCurrentStep(1);
    if (selectedTemplate) {
      setApplianceSelections(selectedTemplate.defaultAppliances);
    }
    setUsageScheduleOptions({});
    setPlan(undefined);
    // Clear persisted plan data
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("solarmatch_plan");
    }
    setBillEntryMethod(null);
    setUploadedBill(null);
    setBillKwhPerMonth(undefined);
    setBillAmountUsd(40);
    setLocation("");
    setApiError("");
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    if (currentStep === 5) {
      setCurrentStep(4);
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleContinue = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }
    if (currentStep === steps.length - 1) {
      resetFlow();
      return;
    }
    if (currentStep === 4) {
      setApiError("");
      const success = await handleGeneratePlan();
      if (success) {
        setCurrentStep(5);
      }
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const noAppliancesSelected = applianceSelections.length === 0;

  const isContinueDisabled = (() => {
    if (currentStep === 2 || currentStep === 3) {
      return noAppliancesSelected;
    }
    if (currentStep === 4) {
      return loadingPlan || noAppliancesSelected;
    }
    return false;
  })();

  const primaryButtonLabel = (() => {
    if (currentStep === 0) return translations.common.continue;
    if (currentStep === 4) return loadingPlan ? translations.common.loading : "Get my solar plan";
    if (currentStep === 5) return "Start over";
    return translations.common.continue;
  })();

  const progressPercent = Math.min(
    (currentStep / (steps.length - 1)) * 100,
    100,
  );

  const renderWelcome = () => {
    const welcomeT = translations.welcome;
    
    return (
      <div className="space-y-8 text-center">
        {/* Logo Icon */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#2E90FF] opacity-30"></div>
            {/* Inner ring */}
            <div className="absolute inset-2 rounded-full border border-emerald-500 opacity-50"></div>
            {/* Sun icon */}
            <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <svg
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-[#2E90FF]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" strokeWidth="2" stroke="currentColor" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title with colorful letters */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-[#2E90FF]">Solar</span>
            <span className="text-[#FFD348]">M</span>
            <span className="text-[#FFD348]">a</span>
            <span className="text-emerald-500">t</span>
            <span className="text-emerald-500">c</span>
            <span className="text-emerald-500">h</span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="space-y-2 px-2">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900">
            {welcomeT.tagline}
          </p>
          <p className="text-xs sm:text-sm md:text-base text-slate-600">
            {welcomeT.tagline}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-stretch sm:items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#2E90FF] px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#1f6fd1] hover:shadow-xl"
          >
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {welcomeT.startButton}
          </button>
          <button
            type="button"
            className="w-full sm:w-auto rounded-xl border-2 border-slate-300 bg-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold text-slate-900 transition hover:bg-slate-50 hover:border-slate-400"
          >
            {welcomeT.learnMoreButton}
          </button>
        </div>

        {/* Feature Cards */}
        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Simple visual selection */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg shadow-emerald-100/50 transition hover:shadow-xl">
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-50">
                <svg
                  className="h-6 w-6 sm:h-8 sm:w-8 text-[#2E90FF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-slate-900">
              {welcomeT.features.visualSelection.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {welcomeT.features.visualSelection.description}
            </p>
          </div>

          {/* Instant recommendations */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg shadow-emerald-100/50 transition hover:shadow-xl">
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-50">
                <svg
                  className="h-6 w-6 sm:h-8 sm:w-8 text-[#2E90FF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-slate-900">
              {welcomeT.features.instantRecommendations.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {welcomeT.features.instantRecommendations.description}
            </p>
          </div>

          {/* Local retailer matching */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg shadow-emerald-100/50 transition hover:shadow-xl">
            <div className="mb-3 sm:mb-4 flex justify-center">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-50">
                <svg
                  className="h-6 w-6 sm:h-8 sm:w-8 text-[#2E90FF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-slate-900">
              {welcomeT.features.retailerMatching.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {welcomeT.features.retailerMatching.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const StepCard = ({
    stepNumber,
    title,
    subtitle,
    children,
    id,
  }: {
    stepNumber: number;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    id?: string;
  }) => (
    <section
      id={id}
      className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-xl shadow-emerald-100/60"
    >
      <div className="space-y-2 text-center">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-[#2E90FF]">
          Step {stepNumber}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2E90FF]">{title}</h2>
        <p className="text-sm sm:text-base text-slate-500">{subtitle}</p>
      </div>
      <div className="mt-4 sm:mt-6">{children}</div>
    </section>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderWelcome();
      case 1:
        return (
          <StepCard
            stepNumber={1}
            title="What are we powering?"
            subtitle="Templates apply smart defaults for each space."
          >
            <ProfileSelector
              templates={templates}
              value={selectedTemplateId}
              onChange={handleTemplateChange}
            />
          </StepCard>
        );
      case 2:
        return (
          <StepCard
            stepNumber={2}
            title="Select your appliances"
            subtitle="Add quantities per category. Tap the card to clear."
          >
            <p className="mb-4 text-center text-sm text-slate-500">
              {applianceSelections.length} appliances selected
            </p>
            <ApplianceSelector
              appliances={appliances}
              selections={applianceSelections}
              onQuantityChange={handleQuantityChange}
              isLoading={!appliances.length && !apiError}
            />
            {apiError && (
              <p className="mt-4 text-sm text-rose-600">{apiError}</p>
            )}
          </StepCard>
        );
      case 3:
  return (
          <StepCard
            stepNumber={3}
            title="When do you use"
            subtitle="Select usage pattern for each appliance"
          >
            <UsageFrequencyGrid
              appliances={appliances}
              selections={applianceSelections}
              selectedOptions={usageScheduleOptions}
              onOptionChange={handleUsageScheduleChange}
            />
          </StepCard>
        );
      case 4:
        return (
          <StepCard
            stepNumber={4}
            title={translations.billEntry.title}
            subtitle={translations.billEntry.subtitle}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  // Toggle: if already selected, deselect it
                  setBillEntryMethod(
                    billEntryMethod === "manual" ? null : "manual",
                  );
                }}
                className={clsx(
                  "flex flex-col items-center gap-4 rounded-2xl border-2 bg-white p-6 text-center transition",
                  billEntryMethod === "manual"
                    ? "border-[#2E90FF] shadow-lg"
                    : "border-slate-200 hover:border-[#2E90FF] hover:shadow-lg",
                )}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2E90FF]/10">
                  <svg
                    className="h-8 w-8 text-[#2E90FF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {translations.billEntry.enterManually}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Type in your monthly usage and cost
                  </p>
                </div>
              </button>

              <div className="relative">
                <label
                  htmlFor="bill-upload"
                  className={clsx(
                    "flex flex-col items-center gap-4 rounded-2xl border-2 bg-white p-6 text-center transition cursor-pointer",
                    billEntryMethod === "upload"
                      ? "border-emerald-500 shadow-lg"
                      : "border-slate-200 hover:border-emerald-500 hover:shadow-lg",
                  )}
                >
                  <input
                    id="bill-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      handleBillUpload(e);
                      setBillEntryMethod("upload");
                    }}
                    className="hidden"
                  />
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                      className="h-8 w-8 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {translations.billEntry.uploadBill}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Upload a photo of your bill
                    </p>
                  </div>
                </label>
                {billEntryMethod === "upload" && uploadedBill && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBillEntryMethod(null);
                      setUploadedBill(null);
                    }}
                    className="absolute top-2 right-2 rounded-full bg-rose-500 p-1.5 text-white shadow-lg hover:bg-rose-600 transition"
                    title="Remove upload"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {billEntryMethod === "manual" && (
              <div className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="text-sm text-slate-500">
                      {translations.billEntry.billAmount}
                    </span>
                    <input
                      type="number"
                      min={0}
                      className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-lg font-semibold text-slate-900 focus:border-emerald-500 focus:outline-none"
                      value={billAmountUsd}
                      onChange={(event) =>
                        setBillAmountUsd(Number(event.target.value) || 0)
                      }
                    />
                  </label>
                  <label className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="text-sm text-slate-500">
                      {translations.billEntry.billKwh}
                    </span>
                    <input
                      type="number"
                      min={0}
                      className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-lg text-slate-900 focus:border-emerald-500 focus:outline-none"
                      value={billKwhPerMonth ?? ""}
                      onChange={(event) =>
                        setBillKwhPerMonth(
                          event.target.value
                            ? Number(event.target.value)
                            : undefined,
                        )
                      }
                    />
                  </label>
                  <label className="md:col-span-2 flex flex-col rounded-2xl border border-slate-200 bg-white p-4">
                    <span className="text-sm text-slate-500">{translations.billEntry.location}</span>
                    <input
                      type="text"
                      placeholder={translations.billEntry.locationPlaceholder}
                      className="mt-2 rounded-xl border border-slate-200 px-3 py-2 text-lg text-slate-900 focus:border-emerald-500 focus:outline-none"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {billEntryMethod === "upload" && uploadedBill && (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-900">
                  Uploaded: {uploadedBill.name}
                </p>
                <p className="text-xs text-emerald-700">
                  {uploadedBill.sizeLabel}
          </p>
        </div>
            )}

            {apiError && (
              <p className="mt-4 text-sm text-rose-600">{apiError}</p>
            )}
          </StepCard>
        );
      case 5:
        return (
          <div id="plan-preview">
            <StepCard
              stepNumber={5}
              title={translations.results.title}
              subtitle={translations.results.subtitle}
            >
              <ResultPanel plan={plan} loading={loadingPlan} />
              <PlanSummary plan={plan} />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <PdfExportButton targetId="plan-preview" plan={plan} disabled={!plan} />
                <button
                  type="button"
                  onClick={() => {
                    // Store that we're coming from step 5
                    sessionStorage.setItem("solarmatch_return_step", "5");
                    router.push("/retailers");
                  }}
                  disabled={!plan}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2E90FF] px-6 py-2 font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-[#1f6fd1] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {translations.results.seeRetailers}
                </button>
              </div>
            </StepCard>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-emerald-50 to-green-50">
      <header className={`px-3 sm:px-4 py-6 sm:py-10 relative ${currentStep === 0 ? 'bg-transparent' : 'bg-[#0C3B2E]'}`}>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <LanguageToggle />
        </div>
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:gap-4">
          {currentStep === 0 ? null : (
            <>
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-emerald-200">
                SolarMatch
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                Simple, visual, one-step-at-a-time solar sizing.
              </h1>
              <p className="text-sm sm:text-base text-emerald-100">
                Step {currentStep} · {steps[currentStep].title}
              </p>
            </>
          )}
        </div>
      </header>

      {currentStep > 0 && (
        <div className="mx-auto mt-4 sm:mt-8 max-w-4xl px-3 sm:px-4">
          <div className="rounded-2xl sm:rounded-3xl bg-white/70 p-4 sm:p-5 shadow-sm shadow-emerald-100 backdrop-blur">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>
                Step {currentStep} of {steps.length - 1}
              </span>
              <span className="text-right">{steps[currentStep].title}</span>
            </div>
            <div className="mt-3 h-2 sm:h-3 rounded-full bg-emerald-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-3 sm:px-4 py-6 sm:py-8">
        {currentStep === 0 ? (
          renderWelcome()
        ) : (
          renderStepContent()
        )}

        {currentStep > 0 && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="w-full sm:w-auto rounded-full border border-slate-300 px-6 py-3 sm:py-2 text-sm sm:text-base font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {translations.common.back}
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={isContinueDisabled}
              className={`w-full sm:w-auto rounded-full px-6 py-3 sm:py-2 text-sm sm:text-base font-semibold text-white shadow-md transition ${
                currentStep === 4
                  ? "bg-[#2E90FF] hover:bg-[#1f6fd1]"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } disabled:cursor-not-allowed disabled:bg-slate-300`}
            >
              {primaryButtonLabel}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
