import { Router } from "express";
import AuthController from '../controller/AuthController';
import { checkJwt } from "../middlewares/jwt";

const router = Router();

//login
router.post('/login', AuthController.login);

// Forgot password
router.put('/forgot-password', AuthController.forgotPassword);

// Create new password
router.put('/new-password', AuthController.createNewPassword);

// Refresh token
router.post('/refresh-token', AuthController.refreshToken);

// Change password
router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;