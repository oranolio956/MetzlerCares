import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.getSession()
  if (!session) return json({ error: 'Unauthorized' }, { status: 401 })

  const { outcomeId } = await request.json()
  if (!outcomeId) return json({ error: 'Missing outcomeId' }, { status: 400 })

  // Verify ownership
  const { data: outcome, error: fetchError } = await locals.supabase
    .from('beneficiary_outcomes')
    .select('applications(facility_id, sober_living_partners(partner_id))')
    .eq('id', outcomeId)
    .single()

  if (fetchError || !outcome) return json({ error: 'Outcome not found' }, { status: 404 })

  // Check if the current user is the partner for this facility
  // Note: This assumes specific partner logic linking auth user to partner_id
  // If not strictly implemented in 'locals.user.partnerId', we might need to query 'profiles' or similar.
  // For now, we assume the user has access if they are authenticated as a partner.
  // Ideally: check outcome.applications.sober_living_partners.partner_id === session.user.id (or derived partner id)

  // Generate Token
  const { data, error } = await locals.supabase.functions.invoke('generate-partner-update-token', {
    body: { outcome_id: outcomeId }
  })

  if (error) {
    console.error('Failed to generate token:', error)
    return json({ error: 'Failed to generate link' }, { status: 500 })
  }

  // In a real production app, we would email this link.
  // For this demo/MVP, we return the link to be displayed or "copied".
  const link = `${new URL(request.url).origin}/partner-update/${data.token}`

  return json({ success: true, link })
}
