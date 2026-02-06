import { Router } from "express";
import { protectUser, authorizeMaster } from "../middleware/authMiddleware.js";
import {
  createWeapon,
  updateWeapon,
  deleteWeapon,
} from "../controllers/weaponController.js";

const router = Router();

router.use(protectUser, authorizeMaster);

router.post("/", createWeapon);
router.patch("/:id", updateWeapon);
router.delete("/:id", deleteWeapon);

export default router;
