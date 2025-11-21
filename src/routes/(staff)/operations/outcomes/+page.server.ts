import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.getSession()
  if (!session) return { status: 401, error: 'Unauthorized' }
  const { data: profile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single()
  if (!profile || (profile as any).role !== 'staff') return { status: 403, error: 'Forbidden' }

  const interval = url.searchParams.get('interval')
  const status = url.searchParams.get('status')
  const metric = url.searchParams.get('metric')

  let query = locals.supabase
    .from('beneficiary_outcomes')
    .select('id, interval_days, status, outcome_metric, completed_at, updated_at')
    .order('updated_at', { ascending: false })
  if (interval) query = query.eq('interval_days', Number(interval))
  if (status) query = query.eq('status', status)
  if (metric) query = query.eq('outcome_metric', metric)
  const { data } = await query
  return { outcomes: data || [] }
}
