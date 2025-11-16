<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { goto, invalidateAll } from '$app/navigation';
  export let data;
  import type { Resource, FormError } from '$lib/types';

  let resources: Resource[] = data.resources || [];
  let loading = false;
  let error: string | null = data.error || null;
  let selectedCity = 'all';
  let cities: string[] = (data.cities as string[]) || ['all'];
  let canonical: string = data.canonical || '';

  // AI Resource Matcher state
  let aiQuery = '';
  let aiResults: Resource[] = [];
  let aiLoading = false;
  let aiError: FormError | null = null;
  let showAiResults = false;

  let searchTerm = ''
  async function refreshDirectory() {
    loading = true
    error = null
    try {
      await invalidateAll()
    } catch (e: any) {
      error = e?.message || 'Failed to refresh'
    } finally {
      loading = false
    }
  }

$: filteredResources = resources.filter((resource) => {
    const cityOk = selectedCity === 'all' || resource.city === selectedCity
    const term = searchTerm.trim().toLowerCase()
    const termOk = term === '' ||
      (resource.organizationName?.toLowerCase().includes(term) ||
       resource.description?.toLowerCase().includes(term))
    return cityOk && termOk
  })

  // AI-powered resource matching function
  async function findAiResources() {
    if (!aiQuery.trim()) {
      aiError = { message: 'Please describe what you need help with' };
      return;
    }

    try {
      aiLoading = true;
      aiError = null;
      showAiResults = false;

      const response = await fetch('/functions/v1/match-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_text: aiQuery.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find resources');
      }

      aiResults = data.matches || [];
      showAiResults = true;

    } catch (err) {
      console.error('AI resource matching error:', err);
      aiError = { message: 'Unable to find matching resources. Please try the directory below.' };
    } finally {
      aiLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Colorado Sober Living Resources - Metzler Foundations</title>
  <meta name="description" content="Comprehensive directory of sober living homes, treatment facilities, and recovery support services in Colorado." />
  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NGO",
      "name": "Metzler Foundations",
      "url": "https://metzlerfoundations.org",
      "description": "Providing dignified housing scholarships for individuals in recovery",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "CO",
        "addressCountry": "US"
      },
      "serviceArea": {
        "@type": "Place",
        "name": "Colorado"
      }
    }
  </script>
</svelte:head>

