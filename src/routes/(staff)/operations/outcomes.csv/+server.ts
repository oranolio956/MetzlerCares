import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals }) => {
  const session = await locals.getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })
  const { data: profile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single()
  if (!profile || (profile as any).role !== 'staff') return new Response('Forbidden', { status: 403 })

  const { data } = await locals.supabase
    .from('beneficiary_outcomes')
    .select('id, interval_days, status, outcome_metric, completed_at, updated_at')

  const rows = (data || []).map((o: any) => [
    o.id,
    o.interval_days,
    o.status,
    o.outcome_metric,
    o.completed_at,
    o.updated_at
  ])
  const csv = [
    'id,interval_days,status,outcome_metric,completed_at,updated_at',
    ...rows.map((r: any[]) => r.join(','))
  ].join('\n')
  return new Response(csv, { headers: { 'Content-Type': 'text/csv' } })
}
