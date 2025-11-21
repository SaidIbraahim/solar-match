import {
  Building,
  Calculator,
  Droplet,
  Fan,
  Hospital,
  Lightbulb,
  LucideIcon,
  Refrigerator,
  Smartphone,
  Snowflake,
  Store,
  Stethoscope,
  SunMedium,
  Tv,
  Wifi,
  Sparkles,
  Home,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Building,
  Store,
  Hospital,
  Lightbulb,
  Smartphone,
  Tv,
  Refrigerator,
  Snowflake,
  Fan,
  Wifi,
  Calculator,
  Droplet,
  Stethoscope,
  SunMedium,
};

export const getIcon = (name: string): LucideIcon => {
  return iconMap[name] ?? Sparkles;
};

