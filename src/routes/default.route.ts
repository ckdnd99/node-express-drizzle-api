// src/routes/default.route.ts
import express from "express";
import { defaultController } from "../controllers/defaultController";

const router = express.Router();

// Route: GET /
router.get("/", defaultController);

export default router;
