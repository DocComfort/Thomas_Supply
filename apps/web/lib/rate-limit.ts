import { AppError } from "./errors";

const windows = new Map<string, { count: number; resetAt: number }>();

export async function assertRateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    throw new AppError("Too many requests. Please wait and try again.", 429, "RATE_LIMITED");
  }

  current.count += 1;
  return { ok: true, remaining: limit - current.count };
}
