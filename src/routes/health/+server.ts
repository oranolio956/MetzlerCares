import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { sanityClient } from '$lib/utils/sanity'
import { createClient } from '@supabase/supabase-js'
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '$env/static/private'

export const GET: RequestHandler = async () => {
  const envOk = !!VITE_SUPABASE_URL && !!VITE_SUPABASE_ANON_KEY
  const sb = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

  let partnersOk = false
  let partnersErr: string | null = null
  let sanityOk = false
  let sanityErr: string | null = null

  try {
    const { data, error } = await sb
      .from('sober_living_partners')
      .select('facility_name')
      .eq('network_status', 'active')
      .limit(1)
    partnersOk = !!data && !error
    partnersErr = error ? error.message : null
  } catch (e: any) {
    partnersErr = e?.message || 'unknown'
  }

  try {
    const result = await sanityClient.fetch(`count(*[_type == "pillarPage"])`)
    sanityOk = typeof result === 'number'
  } catch (e: any) {
    sanityErr = e?.message || 'unknown'
  }

  return json({
    status: envOk && partnersOk && sanityOk ? 'ok' : 'degraded',
    checks: {
      env: envOk,
      supabasePartners: partnersOk,
      supabaseError: partnersErr,
      sanity: sanityOk,
      sanityError: sanityErr
    }
  })
}
