<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { sanityClient } from '$lib/utils/sanity'
  import { onMount } from 'svelte'
  import SkeletonLoader from '$lib/components/SkeletonLoader.svelte'
  import type { Resource, FormError } from '$lib/types'

  let resources: Resource[] = []
  let loading = true
  let error: FormError | null = null
  let selectedCity = 'all'
  let cities: string[] = ['all']
  let searchQuery = ''

  onMount(async () => {
    await loadResources()
  })

  async function loadResources() {
    try {
      loading = true
      error = null

      if (!sanityClient) {
        error = { message: 'Sanity client not configured' }
        loading = false
        return
      }

      // Query for sober living resources from Sanity
      const query = `*[_type == "localResource" && resourceType == "sober_living"] | order(organizationName asc) {
        _id,
        organizationName,
        description,
        phone,
        website,
        addressCity,
        addressState,
        resourceType
      }`

      const result = await sanityClient.fetch(query)

      if (result) {
        resources = result

        // Extract unique cities for filter
        const uniqueCities = [...new Set(result.map((r: Resource) => r.addressCity).filter(Boolean))].sort()
        cities = ['all', ...(uniqueCities as string[])]
      }
    } catch (err) {
      console.error('Error loading sober living resources:', err)
      error = { message: 'Failed to load sober living directory' }
    } finally {
      loading = false
    }
  }

  $: filteredResources = resources.filter(resource => {
    // City filter
    const cityMatch = selectedCity === 'all' || resource.addressCity === selectedCity

    // Search filter
    const searchMatch =
      !searchQuery ||
      resource.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.addressCity?.toLowerCase().includes(searchQuery.toLowerCase())

    return cityMatch && searchMatch
  })

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Colorado Sober Living Homes | CARR-Certified Recovery Housing',
    description:
      'Directory of CARR-certified sober living homes in Colorado providing structured recovery housing and peer support.',
    url: 'https://metzlercares.com/resources/colorado-sober-living',
    publisher: {
      '@type': 'Organization',
      name: 'Metzler Foundations',
      url: 'https://metzlercares.com',
      logo: 'https://metzlercares.com/logo.png'
    },
    about: {
      '@type': 'LodgingBusiness',
      name: 'Sober Living Homes',
      description: 'CARR-certified sober living homes providing recovery housing in Colorado'
    },
    areaServed: {
      '@type': 'State',
      name: 'Colorado',
      addressRegion: 'CO',
      addressCountry: 'US'
    }
  }
  $: schemaJson = JSON.stringify(schema)
</script>

