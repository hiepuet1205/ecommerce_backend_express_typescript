import { Router } from "express";
const router = Router();

import { login, logout, refreshToken } from "../controllers/authController";
import { validateLogin } from "../middlewares/validate/auth";
import { verifyAccessToken, verifyRefreshToken } from "../middlewares/authMiddleware";

router.post('/login', validateLogin, login);
router.post('/refresh-token', verifyRefreshToken, refreshToken);
router.post('/logout', verifyAccessToken, logout);

export default router;