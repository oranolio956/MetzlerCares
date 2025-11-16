import type { PageServerLoad } from './$types';
import { seoGenerator } from '$lib/utils/colorado-seo-generator';
import { getPriorityLocations, COLORADO_RECOVERY_SERVICES } from '$lib/utils/colorado-seo-data';
import { coloradoIndexingAPI } from '$lib/utils/colorado-indexing-api';
import { coloradoContentVelocity } from '$lib/utils/colorado-content-velocity';

export const load: PageServerLoad = async ({ params, setHeaders, url }) => {
  // Enhanced headers for rapid indexing
  setHeaders({ 
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5min cache for frequent updates
    'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-UA-Compatible': 'IE=edge',
    'Link': `<${url.origin}/co/${params.city}>; rel="canonical"`,
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${Date.now()}"`, // Dynamic ETag for fresh content
    'Vary': 'Accept-Encoding'
  });

  try {
    const { city } = params;
    const templateType = url.searchParams.get('type') || 'city_sober_living';
    
    // Find the location data
    const locations = getPriorityLocations('all');
    const location = locations.find(loc => 
      loc.city.toLowerCase().replace(/\s+/g, '-') === city.toLowerCase()
    );
    
    if (!location) {
      return {
        status: 404,
        error: 'City not found in Colorado recovery services directory'
      };
    }

    // Generate base SEO content
    const baseContent = seoGenerator.generateCityContent(location, templateType);
    
    // Apply content velocity updates for freshness
    const velocityUpdate = coloradoContentVelocity.generateDynamicUpdates(location.city, baseContent.content);
    
    // Merge dynamic updates with base content
    const enhancedContent = {
      ...baseContent,
      content: baseContent.content + '\n\n' + velocityUpdate.changes.map(c => c.content).join('\n\n'),
      freshnessScore: velocityUpdate.freshnessScore,
      lastUpdated: velocityUpdate.timestamp
    };
    
    // Submit to indexing API for rapid discovery (async, don't wait)
    const pageUrl = `${url.origin}/co/${city}`;
    coloradoIndexingAPI.submitUrl(pageUrl, 'URL_UPDATED').then(response => {
      console.log(`Indexing API submission for ${pageUrl}:`, response.status);
    }).catch(error => {
      console.error(`Failed to submit ${pageUrl} to indexing API:`, error);
    });
    
    // Get nearby cities for internal linking
    const nearbyCities = locations
      .filter(loc => loc.city !== location.city)
      .map(loc => ({
        ...loc,
        distance: calculateDistance(location.coordinates, loc.coordinates)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    // Compute verified local services within 50 miles
    const nearbyServices = COLORADO_RECOVERY_SERVICES
      .filter(svc => calculateDistance(location.coordinates, svc.coordinates) <= 50)
      .map(svc => ({
        type: svc.type,
        name: svc.name,
        description: svc.description,
        paymentOptions: svc.paymentOptions,
        certifications: svc.certifications,
        website: svc.website
      }))
      .slice(0, 6)

    return {
      content: enhancedContent,
      location,
      nearbyCities,
      nearbyServices,
      canonical: enhancedContent.canonical,
      breadcrumbs: [
        { name: 'Home', href: '/' },
        { name: 'Colorado Recovery Services', href: '/co' },
        { name: `${location.city} Recovery Services`, href: `/co/${city}` }
      ],
      freshnessSignals: {
        lastUpdated: enhancedContent.lastUpdated,
        freshnessScore: enhancedContent.freshnessScore,
        updateReason: velocityUpdate.updateReason
      }
    };
  } catch (error) {
    console.error('Error loading city recovery services page:', error);
    return {
      status: 500,
      error: 'Failed to load recovery services information'
    };
  }
};

function calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}