<svelte:head>
  <title>Colorado Sober Living Homes | CARR-Certified Recovery Housing</title>
  <meta
    name="description"
    content="Find CARR-certified sober living homes in Colorado. Structured recovery housing with peer support. Housing scholarships available for qualified individuals."
  />
  <meta
    name="keywords"
    content="Colorado sober living homes, sober living Colorado, recovery housing Colorado, CARR certified sober living, sober houses Colorado"
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/resources/colorado-sober-living" />
  <meta property="og:title" content="Colorado Sober Living Homes | CARR-Certified Recovery Housing" />
  <meta
    property="og:description"
    content="Find CARR-certified sober living homes in Colorado. Structured recovery housing with peer support. Housing scholarships available for qualified individuals."
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Colorado Sober Living Homes" />
  <link rel="canonical" href="https://metzlercares.com/resources/colorado-sober-living" />
  {@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-white text-charcoal">
  <!-- Hero Section -->
  <section class="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-charcoal mb-4">Colorado Sober Living Homes</h1>
      <p class="text-lg text-gray-600 mb-6">
        CARR-certified sober living homes across Colorado providing structured recovery housing, peer support, and a
        substance-free environment. Housing scholarships available.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/get-aid" class="btn-primary"> Apply for Housing Aid </a>
        <a href="/resources/colorado" class="btn-secondary"> Browse All Resources </a>
      </div>
    </div>
  </section>

  <!-- CARR Certification Info -->
  <section class="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
    <div class="max-w-4xl mx-auto text-center">
      <div class="flex items-center justify-center mb-6">
        <div class="w-16 h-16 bg-forest-green bg-opacity-10 rounded-full flex items-center justify-center mr-4">
          <svg class="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div class="text-left">
          <h2 class="text-2xl font-bold text-charcoal">CARR-Certified Housing</h2>
          <p class="text-gray-600">Colorado Association of Recovery Residences</p>
        </div>
      </div>
      <p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
        All sober living homes listed here are certified by CARR, Colorado's independent association that ensures safe,
        structured, and accountable recovery housing with proper oversight and standards.
      </p>
    </div>
  </section>

  <!-- Comprehensive Content Section -->
  <section class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-4xl mx-auto prose prose-lg max-w-none">
      <h2 class="text-3xl font-bold text-charcoal mb-6">Sober Living Homes in Colorado</h2>
      <p class="text-lg text-gray-600 mb-6">
        Sober living homes in Colorado provide structured, substance-free environments for individuals in early recovery. These residences bridge the gap between intensive treatment and independent living, offering peer support, accountability, and a safe place to practice recovery skills. Colorado's sober living homes are often certified by the Colorado Association of Recovery Residences (CARR), ensuring they meet quality standards for safety, structure, and support.
      </p>

      <h3 class="text-2xl font-bold text-charcoal mb-4">Benefits of Sober Living</h3>
      <p class="text-gray-600 mb-4">
        Sober living homes offer numerous benefits for those in recovery. They provide a safe, drug-free environment, peer support from others in recovery, structured daily routines, accountability through house rules and drug testing, life skills development, employment and education support, and a gradual transition to independence. Research shows that individuals who stay in sober living for at least 90 days have significantly better outcomes than those who return directly to their previous environment.
      </p>

      <h3 class="text-2xl font-bold text-charcoal mb-4">CARR Certification and Quality Standards</h3>
      <p class="text-gray-600 mb-4">
        The Colorado Association of Recovery Residences (CARR) certifies sober living homes that meet rigorous standards for safety, structure, and support. CARR-certified homes must maintain drug-free environments, have clear house rules and consequences, provide peer support and recovery resources, ensure safe and clean facilities, and demonstrate ethical business practices. When choosing a sober living home, look for CARR certification as a sign of quality and accountability.
      </p>

      <h3 class="text-2xl font-bold text-charcoal mb-4">Housing Scholarships and Financial Assistance</h3>
      <p class="text-gray-600 mb-4">
        Many Colorado residents qualify for housing scholarships that cover the first month's rent or entry fees at certified sober living homes. Organizations like Metzler Foundations provide immediate financial assistance to qualified individuals, removing financial barriers to recovery housing. These scholarships are typically available to Colorado residents who demonstrate financial need and commitment to recovery. Application processes are streamlined to provide rapid assistance when it's needed most.
      </p>

      <h3 class="text-2xl font-bold text-charcoal mb-6">What to Look for in a Sober Living Home</h3>
      <p class="text-gray-600 mb-6">
        When choosing a sober living home in Colorado, consider factors such as CARR certification, location and accessibility, house rules and structure, peer support and community, cost and payment options, length of stay requirements, and transition planning. Visit potential homes, talk to current residents, and ask about success rates and support services. A good sober living home should feel safe, supportive, and aligned with your recovery goals.
      </p>
    </div>
  </section>

  <!-- Main Content -->
  <main class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      {#if loading}
        <!-- Loading State -->
        <div class="py-16" role="status" aria-live="polite" aria-label="Loading sober living homes">
          <SkeletonLoader lines={8} className="max-w-4xl mx-auto" />
        </div>
      {:else if error}
        <!-- Error State -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 class="text-lg font-medium text-red-800 mb-2">Unable to Load Sober Living Homes</h3>
          <p class="text-red-700 mb-6">{error.message}</p>
          <button
            on:click={loadResources}
            class="bg-red-100 px-4 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      {:else}
        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
          <!-- Search Input -->
          <div class="mb-6">
            <label for="sober-living-search" class="block text-sm font-medium text-charcoal mb-2">
              Search Sober Living Homes
            </label>
            <div class="relative">
              <input
                id="sober-living-search"
                type="text"
                bind:value={searchQuery}
                placeholder="Search by name, description, or city..."
                class="form-input pl-10 w-full"
                aria-describedby="search-help"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <p id="search-help" class="mt-1 text-xs text-gray-500">
              Search across organization names, descriptions, and locations
            </p>
          </div>

          <!-- City Filter -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-xl font-medium text-charcoal mb-2">Filter by Location</h2>
              <p class="text-gray-600">Find sober living homes in your area</p>
            </div>

            <div class="flex items-center space-x-4">
              <label for="city-filter" class="text-sm font-medium text-charcoal">City:</label>
              <select id="city-filter" bind:value={selectedCity} class="form-input max-w-xs">
                {#each cities as city}
                  <option value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                {/each}
              </select>
            </div>
          </div>

          <!-- Results Count -->
          <div class="mt-4 text-sm text-gray-600">
            {#if searchQuery}
              <div class="flex items-center space-x-2">
                <span>Showing {filteredResources.length} of {resources.length} sober living homes</span>
                {#if selectedCity !== 'all'}
                  <span>in {selectedCity}</span>
                {/if}
                <span>matching "{searchQuery}"</span>
              </div>
            {:else}
              <span>Showing {filteredResources.length} of {resources.length} sober living homes</span>
              {#if selectedCity !== 'all'}
                <span>in {selectedCity}</span>
              {/if}
            {/if}
          </div>
        </div>

        <!-- Resources Grid -->
        {#if filteredResources.length === 0}
          <div class="text-center py-16">
            <svg
              class="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <h3 class="text-lg font-medium text-charcoal mb-2">No sober living homes found</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {#if searchQuery && selectedCity === 'all'}
                No sober living homes match your search for "{searchQuery}". Try different keywords or clear the search.
              {:else if searchQuery && selectedCity !== 'all'}
                No sober living homes match your search for "{searchQuery}" in {selectedCity}. Try different keywords or
                select "All Cities".
              {:else if selectedCity !== 'all'}
                No sober living homes found in {selectedCity}. Try selecting "All Cities".
              {:else}
                No sober living homes are currently available.
              {/if}
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              {#if searchQuery}
                <button on:click={() => (searchQuery = '')} class="btn-secondary"> Clear Search </button>
              {/if}
              {#if selectedCity !== 'all'}
                <button on:click={() => (selectedCity = 'all')} class="btn-primary"> Show All Cities </button>
              {/if}
            </div>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredResources as resource}
              <article
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div class="w-16 h-16 bg-forest-green bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-medium text-charcoal mb-3">
                  {resource.organizationName}
                </h3>

                {#if resource.addressCity}
                  <div class="flex items-center text-sm text-gray-600 mb-3">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {resource.addressCity}, CO
                  </div>
                {/if}

                {#if resource.description}
                  <p class="text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                {/if}

                <div class="space-y-2">
                  {#if resource.phone}
                    <div class="flex items-center text-sm">
                      <svg class="w-4 h-4 mr-2 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <a href="tel:{resource.phone}" class="text-charcoal hover:text-forest-green transition-colors">
                        {resource.phone}
                      </a>
                    </div>
                  {/if}

                  {#if resource.website}
                    <div class="flex items-center text-sm">
                      <svg class="w-4 h-4 mr-2 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-forest-green hover:text-charcoal transition-colors"
                      >
                        Visit Website →
                      </a>
                    </div>
                  {/if}
                </div>

                <div class="mt-4 pt-4 border-t border-gray-200">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-forest-green bg-opacity-10 text-forest-green"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    CARR Certified
                  </span>
                </div>
              </article>
            {/each}
          </div>
        {/if}

        <!-- Call to Action -->
        <div class="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mt-12">
          <h2 class="text-2xl font-bold text-charcoal mb-4">Housing Scholarships Available</h2>
          <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
            Qualified individuals can receive immediate housing scholarships covering the first month's rent at
            CARR-certified sober living homes throughout Colorado.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/get-aid" class="btn-primary"> Apply for Housing Aid </a>
            <a href="/resources/colorado-rehab" class="btn-secondary"> Find Treatment First </a>
          </div>
        </div>
      {/if}
    </div>
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
