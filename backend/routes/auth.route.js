import { Router } from "express";
import { forgotPassword, login, logout, signup, verifyEmail } from "../controllers/auth.controller.js";

//Setup router
const router = Router();

//API endpoints for various functionalities
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

export default router;