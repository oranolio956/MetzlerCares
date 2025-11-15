import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create Outcome Checkpoints for Long-Term Tracking
// Triggered when application status changes to 'funded'

interface RequestBody {
  application_id: string;
  beneficiary_id: string;
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Parse request body
    const body: RequestBody = await req.json();
    const { application_id, beneficiary_id } = body;

    if (!application_id || !beneficiary_id) {
      return new Response(
        JSON.stringify({ error: 'application_id and beneficiary_id are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create outcome checkpoints for 30, 60, and 90 days
    const checkpoints = [
      { interval_days: 30 },
      { interval_days: 60 },
      { interval_days: 90 }
    ];

    const outcomesToInsert = checkpoints.map(checkpoint => ({
      application_id,
      beneficiary_id,
      interval_days: checkpoint.interval_days,
      status: 'pending'
    }));

    // Insert all checkpoints
    const { data: insertedOutcomes, error: insertError } = await supabase
      .from('beneficiary_outcomes')
      .insert(outcomesToInsert)
      .select();

    if (insertError) {
      console.error('Failed to create outcome checkpoints:', insertError);
      return new Response(
        JSON.stringify({
          error: 'Failed to create outcome checkpoints',
          details: insertError.message
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created ${insertedOutcomes?.length || 0} outcome checkpoints for application ${application_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Outcome checkpoints created successfully',
        checkpoints_created: insertedOutcomes?.length || 0,
        application_id,
        beneficiary_id
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error in create-outcome-checkpoints:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: 'Failed to create outcome checkpoints'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
