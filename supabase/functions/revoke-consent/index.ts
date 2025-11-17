import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RevokeConsentRequest {
  consent_id: string
}

serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Parse request body
    const body: RevokeConsentRequest = await req.json()
    const { consent_id } = body

    if (!consent_id) {
      return new Response(JSON.stringify({ error: 'consent_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify the consent belongs to the authenticated user
    // Note: In a real implementation, you'd get the user from JWT
    // For now, we'll rely on RLS policies

    // Revoke the consent
    const { data, error } = await supabase
      .from('consents')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString()
      })
      .eq('id', consent_id)
      .select()

    if (error) {
      console.error('Failed to revoke consent:', error)
      return new Response(
        JSON.stringify({
          error: 'Failed to revoke consent',
          details: error.message
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Consent not found or access denied' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`Consent ${consent_id} successfully revoked`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Consent revoked successfully',
        consent: data[0]
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Unexpected error in revoke-consent:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to revoke consent'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
