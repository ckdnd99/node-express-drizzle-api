// src/utils/sessionStore.ts
import redis from "../redis"; // your redis client
import { db } from "../db";
import { sessionsTable } from "../db/schema";

type SessionData = {
  userId: string;
  sessionToken: string;
  expiresAt: Date;
};

const REDIS_ENABLED = process.env.REDIS_ENABLED === "true";

// 🧠 Store session in Redis or DB
export async function storeSession(session: SessionData) {
  if (REDIS_ENABLED) {
    if (!redis) throw new Error("Redis client not initialized");

    const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
    await redis.setex(`session:${session.sessionToken}`, ttl, session.userId);
  } else {
    await db.insert(sessionsTable).values({
      userId: session.userId,
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
