import type { PageServerLoad } from './$types';
import { seoGenerator } from '$lib/utils/colorado-seo-generator';
import { getPriorityLocations } from '$lib/utils/colorado-seo-data';

export const load: PageServerLoad = async ({ setHeaders, url }) => {
  setHeaders({ 
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    'X-Robots-Tag': 'index, follow'
  });

  try {
    // Get all Colorado locations
    const locations = getPriorityLocations('all');
    
    // Group by priority for better organization
    const mapLoc = (loc: any) => ({
      name: loc.city,
      county: loc.county,
      population: loc.population,
      slug: loc.city.toLowerCase().replace(/\s+/g, '-'),
      coordinates: loc.coordinates
    })
    const highPriorityCities = locations.filter(loc => loc.priority === 'high').map(mapLoc);
    const mediumPriorityCities = locations.filter(loc => loc.priority === 'medium').map(mapLoc);
    const lowPriorityCities = locations.filter(loc => loc.priority === 'low').map(mapLoc);
    
    // Generate overview content for Colorado recovery services
    const overviewContent = {
      title: 'Recovery Services & Sober Living in Colorado | Complete Directory',
      description: 'Comprehensive directory of recovery services, sober living homes, and addiction treatment centers throughout Colorado. Find scholarships, support groups, and treatment options in every city and county.',
      h1: 'Colorado Recovery Services Directory',
      content: `
Colorado offers a comprehensive network of recovery services, sober living homes, and addiction treatment centers serving communities from Denver to Durango. Whether you're seeking immediate treatment, transitional housing, or ongoing support, our directory connects you with trusted resources throughout the state.

## Major Recovery Hubs in Colorado

### Denver Metro Area
The Denver metropolitan area serves as Colorado's primary recovery hub, with numerous treatment centers, sober living homes, and support services. Cities including Denver, Aurora, Lakewood, Thornton, Arvada, and Westminster offer extensive recovery infrastructure.

### Colorado Springs Region
El Paso County, anchored by Colorado Springs, provides robust addiction treatment services and recovery housing options, particularly for military veterans and their families.

### Northern Colorado
Fort Collins, Loveland, and Greeley form a strong recovery community in Larimer and Weld counties, with specialized programs for college students and working professionals.

### Mountain Communities
Communities like Boulder, Longmont, and Castle Rock offer unique recovery environments with access to outdoor activities and holistic treatment approaches.

## Types of Recovery Services Available

### Sober Living Homes
Colorado's sober living homes provide structured, drug-free environments supporting individuals in early recovery. Many offer scholarships and sliding scale payment options.

### Addiction Treatment Centers
From medical detox to outpatient programs, Colorado treatment centers offer comprehensive care including:
- Medical Detoxification
- Inpatient Residential Treatment
- Intensive Outpatient Programs (IOP)
- Partial Hospitalization Programs (PHP)
- Outpatient Counseling
- Aftercare Planning

### Recovery Support Services
Peer support, recovery coaching, and community-based services help maintain long-term sobriety through:
- Peer Recovery Specialists
- Recovery Coaching
- Support Groups (12-Step, SMART Recovery)
- Family Support Programs
- Employment Assistance
- Housing Navigation

## Financial Assistance & Scholarships

### Sober Living Scholarships
Several Colorado organizations provide scholarships for sober living, including:
- **Hornbuckle Foundation**: Recovery coaching and housing scholarships
- **Hazelbrook Recovery Residences**: Scholarship programs across multiple locations
- **Colorado Health Foundation**: Grants supporting recovery housing

### Insurance Coverage
Most Colorado treatment centers accept:
- Private insurance (Anthem, Cigna, Aetna, UnitedHealthcare)
- Medicaid (Health First Colorado)
- Medicare
- State-funded programs
- Sliding scale payment options

### State & Local Resources
- Colorado Crisis Services: 24/7 support line
- Colorado Department of Human Services: Behavioral Health Administration
- County human services departments
- Local recovery community organizations
      `
    };

    return {
      overviewContent,
      highPriorityCities,
      mediumPriorityCities,
      lowPriorityCities,
      totalCities: locations.length,
      canonical: `${url.origin}/co`,
      breadcrumbs: [
        { name: 'Home', href: '/' },
        { name: 'Colorado Recovery Services', href: '/co' }
      ]
    };
  } catch (error) {
    console.error('Error loading Colorado recovery services overview:', error);
    return {
      status: 500,
      error: 'Failed to load Colorado recovery services information'
    };
  }
};