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

  // Resource Matcher state
  let aiQuery = ''
  let aiResults: Resource[] = []
  let aiLoading = false
  let aiError: FormError | null = null
  let showAiResults = false

  onMount(async () => {
    await loadResources()
  })

  async function loadResources() {
    try {
      loading = true
      error = null

      // Mock data for fallback
      const mockResources: Resource[] = [
        {
          _id: '1',
          organizationName: 'Denver Recovery Center',
          description: 'Comprehensive addiction treatment center offering detox, residential, and outpatient programs.',
          phone: '(303) 555-0101',
          website: 'https://example.com/denver-recovery',
          city: 'Denver'
        },
        {
          _id: '2',
          organizationName: 'Boulder Sober Living',
          description: 'Structured sober living environment for men and women in early recovery.',
          phone: '(303) 555-0102',
          website: 'https://example.com/boulder-sober',
          city: 'Boulder'
        },
        {
          _id: '3',
          organizationName: 'Colorado Springs Hope House',
          description: 'Faith-based recovery residence providing support and community.',
          phone: '(719) 555-0103',
          website: 'https://example.com/springs-hope',
          city: 'Colorado Springs'
        },
        {
          _id: '4',
          organizationName: 'Mile High Recovery',
          description: 'Outpatient treatment and sober living support in the heart of Denver.',
          phone: '(303) 555-0104',
          website: 'https://example.com/mile-high',
          city: 'Denver'
        },
        {
          _id: '5',
          organizationName: 'Fort Collins Serenity',
          description: 'Peaceful residential treatment facility focusing on holistic recovery.',
          phone: '(970) 555-0105',
          website: 'https://example.com/ft-collins',
          city: 'Fort Collins'
        }
      ]

      if (!sanityClient) {
        console.warn('Sanity client not configured, using mock data')
        resources = mockResources
        cities = ['all', 'Boulder', 'Colorado Springs', 'Denver', 'Fort Collins']
        loading = false
        return
      }

      // Query for local resources from Sanity
      const query = `*[_type == "localResource"] | order(organizationName asc) {
        _id,
        organizationName,
        description,
        phone,
        website,
        city
      }`

      try {
        const result = await sanityClient.fetch(query)
        if (result && result.length > 0) {
          resources = result
          // Extract unique cities for filter
          const uniqueCities = [...new Set(result.map((r: Resource) => r.city).filter(Boolean))].sort()
          cities = ['all', ...(uniqueCities as string[])]
        } else {
          // Fallback if Sanity returns empty
          resources = mockResources
          cities = ['all', 'Boulder', 'Colorado Springs', 'Denver', 'Fort Collins']
        }
      } catch (e) {
        console.warn('Sanity fetch failed, using mock data', e)
        resources = mockResources
        cities = ['all', 'Boulder', 'Colorado Springs', 'Denver', 'Fort Collins']
      }
    } catch (err) {
      console.error('Error loading resources:', err)
      error = { message: 'Failed to load resource directory' }
    } finally {
      loading = false
    }
  }

  $: filteredResources = resources.filter(resource => {
    // City filter
    const cityMatch = selectedCity === 'all' || resource.city === selectedCity

    // Search filter
    const searchMatch =
      !searchQuery ||
      resource.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.city?.toLowerCase().includes(searchQuery.toLowerCase())

    return cityMatch && searchMatch
  })

  // Resource matching function
  async function findAiResources() {
    if (!aiQuery.trim()) {
      aiError = { message: 'Please describe what you need help with' }
      return
    }

    try {
      aiLoading = true
      aiError = null
      showAiResults = false

      // Simulate "Smart" search by filtering local resources with a delay
      await new Promise(resolve => setTimeout(resolve, 800))

      const terms = aiQuery.toLowerCase().split(' ')
      const matches = resources.filter(r => {
        const text = (r.organizationName + ' ' + r.description + ' ' + r.city).toLowerCase()
        return terms.some(term => text.includes(term))
      })

      aiResults = matches.map(m => ({ ...m, similarity: 0.9 })) // Mock similarity
      showAiResults = true
    } catch (err) {
      console.error('Resource matching error:', err)
      aiError = { message: 'Unable to find matching resources. Please try the directory below.' }
    } finally {
      aiLoading = false
    }
  }

  $: schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Metzler Foundations',
    url: 'https://metzlercares.com',
    description: 'Providing dignified housing scholarships for individuals in recovery',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'CO',
      addressCountry: 'US'
    },
    serviceArea: {
      '@type': 'Place',
      name: 'Colorado'
    }
  })
</script>

