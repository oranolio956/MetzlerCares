import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession()
  const user = session?.user
  if (!user) {
    return { beneficiary: null, consents: [], applications: [] }
  }
  const { data: beneficiary } = await locals.supabase
    .from('beneficiaries')
    .select('*')
    .eq('id', user.id)
    .single()
  const { data: consents } = await locals.supabase
    .from('consents')
    .select('*')
    .eq('beneficiary_id', user.id)
    .order('granted_at', { ascending: false })
  const { data: applications } = await locals.supabase
    .from('applications')
    .select(`*, partner:sober_living_partners(facility_name, contact_email)`) 
    .eq('beneficiary_id', user.id)
    .order('created_at', { ascending: false })
  return { beneficiary, consents: consents || [], applications: applications || [] }
}