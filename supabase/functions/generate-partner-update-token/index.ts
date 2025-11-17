import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface TokenRequest {
  outcome_id: string
}

serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
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

    // Create JWT payload
    const payload = {
      outcome_id,
      beneficiary_name: outcome.beneficiaries?.full_name || 'Unknown',
      facility_name: outcome.applications?.sober_living_partners?.facility_name || 'Unknown Facility',
      interval_days: outcome.interval_days,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      iat: Math.floor(Date.now() / 1000),
      iss: 'metzler-foundations'
    }

    // Simple JWT creation (in production, use a proper JWT library)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const encodedPayload = btoa(JSON.stringify(payload))

    // Create signature (simplified - use proper crypto in production)
    const message = `${header}.${encodedPayload}`
    const signature = await crypto.subtle.sign(
      'HMAC',
      await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(jwtSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      ),
      new TextEncoder().encode(message)
    )

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    const token = `${message}.${encodedSignature}`

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
            outcome_id: req.body?.outcome_id || 'unknown',
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
