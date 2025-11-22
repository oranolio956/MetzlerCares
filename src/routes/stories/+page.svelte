<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import { onMount } from 'svelte'
  import { logClientError } from '$lib/utils/security'
  import { fade, fly } from 'svelte/transition'

  export let data: PageData

  let stories = data.stories || []
  let selectedCategory = 'all'
  let searchTerm = ''
  let loading = false
  let error: string | null = null

  $: filteredStories = stories.filter(story => {
    const matchesCategory =
      selectedCategory === 'all' || story.housing_type.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesSearch =
      !searchTerm ||
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function getUniqueHousingTypes() {
    const types = stories.map(story => story.housing_type)
    return [...new Set(types)]
  }

  // Telemetry for search/filter usage
  let searchTimeout: NodeJS.Timeout
  function handleSearchInput() {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      if (searchTerm.length > 3) {
        // Log search engagement (optional, kept simple for now)
        console.debug('Search term:', searchTerm)
      }
    }, 1000)
  }

  onMount(() => {
    if (!stories.length) {
      logClientError({
        type: 'content_warning',
        status: 200,
        error: 'No stories loaded from server',
        url: window.location.href
      })
    }
  })
</script>

<svelte:head>
  <title>Impact Stories - Metzler Foundations</title>
  <meta
    name="description"
    content="Read real stories from individuals who received housing scholarships and support from Metzler Foundations in Colorado."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/stories" />
  <meta property="og:title" content="Impact Stories - Metzler Foundations" />
  <meta
    property="og:description"
    content="Read real stories from individuals who received housing scholarships and support from Metzler Foundations in Colorado."
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Impact Stories - Metzler Foundations" />
  <link rel="canonical" href="https://metzlercares.com/stories" />
</svelte:head>

