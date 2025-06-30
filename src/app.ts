// src/app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { checkRedisConnection } from "./redis";
import apiRouter from "./routes";
import { defaultController } from "./controllers/defaultController";
import { corsOptions } from "./config/cors";
import { apiRateLimiter } from "./config/rateLimit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Conditionally apply the rate limiter
if (process.env.RATE_LIMIT_ENABLED === "true") {
  app.use(apiRateLimiter);
  console.log("Rate limiting is enabled.");
} else {
  console.log("Rate limiting is disabled.");
}

app.use("/api", apiRouter);
app.get("/", defaultController);

checkRedisConnection().then((redisStatus) => {
  app.listen(PORT, () => {
    console.log(`🚀 ${process.env.APP_NAME || "Node App"} started`);
    console.log(`📦 Server: ${process.env.APP_URL || "http://localhost:" + PORT}`);
    console.log(`🔗 Frontend: ${process.env.FRONTEND_APP_URL}`);
    console.log(`🟢 Listening on port ${PORT}`);
    console.log(`📡 Redis Status: ${redisStatus}`);
    console.log("=========================================");
  });
});
