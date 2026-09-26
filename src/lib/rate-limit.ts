/**
 * Minimal in-memory rate limiter.
 *
 * Deliberately simple: this site runs at small scale, and a fixed window per
 * IP is enough to stop casual form abuse. It is per-instance, so it is a
 * speed bump rather than a guarantee — the honeypot and validation do the
 * real work. If the site ever runs at scale across many instances, swap this
 * for a shared store (Upstash/Redis) behind the same function signature.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Exposed for tests. */
export function resetRateLimits(): void {
  buckets.clear();
}

/** Best-effort client identifier from proxy headers. */
export function clientKey(headers: Headers, scope: string): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}