<div class="min-h-screen bg-[var(--surface-cream)] text-[var(--color-charcoal)] font-[family-name:var(--font-secondary)]">
  <!-- Header -->
  <header class="bg-white border-b border-[var(--surface-border)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2 group">
          <MetzlerBridgeLogo className="w-8 h-8 text-[var(--color-forest-green)] group-hover:opacity-80 transition-opacity" />
          <span class="text-xl font-bold text-[var(--color-charcoal)] font-[family-name:var(--font-primary)]">Metzler Foundations</span>
        </button>
        <a href="/impact" class="btn-outline text-sm px-4 py-2 rounded-md border border-[var(--surface-border)] hover:bg-[var(--surface-gray-50)] transition-colors"> Back to Impact </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-[var(--surface-border)]">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-[var(--color-charcoal)] mb-6 font-[family-name:var(--font-primary)]">Stories of Hope & Transformation</h1>
      <p class="text-lg text-[var(--text-muted)] mb-6">
        Every story represents a life changed through stable housing in recovery. These are real people, real struggles,
        and real victories.
      </p>
      <div class="text-[var(--text-muted)] text-sm">
        <p class="text-lg">Browse {stories.length} stories of transformation</p>
      </div>
    </div>
  </section>

  <!-- Filters and Search -->
  <section class="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--surface-border)] bg-[var(--surface-gray-50)]">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <!-- Search -->
        <div class="flex-1 max-w-md w-full">
          <div class="relative">
            <label for="search-stories" class="sr-only">Search stories</label>
            <input
              id="search-stories"
              bind:value={searchTerm}
              on:input={handleSearchInput}
              type="text"
              placeholder="Search stories..."
              class="w-full pl-10 pr-4 py-2 border border-[var(--surface-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-forest-green)] focus:border-transparent outline-none transition-all"
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
        </div>

        <!-- Category Filter -->
        <div class="flex items-center space-x-2 w-full md:w-auto">
          <label for="category-filter" class="text-sm text-[var(--text-muted)] whitespace-nowrap">Filter by:</label>
          <select
            id="category-filter"
            bind:value={selectedCategory}
            class="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--color-forest-green)] focus:border-[var(--color-forest-green)] sm:text-sm rounded-md"
          >
            <option value="all">All Housing Types</option>
            {#each getUniqueHousingTypes() as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </div>
      </div>

      {#if filteredStories.length !== stories.length}
        <div class="mt-4 text-sm text-[var(--text-muted)]" in:fade>
          Showing {filteredStories.length} of {stories.length} stories
        </div>
      {/if}
    </div>
  </section>

  <!-- Stories Grid -->
  <main class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      {#if filteredStories.length === 0}
        <div class="text-center py-16" in:fade>
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
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m-.5-4H7a2 2 0 012-2h6a2 2 0 012 2h.5M12 7v10m0 0l-3-3m3 3l3-3"
            />
          </svg>
          <h3 class="text-lg font-medium text-[var(--color-charcoal)] mb-2">No stories found</h3>
          <p class="text-[var(--text-muted)] mb-4">Try adjusting your search or filter criteria.</p>
          <button
            on:click={() => {
              selectedCategory = 'all'
              searchTerm = ''
            }}
            class="btn-secondary px-4 py-2 rounded-md bg-[var(--color-mountain-blue)] text-white hover:bg-opacity-90 transition-all"
          >
            Clear Filters
          </button>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each filteredStories as story, i (story.title)}
            <article
              class="bg-white rounded-xl shadow-lg border border-[var(--surface-border)] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
              in:fly={{ y: 20, duration: 300, delay: i * 50 }}
            >
              <!-- Story Image -->
              {#if story.photo_url}
                <div class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[var(--color-forest-green)]/10 to-[var(--color-mountain-blue)]/10">
                  <div
                    class="w-full h-48 bg-gray-100 flex items-center justify-center"
                  >
                    <img 
                      src={story.photo_url} 
                      alt={story.title}
                      class="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="225"
                    />
                  </div>
                </div>
              {:else}
                 <div class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[var(--color-forest-green)]/10 to-[var(--color-mountain-blue)]/10">
                  <div
                    class="w-full h-48 flex items-center justify-center"
                  >
                    <svg class="w-12 h-12 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              {/if}

              <!-- Story Content -->
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-start space-x-3 mb-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-[var(--color-forest-green)]/10 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-[var(--color-forest-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h2 class="text-xl font-bold text-[var(--color-charcoal)] mb-2 font-[family-name:var(--font-primary)]">{story.title}</h2>
                    <div class="flex flex-wrap gap-y-2 items-center text-sm text-[var(--text-muted)]">
                      <span class="flex items-center mr-4">
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
                        {story.location}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {story.time_to_housing}
                      </span>
                    </div>
                  </div>
                </div>

                <p class="text-[var(--text-secondary)] mb-4 line-clamp-3 flex-1">{story.story}</p>

                <div class="mb-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-forest-green)]/10 text-[var(--color-forest-green)]"
                  >
                    {story.housing_type}
                  </span>
                </div>

                {#if story.success_indicators && story.success_indicators.length > 0}
                  <div class="border-t border-[var(--surface-border)] pt-4 mt-auto">
                    <p class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Key Achievements:</p>
                    <div class="flex flex-wrap gap-2">
                      {#each story.success_indicators.slice(0, 3) as indicator}
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[var(--color-sunset-orange)]/10 text-[var(--color-sunset-orange)]"
                        >
                          {indicator}
                        </span>
                      {/each}
                      {#if story.success_indicators.length > 3}
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[var(--color-mountain-blue)]/10 text-[var(--color-mountain-blue)]"
                        >
                          +{story.success_indicators.length - 3} more
                        </span>
                      {/if}
                    </div>
                  </div>
                {/if}

                <div class="mt-4 pt-4 border-t border-[var(--surface-border)]">
                  <button class="text-[var(--color-forest-green)] hover:text-[var(--color-charcoal)] font-medium text-sm transition-colors flex items-center">
                    Read Full Story 
                    <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </div>
  </main>

  <!-- Call to Action -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-warm-gray)]">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl font-bold text-[var(--color-charcoal)] mb-6 font-[family-name:var(--font-primary)]">Your Support Makes Stories Like These Possible</h2>
      <p class="text-xl text-[var(--text-secondary)] mb-8">
        Every donation provides immediate housing support, creating the stability needed for lasting recovery.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/donate" class="btn-primary px-8 py-3 rounded-lg bg-[var(--color-forest-green)] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"> Make a Donation </a>
        <a href="/give-support" class="btn-secondary px-8 py-3 rounded-lg bg-[var(--color-mountain-blue)] text-white font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"> Learn More About Giving </a>
      </div>
    </div>
  </section>
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
