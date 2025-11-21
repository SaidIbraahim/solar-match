import { Router } from "express";
import { savePlanHandler } from "../controllers/planController";

const router = Router();

router.post("/save-plan", savePlanHandler);

export default router;

