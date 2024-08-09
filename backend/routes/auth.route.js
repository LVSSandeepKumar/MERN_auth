import { Router } from "express";
import { forgotPassword, login, logout, signup, verifyEmail, resetPassword, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

//Setup router
const router = Router();

//API endpoints for various functionalities
router.get("/check-auth", protectRoute, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;