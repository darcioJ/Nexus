import { Router } from "express";
import { protectUser, authorizeMaster } from "../middleware/authMiddleware.js";
import {
  createStatusEffect,
  updateStatusEffect,
  deleteStatusEffect,
} from "../controllers/statusEffectController.js";

const router = Router();

router.use(protectUser, authorizeMaster);

router.post("/", createStatusEffect);
router.patch("/:id", updateStatusEffect);
router.delete("/:id", deleteStatusEffect);

export default router;