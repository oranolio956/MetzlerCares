import type { Handle } from '@sveltejs/kit'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '$env/static/private'
import { authRateLimiter, apiRateLimiter, uploadRateLimiter } from '$lib/server/security/rateLimiter'
import { generateSecurityHeaders, generateCSP, validateCSRFToken } from '$lib/server/security/utils'
import { handleError, ErrorCode, createError } from '$lib/server/security/errorHandler'
import { securityLogger } from '$lib/server/security/logger'
import { fileSecurityValidator } from '$lib/server/security/fileValidator'

export const handle: Handle = async ({ event, resolve }) => {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()
  event.locals.requestId = requestId
  
  // Initialize Supabase client
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: VITE_SUPABASE_URL,
    supabaseKey: VITE_SUPABASE_ANON_KEY,
    event
  })

  event.locals.getSession = async () => {
    const { data } = await event.locals.supabase.auth.getSession()
    return data.session
  }

  // Get user information if authenticated
  try {
    const session = await event.locals.getSession()
    if (session?.user) {
      event.locals.user = session.user
    }
  } catch (err) {
    console.error('Error getting user session:', err)
  }

  // Rate limiting
  const path = event.url.pathname
  let rateLimiter
  
  if (path.startsWith('/auth') || path.startsWith('/login') || path.startsWith('/signup')) {
    rateLimiter = authRateLimiter
  } else if (path.startsWith('/api')) {
    rateLimiter = apiRateLimiter
  } else if (path.includes('/upload') || path.includes('/file')) {
    rateLimiter = uploadRateLimiter
  }
  
  if (rateLimiter) {
    const allowed = await rateLimiter(event)
    if (!allowed) {
      await securityLogger.logSecurityEvent({
        type: 'rate_limit_exceeded',
        ipAddress: event.getClientAddress(),
        userAgent: event.request.headers.get('user-agent') || '',
        requestId,
        userId: event.locals.user?.id,
        details: { path }
      })
      
      throw createError(
        ErrorCode.RATE_LIMIT_EXCEEDED,
        'Rate limit exceeded',
        429,
        { retryAfter: 900 } // 15 minutes
      )
    }
  }

  // CSRF protection
  const csrfCookie = event.cookies.get('csrf_token')
  if (!csrfCookie) {
    const token = crypto.randomUUID()
    event.cookies.set('csrf_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 // 24 hours
    })
    event.locals.csrfToken = token
  } else {
    event.locals.csrfToken = csrfCookie
  }

  // Validate CSRF token for state-changing requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.request.method)) {
    if (!validateCSRFToken(event)) {
      await securityLogger.logSecurityEvent({
        type: 'csrf_validation_failed',
        ipAddress: event.getClientAddress(),
        userAgent: event.request.headers.get('user-agent') || '',
        requestId,
        userId: event.locals.user?.id
      })
      
      throw createError(
        ErrorCode.CSRF_VALIDATION_FAILED,
        'CSRF validation failed',
        403
      )
    }
  }

  // Log request
  await securityLogger.log({
    level: 'info',
    category: 'system',
    message: `Request: ${event.request.method} ${path}`,
    ip_address: event.getClientAddress(),
    user_agent: event.request.headers.get('user-agent') || '',
    request_id: requestId,
    user_id: event.locals.user?.id,
    details: {
      method: event.request.method,
      path,
      query: Object.fromEntries(event.url.searchParams)
    }
  })

  try {
    // Process request
    const response = await resolve(event, {
      transformPageChunk: ({ html }) => {
        // Inject CSP nonce for inline styles
        const nonce = event.locals.cspNonce
        return nonce ? html.replace(/%sveltekit.cspnonce%/g, nonce) : html
      }
    })
    
    // Add security headers
    const securityHeaders = generateSecurityHeaders(event)
    const csp = generateCSP(event)
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      if (value) response.headers.set(key, value)
    })
    
    response.headers.set('Content-Security-Policy', csp)
    response.headers.set('X-Request-ID', requestId)
    
    // Log successful response
    const duration = Date.now() - startTime
    if (duration > 5000) { // Log slow requests
      await securityLogger.log({
        level: 'warn',
        category: 'system',
        message: `Slow request: ${duration}ms`,
        ip_address: event.getClientAddress(),
        user_agent: event.request.headers.get('user-agent') || '',
        request_id: requestId,
        user_id: event.locals.user?.id,
        details: {
          method: event.request.method,
          path,
          duration,
          status: response.status
        }
      })
    }
    
    return response
  } catch (err) {
    const appError = await handleError(err, event, 'request_handler')
    
    // Return error response with security headers
    const errorResponse = new Response(
      JSON.stringify({
        error: {
          message: appError.userMessage,
          code: appError.code,
          requestId: appError.requestId
        }
      }),
      {
        status: appError.status,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          ...generateSecurityHeaders(event)
        }
      }
    )
    
    return errorResponse
  }
}
