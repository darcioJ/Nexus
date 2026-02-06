import { Router } from "express";
import { protectUser, authorizeMaster } from "../middleware/authMiddleware.js";
import {
  createEssence,
  updateEssence,
  deleteEssence,
} from "../controllers/essenceController.js";

const router = Router();

router.use(protectUser, authorizeMaster);

router.post("/", createEssence);
router.patch("/:id", updateEssence);
router.delete("/:id", deleteEssence);

export default router;