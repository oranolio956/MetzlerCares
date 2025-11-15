import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts"

interface SubmitOutcomeRequest {
  token: string;
  outcome_metric: string;
  notes?: string;
}

serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const now = Date.now()
  ;(globalThis as any).rate_s = (globalThis as any).rate_s || new Map<string, number[]>()
  const bucket = (globalThis as any).rate_s.get(ip) || []
  const windowMs = 60 * 1000
  const filtered = bucket.filter((t: number) => now - t < windowMs)
  if (filtered.length >= 20) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
  }
  filtered.push(now)
  ;(globalThis as any).rate_s.set(ip, filtered)
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const jwtSecret = Deno.env.get('JWT_SECRET');

    if (!supabaseUrl || !supabaseServiceKey || !jwtSecret) {
      throw new Error('Missing required configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // DB-backed rate control
    const windowStart = new Date(Date.now() - 60_000).toISOString()
    const { count } = await supabase
      .from('request_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip as string)
      .eq('endpoint', 'submit_outcome')
      .gt('created_at', windowStart)
    if ((count || 0) >= 50) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
    }
    await supabase.from('request_logs').insert({ endpoint: 'submit_outcome', ip })

    // Parse request body
    const body: SubmitOutcomeRequest = await req.json();
    const { token, outcome_metric, notes } = body;

    if (!token || !outcome_metric) {
      return new Response(
        JSON.stringify({ error: 'Token and outcome_metric are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate outcome_metric
    const validMetrics = [
      'still_in_residence',
      'completed_program_successfully',
      'discharged_non_compliant',
      'discharged_left_ama',
      'lost_contact'
    ];

    if (!validMetrics.includes(outcome_metric)) {
      return new Response(
        JSON.stringify({ error: 'Invalid outcome_metric' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify JWT signature and claims
    let payload: Record<string, unknown>
    try {
      const key = new TextEncoder().encode(jwtSecret)
      payload = await verify(token, key, "HS256")
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid or unauthorized token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check expiration
    if ((payload as any).exp < Math.floor(Date.now() / 1000)) {
      return new Response(
        JSON.stringify({ error: 'Token has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
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
      .eq('id', (payload as any).outcome_id)
      .eq('status', 'pending') // Ensure it's still pending
      .select();

    if (error) {
      console.error('Failed to update outcome:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to update outcome',
          details: error.message
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Outcome not found or already completed' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Outcome ${(payload as any).outcome_id} updated with metric: ${outcome_metric}`);

    // Trigger receipt webhook (non-PHI)
    try {
      const receiptUrl = Deno.env.get('OUTCOME_RECEIPT_WEBHOOK_URL')
      if (receiptUrl) {
        await fetch(receiptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            outcome_id: (payload as any).outcome_id,
            metric: outcome_metric,
            interval_days: (data?.[0]?.interval_days ?? null),
            timestamp: new Date().toISOString()
          })
        })
      }
    } catch (_) {}

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
    );

  } catch (error) {
    console.error('Unexpected error in submit-outcome-update:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to submit outcome update'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
