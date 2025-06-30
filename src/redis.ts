// src/redis.ts
import Redis from "ioredis";

let redis: Redis | null = null;
let redisEnabled = process.env.REDIS_ENABLED === "true";

let connectedOnce = false;

if (redisEnabled) {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password:
      process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD !== "null"
        ? process.env.REDIS_PASSWORD
        : undefined,
    retryStrategy: (times) => Math.min(times * 5000, 30000),
  });

  redis.on("connect", () => {
    if (!connectedOnce) {
      console.log("🔌 Redis: Connecting...");
    }
  });

  redis.on("ready", () => {
    console.log("✅ Redis: Connection ready");
    connectedOnce = true;
  });

  redis.on("end", () => {
    console.log("⚠️ Redis: Disconnected");
    connectedOnce = false;
  });

  redis.on("reconnecting", () => {
    console.log("♻️ Redis: Reconnecting...");
  });

  redis.on("error", (err) => {
    if (!connectedOnce) {
      console.error("❌ Redis: Connection error:", err?.message || err);
    }
  });
}

export async function checkRedisConnection(): Promise<string> {
  if (!redisEnabled || !redis) return "⏸️ Redis disabled";
  try {
    await redis.ping();
    return "✅ Redis connected";
  } catch (err) {
    return "❌ Redis not connected";
  }
}

export default redis;
