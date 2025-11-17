import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/utils/supabase'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // Check if user is authenticated
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    // Redirect to login page with return URL
    throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`)
  }

  // Check if user has an active beneficiary profile
  const { data: beneficiary, error: beneficiaryError } = await supabase
    .from('beneficiaries')
    .select('id, full_name')
    .eq('id', user.id)
    .single()

  if (beneficiaryError || !beneficiary) {
    // User doesn't have a beneficiary profile
    throw redirect(302, '/get-aid')
  }

  // User is authenticated and has a beneficiary profile
  return {
    user: {
      id: user.id,
      email: user.email,
      name: beneficiary.full_name
    }
  }
}
