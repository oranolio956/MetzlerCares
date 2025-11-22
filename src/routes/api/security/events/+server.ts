import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
  try {
    const event = await request.json()
    const { type, status, url, userAgent, error, context } = event

    // Sanitize and validate
    const sanitizedEvent = {
      timestamp: new Date().toISOString(),
      type: type || 'security_event',
      status: status || 500,
      url: url || 'unknown',
      userAgent: userAgent || 'unknown',
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null,
      context: context || {}
    }

    // In a real production env, we would send this to Datadog, Sentry, or write to a secure log
    // For now, we log to stdout which Vercel/system captures
    console.error('[SECURITY_EVENT]', JSON.stringify(sanitizedEvent))

    return json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Failed to process security event', err)
    return json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
