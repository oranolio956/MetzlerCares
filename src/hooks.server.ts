import type { Handle } from '@sveltejs/kit'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '$env/static/private'

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

  const csrfCookie = event.cookies.get('csrf_token')
  if (!csrfCookie) {
    const token = crypto.randomUUID()
    event.cookies.set('csrf_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24
    })
    ;(event.locals as any).csrfToken = token
  } else {
    ;(event.locals as any).csrfToken = csrfCookie
  }

  const rid = crypto.randomUUID()
  ;(event.locals as any).requestId = rid
  const response = await resolve(event)
  response.headers.set('X-Request-Id', rid)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "img-src 'self' https: data:",
    "script-src 'self' https://donorbox.org",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://cdn.sanity.io https://donorbox.org",
    "frame-src https://donorbox.org",
  ].join('; '))
  return response
}
