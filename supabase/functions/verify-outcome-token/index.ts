import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts"

interface VerifyTokenRequest {
  token: string;
}

serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const now = Date.now()
  ;(globalThis as any).rate = (globalThis as any).rate || new Map<string, number[]>()
  const bucket = (globalThis as any).rate.get(ip) || []
  const windowMs = 60 * 1000
  const filtered = bucket.filter((t: number) => now - t < windowMs)
  if (filtered.length >= 20) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
  }
  filtered.push(now)
  ;(globalThis as any).rate.set(ip, filtered)
  if (req.method !== 'POST') {
    console.warn(JSON.stringify({ level: 'warn', ctx: 'verify_outcome', msg: 'invalid_method', method: req.method }));
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const jwtSecret = Deno.env.get('JWT_SECRET');

    if (!supabaseUrl || !supabaseServiceKey || !jwtSecret) {
      console.error(JSON.stringify({ level: 'error', ctx: 'verify_outcome', msg: 'missing_config' }));
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
      .eq('endpoint', 'verify_outcome')
      .gt('created_at', windowStart)
    if ((count || 0) >= 50) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
    }
    await supabase.from('request_logs').insert({ endpoint: 'verify_outcome', ip })

    // Parse request body
    const body: VerifyTokenRequest = await req.json();
    const { token } = body;

    if (!token) {
      console.warn(JSON.stringify({ level: 'warn', ctx: 'verify_outcome', msg: 'missing_token' }));
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify JWT signature and claims
    let payload: Record<string, unknown>;
    try {
      const key = new TextEncoder().encode(jwtSecret);
      payload = await verify(token, key, "HS256");
      console.info(JSON.stringify({ level: 'info', ctx: 'verify_outcome', msg: 'jwt_verified', outcome_id: payload.outcome_id }));
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', ctx: 'verify_outcome', msg: 'jwt_verify_failed', error: e }));
      return new Response(
        JSON.stringify({ error: 'Invalid or unauthorized token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check expiration
    if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
      console.warn(JSON.stringify({ level: 'warn', ctx: 'verify_outcome', msg: 'token_expired', outcome_id: payload.outcome_id, exp: payload.exp }));
      return new Response(
        JSON.stringify({ error: 'Token has expired' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify the outcome still exists and is pending
    console.info(JSON.stringify({ level: 'info', ctx: 'verify_outcome', msg: 'looking_up_outcome', outcome_id: payload.outcome_id }));
    
    const { data: outcome, error: outcomeError } = await supabase
      .from('beneficiary_outcomes')
      .select(`
        id,
        interval_days,
        status,
        beneficiaries (full_name),
        applications (
          sober_living_partners (facility_name)
        )
      `)
      .eq('id', payload.outcome_id as string)
      .single();

    if (outcomeError || !outcome) {
      console.error(JSON.stringify({ level: 'error', ctx: 'verify_outcome', msg: 'outcome_not_found', error: outcomeError, outcome_id: payload.outcome_id }));
      return new Response(
        JSON.stringify({ error: 'Outcome not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (outcome.status !== 'pending') {
      console.warn(JSON.stringify({ level: 'warn', ctx: 'verify_outcome', msg: 'outcome_not_pending', outcome_id: outcome.id, status: outcome.status }));
      return new Response(
        JSON.stringify({ error: 'Outcome has already been completed' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.info(JSON.stringify({ level: 'info', ctx: 'verify_outcome', msg: 'outcome_verified', outcome_id: outcome.id, beneficiary_name: outcome.beneficiaries?.full_name }));

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
    );

  } catch (error) {
    console.error(JSON.stringify({ level: 'error', ctx: 'verify_outcome', msg: 'unexpected_error', error }));
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to verify token'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
