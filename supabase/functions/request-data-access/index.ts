import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface DataRequest {
  request_type: 'data_access' | 'data_deletion'
  beneficiary_id: string
}

serve(async req => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const keragonWebhookUrl = Deno.env.get('KERAGON_WEBHOOK_URL')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Parse request body
    const body: DataRequest = await req.json()
    const { request_type, beneficiary_id } = body

    if (!request_type || !beneficiary_id) {
      return new Response(JSON.stringify({ error: 'request_type and beneficiary_id are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!['data_access', 'data_deletion'].includes(request_type)) {
      return new Response(JSON.stringify({ error: 'Invalid request_type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify the beneficiary exists
    const { data: beneficiary, error: beneficiaryError } = await supabase
      .from('beneficiaries')
      .select('full_name, email')
      .eq('id', beneficiary_id)
      .single()

    if (beneficiaryError || !beneficiary) {
      return new Response(JSON.stringify({ error: 'Beneficiary not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Trigger Keragon workflow for HITL processing
    if (keragonWebhookUrl) {
      try {
        const keragonResponse = await fetch(keragonWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_type: 'data_rights_request',
            request_type,
            beneficiary_id,
            beneficiary_name: beneficiary.full_name,
            beneficiary_email: beneficiary.email,
            request_timestamp: new Date().toISOString(),
            priority: 'high'
          })
        })

        if (!keragonResponse.ok) {
          console.error('Failed to trigger Keragon workflow for data rights request')
          // Don't fail the request - log and continue
        } else {
          console.log('Keragon workflow triggered for data rights request')
        }
      } catch (keragonError) {
        console.error('Error triggering Keragon workflow:', keragonError)
        // Don't fail the request - log and continue
      }
    }

    // Log the request for compliance tracking
    console.log(`Data rights request submitted: ${request_type} for beneficiary ${beneficiary_id}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `${request_type === 'data_access' ? 'Data access' : 'Data deletion'} request submitted successfully`,
        request_type,
        beneficiary_id,
        submitted_at: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Unexpected error in request-data-access:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to process data rights request'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
