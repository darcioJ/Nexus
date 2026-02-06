import { Router } from "express";
import { protectUser, authorizeMaster } from "../middleware/authMiddleware.js";
import { 
  createAttribute, 
  updateAttribute, 
  deleteAttribute 
} from "../controllers/attributeController.js";

const router = Router();

router.use(protectUser, authorizeMaster);

router.post("/", createAttribute);
router.patch("/:id", updateAttribute);
router.delete("/:id", deleteAttribute);

export default router;