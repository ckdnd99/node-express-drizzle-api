// src/controllers/auth/logoutController.ts
import type { Request, Response } from "express";
import redis from "../../redis";
import { db } from "../../db";
import { sessionsTable } from "../../db/schema";
import { eq } from "drizzle-orm";

const REDIS_ENABLED = process.env.REDIS_ENABLED === "true";

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionToken = req.cookies?.session_token;

    if (!sessionToken) {
      res.status(400).json({
        success: false,
        message: "Session token not found.",
      });
      return;
    }

    // 🗑 Remove session
    if (REDIS_ENABLED) {
      if (!redis) throw new Error("Redis not initialized");
      await redis.del(`session:${sessionToken}`);
    } else {
      await db
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken));
    }

    // 🍪 Clear cookie
    res.clearCookie("session_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout.",
    });
  }
};
