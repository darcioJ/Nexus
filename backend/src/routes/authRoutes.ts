import { Router } from "express";
import * as authCtrl from "../controllers/authController.js";

const router = Router();

// @route   POST /api/auth/register
// @desc    Cria um novo usuário padrão
router.post("/register", authCtrl.register);

// @route   POST /api/auth/login
// @desc    Autentica usuário e retorna o Token de Nível 7
router.post("/login", authCtrl.login);

// @route   POST /api/auth/finalize
// @desc    Vincula um personagem convidado a uma conta definitiva
router.post("/finalize", authCtrl.finalize);

export default router;
