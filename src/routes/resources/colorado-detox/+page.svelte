<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { sanityClient } from '$lib/utils/sanity'
  import { onMount } from 'svelte'
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

      // Query for detox-specific resources from Sanity
      const query = `*[_type == "localResource" && resourceType == "detox"] | order(organizationName asc) {
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
      console.error('Error loading detox resources:', err)
      error = { message: 'Failed to load detox directory' }
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
    name: 'Colorado Detox Centers & Medical Detoxification',
    description:
      'Directory of medical detox centers in Colorado providing safe, supervised withdrawal from alcohol and drugs.',
    url: 'https://metzlerfoundations.org/resources/colorado-detox',
    publisher: {
      '@type': 'Organization',
      name: 'Metzler Foundations',
      url: 'https://metzlerfoundations.org'
    },
    about: {
      '@type': 'MedicalProcedure',
      name: 'Medical Detoxification',
      description: 'Medically supervised withdrawal from alcohol and drugs in Colorado'
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
  <title>Colorado Detox Centers & Medical Detoxification | Safe Withdrawal</title>
  <meta
    name="description"
    content="Find medical detox centers in Colorado providing 24/7 supervised withdrawal from alcohol and drugs. Safe, medically monitored detoxification services."
  />
  <meta
    name="keywords"
    content="Colorado detox centers, medical detox Colorado, drug detox Colorado, alcohol detox Colorado, supervised withdrawal Colorado"
  />
  {@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-white text-charcoal">
  <!-- Hero Section -->
  <section class="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-charcoal mb-4">
        Colorado Detox Centers & Medical Detoxification
      </h1>
      <p class="text-lg text-gray-600 mb-6">
        Medical detoxification centers across Colorado providing safe, supervised withdrawal from alcohol and drugs with
        24/7 medical monitoring.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/get-aid" class="btn-primary"> Apply for Housing Aid </a>
        <a href="/resources/colorado" class="btn-secondary"> Browse All Resources </a>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <main class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      {#if loading}
        <!-- Loading State -->
        <div class="flex justify-center items-center py-16">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
          <span class="ml-3 text-navy">Loading detox centers...</span>
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
          <h3 class="text-lg font-medium text-red-800 mb-2">Unable to Load Detox Centers</h3>
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
            <label for="detox-search" class="block text-sm font-medium text-charcoal mb-2"> Search Detox Centers </label>
            <div class="relative">
              <input
                id="detox-search"
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
              <p class="text-gray-600">Find detox centers in your area</p>
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
                <span>Showing {filteredResources.length} of {resources.length} detox centers</span>
                {#if selectedCity !== 'all'}
                  <span>in {selectedCity}</span>
                {/if}
                <span>matching "{searchQuery}"</span>
              </div>
            {:else}
              <span>Showing {filteredResources.length} of {resources.length} detox centers</span>
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
              class="mx-auto h-12 w-12 text-navy text-opacity-40 mb-4"
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
            <h3 class="text-lg font-medium text-navy mb-2">No detox centers found</h3>
            <p class="text-navy text-opacity-60 mb-6 max-w-md mx-auto">
              {#if searchQuery && selectedCity === 'all'}
                No detox centers match your search for "{searchQuery}". Try different keywords or clear the search.
              {:else if searchQuery && selectedCity !== 'all'}
                No detox centers match your search for "{searchQuery}" in {selectedCity}. Try different keywords or
                select "All Cities".
              {:else if selectedCity !== 'all'}
                No detox centers found in {selectedCity}. Try selecting "All Cities".
              {:else}
                No detox centers are currently available.
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
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
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-forest-green bg-opacity-10 text-forest-green">
                    Medical Detox Center
                  </span>
                </div>
              </article>
            {/each}
          </div>
        {/if}

        <!-- Call to Action -->
        <div class="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mt-12">
          <h2 class="text-2xl font-bold text-charcoal mb-4">Safe Medical Detox is the First Step</h2>
          <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
            Medical detoxification provides the safest way to withdraw from alcohol and drugs. Many Colorado detox
            centers accept insurance and offer sliding scale fees.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/get-aid" class="btn-primary"> Apply for Housing Aid </a>
            <a href="/resources/colorado-rehab" class="btn-secondary"> Find Rehab Programs </a>
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
