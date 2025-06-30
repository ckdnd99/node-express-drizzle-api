// src/controllers/auth/loginController.ts
import type { Request, Response } from "express";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateSessionToken } from "../../utils/generateToken";
import { storeSession } from "../../utils/sessionStore";
import { addDays } from "date-fns";

// 🔐 Login Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const { email, password } = parseResult.data;

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const user = users[0];

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password || "");

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const sessionToken = generateSessionToken();
    const expiresAt = addDays(new Date(), 30);

    await storeSession({
      userId: user.id,
      sessionToken,
      expiresAt,
    });

    // 🍪 Set cookie
    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login.",
    });
  }
};
