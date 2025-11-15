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

  const { data: pendingData } = await locals.supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      beneficiaries!inner(full_name, email)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const { data: disbursementData } = await locals.supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      amount_requested,
      sober_living_partners!inner(facility_name, contact_email)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return {
    pendingApplications: pendingData || [],
    disbursementsReady: disbursementData || []
  }
}