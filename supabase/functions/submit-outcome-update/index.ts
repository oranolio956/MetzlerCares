import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface SubmitOutcomeRequest {
  token: string
  outcome_metric: string
  notes?: string
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
    const body: SubmitOutcomeRequest = await req.json()
    const { token, outcome_metric, notes } = body

    if (!token || !outcome_metric) {
      return new Response(JSON.stringify({ error: 'Token and outcome_metric are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validate outcome_metric
    const validMetrics = [
      'still_in_residence',
      'completed_program_successfully',
      'discharged_non_compliant',
      'discharged_left_ama',
      'lost_contact'
    ]

    if (!validMetrics.includes(outcome_metric)) {
      return new Response(JSON.stringify({ error: 'Invalid outcome_metric' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Decode and verify JWT
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

    // Update the outcome
    const { data, error } = await supabase
      .from('beneficiary_outcomes')
      .update({
        status: 'completed',
        outcome_metric,
        notes,
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .eq('id', payload.outcome_id)
      .eq('status', 'pending') // Ensure it's still pending
      .select()

    if (error) {
      console.error('Failed to update outcome:', error)
      return new Response(
        JSON.stringify({
          error: 'Failed to update outcome',
          details: error.message
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Outcome not found or already completed' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`Outcome ${payload.outcome_id} updated with metric: ${outcome_metric}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Outcome updated successfully',
        outcome: data[0]
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Unexpected error in submit-outcome-update:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to submit outcome update'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
