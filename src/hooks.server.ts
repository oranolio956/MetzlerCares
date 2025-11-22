import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'

const SUPPORTED_LOCALES = ['en', 'es'] as const
const DEFAULT_LOCALE: (typeof SUPPORTED_LOCALES)[number] = 'en'
const LOCALE_COOKIE = 'mf_locale'

function normalizeLocale(value: string | null | undefined): (typeof SUPPORTED_LOCALES)[number] | null {
  if (!value) return null
  const normalized = value.trim().toLowerCase().split('-')[0]
  return SUPPORTED_LOCALES.some(locale => locale === normalized)
    ? (normalized as (typeof SUPPORTED_LOCALES)[number])
    : null
}

function localeFromAcceptLanguage(
  header: string | null
): (typeof SUPPORTED_LOCALES)[number] | null {
  if (!header) return null
  for (const part of header.split(',')) {
    const [rawLocale] = part.split(';')
    const locale = normalizeLocale(rawLocale)
    if (locale) return locale
  }
  return null
}

export const handle: Handle = async ({ event, resolve }) => {
  const supabaseUrl =
    import.meta.env.PUBLIC_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL ||
    'https://placeholder-project.supabase.co'
  const supabaseKey =
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    'placeholder-key'

  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl,
    supabaseKey,
    event
  })

  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession()
    return session
  }

  const {
    data: { session }
  } = await event.locals.supabase.auth.getSession()
  event.locals.session = session || null
  event.locals.user = session?.user || null
  event.locals.requestId = crypto.randomUUID()
  const cspNonce = crypto.randomUUID()
  event.locals.cspNonce = cspNonce

  const queryLocale = normalizeLocale(event.url.searchParams.get('lang'))
  const cookieLocale = normalizeLocale(event.cookies.get(LOCALE_COOKIE))
  const headerLocale = localeFromAcceptLanguage(event.request.headers.get('accept-language'))
  const resolvedLocale: (typeof SUPPORTED_LOCALES)[number] =
    queryLocale || cookieLocale || headerLocale || DEFAULT_LOCALE

  event.locals.locale = resolvedLocale

  if (queryLocale && queryLocale !== cookieLocale) {
    event.cookies.set(LOCALE_COOKIE, queryLocale, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    })
  }

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace(/%sveltekit.nonce%/g, cspNonce)
  })

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // Content Security Policy
  // Note: In dev, we might need to be looser, but this is for production readiness
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://js.stripe.com https://donorbox.org 'nonce-${cspNonce}'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://donorbox.org",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://*.supabase.co https://*.supabase.in https://www.google-analytics.com https://vitals.vercel-insights.com https://donorbox.org",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://donorbox.org",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ]

  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))

  return response
}
