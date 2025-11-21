import { Request, Response } from "express";
import { z } from "zod";

import { computeSolarPlan } from "../services/calculationService";
import { generatePlanNarrative } from "../services/aiService";
import {
  ApiResponse,
  SolarPlanResult,
  UsagePreset,
} from "../types/solar";

const selectionSchema = z.object({
  applianceId: z.string(),
  preset: z.custom<UsagePreset>((value) =>
    ["light", "normal", "heavy"].includes(String(value)),
  ),
  quantity: z.number().int().min(1).max(3),
});

const requestSchema = z.object({
  templateId: z.enum(["home", "large_home", "shop", "clinic"]),
  appliances: z.array(selectionSchema).nonempty(),
  billAmountUsd: z.number().optional(),
  billKwhPerMonth: z.number().optional(),
  location: z.string().optional(),
});

export const calculatePlanHandler = (
  req: Request,
  res: Response<ApiResponse<SolarPlanResult & { explanation: string }>>,
) => {
  try {
    const payload = requestSchema.parse(req.body);
    const plan = computeSolarPlan(payload);
    const explanation = generatePlanNarrative(plan);

    res.json({
      success: true,
      data: {
        ...plan,
        explanation,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      res.status(400).json({
        success: false,
        message: "Invalid payload",
        errors: error.errors,
      });
      return;
    }
    console.error("Calculation error:", error);
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

