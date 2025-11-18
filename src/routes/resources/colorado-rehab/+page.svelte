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

      // Query for rehab-specific resources from Sanity
      const query = `*[_type == "localResource" && resourceType in ["treatment", "rehab"]] | order(organizationName asc) {
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
      console.error('Error loading rehab resources:', err)
      error = { message: 'Failed to load rehab directory' }
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
</script>

<svelte:head>
  <title>Colorado Rehab Programs & Treatment Centers | Find Help Now</title>
  <meta
    name="description"
    content="Find licensed rehab programs and treatment centers across Colorado. Inpatient, outpatient, and specialized treatment for substance use disorders."
  />
  <meta
    name="keywords"
    content="Colorado rehab programs, addiction treatment Colorado, rehab centers Colorado, substance abuse treatment Colorado"
  />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Colorado Rehab Programs & Treatment Centers",
      "description": "Comprehensive directory of licensed rehab programs and treatment centers across Colorado for substance use disorders.",
      "url": "https://metzlerfoundations.org/resources/colorado-rehab",
      "publisher": {
        "@type": "Organization",
        "name": "Metzler Foundations",
        "url": "https://metzlerfoundations.org"
      },
      "about": {
        "@type": "Thing",
        "name": "Substance Use Disorder Treatment",
        "description": "Professional rehabilitation and treatment services for individuals with substance use disorders in Colorado"
      },
      "areaServed": {
        "@type": "State",
        "name": "Colorado",
        "addressRegion": "CO",
        "addressCountry": "US"
      }
    }
  </script>
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
        </button>
        <nav class="hidden md:flex items-center space-x-6">
          <a href="/colorado-recovery" class="text-navy hover:text-olive transition-colors duration-200 font-medium">
            Colorado Recovery
          </a>
          <a href="/resources/colorado" class="text-navy hover:text-olive transition-colors duration-200 font-medium">
            All Resources
          </a>
          <a href="/get-aid" class="text-navy hover:text-olive transition-colors duration-200 font-medium"> Get Aid </a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy via-olive to-gold bg-opacity-10">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-navy mb-6">
        Colorado Rehab Programs & Treatment Centers
      </h1>
      <p class="text-xl text-navy text-opacity-80 mb-8">
        Licensed rehabilitation programs and treatment centers across Colorado offering professional care for substance
        use disorders.
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
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
          <span class="ml-3 text-navy">Loading rehab programs...</span>
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
          <h3 class="text-lg font-medium text-red-800 mb-2">Unable to Load Rehab Programs</h3>
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
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 mb-8">
          <!-- Search Input -->
          <div class="mb-6">
            <label for="rehab-search" class="block text-sm font-medium text-navy mb-2"> Search Rehab Programs </label>
            <div class="relative">
              <input
                id="rehab-search"
                type="text"
                bind:value={searchQuery}
                placeholder="Search by name, description, or city..."
                class="form-input pl-10 w-full"
                aria-describedby="search-help"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-navy text-opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <p id="search-help" class="mt-1 text-xs text-navy text-opacity-60">
              Search across organization names, descriptions, and locations
            </p>
          </div>

          <!-- City Filter -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-xl font-medium text-navy mb-2">Filter by Location</h2>
              <p class="text-navy text-opacity-70">Find rehab programs in your area</p>
            </div>

            <div class="flex items-center space-x-4">
              <label for="city-filter" class="text-sm font-medium text-navy">City:</label>
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
          <div class="mt-4 text-sm text-navy text-opacity-60">
            {#if searchQuery}
              <div class="flex items-center space-x-2">
                <span>Showing {filteredResources.length} of {resources.length} rehab programs</span>
                {#if selectedCity !== 'all'}
                  <span>in {selectedCity}</span>
                {/if}
                <span>matching "{searchQuery}"</span>
              </div>
            {:else}
              <span>Showing {filteredResources.length} of {resources.length} rehab programs</span>
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
            <h3 class="text-lg font-medium text-navy mb-2">No rehab programs found</h3>
            <p class="text-navy text-opacity-60 mb-6 max-w-md mx-auto">
              {#if searchQuery && selectedCity === 'all'}
                No rehab programs match your search for "{searchQuery}". Try different keywords or clear the search.
              {:else if searchQuery && selectedCity !== 'all'}
                No rehab programs match your search for "{searchQuery}" in {selectedCity}. Try different keywords or
                select "All Cities".
              {:else if selectedCity !== 'all'}
                No rehab programs found in {selectedCity}. Try selecting "All Cities".
              {:else}
                No rehab programs are currently available.
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
                class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 hover:shadow-md transition-shadow"
              >
                <h3 class="text-xl font-medium text-navy mb-3">
                  {resource.organizationName}
                </h3>

                {#if resource.addressCity}
                  <div class="flex items-center text-sm text-navy text-opacity-60 mb-3">
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
                  <p class="text-navy text-opacity-80 mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                {/if}

                <div class="space-y-2">
                  {#if resource.phone}
                    <div class="flex items-center text-sm">
                      <svg class="w-4 h-4 mr-2 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <a href="tel:{resource.phone}" class="text-navy hover:text-olive transition-colors">
                        {resource.phone}
                      </a>
                    </div>
                  {/if}

                  {#if resource.website}
                    <div class="flex items-center text-sm">
                      <svg class="w-4 h-4 mr-2 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        class="text-olive hover:text-navy transition-colors"
                      >
                        Visit Website →
                      </a>
                    </div>
                  {/if}
                </div>

                {#if resource.resourceType}
                  <div class="mt-4 pt-4 border-t border-navy border-opacity-10">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-olive bg-opacity-20 text-olive"
                    >
                      {resource.resourceType === 'treatment'
                        ? 'Treatment Program'
                        : resource.resourceType === 'rehab'
                          ? 'Rehab Center'
                          : resource.resourceType}
                    </span>
                  </div>
                {/if}
              </article>
            {/each}
          </div>
        {/if}

        <!-- Call to Action -->
        <div class="bg-navy bg-opacity-5 rounded-lg p-8 text-center border border-navy border-opacity-10 mt-12">
          <h2 class="text-2xl font-serif font-medium text-navy mb-4">Need Housing Support During Treatment?</h2>
          <p class="text-navy text-opacity-80 mb-6 max-w-2xl mx-auto">
            Many Colorado residents qualify for immediate housing scholarships to cover the first month's rent at
            certified sober living homes while completing rehab programs.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/get-aid" class="btn-gold"> Apply for Housing Aid </a>
            <a href="/resources/colorado-sober-living" class="btn-secondary"> Find Sober Living </a>
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
