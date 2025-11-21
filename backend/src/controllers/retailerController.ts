import { Request, Response } from "express";

import { RETAILERS } from "../data/retailers";
import { ApiResponse, Retailer } from "../types/solar";

export const listRetailersHandler = (
  _req: Request,
  res: Response<ApiResponse<Retailer[]>>,
) => {
  res.json({
    success: true,
    data: RETAILERS,
  });
};

