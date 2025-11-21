import { Router } from "express";
import {
  listAppliancesHandler,
  listTemplatesHandler,
} from "../controllers/applianceController";

const router = Router();

router.get("/appliances", listAppliancesHandler);
router.get("/templates", listTemplatesHandler);

export default router;

