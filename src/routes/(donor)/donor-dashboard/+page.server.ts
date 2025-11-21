import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession()
  if (!session) throw redirect(302, '/give-support?login=required')

  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role, email')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== 'donor') throw redirect(303, '/give-support?access=denied')

  let donorMetrics = {
    totalGiving: 0,
    firstGiftDate: null as string | null,
    individualsHoused: 0,
    givingFrequency: 'one-time' as string,
    lastGiftDate: null as string | null
  }

  const COST_PER_SCHOLARSHIP = 300

  const { data: donorData, error: donorError } = await locals.supabase
    .from('bloomerang_constituents')
    .select('*')
    .eq('email', profile.email)
    .single()

  if (!donorError && donorData) {
    donorMetrics = {
      totalGiving: donorData.total_giving || 0,
      firstGiftDate: donorData.created_at,
      individualsHoused: Math.floor((donorData.total_giving || 0) / COST_PER_SCHOLARSHIP),
      givingFrequency: donorData.segment_name?.includes('Monthly')
        ? 'monthly'
        : donorData.segment_name?.includes('Recurring')
        ? 'recurring'
        : 'one-time',
      lastGiftDate: donorData.last_gift_date
    }
  } else {
    donorMetrics = {
      totalGiving: 1200,
      firstGiftDate: '2024-03-10',
      individualsHoused: Math.floor(1200 / COST_PER_SCHOLARSHIP),
      givingFrequency: 'quarterly',
      lastGiftDate: '2024-10-15'
    }
  }

  const { data: stories } = await locals.supabase
    .from('impact_stories')
    .select('*')
    .eq('published', true)
    .eq('is_featured', true)
    .limit(1)

  return { user: session.user, donorMetrics, impactStories: stories || [] }
}

export const actions: Actions = {
  logout: async ({ locals }) => {
    const session = await locals.getSession()
    if (!session) return fail(401, { error: { message: 'Unauthorized' } })
    const { error } = await locals.supabase.auth.signOut()
    if (error) return fail(500, { error: { message: error.message } })
    return { success: true }
  }
}
