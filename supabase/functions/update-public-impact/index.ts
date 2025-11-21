import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Service configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { count: totalBeneficiaries } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'funded')

    const { data: fundedApps } = await supabase
      .from('applications')
      .select('amount_disbursed, created_at, updated_at')
      .eq('status', 'funded')

    const totalFunds = fundedApps?.reduce((sum: number, a: any) => sum + (a.amount_disbursed || 0), 0) || 0

    const durations = (fundedApps || []).map((a: any) => {
      const created = new Date(a.created_at).getTime()
      const updated = new Date(a.updated_at).getTime()
      const minutes = Math.max(0, Math.round((updated - created) / 60000))
      return isFinite(minutes) ? minutes : 0
    })

    const avgMinutes = durations.length
      ? Math.round(durations.reduce((s: number, v: number) => s + v, 0) / durations.length)
      : 0

    const { error: updateError } = await supabase
      .from('public_impact_metrics')
      .update({
        total_beneficiaries_served: totalBeneficiaries || 0,
        total_funds_disbursed_usd: totalFunds,
        average_approval_time_minutes: avgMinutes,
        last_updated: new Date().toISOString()
      })
      .eq('id', 1)

    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to update metrics' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        beneficiaries: totalBeneficiaries || 0,
        total_funds: totalFunds,
        avg_minutes: avgMinutes
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
})
