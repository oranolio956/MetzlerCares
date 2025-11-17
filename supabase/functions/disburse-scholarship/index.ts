import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

// Closed-Loop Payment Disbursement Engine
// Secure ACH transfers to vetted sober living partners

interface RequestBody {
  application_id: string
  amount?: number // Optional override, otherwise uses application amount
}

serve(async req => {
  // Only allow POST requests from authorized sources
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

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      throw new Error('Missing Stripe configuration')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    })

    // Parse request body
    const body: RequestBody = await req.json()
    const { application_id, amount: overrideAmount } = body

    if (!application_id) {
      return new Response(JSON.stringify({ error: 'application_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 1. Retrieve application and partner details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(
        `
        *,
        sober_living_partners (
          id,
          facility_name,
          stripe_account_id,
          banking_verified
        )
      `
      )
      .eq('id', application_id)
      .eq('status', 'approved') // Only process approved applications
      .single()

    if (appError || !application) {
      console.error('Application lookup failed:', appError)
      return new Response(JSON.stringify({ error: 'Application not found or not approved for disbursement' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const partner = application.sober_living_partners
    if (!partner) {
      return new Response(JSON.stringify({ error: 'Partner information not found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 2. Verify banking information
    if (!partner.stripe_account_id || !partner.banking_verified) {
      console.error('Partner banking not verified:', partner.id)
      return new Response(JSON.stringify({ error: 'Partner banking information not verified' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 3. Determine transfer amount
    const transferAmount = overrideAmount || application.amount_requested
    if (!transferAmount || transferAmount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid transfer amount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Convert to cents for Stripe (assuming amount is in dollars)
    const amountInCents = Math.round(transferAmount * 100)

    // 4. Create Stripe Transfer (ACH)
    try {
      const transfer = await stripe.transfers.create({
        amount: amountInCents,
        currency: 'usd',
        destination: partner.stripe_account_id,
        description: `Scholarship disbursement to ${partner.facility_name}`,
        metadata: {
          application_id: application_id,
          beneficiary_id: application.beneficiary_id,
          partner_id: partner.id,
          facility_name: partner.facility_name,
          disbursement_type: 'scholarship',
          audit_timestamp: new Date().toISOString()
        },
        transfer_group: `application-${application_id}` // For tracking related transfers
      })

      console.log('Stripe transfer created:', transfer.id)

      // 5. Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'funded',
          payment_date: new Date().toISOString(),
          stripe_transfer_id: transfer.id,
          amount_disbursed: transferAmount
        })
        .eq('id', application_id)

      if (updateError) {
        console.error('Failed to update application:', updateError)
        // Transfer was successful, but database update failed
        // This should trigger an alert for manual reconciliation
      }

      // 6. Create outcome tracking checkpoints
      try {
        const { data: checkpointData, error: checkpointError } = await supabase.functions.invoke(
          'create-outcome-checkpoints',
          {
            body: {
              application_id: application_id,
              beneficiary_id: application.beneficiary_id
            }
          }
        )

        if (checkpointError) {
          console.error('Failed to create outcome checkpoints:', checkpointError)
          // Don't fail the payment for this - log and continue
        } else {
          console.log('Outcome checkpoints created:', checkpointData)
        }
      } catch (checkpointErr) {
        console.error('Error creating outcome checkpoints:', checkpointErr)
      }

      // 7. Update public impact metrics
      await updatePublicMetrics(supabase)

      // 8. Log successful disbursement for compliance
      console.log(
        `Scholarship disbursed: $${transferAmount} to ${partner.facility_name} for application ${application_id}`
      )

      return new Response(
        JSON.stringify({
          success: true,
          transfer_id: transfer.id,
          amount: transferAmount,
          destination: partner.facility_name,
          application_id: application_id,
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (stripeError) {
      console.error('Stripe transfer failed:', stripeError)

      // Update application with failed status
      await supabase
        .from('applications')
        .update({
          status: 'payment_failed',
          payment_error: stripeError.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', application_id)

      return new Response(
        JSON.stringify({
          error: 'Payment processing failed',
          details: stripeError.message
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Unexpected error in disburse-scholarship:', error)

    // Global error handling - escalate to Keragon
    try {
      const keragonWebhookUrl = Deno.env.get('KERAGON_WEBHOOK_URL')
      if (keragonWebhookUrl) {
        await fetch(keragonWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'automation_failure',
            function_name: 'disburse-scholarship',
            error_message: error.message,
            application_id: req.body?.application_id || 'unknown',
            severity: 'critical',
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
        details: 'Failed to process scholarship disbursement'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

// Helper function to update public impact metrics
async function updatePublicMetrics(supabase: any) {
  try {
    // Count total funded applications (beneficiaries served)
    const { count: totalBeneficiaries, error: countError } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'funded')

    if (countError) {
      console.error('Error counting beneficiaries:', countError)
      return
    }

    // Sum total disbursed amounts
    const { data: disbursements, error: sumError } = await supabase
      .from('applications')
      .select('amount_disbursed')
      .eq('status', 'funded')
      .not('amount_disbursed', 'is', null)

    if (sumError) {
      console.error('Error summing disbursements:', sumError)
      return
    }

    const totalFunds = disbursements?.reduce((sum, app) => sum + (app.amount_disbursed || 0), 0) || 0

    // Update public metrics
    const { error: updateError } = await supabase
      .from('public_impact_metrics')
      .update({
        total_beneficiaries_served: totalBeneficiaries || 0,
        total_funds_disbursed_usd: totalFunds,
        last_updated: new Date().toISOString()
      })
      .eq('id', 1)

    if (updateError) {
      console.error('Error updating public metrics:', updateError)
    } else {
      console.log(`Updated public metrics: ${totalBeneficiaries} beneficiaries, $${totalFunds} disbursed`)
    }
  } catch (error) {
    console.error('Error in updatePublicMetrics:', error)
  }
}
