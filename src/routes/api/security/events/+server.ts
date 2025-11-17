import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { securityLogger } from '$lib/server/security/logger'

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { start, end, level, category, limit = 100 } = await request.json()
    
    if (!start || !end) {
      return json({ error: 'Start and end dates are required' }, { status: 400 })
    }
    
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return json({ error: 'Invalid date format' }, { status: 400 })
    }
    
    const events = await securityLogger.getSuspiciousActivities({
      start: startDate,
      end: endDate
    })
    
    // Filter by level and category if specified
    let filteredEvents = events
    
    if (level && level !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.level === level)
    }
    
    if (category && category !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === category)
    }
    
    // Limit results
    filteredEvents = filteredEvents.slice(0, limit)
    
    return json(filteredEvents)
  } catch (error) {
    console.error('Error fetching security events:', error)
    return json({ error: 'Failed to fetch security events' }, { status: 500 })
  }
}