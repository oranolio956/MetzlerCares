<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'

  export let data: PageData

  let stories = data.stories || []
  let selectedCategory = 'all'
  let searchTerm = ''

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
</script>

<svelte:head>
  <title>Impact Stories - Metzler Foundations</title>
  <meta
    name="description"
    content="Read real stories of transformation from individuals whose lives have been changed through housing scholarships in recovery."
  />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-medium text-navy">Metzler Foundations</span>
        </button>
        <a href="/impact" class="btn-secondary text-sm px-4 py-2"> Back to Impact </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy via-olive to-gold bg-opacity-10">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-navy mb-6">Stories of Hope & Transformation</h1>
      <p class="text-xl text-navy text-opacity-80 mb-8">
        Every story represents a life changed through stable housing in recovery. These are real people, real struggles,
        and real victories.
      </p>
      <div class="text-navy text-opacity-60">
        <p class="text-lg">Browse {stories.length} stories of transformation</p>
      </div>
    </div>
  </section>

  <!-- Filters and Search -->
  <section class="py-8 px-4 sm:px-6 lg:px-8 border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <input bind:value={searchTerm} type="text" placeholder="Search stories..." class="form-input pl-10" />
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
        </div>

        <!-- Category Filter -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-navy text-opacity-70">Filter by housing type:</span>
          <select bind:value={selectedCategory} class="form-input text-sm">
            <option value="all">All Types</option>
            {#each getUniqueHousingTypes() as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </div>
      </div>

      {#if filteredStories.length !== stories.length}
        <div class="mt-4 text-sm text-navy text-opacity-60">
          Showing {filteredStories.length} of {stories.length} stories
        </div>
      {/if}
    </div>
  </section>

  <!-- Stories Grid -->
  <main class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      {#if filteredStories.length === 0}
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
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m-.5-4H7a2 2 0 012-2h6a2 2 0 012 2h.5M12 7v10m0 0l-3-3m3 3l3-3"
            />
          </svg>
          <h3 class="text-lg font-medium text-navy mb-2">No stories found</h3>
          <p class="text-navy text-opacity-60 mb-4">Try adjusting your search or filter criteria.</p>
          <button
            on:click={() => {
              selectedCategory = 'all'
              searchTerm = ''
            }}
            class="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each filteredStories as story}
            <article
              class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <!-- Story Image -->
              {#if story.photo_url}
                <div class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-olive to-gold bg-opacity-20">
                  <div
                    class="w-full h-48 bg-gradient-to-br from-olive via-gold to-navy bg-opacity-20 flex items-center justify-center"
                  >
                    <svg class="w-12 h-12 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div class="p-6">
                <div class="flex items-start space-x-3 mb-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-olive bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <h2 class="text-xl font-serif font-medium text-navy mb-2">{story.title}</h2>
                    <div class="flex items-center space-x-4 text-sm text-navy text-opacity-60">
                      <span class="flex items-center">
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

                <p class="text-navy text-opacity-80 mb-4 line-clamp-3">{story.story}</p>

                <div class="mb-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-olive bg-opacity-20 text-olive"
                  >
                    {story.housing_type}
                  </span>
                </div>

                {#if story.success_indicators && story.success_indicators.length > 0}
                  <div class="border-t border-navy border-opacity-10 pt-4">
                    <p class="text-sm font-medium text-navy mb-2">Key Achievements:</p>
                    <div class="flex flex-wrap gap-1">
                      {#each story.success_indicators.slice(0, 3) as indicator}
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gold bg-opacity-20 text-gold"
                        >
                          {indicator}
                        </span>
                      {/each}
                      {#if story.success_indicators.length > 3}
                        <span
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-navy bg-opacity-20 text-navy"
                        >
                          +{story.success_indicators.length - 3} more
                        </span>
                      {/if}
                    </div>
                  </div>
                {/if}

                <div class="mt-4 pt-4 border-t border-navy border-opacity-10">
                  <button class="text-olive hover:text-navy font-medium text-sm transition-colors">
                    Read Full Story →
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
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-navy bg-opacity-5">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Your Support Makes Stories Like These Possible</h2>
      <p class="text-xl text-navy text-opacity-80 mb-8">
        Every donation provides immediate housing support, creating the stability needed for lasting recovery.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/donate" class="btn-primary"> Make a Donation </a>
        <a href="/give-support" class="btn-secondary"> Learn More About Giving </a>
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
