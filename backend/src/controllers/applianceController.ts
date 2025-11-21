import { Request, Response } from "express";

import { APPLIANCE_PRESETS } from "../data/appliancePresets";
import { BUSINESS_TEMPLATES } from "../data/businessTemplates";
import {
  ApiResponse,
  AppliancePreset,
  BusinessTemplate,
} from "../types/solar";

export const listAppliancesHandler = (
  _req: Request,
  res: Response<ApiResponse<AppliancePreset[]>>,
) => {
  res.json({
    success: true,
    data: APPLIANCE_PRESETS,
  });
};

export const listTemplatesHandler = (
  _req: Request,
  res: Response<ApiResponse<BusinessTemplate[]>>,
) => {
  res.json({
    success: true,
    data: Object.values(BUSINESS_TEMPLATES),
  });
};

