import { Router } from "express";
import { protectUser, authorizeMaster } from "../middleware/authMiddleware.js";
import { 
  getUsers, 
  updateUser, 
  deleteUser 
} from "../controllers/userController.js";

const router = Router();

router.use(protectUser, authorizeMaster);

router.get("/", getUsers);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;