<svelte:head>
  <title>Colorado Sober Living Resources - Metzler Foundations</title>
  <meta
    name="description"
    content="Comprehensive directory of sober living homes, treatment facilities, and recovery support services in Colorado."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/resources/colorado" />
  <meta property="og:title" content="Colorado Sober Living Resources - Metzler Foundations" />
  <meta
    property="og:description"
    content="Comprehensive directory of sober living homes, treatment facilities, and recovery support services in Colorado."
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Colorado Sober Living Resources" />
  <link rel="canonical" href="https://metzlercares.com/resources/colorado" />
  {@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-white text-charcoal">
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    <!-- Hero Section -->
    <div class="text-center mb-8 md:mb-12">
      <h1 class="text-3xl md:text-4xl font-bold text-charcoal mb-4">Colorado Recovery Resources</h1>
      <p class="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
        A comprehensive directory of sober living homes, treatment facilities, and recovery support services across
        Colorado.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#directory" class="btn-primary"> Browse Resources </a>
        <a href="/get-aid" class="btn-secondary"> Apply for Aid </a>
      </div>
    </div>

    <!-- Resource Finder -->
    <div class="bg-forest-green rounded-xl p-6 md:p-8 mb-8 md:mb-12 text-white">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold mb-4 text-center">Tell us what you need help with</h2>
        <p class="text-white text-opacity-90 text-center mb-6 text-base md:text-lg">
          Our Resource Finder will instantly match you with the most relevant resources in Colorado.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <label for="resource-finder-input" class="sr-only">Describe your needs</label>
          <input
            id="resource-finder-input"
            bind:value={aiQuery}
            type="text"
            placeholder="I'm in Denver and need help with housing..."
            class="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white text-charcoal placeholder-gray-400"
            on:keydown={e => e.key === 'Enter' && findAiResources()}
          />
          <button
            on:click={findAiResources}
            disabled={aiLoading}
            class="px-6 md:px-8 py-3 bg-white text-forest-green font-semibold rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-forest-green disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {#if aiLoading}
              <div class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-forest-green mr-2" />
                Finding Help...
              </div>
            {:else}
              Find Help Now
            {/if}
          </button>
        </div>

        {#if aiError}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {aiError.message}
          </div>
        {/if}

        {#if showAiResults}
          <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4">
              {aiResults.length > 0
                ? `Found ${aiResults.length} matching resource${aiResults.length === 1 ? '' : 's'}:`
                : 'No matching resources found'}
            </h3>

            {#if aiResults.length > 0}
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {#each aiResults as result}
                  <div
                    class="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <h4 class="font-semibold text-lg mb-2">{result.organization_name}</h4>
                    <p class="text-gray-600 mb-3 text-sm line-clamp-3">
                      {result.description}
                    </p>
                    <div class="space-y-1 text-sm">
                      {#if result.phone}
                        <p>
                          <strong>Phone:</strong>
                          <a href="tel:{result.phone}" class="underline hover:text-forest-green">{result.phone}</a>
                        </p>
                      {/if}
                      {#if result.website}
                        <p>
                          <strong>Website:</strong>
                          <a href={result.website} target="_blank" rel="noopener" class="underline hover:text-forest-green"
                            >Visit Site</a
                          >
                        </p>
                      {/if}
                      {#if result.address_city && result.address_state}
                        <p><strong>Location:</strong> {result.address_city}, {result.address_state}</p>
                      {/if}
                    </div>
                    <div class="mt-3 text-xs text-gray-500">
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
      <div class="py-16" role="status" aria-live="polite" aria-label="Loading resources">
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
        <h3 class="text-lg font-medium text-red-800 mb-2">Unable to Load Resources</h3>
        <p class="text-red-700 mb-6">{error}</p>
        <button
          on:click={loadResources}
          class="bg-red-100 px-4 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    {:else}
      <!-- Resource Directory -->
      <div id="directory" class="space-y-8">
        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <!-- Search Input -->
          <div class="mb-6">
            <label for="resource-search" class="block text-sm font-medium text-charcoal mb-2"> Search Resources </label>
            <div class="relative">
              <input
                id="resource-search"
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
              <p class="text-gray-600">Find resources in your area</p>
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
                <span>Showing {filteredResources.length} of {resources.length} resources</span>
                {#if selectedCity !== 'all'}
                  <span>in {selectedCity}</span>
                {/if}
                <span>matching "{searchQuery}"</span>
              </div>
            {:else}
              <span>Showing {filteredResources.length} of {resources.length} resources</span>
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 class="text-lg font-medium text-charcoal mb-2">No resources found</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {#if searchQuery && selectedCity === 'all'}
                No resources match your search for "{searchQuery}". Try different keywords or clear the search.
              {:else if searchQuery && selectedCity !== 'all'}
                No resources match your search for "{searchQuery}" in {selectedCity}. Try different keywords or select
                "All Cities".
              {:else if selectedCity !== 'all'}
                No resources found in {selectedCity}. Try selecting "All Cities".
              {:else}
                No resources are currently available.
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
                <h3 class="text-xl font-medium text-charcoal mb-3">
                  {resource.organizationName}
                </h3>

                {#if resource.city}
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
                    {resource.city}, CO
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
              </article>
            {/each}
          </div>
        {/if}

        <!-- Call to Action -->
        <div class="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <h2 class="text-2xl font-bold text-charcoal mb-4">Can't Find What You're Looking For?</h2>
          <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our team is constantly updating this directory and can help connect you with additional resources in your
            area. We're also always looking to add new vetted partners.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" class="btn-primary"> Contact Our Team </a>
            <a href="/partners" class="btn-secondary"> Become a Partner </a>
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
