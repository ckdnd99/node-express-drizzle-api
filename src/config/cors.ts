// src/config/cors.ts
import type { CorsOptions } from "cors";

const NODE_ENV = process.env.NODE_ENV || "development";

const allowedOrigins: string[] =
  NODE_ENV === "production"
    ? (process.env.FRONTEND_APP_URL || "").split(",").map((url) => url.trim())
    : ["http://localhost:3000", "http://localhost:5173"];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools like Postman

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
