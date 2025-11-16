import type { RequestEvent } from '@sveltejs/kit'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyGenerator: (event: RequestEvent) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitStore>()

export function createRateLimiter(config: RateLimitConfig) {
  return async function rateLimit(event: RequestEvent): Promise<boolean> {
    const key = config.keyGenerator(event)
    const now = Date.now()
    
    const store = rateLimitStore.get(key)
    
    if (store && store.resetTime < now) {
      rateLimitStore.delete(key)
    }
    
    const current = rateLimitStore.get(key) || { count: 0, resetTime: now + config.windowMs }
    
    if (current.count >= config.maxRequests) {
      return false
    }
    
    current.count++
    rateLimitStore.set(key, current)
    
    // Cleanup old entries
    if (rateLimitStore.size > 10000) {
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < now) {
          rateLimitStore.delete(k)
        }
      }
    }
    
    return true
  }
}

// Predefined rate limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyGenerator: (event) => {
    const ip = event.getClientAddress()
    return `auth:${ip}`
  }
})

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyGenerator: (event) => {
    const ip = event.getClientAddress()
    const userId = event.locals.user?.id || 'anonymous'
    return `api:${ip}:${userId}`
  }
})

export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
  keyGenerator: (event) => {
    const userId = event.locals.user?.id || 'anonymous'
    return `upload:${userId}`
  }
})