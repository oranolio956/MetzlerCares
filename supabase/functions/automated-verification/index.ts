import { corsHeaders } from '../_shared/cors.ts'

interface VerifyRequest {
  ssn: string
  full_name: string
  date_of_birth: string
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body: VerifyRequest = await req.json()
    const { ssn, full_name, date_of_birth } = body || {}

    if (!ssn || !full_name || !date_of_birth) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    const apiUrl = Deno.env.get('VERIFICATION_API_URL')
    const apiKey = Deno.env.get('VERIFICATION_API_KEY')

    let eligible = false

    if (apiUrl && apiKey) {
      try {
        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({ ssn, full_name, date_of_birth })
        })

        if (!resp.ok) {
          console.warn(
            JSON.stringify({ level: 'warn', ctx: 'auto_verify', msg: 'provider_error', status: resp.status })
          )
        } else {
          const result = await resp.json()
          eligible = !!result?.eligible
        }
      } catch (e) {
        console.error(JSON.stringify({ level: 'error', ctx: 'auto_verify', msg: 'provider_exception', error: e }))
      }
    } else {
      // Fallback simulation when provider not configured
      const hashSeed = ssn.slice(-4)
      eligible = parseInt(hashSeed, 10) % 10 < 8
    }

    return new Response(JSON.stringify({ eligible }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', ctx: 'auto_verify', msg: 'unexpected_error', error }))
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
})
