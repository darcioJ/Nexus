import { Router } from "express";
import { getForgeData } from "../controllers/forgeController.js";
import {
  blockAuthenticated,
  applyVaultFilter,
  extractUser,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/data",
  extractUser, // Identifica quem é (se houver alguém)
  blockAuthenticated, // Chuta pra fora se for um player logado
  applyVaultFilter, // Define o filtro de sistema
  getForgeData, // Entrega os dados limpos );
);

export default router;
