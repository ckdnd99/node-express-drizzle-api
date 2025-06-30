// src/controllers/auth/meController.ts
import type { Request, Response } from "express";
import { getSessionUser } from "../../utils/getSessionUser";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await getSessionUser(req);

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid or expired session.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  });
};
