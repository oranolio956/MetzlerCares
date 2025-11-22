interface RateLimitEntry {
  count: number
  lastReset: number
}

const ipLimits = new Map<string, RateLimitEntry>()

/**
 * Simple in-memory rate limiter for Edge Functions.
 * Note: This is per-isolate. For strict global limits, use Redis/Database.
 * 
 * @param ip - Client IP address
 * @param limit - Max requests per window
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if limited
 */
export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = ipLimits.get(ip) || { count: 0, lastReset: now }

  if (now - entry.lastReset > windowMs) {
    entry.count = 0
    entry.lastReset = now
  }

  entry.count++
  ipLimits.set(ip, entry)

  return entry.count <= limit
}
