import { Request, Response } from "express";
import { z } from "zod";

import { computeSolarPlan } from "../services/calculationService";
import { ApiResponse, SavedPlan, UsagePreset } from "../types/solar";

const selectionSchema = z.object({
  applianceId: z.string(),
  preset: z.custom<UsagePreset>((value) =>
    ["light", "normal", "heavy"].includes(String(value)),
  ),
  quantity: z.number().int().min(1).max(3),
});

const savePlanSchema = z.object({
  templateId: z.enum(["home", "large_home", "shop", "clinic"]),
  appliances: z.array(selectionSchema).nonempty(),
  billAmountUsd: z.number().optional(),
  billKwhPerMonth: z.number().optional(),
  location: z.string().optional(),
  contactName: z.string().min(2),
  contactPhone: z.string().min(5),
  retailerIds: z.array(z.string()).optional(),
});

const savedPlans: SavedPlan[] = [];

export const savePlanHandler = (
  req: Request,
  res: Response<ApiResponse<{ id: string }>>,
) => {
  try {
    const payload = savePlanSchema.parse(req.body);
    const plan = computeSolarPlan(payload);
    const planId = `plan_${Date.now()}`;

    savedPlans.push({
      id: planId,
      createdAt: new Date().toISOString(),
      payload,
      result: plan,
      retailerIds: payload.retailerIds ?? [],
    });

    res.status(201).json({
      success: true,
      data: { id: planId },
      message: "Plan saved locally. Connect Supabase to persist permanently.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid save payload",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

