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
    // Get all partners
    const { data: partners, error: partnersError } = await supabase
      .from('sober_living_partners')
      .select('*')
      .eq('status', 'approved')
      .order('facility_name', { ascending: true });

    if (partnersError) {
      console.error('Error loading partners:', partnersError);
      return {
        partners: [],
        outcomes: [],
        error: 'Failed to load partner data'
      };
    }

    // Get outcomes for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const { data: outcomes, error: outcomesError } = await supabase
      .from('outcomes')
      .select('*')
      .gte('created_at', twelveMonthsAgo.toISOString());

    if (outcomesError) {
      console.error('Error loading outcomes:', outcomesError);
      return {
        partners: partners || [],
        outcomes: [],
        error: 'Failed to load outcome data'
      };
    }

    return {
      partners: partners || [],
      outcomes: outcomes || [],
      error: null
    };
  } catch (err) {
    console.error('Unexpected error loading partner analytics:', err);
    return {
      partners: [],
      outcomes: [],
      error: 'An unexpected error occurred'
    };
  }
};