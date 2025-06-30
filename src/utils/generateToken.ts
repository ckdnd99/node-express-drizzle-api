// src/utils/generateToken.ts
import crypto from "crypto";

export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
