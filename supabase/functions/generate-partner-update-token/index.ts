import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create, getNumericDate } from 'https://deno.land/x/djwt@v2.8/mod.ts'
import { checkRateLimit } from '../_shared/rateLimit.ts'

interface TokenRequest {
  outcome_id: string
}

serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Rate Limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  if (!checkRateLimit(ip, 5, 60 * 60 * 1000)) { // 5 req / hour (strict for token gen)
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const jwtSecret = Deno.env.get('JWT_SECRET')

    if (!supabaseUrl || !supabaseServiceKey || !jwtSecret) {
      throw new Error('Missing required configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Parse request body
    const body: TokenRequest = await req.json()
    const { outcome_id } = body

    if (!outcome_id) {
      return new Response(JSON.stringify({ error: 'outcome_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify the outcome exists and get related data
    const { data: outcome, error: outcomeError } = await supabase
      .from('beneficiary_outcomes')
      .select(
        `
        id,
        interval_days,
        beneficiaries (full_name),
        applications (
          id,
          sober_living_partners (facility_name)
        )
      `
      )
      .eq('id', outcome_id)
      .single()

    if (outcomeError || !outcome) {
      return new Response(JSON.stringify({ error: 'Outcome not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Create JWT using djwt
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const payload = {
      outcome_id,
      beneficiary_name: outcome.beneficiaries?.full_name || 'Unknown',
      facility_name: outcome.applications?.sober_living_partners?.facility_name || 'Unknown Facility',
      interval_days: outcome.interval_days,
      exp: getNumericDate(7 * 24 * 60 * 60), // 7 days
      iat: getNumericDate(0),
      iss: 'metzler-foundations'
    }

    const token = await create({ alg: 'HS256', typ: 'JWT' }, payload, key)

    console.log(`Generated partner update token for outcome ${outcome_id}`)

    return new Response(
      JSON.stringify({
        success: true,
        token,
        expires_in: '7 days',
        outcome_id
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Unexpected error in generate-partner-update-token:', error)

    // Global error handling - escalate to Keragon
    try {
      const keragonWebhookUrl = Deno.env.get('KERAGON_WEBHOOK_URL')
      if (keragonWebhookUrl) {
        await fetch(keragonWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'automation_failure',
            function_name: 'generate-partner-update-token',
            error_message: error.message,
            severity: 'medium',
            timestamp: new Date().toISOString()
          })
        })
      }
    } catch (keragonError) {
      console.error('Failed to escalate error to Keragon:', keragonError)
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to generate partner update token'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
