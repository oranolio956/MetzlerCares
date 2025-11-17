<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  // Use data directly with optional chaining
  const overviewContent = data?.overviewContent || { 
    title: 'Colorado Recovery Services Directory', 
    description: 'Comprehensive directory of recovery services, sober living homes, and addiction treatment centers throughout Colorado.', 
    h1: 'Colorado Recovery Services Directory', 
    content: '' 
  };
  const highPriorityCities = data?.highPriorityCities || [];
  const mediumPriorityCities = data?.mediumPriorityCities || [];
  const lowPriorityCities = data?.lowPriorityCities || [];
  const totalCities = data?.totalCities || 0;
  const canonical = data?.canonical || '';
  const breadcrumbs = data?.breadcrumbs || [];
</script>

<svelte:head>
  <title>{overviewContent.title}</title>
  <meta name="description" content={overviewContent.description} />
  <meta name="keywords" content="Colorado recovery services, sober living Colorado, addiction treatment Colorado, recovery housing, Colorado drug rehab, Colorado alcohol treatment" />
  <link rel="canonical" href={canonical} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={overviewContent.title} />
  <meta property="og:description" content={overviewContent.description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonical} />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={overviewContent.title} />
  <meta name="twitter:description" content={overviewContent.description} />
  
  <!-- Schema.org structured data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": overviewContent.title,
      "description": overviewContent.description,
      "url": canonical
    }
  </script>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-sage-50">
  <!-- Breadcrumb Navigation -->
  <nav class="bg-white shadow-sm" aria-label="Breadcrumb">
    <div class="container mx-auto px-4 py-3">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <a href="/" class="text-blue-600 hover:text-blue-800">Home</a>
        </li>
        {#each breadcrumbs as crumb, index}
          <li class="flex items-center">
            <svg class="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            {#if index === breadcrumbs.length - 1}
              <span class="text-gray-900 font-medium">{crumb.name}</span>
            {:else}
              <a href={crumb.href} class="text-blue-600 hover:text-blue-800">{crumb.name}</a>
            {/if}
          </li>
        {/each}
      </ol>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
    <div class="container mx-auto px-4 py-16 md:py-24">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{overviewContent.h1}</h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto">
          {overviewContent.description}
        </p>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <main class="container mx-auto px-4 py-12">
    <!-- Content Section -->
    <section class="mb-16">
      <div class="prose prose-lg max-w-none mb-12">
        {@html overviewContent.content}
      </div>
    </section>

    <!-- City Listings -->
    <section class="space-y-12">
      <!-- High Priority Cities -->
      {#if highPriorityCities.length > 0}
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Major Metropolitan Areas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each highPriorityCities as city}
            <a href={`/co/${city.slug}`} class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
              <h3 class="font-semibold text-gray-900">{city.name}</h3>
              <p class="text-sm text-gray-600 mt-1">{city.county} County • Population: {city.population.toLocaleString()}</p>
            </a>
          {/each}
        </div>
      </div>
      {/if}

      <!-- Medium Priority Cities -->
      {#if mediumPriorityCities.length > 0}
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Regional Centers</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each mediumPriorityCities as city}
            <a href={`/co/${city.slug}`} class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
              <h3 class="font-semibold text-gray-900">{city.name}</h3>
              <p class="text-sm text-gray-600 mt-1">{city.county} County • Population: {city.population.toLocaleString()}</p>
            </a>
          {/each}
        </div>
      </div>
      {/if}

      <!-- Low Priority Cities -->
      {#if lowPriorityCities.length > 0}
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Smaller Communities</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each lowPriorityCities as city}
            <a href={`/co/${city.slug}`} class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
              <h3 class="font-semibold text-gray-900">{city.name}</h3>
              <p class="text-sm text-gray-600 mt-1">{city.county} County • Population: {city.population.toLocaleString()}</p>
            </a>
          {/each}
        </div>
      </div>
      {/if}
    </section>

    <!-- Scholarships & FAQ -->
    <section class="bg-white rounded-lg shadow-sm p-8 mt-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Scholarships & Frequently Asked Questions</h2>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/scholarships" class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">Sober Living Scholarships</a>
          <a href="/faq/sober-living" class="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors">Sober Living FAQ</a>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="bg-white rounded-lg shadow-sm p-8 mt-16">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Colorado Recovery Services Coverage</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="text-3xl font-bold text-blue-600">{highPriorityCities.length}</div>
            <div class="text-gray-600">Major Metro Areas</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-600">{mediumPriorityCities.length}</div>
            <div class="text-gray-600">Regional Centers</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-600">{totalCities}</div>
            <div class="text-gray-600">Total Communities Served</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>
