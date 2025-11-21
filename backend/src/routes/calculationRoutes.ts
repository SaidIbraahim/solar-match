import { Router } from "express";
import { calculatePlanHandler } from "../controllers/calculationController";

const router = Router();

router.post("/calculate", calculatePlanHandler);

export default router;