<div class="min-h-screen bg-warm-cream text-deep-navy-900">
  <!-- Header -->
  <header class="bg-warm-cream border-b border-deep-navy-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo class="w-8 h-8 text-deep-navy-700" />
          <span class="text-xl font-serif font-medium text-deep-navy-900">Metzler Foundations</span>
        </button>

        <nav class="flex items-center space-x-4">
          <a href="/give-support" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">
            Give Support
          </a>
          <a href="/get-aid" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">
            Get Financial Aid
          </a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-deep-navy-900 mb-6">
        Colorado Recovery Resources
      </h1>
      <p class="text-xl text-deep-navy-700 mb-8 max-w-3xl mx-auto">
        A comprehensive directory of sober living homes, treatment facilities,
        and recovery support services across Colorado.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#directory" class="btn-primary">
          Browse Resources
        </a>
        <a href="/get-aid" class="btn-secondary">
          Apply for Aid
        </a>
        <a href="/scholarships" class="btn-secondary">
          Sober Living Scholarships
        </a>
        <a href="/faq/sober-living" class="btn-secondary">
          Sober Living FAQ
        </a>
      </div>
    </div>

    <!-- AI Resource Matcher -->
    <div class="bg-gradient-to-r from-deep-navy-700 to-sage-700 rounded-2xl p-8 mb-12 text-soft-white">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-serif font-medium mb-4 text-center">
          Tell us what you need help with
        </h2>
        <p class="text-soft-white text-opacity-90 text-center mb-8 text-lg">
          Our AI-powered assistant will instantly match you with the most relevant resources in Colorado.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            bind:value={aiQuery}
            type="text"
            placeholder="I'm in Denver and need help with housing..."
            class="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-accent-gold-500 text-deep-navy-900 placeholder-deep-navy-700 placeholder-opacity-60"
            on:keydown={(e) => e.key === 'Enter' && findAiResources()}
          />
          <button
            on:click={findAiResources}
            disabled={aiLoading}
            class="px-8 py-3 bg-accent-gold-500 text-deep-navy-900 font-semibold rounded-lg hover:bg-accent-gold-600 focus:outline-none focus:ring-2 focus:ring-accent-gold-500 focus:ring-offset-2 focus:ring-offset-deep-navy-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {#if aiLoading}
              <div class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-navy mr-2"></div>
                Finding Help...
              </div>
            {:else}
              Find Help Now
            {/if}
          </button>
        </div>

        {#if aiError}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {aiError}
          </div>
        {/if}

        {#if showAiResults}
          <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4">
              {aiResults.length > 0 ? `Found ${aiResults.length} matching resource${aiResults.length === 1 ? '' : 's'}:` : 'No matching resources found'}
            </h3>

            {#if aiResults.length > 0}
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {#each aiResults as result}
              <div class="bg-soft-white rounded-lg p-6 border border-sage-200 shadow-sm">
                    <h4 class="font-semibold text-lg mb-2">{result.organization_name}</h4>
                    <p class="text-deep-navy-700 mb-3 text-sm line-clamp-3">
                      {result.description}
                    </p>
                    <div class="space-y-1 text-sm">
                      {#if result.phone}
                      <p><strong>Phone:</strong> <a href="tel:{result.phone}" class="underline hover:text-accent-gold-500">{result.phone}</a></p>
                      {/if}
                      {#if result.website}
                      <p><strong>Website:</strong> <a href="{result.website}" target="_blank" rel="noopener noreferrer" class="underline hover:text-accent-gold-500">Visit Site</a></p>
                      {/if}
                      {#if result.address_city && result.address_state}
                        <p><strong>Location:</strong> {result.address_city}, {result.address_state}</p>
                      {/if}
                    </div>
                    <div class="mt-3 text-xs text-deep-navy-600">
                      Match confidence: {Math.round((result.similarity || 0) * 100)}%
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    {#if loading}
      <!-- Loading State -->
        <div class="space-y-6" role="status" aria-live="polite">
          <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-navy-900"></div>
            <span class="ml-3 text-deep-navy-900">Loading resources...</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each Array(6) as _, i}
            <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
              <div class="h-5 w-2/3 bg-navy bg-opacity-10 mb-3"></div>
              <div class="space-y-2">
                {#each Array(3) as __}
                  <div class="h-4 w-full bg-navy bg-opacity-5"></div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>

    {:else if error}
      <!-- Error State -->
        <div class="bg-soft-white border border-sage-200 rounded-lg p-8 text-center" role="alert" aria-live="assertive">
          <svg class="mx-auto h-12 w-12 text-error mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-error mb-2">Unable to Load Resources</h3>
        <p class="text-error mb-6">{error}</p>
        <button on:click={refreshDirectory} class="bg-red-100 px-4 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200">Try Again</button>
      </div>

    {:else}
      <!-- Resource Directory -->
      <div id="directory" class="space-y-8">
        <!-- Filter Section -->
        <div class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-xl font-medium text-deep-navy-900 mb-2">Filter by Location</h2>
              <p class="text-deep-navy-700">Find resources in your area</p>
            </div>

            <div class="flex items-center space-x-4">
              <label for="city-filter" class="text-sm font-medium text-deep-navy-900">City:</label>
              <select
                id="city-filter"
                bind:value={selectedCity}
                class="form-input max-w-xs"
              >
                {#each cities as city}
                  <option value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                {/each}
              </select>
            </div>
            <div class="flex items-center space-x-4">
              <label for="search-filter" class="text-sm font-medium text-deep-navy-900">Search:</label>
              <input id="search-filter" type="text" bind:value={searchTerm} placeholder="Name or service"
                class="form-input max-w-sm" />
            </div>
          </div>

          <div class="mt-4 text-sm text-deep-navy-700">
            Showing {filteredResources.length} of {resources.length} resources
            {#if selectedCity !== 'all'}
              in {selectedCity}
            {/if}
          </div>
        </div>

        <!-- Resources Grid -->
        {#if filteredResources.length === 0}
          <div class="text-center py-16">
            <svg class="mx-auto h-12 w-12 text-navy text-opacity-40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 class="text-lg font-medium text-deep-navy-900 mb-2">No resources found</h3>
            <p class="text-deep-navy-700 mb-6">
              {#if selectedCity === 'all'}
                No resources are currently available.
              {:else}
                No resources found in {selectedCity}. Try selecting "All Cities".
              {/if}
            </p>
            {#if selectedCity !== 'all'}
              <button
                on:click={() => selectedCity = 'all'}
                class="btn-primary"
              >
                Show All Resources
              </button>
            {/if}
          </div>
        {:else}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredResources as resource}
              <article class="bg-soft-white rounded-lg shadow-sm border border-deep-navy-200 p-6 hover:shadow-md transition-shadow" itemscope itemtype="https://schema.org/Organization">
                <h3 class="text-xl font-medium text-deep-navy-900 mb-3">
                  <span itemprop="name">{resource.organizationName}</span>
                </h3>

                {#if resource.city}
                  <div class="flex items-center text-sm text-deep-navy-700 mb-3">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span itemprop="address">{resource.city}, CO</span>
                  </div>
                {/if}

                {#if resource.description}
                  <p class="text-deep-navy-700 mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                {/if}

                <div class="space-y-2">
                  {#if resource.phone}
                    <div class="flex items-center text-sm">
                      <svg class="w-4 h-4 mr-2 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href="tel:{resource.phone}" class="text-deep-navy-900 hover:text-sage-700 transition-colors">
                    <span itemprop="telephone">{resource.phone}</span>
                  </a>
                </div>
              {/if}

                  {#if resource.website}
                    <div class="flex items-center text-sm">
                      <svg class="w-4 h-4 mr-2 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-sage-700 hover:text-deep-navy-900 transition-colors"
                        itemprop="url"
                      >
                        Visit Website →
                      </a>
                    </div>
                  {/if}
                </div>
              </article>
            {/each}
          </div>
        {/if}

        <!-- Call to Action -->
        <div class="bg-deep-navy-900 bg-opacity-5 rounded-lg p-8 text-center border border-deep-navy-200">
          <h2 class="text-2xl font-serif font-medium text-deep-navy-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p class="text-deep-navy-700 mb-6 max-w-2xl mx-auto">
            Our team is constantly updating this directory and can help connect you with additional resources
            in your area. We're also always looking to add new vetted partners.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" class="btn-primary">
              Contact Our Team
            </a>
            <a href="/partners" class="btn-secondary">
              Become a Partner
            </a>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
</style>
