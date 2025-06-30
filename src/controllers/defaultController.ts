// src/controllers/defaultController.ts
import type { Request, Response } from "express";

export const defaultController = (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "API is running" });
};
