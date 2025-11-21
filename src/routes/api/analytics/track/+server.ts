import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { createClient } from '@supabase/supabase-js'
import { csrfProtection } from '$lib/utils/csrf'
import { validateSecureInput, logSecurityEvent } from '$lib/utils/hipaaValidation'

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseAnon = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null

export const POST: RequestHandler = async event => {
  const { request, getClientAddress } = event

  try {
    // CSRF Protection
    csrfProtection(event)

    const {
      event_type,
      user_id,
      persona,
      page_url,
      referrer_url,
      utm_source,
      utm_medium,
      utm_campaign,
      metadata = {}
    } = await request.json()

    // Enhanced HIPAA-compliant validation
    const eventTypeValidation = validateSecureInput(event_type, 'event_type')
    if (!eventTypeValidation.isValid) {
      logSecurityEvent(
        'INVALID_ANALYTICS_REQUEST',
        {
          reason: 'event_type_validation_failed',
          field: 'event_type',
          value: event_type
        },
        'medium'
      )
      return json({ error: eventTypeValidation.message || 'Invalid event type' }, { status: 400 })
    }

    // Validate optional fields if provided
    if (user_id) {
      const userIdValidation = validateSecureInput(user_id, 'user_id')
      if (!userIdValidation.isValid) {
        logSecurityEvent(
          'INVALID_ANALYTICS_REQUEST',
          {
            reason: 'user_id_validation_failed',
            field: 'user_id'
          },
          'medium'
        )
        return json({ error: 'Invalid user ID format' }, { status: 400 })
      }
    }

    if (page_url) {
      const pageUrlValidation = validateSecureInput(page_url, 'page_url')
      if (!pageUrlValidation.isValid) {
        logSecurityEvent(
          'INVALID_ANALYTICS_REQUEST',
          {
            reason: 'page_url_validation_failed',
            field: 'page_url'
          },
          'medium'
        )
        return json({ error: 'Invalid page URL format' }, { status: 400 })
      }
    }

    // Get client information
    const clientIp = getClientAddress()
    const userAgent = request.headers.get('user-agent') || ''
    const sessionId = generateSessionId()

    // Generate unique event ID
    const eventId = generateEventId()

    // Prepare event data
    const eventData = {
      id: eventId,
      user_id: user_id || null,
      session_id: sessionId,
      event_type: event_type,
      persona: persona || 'unknown',
      page_url: page_url || request.headers.get('referer') || '',
      referrer_url: referrer_url || request.headers.get('referer') || '',
      utm_source: utm_source || getUtmFromUrl(page_url, 'utm_source'),
      utm_medium: utm_medium || getUtmFromUrl(page_url, 'utm_medium'),
      utm_campaign: utm_campaign || getUtmFromUrl(page_url, 'utm_campaign'),
      metadata: metadata,
      ip_address: clientIp,
      user_agent: userAgent,
      created_at: new Date().toISOString()
    }

    // Insert into database
    if (supabase) {
      const { data, error: dbError } = await supabase.from('conversion_events').insert(eventData)

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Failed to track event')
      }
    }

    // Process special events
    await processSpecialEvents(event_type, eventData)

    // Return success response
    return json({
      success: true,
      event_id: eventId,
      message: 'Event tracked successfully'
    })
  } catch (err) {
    console.error('Analytics tracking error:', err)

    return json(
      {
        error: 'Failed to track event',
        message: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
}

function generateEventId(): string {
  return 'event_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
}

function getUtmFromUrl(url: string | null, param: string): string | null {
  if (!url) return null

  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get(param)
  } catch {
    return null
  }
}

async function processSpecialEvents(eventType: string, eventData: any) {
  try {
    switch (eventType) {
      case 'insurance_verification_success':
        await processInsuranceVerificationSuccess(eventData)
        break

      case 'urgency_cta_click':
        await processUrgencyCtaClick(eventData)
        break

      case 'referral_created':
        await processReferralCreated(eventData)
        break

      case 'achievement_unlocked':
        await processAchievementUnlocked(eventData)
        break

      case 'buddy_connection_made':
        await processBuddyConnection(eventData)
        break

      case 'conversion_complete':
        await processConversionComplete(eventData)
        break

      default:
        // No special processing needed
        break
    }
  } catch (err) {
    console.error('Error processing special event:', err)
  }
}

async function processInsuranceVerificationSuccess(eventData: any) {
  const { user_id, metadata, persona } = eventData

  if (!user_id || !supabase) return

  // Update user insurance verification status
  const { error: updateError } = await supabase
    .from('users')
    .update({
      insurance_verified: true,
      insurance_provider: metadata.provider,
      updated_at: new Date().toISOString()
    })
    .eq('id', user_id)

  if (updateError) {
    console.error('Error updating user insurance status:', updateError)
  }

  // Track as conversion
  await trackConversion('insurance_verification', user_id, persona, {
    value: 50, // Insurance verification has high value
    metadata: {
      provider: metadata.provider,
      verified: metadata.verified
    }
  })

  // Check for insurance verification achievement
  await checkAndAwardAchievement(user_id, 'insurance_verified')
}

async function processUrgencyCtaClick(eventData: any) {
  const { metadata, persona } = eventData

  if (!supabase) return
  // Track urgency effectiveness
  const { data: urgencyData } = await supabase
    .from('urgency_indicators')
    .select('id, clicks, last_clicked_at')
    .eq('facility_id', metadata.facility_id)
    .eq('urgency_level', metadata.urgency_level)
    .single()

  if (urgencyData) {
    // Update urgency indicator effectiveness
    await supabase
      .from('urgency_indicators')
      .update({
        clicks: (urgencyData.clicks || 0) + 1,
        last_clicked_at: new Date().toISOString()
      })
      .eq('id', urgencyData.id)
  }

  // Track conversion with urgency context
  await trackConversion('urgency_cta_click', eventData.user_id, persona, {
    value: 25,
    metadata: {
      facility_id: metadata.facility_id,
      urgency_level: metadata.urgency_level,
      available_beds: metadata.available_beds
    }
  })
}

async function processReferralCreated(eventData: any) {
  const { user_id, metadata, persona } = eventData

  if (!user_id) return

  // Award points for creating referral
  await awardPoints(user_id, 10, 'referral_created')

  // Check for referral achievements
  if (!supabase) return
  const { count } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_user_id', user_id)

  if (count && count >= 3) {
    await checkAndAwardAchievement(user_id, 'referral_milestone_3')
  }

  // Track conversion
  await trackConversion('referral_created', user_id, persona, {
    value: 20,
    metadata: {
      referral_id: metadata.referral_id,
      urgency_level: metadata.urgency_level
    }
  })
}

async function processAchievementUnlocked(eventData: any) {
  const { user_id, metadata } = eventData

  if (!user_id) return

  // Award achievement points
  await awardPoints(user_id, metadata.points_awarded || 0, `achievement_${metadata.achievement_type}`)

  // Track achievement conversion
  await trackConversion('achievement_unlocked', user_id, eventData.persona, {
    value: metadata.points_awarded || 0,
    metadata: {
      achievement_type: metadata.achievement_type,
      achievement_name: metadata.achievement_name
    }
  })
}

async function processBuddyConnection(eventData: any) {
  const { user_id, metadata } = eventData

  if (!user_id) return

  // Award points for buddy connection
  await awardPoints(user_id, 15, 'buddy_connection')

  // Check for community achievements
  if (!supabase) return
  const { count } = await supabase
    .from('buddy_connections')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id)
    .eq('connection_status', 'accepted')

  if (count && count >= 5) {
    await checkAndAwardAchievement(user_id, 'community_champion')
  }

  // Track conversion
  await trackConversion('buddy_connection_made', user_id, eventData.persona, {
    value: 15,
    metadata: {
      buddy_user_id: metadata.buddy_user_id,
      connection_strength: metadata.connection_strength
    }
  })
}

