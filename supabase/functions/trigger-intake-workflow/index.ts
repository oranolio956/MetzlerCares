const corsHeaders: HeadersInit = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-webhook-token, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

// HIPAA-Compliant Keragon Webhook Trigger
// This function is called after successful beneficiary intake
// It triggers the Keragon automation workflow without exposing PII

interface RequestBody {
  beneficiary_id: string
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    // Parse request body
    const body: RequestBody = await req.json()

    if (!body || typeof body.beneficiary_id !== 'string' || !body.beneficiary_id.trim()) {
      return new Response(JSON.stringify({ error: 'beneficiary_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    const { beneficiary_id } = body

    // Validate beneficiary_id format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(beneficiary_id)) {
      return new Response(JSON.stringify({ error: 'Invalid beneficiary_id format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Optional auth: if INTAKE_WORKFLOW_TOKEN is set, require matching bearer or header
    const expectedToken = Deno.env.get('INTAKE_WORKFLOW_TOKEN')
    if (expectedToken) {
      const authHeader = req.headers.get('Authorization')
      const xToken = req.headers.get('X-Webhook-Token')
      const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
      const provided = bearer || xToken || null
      if (!provided || provided !== expectedToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    // Retrieve Keragon webhook URL from environment variables
    // This is stored securely in Supabase secrets, not in code
    const keragonWebhookUrl = Deno.env.get('KERAGON_WEBHOOK_URL')

    if (!keragonWebhookUrl) {
      console.error('KERAGON_WEBHOOK_URL environment variable not set')
      return new Response(JSON.stringify({ error: 'Service configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Prepare payload for Keragon webhook
    // CRITICAL: Only send beneficiary_id, no PII or PHI
    const payload = {
      beneficiary_id: beneficiary_id,
      timestamp: new Date().toISOString(),
      source: 'metzler-foundations-intake'
    }

    // Make POST request to Keragon webhook
    const keragonResponse = await fetch(keragonWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Metzler-Foundations-Edge-Function/1.0'
      },
      body: JSON.stringify(payload)
    })

    // Check if Keragon webhook accepted the request
    if (!keragonResponse.ok) {
      console.error(`Keragon webhook failed: ${keragonResponse.status} ${keragonResponse.statusText}`)
      return new Response(
        JSON.stringify({
          error: 'Failed to trigger intake workflow',
          details: 'External service unavailable'
        }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Log successful trigger (for HIPAA compliance audit trail)
    console.log(`Successfully triggered Keragon workflow for beneficiary: ${beneficiary_id}`)

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
    )
  } catch (error) {
    console.error('Error in trigger-intake-workflow:', error)

    // Global error handling - escalate to Keragon
    try {
      const keragonWebhookUrl = Deno.env.get('KERAGON_WEBHOOK_URL')
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
          })
        })
      }
    } catch (keragonError) {
      console.error('Failed to escalate error to Keragon:', keragonError)
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to process intake workflow trigger'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
