import type { PageServerLoad } from './$types';
import { logger } from '$lib/utils/logger';
import { sanityClient } from '$lib/utils/sanity';

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
  // Set aggressive caching headers for public content
  setHeaders({
    'Cache-Control': 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 1 day CDN
    'CDN-Cache-Control': 'public, max-age=86400', // 1 day for CDN
  });

  try {
    // Fetch live impact metrics from Supabase
    const { data: metrics, error } = await locals.supabase
      .from('public_impact_metrics')
      .select('*')
      .single();

    if (error) {
      logger.error('impact_load', { message: 'fetch_failed', error });
      return {
        metrics: null,
        error: 'Failed to load impact metrics'
      };
    }

    const story = await sanityClient.fetch(
      `*[_type == "impactStory" && published == true && is_featured == true] | order(publishedAt desc)[0]{
        name,
        headline,
        summary,
        photo{asset->{url}},
        city,
        state
      }`
    );

    return {
      metrics,
      story: story || null
    };
  } catch (error) {
    logger.error('impact_load', { message: 'server_error', error });
    return {
      metrics: null,
      error: 'Server error loading impact data'
    };
  }
};