async function processConversionComplete(eventData: any) {
  const { user_id, metadata, persona } = eventData

  // This is a high-value conversion (admission, treatment start, etc.)
  await trackConversion('conversion_complete', user_id, persona, {
    value: metadata.conversion_value || 100,
    metadata: {
      conversion_type: metadata.conversion_type,
      facility_id: metadata.facility_id,
      admission_date: metadata.admission_date
    }
  })

  // Award significant points for major conversion
  if (user_id) {
    await awardPoints(user_id, 50, 'conversion_complete')
  }
}

async function trackConversion(eventType: string, userId: string | null, persona: string, conversionData: any) {
  try {
    if (!supabase) return
    await supabase.from('conversion_events').insert({
      event_type: eventType,
      user_id: userId,
      persona: persona,
      metadata: conversionData.metadata,
      created_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error tracking conversion:', err)
  }
}

async function awardPoints(userId: string, points: number, reason: string) {
  try {
    if (!supabase) return
    // Get current points
    const { data: userData } = await supabase.from('users').select('total_points').eq('id', userId).single()

    if (userData) {
      await supabase
        .from('users')
        .update({
          total_points: (userData.total_points || 0) + points,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    }

    // Track points transaction
    await supabase?.from('points_transactions').insert({
      user_id: userId,
      points_awarded: points,
      reason: reason,
      created_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error awarding points:', err)
  }
}

async function checkAndAwardAchievement(userId: string, achievementType: string) {
  try {
    if (!supabase) return
    // Check if achievement already awarded
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_type', achievementType)
      .single()

    if (existingAchievement) {
      return // Already awarded
    }

    // Get achievement details
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('criteria_type', achievementType)
      .single()

    if (achievement) {
      // Award achievement
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id,
        achievement_type: achievementType,
        earned_at: new Date().toISOString()
      })

      // Award achievement points
      await awardPoints(userId, achievement.points_awarded, `achievement_${achievementType}`)

      // Fire achievement unlocked event
      await supabase.from('conversion_events').insert({
        event_type: 'achievement_unlocked',
        user_id: userId,
        metadata: {
          achievement_type: achievementType,
          achievement_name: achievement.name,
          points_awarded: achievement.points_awarded
        },
        created_at: new Date().toISOString()
      })
    }
  } catch (err) {
    console.error('Error checking/awarding achievement:', err)
  }
}
