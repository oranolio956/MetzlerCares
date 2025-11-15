import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();

  if (!session) {
    throw redirect(303, '/give-support?login=required');
  }

  // Check if user has donor role (this would be set during donation flow)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'donor') {
    throw redirect(303, '/give-support?access=denied');
  }

  return {
    session,
    user: session.user
  };
};
