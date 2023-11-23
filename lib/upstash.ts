import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

export const linksRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  prefix: "ratelimit",
  analytics: true,
});

export const clicksRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(1, "1 h"),
  prefix: "ratelimit:clicks",
  analytics: true,
});
