import {
  AppliancePreset,
  BusinessTemplate,
  Retailer,
  SavePlanPayload,
  SolarPlanResult,
} from "./types";
import { API_BASE_URL } from "./constants";

const jsonHeaders = { "Content-Type": "application/json" };

const parseResponse = async <T>(response: Response): Promise<T> => {
  let payload: any;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`Failed to parse response: ${response.status} ${response.statusText}`);
  }
  
  if (!response.ok || !payload.success) {
    // Include validation errors if available
    let errorMessage = payload.message ?? "API request failed";
    
    if (payload.errors && Array.isArray(payload.errors) && payload.errors.length > 0) {
      const validationErrors = payload.errors
        .map((e: any) => {
          const path = Array.isArray(e.path) ? e.path.join(".") : e.path || "unknown";
          return `${path}: ${e.message}`;
        })
        .join(", ");
      errorMessage = `${errorMessage} (${validationErrors})`;
    }
    
    console.error("API Error:", {
      status: response.status,
      message: errorMessage,
      errors: payload.errors,
      fullPayload: payload,
    });
    
    throw new Error(errorMessage);
  }
  return payload.data as T;
};

export const fetchAppliances = async () => {
  const res = await fetch(`${API_BASE_URL}/appliances`, {
    next: { revalidate: 60 },
  });
  return parseResponse<AppliancePreset[]>(res);
};

export const fetchTemplates = async () => {
  const res = await fetch(`${API_BASE_URL}/templates`, {
    next: { revalidate: 60 },
  });
  return parseResponse<BusinessTemplate[]>(res);
};

export const fetchRetailers = async () => {
  const res = await fetch(`${API_BASE_URL}/retailers`, { cache: "no-store" });
  return parseResponse<Retailer[]>(res);
};

export const calculateSolarPlan = async (body: {
  templateId: SavePlanPayload["templateId"];
  appliances: SavePlanPayload["appliances"];
  billAmountUsd?: number;
  billKwhPerMonth?: number;
  location?: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/calculate`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(body),
  });
  return parseResponse<SolarPlanResult & { explanation: string }>(res);
};

export const saveSolarPlan = async (payload: SavePlanPayload) => {
  const res = await fetch(`${API_BASE_URL}/save-plan`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
  return parseResponse<{ id: string }>(res);
};

