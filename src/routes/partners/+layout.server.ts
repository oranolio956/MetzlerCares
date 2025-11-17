import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const session = await locals.getSession()

  if (!session) {
    throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`)
  }

  const userId = session.user.id
  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role, full_name, email, partner_id')
    .eq('id', userId)
    .single()

  const role = profile?.role || session.user.user_metadata?.role || session.user.app_metadata?.role
  if (!role || !['partner', 'facility_admin'].includes(role)) {
    throw redirect(302, '/unauthorized')
  }

  // Verify partner relationship
  if (!profile?.partner_id) {
    throw redirect(302, '/unauthorized')
  }

  return {
    user: {
      id: userId,
      email: profile?.email || session.user.email,
      role,
      name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email,
      partnerId: profile.partner_id
    }
  }
}
