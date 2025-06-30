// src/utils/getSessionUser.ts
import type { Request } from "express";
import { getUserIdFromSession } from "./getSession";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getSessionUser(req: Request) {
  const sessionToken = req.cookies?.session_token;
  if (!sessionToken) return null;

  const userId = await getUserIdFromSession(sessionToken);
  if (!userId) return null;

  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  return result[0] || null;
}
