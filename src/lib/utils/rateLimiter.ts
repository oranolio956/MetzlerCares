import { dev } from '$app/environment'
import { RateLimitError } from './errorHandler'
import { logger } from './logger'

interface RateLimitEntry {
  count: number
  resetTime: number
}

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator?: (request: Request) => string
}

class MemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async checkLimit(request: Request): Promise<void> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(request) : this.getDefaultKey(request)
    const now = Date.now()
    const entry = this.store.get(key)

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      // 1% chance to clean up
      this.cleanup()
    }

    if (!entry || now >= entry.resetTime) {
      // Create new entry or reset expired one
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs
      })
      return
    }

    if (entry.count >= this.config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      logger.warn('Rate limit exceeded', { key, count: entry.count, retryAfter })
      throw new RateLimitError('Too many requests', retryAfter)
    }

    // Increment counter
    entry.count++
  }

  private getDefaultKey(request: Request): string {
    // Use IP address as default key
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
    return `ip:${ip}`
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

// Predefined rate limit configurations
export const rateLimiters = {
  // Strict limits for authentication endpoints
  auth: new MemoryRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    keyGenerator: request => {
      const forwarded = request.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
      return `auth:${ip}`
    }
  }),

  // Moderate limits for application submissions
  application: new MemoryRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 applications per hour per IP
    keyGenerator: request => {
      const forwarded = request.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
      return `app:${ip}`
    }
  }),

  // General API limits
  api: new MemoryRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60 // 60 requests per minute per IP
  }),

  // Partner application limits
  partner: new MemoryRateLimiter({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 2, // 2 partner applications per day per IP
    keyGenerator: request => {
      const forwarded = request.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown'
      return `partner:${ip}`
    }
  })
}

export async function withRateLimit<T>(
  limiter: MemoryRateLimiter,
  request: Request,
  operation: () => Promise<T>
): Promise<T> {
  try {
    await limiter.checkLimit(request)
    return await operation()
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error
    }
    throw error
  }
}

// Middleware-style rate limiting for SvelteKit
export function createRateLimitMiddleware(limiter: MemoryRateLimiter) {
  return async (request: Request) => {
    try {
      await limiter.checkLimit(request)
      return null // No error, proceed
    } catch (error) {
      if (error instanceof RateLimitError) {
        return new Response(
          JSON.stringify({
            error: {
              code: error.code,
              message: error.message,
              retryAfter: error.retryAfter
            }
          }),
          {
            status: error.statusCode,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': error.retryAfter?.toString() || '60'
            }
          }
        )
      }
      throw error
    }
  }
}
