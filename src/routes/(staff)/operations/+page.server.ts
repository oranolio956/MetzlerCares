import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ 'Cache-Control': 'private, max-age=0' })

  const session = await locals.getSession()
  const user = session?.user
  if (!user) throw redirect(303, '/auth/login')

  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile as any).role !== 'staff') throw redirect(303, '/unauthorized')

  const { data, error } = await locals.supabase.rpc('get_full_organization_kpis')

  const { data: outcomes } = await locals.supabase
    .from('beneficiary_outcomes')
    .select('interval_days,status,outcome_metric')

  const outcomeSummary = {
    pendingByInterval: { 30: 0, 60: 0, 90: 0 },
    completedByMetric: {
      still_in_residence: 0,
      completed_program_successfully: 0,
      discharged_non_compliant: 0,
      discharged_left_ama: 0,
      lost_contact: 0
    },
    completionRateByInterval: { 30: 0, 60: 0, 90: 0 }
  } as any

  if (Array.isArray(outcomes)) {
    const totalsByInterval: Record<number, number> = { 30: 0, 60: 0, 90: 0 }
    for (const o of outcomes) {
      const iv = (o as any).interval_days as number
      const st = (o as any).status as string
      const m = (o as any).outcome_metric as string
      if (iv === 30 || iv === 60 || iv === 90) {
        totalsByInterval[iv] = (totalsByInterval[iv] || 0) + 1
        if (st === 'pending') outcomeSummary.pendingByInterval[iv] = (outcomeSummary.pendingByInterval[iv] || 0) + 1
        if (st === 'completed') {
          outcomeSummary.completedByMetric[m as keyof typeof outcomeSummary.completedByMetric] = (outcomeSummary.completedByMetric[m as keyof typeof outcomeSummary.completedByMetric] || 0) + 1
        }
      }
    }
    for (const iv of [30, 60, 90]) {
      const completed = totalsByInterval[iv] - outcomeSummary.pendingByInterval[iv]
      const total = totalsByInterval[iv]
      outcomeSummary.completionRateByInterval[iv] = total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  return { kpis: data || null, error: error ? 'Failed to load dashboard metrics' : null, outcomes: outcomeSummary }
}