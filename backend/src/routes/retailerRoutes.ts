import { Router } from "express";
import { listRetailersHandler } from "../controllers/retailerController";

const router = Router();

router.get("/retailers", listRetailersHandler);

export default router;

