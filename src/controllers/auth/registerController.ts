// src/controllers/auth/registerController.ts
import type { Request, Response } from "express";
import { db } from "../../db";
import { usersTable, sessionsTable } from "../../db/schema";
import { eq, or, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateSessionToken } from "../../utils/generateToken";
import { storeSession } from "../../utils/sessionStore";
import { addDays } from "date-fns"; // for 30-day expiry

// 🔐 Central Zod schema
const registerSchema = z.object({
  mobile: z.string().min(8, "Mobile number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email").optional(),
});

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parseResult = registerSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const { mobile, password, name, email } = parseResult.data;

  try {
    const whereClause = email
      ? or(eq(usersTable.mobile, mobile), eq(usersTable.email, email))
      : eq(usersTable.mobile, mobile);

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(whereClause)
      .limit(1);

    if (existingUser.length > 0) {
      res.status(409).json({
        success: false,
        message: "User with this mobile or email already exists.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      mobile,
      password: hashedPassword,
      name,
      email,
      role: 1,
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const inserted = await db
      .insert(usersTable)
      .values(newUser)
      .returning({ id: usersTable.id });

    const userId = inserted[0]?.id;

    if (!userId) {
      res.status(500).json({
        success: false,
        message: "User ID not returned after insertion.",
      });
      return;
    }

    // 🆕 Create session
    const sessionToken = generateSessionToken();
    const expiresAt = addDays(new Date(), 30);

    await storeSession({
      userId,
      sessionToken,
      expiresAt,
    });

    
    // 🍪 Set session token in cookie
    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "lax",
    });

    res.status(201).json({
      success: true,
      message: "User registered and logged in successfully.",
      user: {
        mobile: newUser.mobile,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
    });
  }
};
