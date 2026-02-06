import { Router } from "express";
import { protectUser, authorizeMaster } from "../middleware/authMiddleware.js";
import {
  createClub,
  updateClub,
  deleteClub,
} from "../controllers/clubController.js";

const router = Router();

router.use(protectUser, authorizeMaster);

router.post("/", createClub);
router.patch("/:id", updateClub);
router.delete("/:id", deleteClub);

export default router;
