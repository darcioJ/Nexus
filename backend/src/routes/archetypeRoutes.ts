import { Router } from "express";
import { protectUser, authorizeMaster } from "../middleware/authMiddleware.js";
import { 
  createArchetype, 
  updateArchetype, 
  deleteArchetype 
} from "../controllers/archetypeController.js";

const router = Router();

router.use(protectUser, authorizeMaster);

router.post("/", createArchetype);
router.patch("/:id", updateArchetype);
router.delete("/:id", deleteArchetype);

export default router;