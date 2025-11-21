import { UsagePreset } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export const USAGE_SCHEDULE_OPTIONS = [
  {
    id: "morning",
    label: "Morning",
    subLabel: "Subax",
    description: "Mostly before noon",
    preset: "light" as UsagePreset,
  },
  {
    id: "evening",
    label: "Evening",
    subLabel: "Fiid",
    description: "Mostly after sunset",
    preset: "normal" as UsagePreset,
  },
  {
    id: "all_day",
    label: "All Day",
    subLabel: "Maalinta Oo Dhan",
    description: "Runs almost all day",
    preset: "heavy" as UsagePreset,
  },
  {
    id: "sometimes",
    label: "Sometimes",
    subLabel: "Marmar",
    description: "Occasional use",
    preset: "light" as UsagePreset,
  },
] as const;

export type UsageScheduleOptionId =
  (typeof USAGE_SCHEDULE_OPTIONS)[number]["id"];

export const PRESET_TO_DEFAULT_OPTION: Record<
  UsagePreset,
  UsageScheduleOptionId
> = {
  light: "morning",
  normal: "evening",
  heavy: "all_day",
};

export const STATUS_COPY = {
  optimal: {
    title: "Green Zone",
    copy: "Sized correctly for your needs.",
  },
  caution: {
    title: "Yellow Zone",
    copy: "Works, but monitor usage or budget.",
  },
  review: {
    title: "Red Zone",
    copy: "Needs attention. Adjust appliances.",
  },
};

