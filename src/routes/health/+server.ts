import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { supabase } from '$lib/utils/supabase'
import { sanityClient } from '$lib/utils/sanity'

export const GET: RequestHandler = async () => {
  const start = performance.now()
  const envOk = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
  
  // Supabase Check
  let supabaseOk = false
  let supabaseLatency = 0
  let supabaseErr: string | null = null
  try {
    const sStart = performance.now()
    const { error } = await supabase.from('sober_living_partners').select('count', { count: 'exact', head: true })
    supabaseLatency = Math.round(performance.now() - sStart)
    supabaseOk = !error
    supabaseErr = error ? error.message : null
  } catch (e: any) {
    supabaseErr = e?.message || 'unknown'
  }

  // Sanity Check
  let sanityOk = false
  let sanityLatency = 0
  let sanityErr: string | null = null
  if (sanityClient) {
    try {
      const sStart = performance.now()
      await sanityClient.fetch('count(*[_type == "post"])')
      sanityLatency = Math.round(performance.now() - sStart)
      sanityOk = true
    } catch (e: any) {
      sanityErr = e?.message || 'unknown'
    }
  } else {
    sanityErr = 'not configured'
  }

  const totalLatency = Math.round(performance.now() - start)
  const status = envOk && supabaseOk ? (sanityOk ? 'healthy' : 'degraded') : 'unhealthy'

  return json({
    status,
    timestamp: new Date().toISOString(),
    latency: totalLatency,
    checks: {
      environment: { status: envOk ? 'ok' : 'error' },
      supabase: { 
        status: supabaseOk ? 'ok' : 'error', 
        latency: supabaseLatency,
        error: supabaseErr 
      },
      sanity: { 
        status: sanityOk ? 'ok' : (sanityErr === 'not configured' ? 'skipped' : 'error'), 
        latency: sanityLatency,
        error: sanityErr 
      }
    }
  })
}
