import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { securityLogger } from '$lib/server/security/logger'

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { start, end } = await request.json()
    
    if (!start || !end) {
      return json({ error: 'Start and end dates are required' }, { status: 400 })
    }
    
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return json({ error: 'Invalid date format' }, { status: 400 })
    }
    
    const metrics = await securityLogger.getSecurityMetrics({
      start: startDate,
      end: endDate
    })
    
    return json(metrics)
  } catch (error) {
    console.error('Error fetching security metrics:', error)
    return json({ error: 'Failed to fetch security metrics' }, { status: 500 })
  }
}