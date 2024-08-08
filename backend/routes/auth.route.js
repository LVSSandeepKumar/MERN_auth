import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

//Setup router
const router = Router();

//API endpoints for various functionalities
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;