import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface VerifyTokenRequest {
  token: string
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
    const body: VerifyTokenRequest = await req.json()
    const { token } = body

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Decode and verify JWT (simplified - use proper JWT library in production)
    const parts = token.split('.')
    if (parts.length !== 3) {
      return new Response(JSON.stringify({ error: 'Invalid token format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const payload = JSON.parse(atob(parts[1]))

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return new Response(JSON.stringify({ error: 'Token has expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify the outcome still exists and is pending
    const { data: outcome, error: outcomeError } = await supabase
      .from('beneficiary_outcomes')
      .select(
        `
        id,
        interval_days,
        status,
        beneficiaries (full_name),
        applications (
          sober_living_partners (facility_name)
        )
      `
      )
      .eq('id', payload.outcome_id)
      .single()

    if (outcomeError || !outcome) {
      return new Response(JSON.stringify({ error: 'Outcome not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (outcome.status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Outcome has already been completed' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Return the outcome data
    return new Response(
      JSON.stringify({
        success: true,
        outcome_id: outcome.id,
        interval_days: outcome.interval_days,
        beneficiary_name: outcome.beneficiaries?.full_name || 'Unknown',
        facility_name: outcome.applications?.sober_living_partners?.facility_name || 'Unknown Facility'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Unexpected error in verify-outcome-token:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to verify token'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
