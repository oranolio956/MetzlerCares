import { corsHeaders } from '../_shared/cors.ts'

// HIPAA-Compliant Keragon Webhook Trigger
// This function is called after successful beneficiary intake
// It triggers the Keragon automation workflow without exposing PII

interface RequestBody {
  beneficiary_id: string;
}

Deno.serve(async (req) => {
  const ip = req.headers.get('x-forwarded-for') || 'anon'
  const now = Date.now()
  ;(globalThis as any).rate_t = (globalThis as any).rate_t || new Map<string, number[]>()
  const bucket = (globalThis as any).rate_t.get(ip) || []
  const windowMs = 60 * 1000
  const filtered = bucket.filter((t: number) => now - t < windowMs)
  if (filtered.length >= 30) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: corsHeaders })
  }
  filtered.push(now)
  ;(globalThis as any).rate_t.set(ip, filtered)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.warn(JSON.stringify({ level: 'warn', ctx: 'intake_trigger', msg: 'invalid_method', method: req.method }));
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: RequestBody = await req.json();

    if (!body || typeof body.beneficiary_id !== 'string' || !body.beneficiary_id.trim()) {
      console.warn(JSON.stringify({ level: 'warn', ctx: 'intake_trigger', msg: 'missing_beneficiary_id' }));
      return new Response(
        JSON.stringify({ error: 'beneficiary_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const { beneficiary_id } = body;

    // Validate beneficiary_id format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(beneficiary_id)) {
      console.warn(JSON.stringify({ level: 'warn', ctx: 'intake_trigger', msg: 'invalid_beneficiary_format', beneficiary_id }));
      return new Response(
        JSON.stringify({ error: 'Invalid beneficiary_id format' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Require auth token
    const expectedToken = Deno.env.get('INTAKE_WORKFLOW_TOKEN');
    if (!expectedToken) {
      console.error(JSON.stringify({ level: 'error', ctx: 'intake_trigger', msg: 'missing_config_token' }));
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    const authHeader = req.headers.get('Authorization');
    const xToken = req.headers.get('X-Webhook-Token');
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const provided = bearer || xToken || null;
    if (!provided || provided !== expectedToken) {
      console.warn(JSON.stringify({ level: 'warn', ctx: 'intake_trigger', msg: 'unauthorized', has_auth: !!provided }));
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Retrieve Keragon webhook URL from environment variables
    // This is stored securely in Supabase secrets, not in code
    const keragonWebhookUrl = Deno.env.get('KERAGON_WEBHOOK_URL');

    if (!keragonWebhookUrl) {
      console.error(JSON.stringify({ level: 'error', ctx: 'intake_trigger', msg: 'missing_webhook_url' }));
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Prepare payload for Keragon webhook
    // CRITICAL: Only send beneficiary_id, no PII or PHI
    const payload = {
      beneficiary_id: beneficiary_id,
      timestamp: new Date().toISOString(),
      source: 'metzler-foundations-intake'
    };

    console.info(JSON.stringify({ level: 'info', ctx: 'intake_trigger', msg: 'triggering_webhook', beneficiary_id, webhook_url: keragonWebhookUrl }));

    // Make POST request to Keragon webhook
    const keragonResponse = await fetch(keragonWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Metzler-Foundations-Edge-Function/1.0'
      },
      body: JSON.stringify(payload)
    });

    // Check if Keragon webhook accepted the request
    if (!keragonResponse.ok) {
      console.error(JSON.stringify({ level: 'error', ctx: 'intake_trigger', msg: 'webhook_failed', status: keragonResponse.status, statusText: keragonResponse.statusText, beneficiary_id }));
      return new Response(
        JSON.stringify({
          error: 'Failed to trigger intake workflow',
          details: 'External service unavailable'
        }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // DB-backed rate control
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } })
      const windowStart = new Date(Date.now() - 60_000).toISOString()
      const { count } = await supabase
        .from('request_logs')
        .select('*', { count: 'exact', head: true })
        .eq('ip', ip as string)
        .eq('endpoint', 'intake_trigger')
        .gt('created_at', windowStart)
      if ((count || 0) >= 100) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: corsHeaders })
      }
      await supabase.from('request_logs').insert({ endpoint: 'intake_trigger', ip })
    }
    console.info(JSON.stringify({ level: 'info', ctx: 'intake_trigger', msg: 'triggered', beneficiary_id, status: keragonResponse.status }));

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Intake workflow triggered successfully',
        beneficiary_id: beneficiary_id,
        triggered_at: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );

  } catch (error) {
    console.error(JSON.stringify({ level: 'error', ctx: 'intake_trigger', msg: 'unexpected_error', error }));

    // Global error handling - escalate to Keragon
    try {
      const keragonWebhookUrl = Deno.env.get('KERAGON_WEBHOOK_URL');
      if (keragonWebhookUrl) {
        await fetch(keragonWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'automation_failure',
            function_name: 'trigger-intake-workflow',
            error_message: (error as Error)?.message ?? 'unknown',
            beneficiary_id: 'unknown',
            severity: 'high',
            timestamp: new Date().toISOString()
          }),
        });
      }
    } catch (keragonError) {
      console.error(JSON.stringify({ level: 'error', ctx: 'intake_trigger', msg: 'keragon_escalation_failed', error: keragonError }));
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to process intake workflow trigger'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
