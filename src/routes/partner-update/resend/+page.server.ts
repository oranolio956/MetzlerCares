import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({})

export const actions: Actions = {
  request: async ({ request, locals }) => {
    const form = await request.formData()
    const outcome_id = form.get('outcome_id')?.toString() || ''
    if (!outcome_id) return { error: 'Missing outcome_id' }
    const { data: outcome } = await locals.supabase
      .from('beneficiary_outcomes')
      .select('id, interval_days, status')
      .eq('id', outcome_id)
      .single()
    if (!outcome || outcome.status !== 'pending') return { error: 'Outcome not eligible' }
    const { data, error } = await locals.supabase.functions.invoke('generate-partner-update-token', {
      body: { outcome_id }
    })
    if (error) return { error: error.message }
    return { success: true, token: data?.token }
  }
}
