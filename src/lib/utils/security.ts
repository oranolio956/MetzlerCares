// Security utilities for Metzler Foundations

import { browser } from '$app/environment'

// CSRF token generation and validation
export function generateCSRFToken(): string {
  if (!browser) {
    return ''
  }

  const token = crypto.randomUUID()
  sessionStorage.setItem('csrf-token', token)
  return token
}

export function getCSRFToken(): string {
  if (!browser) {
    return ''
  }
  return sessionStorage.getItem('csrf-token') || ''
}

export function validateCSRFToken(token: string): boolean {
  if (!browser) {
    return true
  } // Server-side validation handled differently
  const storedToken = sessionStorage.getItem('csrf-token')
  return token === storedToken
}

// Rate limiting for API calls
class RateLimiter {
  private attempts: Map<string, number[]> = new Map()

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    if (!browser) {
      return true
    }

    const now = Date.now()
    const attempts = this.attempts.get(key) || []

    // Remove attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs)

    if (validAttempts.length >= maxAttempts) {
      return false
    }

    validAttempts.push(now)
    this.attempts.set(key, validAttempts)
    return true
  }

  reset(key: string): void {
    this.attempts.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

// Input sanitization and validation
export function sanitizeHTML(input: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/style\s*=\s*["'][^"']*["']/gi, '')
    .trim()
}

export function sanitizeSQL(input: string): string {
  // Basic SQL injection prevention
  return input.replace(/['";\\]/g, '').trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function validatePhone(phone: string): boolean {
  // Allow various phone formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15
}

export function validateSSN(ssn: string): boolean {
  // Basic SSN format validation (not full security validation)
  const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/
  return ssnRegex.test(ssn)
}

export function validateZIP(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zip)
}

// Content Security Policy headers
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.sanity.io https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com https://maps.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ')
}

// Security headers for all responses
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

// Password security
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
} {
  const errors: string[] = []
  let score = 0

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  } else {
    score += 1
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else {
    score += 1
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else {
    score += 1
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else {
    score += 1
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  } else {
    score += 1
  }

  // Length bonus
  if (password.length >= 12) {
    score += 1
  }

  let strength: 'weak' | 'medium' | 'strong'
  if (score >= 6) {
    strength = 'strong'
  } else if (score >= 4) {
    strength = 'medium'
  } else {
    strength = 'strong' // Default to strong for now, will be weak
    strength = 'weak'
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}

// Session security
export class SecureSession {
  private static instance: SecureSession
  private sessionId: string = ''
  private lastActivity: number = Date.now()

  static getInstance(): SecureSession {
    if (!SecureSession.instance) {
      SecureSession.instance = new SecureSession()
    }
    return SecureSession.instance
  }

  initialize(userId: string): void {
    if (!browser) {
      return
    }

    this.sessionId = crypto.randomUUID()
    this.lastActivity = Date.now()

    localStorage.setItem('session_id', this.sessionId)
    localStorage.setItem('user_id', userId)
    localStorage.setItem('session_start', this.lastActivity.toString())
  }

  isValid(): boolean {
    if (!browser) {
      return true
    }

    const sessionId = localStorage.getItem('session_id')
    const sessionStart = localStorage.getItem('session_start')

    if (!sessionId || !sessionStart) {
      return false
    }

    // Check if session is older than 8 hours
    const sessionAge = Date.now() - parseInt(sessionStart)
    if (sessionAge > 8 * 60 * 60 * 1000) {
      return false
    }

    // Check if inactive for more than 30 minutes
    const inactiveTime = Date.now() - this.lastActivity
    if (inactiveTime > 30 * 60 * 1000) {
      return false
    }

    return true
  }

  updateActivity(): void {
    this.lastActivity = Date.now()
    if (browser) {
      localStorage.setItem('last_activity', this.lastActivity.toString())
    }
  }

  destroy(): void {
    if (!browser) {
      return
    }

    localStorage.removeItem('session_id')
    localStorage.removeItem('user_id')
    localStorage.removeItem('session_start')
    localStorage.removeItem('last_activity')
  }
}

export const secureSession = SecureSession.getInstance()

// File upload security
export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  }
): { isValid: boolean; error?: string } {
  // Size check
  if (options.maxSize && file.size > options.maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(options.maxSize / 1024 / 1024)}MB`
    }
  }

  // Type check
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
    }
  }

  // Extension check
  if (options.allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !options.allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`
      }
    }
  }

  return { isValid: true }
}

// Audit logging for security events
export function logSecurityEvent(event: {
  type: 'login' | 'logout' | 'failed_login' | 'suspicious_activity' | 'file_upload' | 'data_access'
  userId?: string
  details?: any
  ip?: string
}): void {
  if (!browser) {
    return
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    eventType: event.type,
    userId: event.userId || 'anonymous',
    details: event.details || {},
    userAgent: navigator.userAgent,
    url: window.location.href
  }

  // In production, this would send to a secure logging service
  console.log('Security Event:', logEntry)

  // Store in local storage for debugging (remove in production)
  const existingLogs = JSON.parse(localStorage.getItem('security_logs') || '[]')
  existingLogs.push(logEntry)

  // Keep only last 100 entries
  if (existingLogs.length > 100) {
    existingLogs.shift()
  }

  localStorage.setItem('security_logs', JSON.stringify(existingLogs))
}
