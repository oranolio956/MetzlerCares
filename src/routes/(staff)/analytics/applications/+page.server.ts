import type { PageServerLoad } from './$types';
import { createSupabaseServerClient } from '$lib/utils/supabase';
import { error as svelteError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user } = await safeGetSession();

  if (!session || !user) {
    throw svelteError(401, { message: 'Authentication required' });
  }

  // Check if user has staff role
  const supabase = createSupabaseServerClient(cookies);
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || userData?.role !== 'staff') {
    throw svelteError(403, { message: 'Staff access required' });
  }

  try {
    // Get applications from the last 90 days for analytics
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select(`
        *,
        beneficiaries!inner(*)
      `)
      .gte('created_at', ninetyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (appsError) {
      console.error('Error loading applications:', appsError);
      return {
        applications: [],
        error: 'Failed to load application data'
      };
    }

    return {
      applications: applications || [],
      error: null
    };
  } catch (err) {
    console.error('Unexpected error loading analytics:', err);
    return {
      applications: [],
      error: 'An unexpected error occurred'
    };
  }
};