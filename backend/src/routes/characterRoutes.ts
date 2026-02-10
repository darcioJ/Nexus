import { Router } from "express";
import * as charCtrl from "../controllers/characterController.js";
import { protectUser, authorizeMaster } from "../middleware/authMiddleware.js";

const router = Router();

// 1. PROTOCOLO PÚBLICO
// Usado pelo Forger para iniciar novos sinais no sistema
router.post("/", charCtrl.createCharacter);

// 2. PROTOCOLO DE ACESSO INDIVIDUAL
// O Player (ou Convidado) acessa apenas a própria telemetria
router.get("/me", protectUser, charCtrl.getMyCharacter);

// 3. PROTOCOLO DE COMANDO (MASTER ONLY)
// Apenas o Mestre/Admin pode varrer, modular, recalibrar ou purgar sinais
router.get("/", protectUser, authorizeMaster, charCtrl.getAllCharacters);

// Modulação de HP/SAN via Master Panel
router.patch(
  "/:id/modulate",
  protectUser,
  authorizeMaster,
  charCtrl.modulateStatus,
);

// Alteração de Condição (StatusEffect)
router.patch(
  "/:id/status",
  protectUser,
  authorizeMaster,
  charCtrl.updateCondition,
);

// [NOVO] Recalibragem Geral (Update do Admin Panel)
router.patch("/:id", protectUser, authorizeMaster, charCtrl.updateCharacter);

// [NOVO] Purgação Total (Delete do Admin Panel)
router.delete("/:id", protectUser, authorizeMaster, charCtrl.deleteCharacter);

router.post(
  "/:id/inventory",
  protectUser,
  authorizeMaster,
  charCtrl.addInventoryItem,
);
router.patch(
  "/:id/inventory/:itemId",
  protectUser,
  authorizeMaster,
  charCtrl.updateInventoryItem,
);
router.delete(
  "/:id/inventory/:itemId",
  protectUser,
  authorizeMaster,
  charCtrl.removeInventoryItem,
);

export default router;
