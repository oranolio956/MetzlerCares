import type { PageServerLoad } from './$types';
import { logger } from '$lib/utils/logger';

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
  // Set cache headers for public content
  setHeaders({
    'Cache-Control': 'public, max-age=600, s-maxage=3600', // 10 min browser, 1 hour CDN
  });

  try {
    // Fetch sober living partners for social proof
    const { data: partners, error } = await locals.supabase
      .from('sober_living_partners')
      .select('facility_name')
      .eq('network_status', 'active')
      .limit(6); // Show 6 partners for social proof

    if (error) {
      logger.error('give_support_load', { message: 'partners_fetch_failed', error });
      // Return mock data as fallback
      return {
        partners: [
          { id: '1', organization_name: 'Hope Recovery Center', contact_email: 'contact@hoperecovery.org', created_at: new Date().toISOString() },
          { id: '2', organization_name: 'Safe Harbor Sober Living', contact_email: 'contact@safeharbor.org', created_at: new Date().toISOString() },
          { id: '3', organization_name: 'Evergreen Recovery House', contact_email: 'contact@evergreen.org', created_at: new Date().toISOString() },
          { id: '4', organization_name: 'Rocky Mountain Recovery Homes', contact_email: 'contact@rockymountain.org', created_at: new Date().toISOString() },
          { id: '5', organization_name: 'Aspen Transitional Living', contact_email: 'contact@aspen.org', created_at: new Date().toISOString() },
          { id: '6', organization_name: 'Summit Serenity Homes', contact_email: 'contact@summit.org', created_at: new Date().toISOString() }
        ]
      };
    }

    return {
      partners: partners || []
    };
  } catch (error) {
    logger.error('give_support_load', { message: 'server_error', error });
    return {
      partners: []
    };
  }
};