import type { RequestEvent } from '@sveltejs/kit'
import { json, error } from '@sveltejs/kit'

export interface SecurityHeaders {
  'X-Frame-Options'?: string
  'X-Content-Type-Options'?: string
  'X-XSS-Protection'?: string
  'Referrer-Policy'?: string
  'Permissions-Policy'?: string
  'Strict-Transport-Security'?: string
  'Content-Security-Policy'?: string
  'X-Request-ID'?: string
}

export function generateSecurityHeaders(event: RequestEvent): SecurityHeaders {
  const requestId = event.locals.requestId || crypto.randomUUID()

  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Request-ID': requestId
  }
}

export function generateCSP(event: RequestEvent): string {
  const nonce = crypto.randomUUID()
  event.locals.cspNonce = nonce

  const csp = [
    "default-src 'self'",
    "img-src 'self' https: data: blob:",
    "script-src 'self' 'nonce-${nonce}' https://donorbox.org https://www.google-analytics.com https://www.googletagmanager.com",
    "style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://cdn.sanity.io https://donorbox.org https://www.google-analytics.com",
    'frame-src https://donorbox.org',
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests'
  ].join('; ')

  return csp.replace(/\$\{nonce\}/g, nonce)
}

export function validateCSRFToken(event: RequestEvent): boolean {
  if (event.request.method === 'GET' || event.request.method === 'HEAD') {
    return true
  }

  const csrfToken = event.request.headers.get('X-CSRF-Token')
  const cookieToken = event.cookies.get('csrf_token')

  if (!csrfToken || !cookieToken) {
    return false
  }

  return csrfToken === cookieToken
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' }
  }

  // Additional security checks
  const filename = file.name.toLowerCase()
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js']

  if (dangerousExtensions.some(ext => filename.endsWith(ext))) {
    return { valid: false, error: 'Potentially dangerous file type detected' }
  }

  return { valid: true }
}

export function createSecurityError(message: string, status = 403) {
  const errorObj = new Error(message)
  ;(errorObj as any).code = 'SECURITY_ERROR'
  ;(errorObj as any).requestId = crypto.randomUUID()
  return error(status, errorObj)
}
