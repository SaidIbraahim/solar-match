import { Router } from "express";

import calculationRoutes from "./calculationRoutes";
import retailerRoutes from "./retailerRoutes";
import planRoutes from "./planRoutes";
import applianceRoutes from "./applianceRoutes";

const router = Router();

router.use(calculationRoutes);
router.use(retailerRoutes);
router.use(planRoutes);
router.use(applianceRoutes);

export default router;

