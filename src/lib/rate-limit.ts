/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Good enough to blunt brute-force login attempts without extra infra. Note:
 * counters live per server instance, so on multi-instance deployments the
 * effective limit is per-instance. For stricter guarantees use a shared store.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/** Records one hit for `key`; returns whether it is within the limit. */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: allowed ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  };
}

/** Clears the counter for `key` (e.g. after a successful login). */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}
