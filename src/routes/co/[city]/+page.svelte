<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  
  export let data: PageData;

  let content: any = null;
  let location: any = null;
  let nearbyCities: any[] = [];
  let breadcrumbs: { name: string; href: string }[] = [];
  let freshnessSignals: any = null;
  let formattedLastUpdated: string | null = null;
  
  $: {
    const d: any = data || {};
    content = d.content ?? content;
    location = d.location ?? location;
    nearbyCities = d.nearbyCities ?? nearbyCities;
    breadcrumbs = d.breadcrumbs ?? breadcrumbs;
    freshnessSignals = d.freshnessSignals ?? freshnessSignals;
  }

  // Ensure variables have safe defaults (no redeclaration)
  $: if (!content) content = {
    title: '',
    metaDescription: '',
    keywords: [],
    canonical: '',
    h1: '',
    content: '',
    faqs: [],
    schema: {}
  };
  // Ensure variables have safe defaults (no redeclaration)
  $: if (!location) location = {
    city: '',
    county: '',
    population: 0,
    zipCodes: [],
    coordinates: { lat: 0, lng: 0 }
  };
  $: if (!breadcrumbs) breadcrumbs = [];
  
  $: formattedLastUpdated = freshnessSignals?.lastUpdated 
    ? new Date(freshnessSignals.lastUpdated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;
</script>

<svelte:head>
  <title>{content.title}</title>
  <meta name="description" content={content.metaDescription} />
  <meta name="keywords" content={content.keywords.join(', ')} />
  <link rel="canonical" href={content.canonical} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={content.title} />
  <meta property="og:description" content={content.metaDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={content.canonical} />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={content.title} />
  <meta name="twitter:description" content={content.metaDescription} />
  
  <!-- Freshness signals for rapid indexing -->
  {#if freshnessSignals?.lastUpdated}
  <meta property="article:modified_time" content={freshnessSignals.lastUpdated} />
  <meta name="last-modified" content={freshnessSignals.lastUpdated} />
  <meta name="revised" content={freshnessSignals.lastUpdated} />
  {/if}
  
  <!-- Advanced indexing signals -->
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  
  <!-- Schema.org structured data -->
  <script type="application/ld+json">
    {JSON.stringify(content.schema ?? {}, null, 2)}
  </script>
  
  <!-- Local business schema for recovery services -->
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `Recovery Services ${location.city} Colorado`,
      description: `Addiction recovery and sober living services in ${location.city}, Colorado`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.city,
        addressRegion: 'CO',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng
      },
      areaServed: {
        '@type': 'City',
        name: location.city
      },
      serviceType: [
        'Addiction Treatment',
        'Sober Living',
        'Recovery Support',
        'Drug Rehabilitation',
        'Alcohol Treatment'
      ]
    })}
  </script>

  <!-- BreadcrumbList schema -->
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: b.name,
        item: b.href
      }))
    })}
  </script>
  
  <!-- FAQ Schema -->
  {#if content.faqs && content.faqs.length > 0}
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {content.faqs.map(faq => `{
          "@type": "Question",
          "name": "${faq.question}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${faq.answer}"
          }
        }`).join(',')}
      ]
    }
  </script>
  {/if}
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Breadcrumb Navigation -->
  <nav class="bg-white shadow-sm" aria-label="Breadcrumb">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-2 py-4 text-sm">
        {#each breadcrumbs as crumb, index}
          {#if index > 0}
            <span class="text-gray-400">/</span>
          {/if}
          {#if index === breadcrumbs.length - 1}
            <span class="text-gray-900 font-medium">{crumb.name}</span>
          {:else}
            <a href={crumb.href} class="text-blue-600 hover:text-blue-800">{crumb.name}</a>
          {/if}
        {/each}
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{content.h1}</h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto">
          Comprehensive recovery resources and sober living options in {location.city}, Colorado. 
          Find scholarships, treatment centers, and support services to help you or your loved one 
          on the path to recovery.
        </p>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="lg:grid lg:grid-cols-3 lg:gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Recovery Resources in {location.city}</h2>
          <div class="prose max-w-none">
            {@html content.content}
          </div>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Get Help Now</h3>
          <div class="space-y-3">
            <a 
              href="/get-aid/apply" 
              class="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply for Recovery Support
            </a>
            <a 
              href="/donate" 
              class="block w-full bg-sage-600 text-white text-center px-4 py-3 rounded-md hover:bg-sage-700 transition-colors"
            >
              Support Recovery Scholarships
            </a>
            <a 
              href="/scholarships" 
              class="block w-full bg-gray-100 text-gray-900 text-center px-4 py-3 rounded-md hover:bg-gray-200 transition-colors"
            >
              View Scholarships
            </a>
          </div>
        </div>
        
      <!-- Nearby Cities -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Nearby Recovery Services</h3>
          <div class="space-y-2">
            {#each nearbyCities as city}
              <a 
                href={"/co/" + city.city.toLowerCase().replace(/\s+/g, '-') + "/sober-living"}
                class="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                {city.city} Recovery Services
              </a>
            {/each}
          </div>
        </div>
        
        <!-- Verified Local Services -->
        {#if data?.nearbyServices && data.nearbyServices.length > 0}
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Verified Local Services</h3>
          <div class="space-y-4">
            {#each data.nearbyServices as svc}
              <div class="border border-gray-200 rounded-md p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="font-semibold text-gray-900">{svc.name}</div>
                  <div class="text-xs text-gray-600">{svc.type.replace(/_/g, ' ')}</div>
                </div>
                <p class="text-sm text-gray-700 mb-2">{svc.description}</p>
                <div class="text-sm text-gray-600 mb-1"><strong>Payment:</strong> {svc.paymentOptions.join(', ')}</div>
                <div class="text-sm text-gray-600 mb-1"><strong>Certifications:</strong> {svc.certifications.join(', ')}</div>
                {#if svc.website}
                  <a href={svc.website} class="text-blue-600 hover:text-blue-800 hover:underline text-sm">Visit Website</a>
                {/if}
              </div>
            {/each}
          </div>
        </div>
        {/if}

        <!-- Location Info -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{location.city} at a Glance</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <p><strong>County:</strong> {location.county}</p>
            <p><strong>Population:</strong> {location.population.toLocaleString()}</p>
            <p><strong>ZIP Codes:</strong> {location.zipCodes.slice(0, 5).join(', ')}</p>
            <p><strong>Coordinates:</strong> {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}</p>
          </div>
        </div>
      </div>

      <!-- Scholarships & FAQ -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Scholarships & FAQ</h3>
        <div class="space-y-2">
          <a href="/scholarships" class="block text-blue-600 hover:text-blue-800 hover:underline">Sober Living Scholarships</a>
          <a href="/faq/sober-living" class="block text-blue-600 hover:text-blue-800 hover:underline">Sober Living FAQ</a>
        </div>
      </div>
    </div>
  </div>
  
  <!-- CTA Section -->
  <div class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 class="text-3xl font-bold mb-4">Ready to Start Your Recovery Journey?</h2>
      <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Metzler Cares provides scholarships and support for sober living and recovery services 
        throughout Colorado. Let us help you find the right path forward.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/get-aid/apply" 
          class="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Apply for Support
        </a>
        <a 
          href="/partners" 
          class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-gray-900 transition-colors font-semibold"
        >
          Learn About Our Partners
        </a>
      </div>
    </div>
  </div>
</div>