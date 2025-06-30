// src/routes/auth.routes.ts
import express from "express";
import { loginUser } from "../controllers/auth/loginController";
import { registerUser } from "../controllers/auth/registerController";
import { logoutUser } from "../controllers/auth/logoutController";
import { getMe } from "../controllers/auth/meController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/me", getMe);

export default router;
