import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { securityLogger } from '$lib/server/security/logger'

export const POST: RequestHandler = async ({ request, getClientAddress, locals }) => {
  try {
    const body = await request.json()
    const level = (body?.level || 'error') as 'info' | 'warn' | 'error' | 'critical'
    const category = (body?.category || 'system') as 'auth' | 'api' | 'upload' | 'security' | 'system'
    const message = typeof body?.message === 'string' ? body.message : 'Client error'
    const details = typeof body?.details === 'object' ? body.details : undefined

    await securityLogger.log({
      level,
      category,
      message,
      details,
      ip_address: getClientAddress?.(),
      user_agent: request.headers.get('user-agent') || undefined,
      request_id: locals?.requestId
    })

    return json({ ok: true })
  } catch (error) {
    console.error('Failed to log client error:', error)
    return json({ ok: false }, { status: 500 })
  }
}