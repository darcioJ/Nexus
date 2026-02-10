import { Router } from "express";
import { getForgeData } from "../controllers/forgeController.js";

const router = Router();

router.get(
  "/data",
  getForgeData, // Entrega os dados limpos );
);

export default router;
