// src/utils/getSession.ts
import redis from "../redis";
import { db } from "../db";
import { sessionsTable } from "../db/schema";
import { eq } from "drizzle-orm";

const REDIS_ENABLED = process.env.REDIS_ENABLED === "true";

export async function getUserIdFromSession(sessionToken: string): Promise<string | null> {
  if (REDIS_ENABLED) {
    if (!redis) throw new Error("Redis client not initialized");

    return await redis.get(`session:${sessionToken}`);
  } else {
    const result = await db
      .select({ userId: sessionsTable.userId })
      .from(sessionsTable)
      .where(eq(sessionsTable.sessionToken, sessionToken))
      .limit(1);

    return result[0]?.userId || null;
  }
}
