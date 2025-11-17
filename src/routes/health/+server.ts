import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { supabase } from '$lib/utils/supabase'

export const GET: RequestHandler = async () => {
  const envOk = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
  let partnersOk = false
  let partnersErr: string | null = null
  try {
    const { data, error } = await supabase
      .from('sober_living_partners')
      .select('facility_name')
      .eq('network_status', 'active')
      .limit(1)
    partnersOk = !!data && !error
    partnersErr = error ? error.message : null
  } catch (e: any) {
    partnersErr = e?.message || 'unknown'
  }
  return json({
    status: envOk && partnersOk ? 'ok' : 'degraded',
    checks: {
      env: envOk,
      supabasePartners: partnersOk,
      supabaseError: partnersErr
    }
  })
}
