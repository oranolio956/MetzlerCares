import { browser } from '$app/environment'

interface SecurityEvent {
  type?: string
  status?: number
  url?: string
  userAgent?: string
  error?: Error | { message: string; stack?: string; name?: string } | string | null
  context?: Record<string, any>
}

export async function logClientError(event: SecurityEvent) {
  if (!browser) return

  try {
    const payload = {
      ...event,
      url: event.url || window.location.href,
      userAgent: event.userAgent || navigator.userAgent,
      timestamp: new Date().toISOString()
    }

    const endpoint = '/api/security/events'
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, blob)
    } else {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    }
  } catch (err) {
    console.error('Failed to log client error', err)
  }
}

// Client-side CSRF Token retrieval
export function getCSRFToken(): string | null {
  if (!browser) return null
  const name = 'csrf-token'
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) {
    try {
      // The cookie might be JSON stringified (based on csrf.ts)
      const decoded = decodeURIComponent(match[2])
      // Check if it looks like JSON
      if (decoded.startsWith('{')) {
        const data = JSON.parse(decoded)
        return data.token
      }
      return decoded
    } catch {
      return null
    }
  }
  return null
}

// Placeholder for compatibility
export function validateCSRFToken(): boolean {
  return true
}

// Simple client-side rate limiter
class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map()

  isAllowed(key: string, limit: number, windowMs: number): boolean {
    if (!browser) return true
    
    const now = Date.now()
    const timestamps = this.requests.get(key) || []
    
    // Filter out old timestamps
    const validTimestamps = timestamps.filter(t => now - t < windowMs)
    
    if (validTimestamps.length >= limit) {
      return false
    }
    
    validTimestamps.push(now)
    this.requests.set(key, validTimestamps)
    return true
  }
}

export const rateLimiter = new ClientRateLimiter()
