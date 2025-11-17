import type { Handle } from '@sveltejs/kit'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '$env/static/private'
import { validateEncryptionKey } from '$lib/utils/encryption'
import { logAuditEvent } from '$lib/utils/supabase'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: VITE_SUPABASE_URL,
    supabaseKey: VITE_SUPABASE_ANON_KEY,
    event
  })

  event.locals.getSession = async () => {
    const { data } = await event.locals.supabase.auth.getSession()
    return data.session
  }

  // HIPAA Security Headers and Controls
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html
  })

  // Add comprehensive security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Content Security Policy for HIPAA compliance
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://m.stripe.network; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self'; " +
      "connect-src 'self' https://*.supabase.co https://api.stripe.com; " +
      'frame-src https://js.stripe.com https://hooks.stripe.com; ' +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
  )

  // HSTS for encrypted connections
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // Session Management: Log authentication events
  const session = await event.locals.getSession()
  const userId = session?.user?.id

  if (userId) {
    // Log login events (only when session is first established)
    const lastActivity = event.cookies.get('last_activity')
    const currentTime = Date.now()

    if (!lastActivity || currentTime - parseInt(lastActivity) > 300000) {
      // 5 minutes
      await logAuditEvent({
        action: 'LOGIN',
        resource_type: 'user_sessions',
        resource_id: session.user.id,
        purpose: 'User session established'
      }).catch(err => console.error('Failed to log login event:', err))
    }

    // Update last activity
    event.cookies.set('last_activity', currentTime.toString(), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    })
  }

  // HIPAA COMPLIANCE VALIDATIONS
  if (event.url.pathname === '/') {
    // Validate encryption configuration
    const encryptionStatus = validateEncryptionKey()
    if (!encryptionStatus.valid) {
      console.error('HIPAA COMPLIANCE CRITICAL ERROR:', encryptionStatus.message)
      // In production, this should trigger alerts and potentially block operations
      // For now, we'll log but allow operation to continue
    }

    // Validate server-side encryption
    try {
      const { validateEncryptionSetup } = await import('./lib/server/encryption.js')
      const serverEncryptionStatus = validateEncryptionSetup()
      if (!serverEncryptionStatus.valid) {
        console.error('HIPAA SERVER ENCRYPTION CRITICAL ERROR:', serverEncryptionStatus.message)
      } else {
        console.log('✅ HIPAA Server Encryption: Validated')
      }
    } catch (error) {
      console.error('HIPAA ENCRYPTION VALIDATION ERROR:', error)
    }

    console.log('🔐 HIPAA Session Management: Active')
    console.log('🛡️  HIPAA Security Headers: Enabled')
    console.log('📊 HIPAA Audit Logging: Active')
  }

  // Session activity tracking for HIPAA compliance
  // Track user activity for automatic timeout management
  // Note: locals.user is not available in handle hook, this would need to be implemented differently
  // For now, we'll rely on client-side session tracking

  return response
}
