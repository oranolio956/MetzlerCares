<script lang="ts">
  import type { PageData } from './$types';
  import type { FormError } from '$lib/types';

  export let data: PageData;

  let donorMetrics = data.donorMetrics;

  let impactStories: any[] = data.impactStories || [];
  let loading = false;
  let error: FormError | null = null;

  // Calculate cost per scholarship (this should be configurable)
  const COST_PER_SCHOLARSHIP = 300; // $300 average cost

  

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>My Impact - Metzler Foundations</title>
  <meta name="description" content="See the real impact your donations are making in Colorado communities." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-navy text-cream shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-medium">My Impact Dashboard</h1>
          <p class="text-cream text-opacity-80">See how your support is changing lives</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-cream text-opacity-80">Welcome back!</span>
          <form method="POST" action="?/logout">
            <button
              type="submit"
              class="px-4 py-2 bg-cream bg-opacity-10 text-cream border border-cream border-opacity-30 rounded-md hover:bg-opacity-20 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {#if loading}
      <div class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
        <span class="ml-3 text-navy">Loading your impact data...</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
        <p class="text-red-700">{error}</p>
      </div>
    {:else}
      <!-- Hero Impact Section -->
      <div class="bg-gradient-to-r from-navy to-olive rounded-2xl p-8 mb-12 text-cream">
        <div class="text-center">
          <h2 class="text-4xl font-serif font-medium mb-4">
            Your Support Has Housed
          </h2>
          <div class="text-7xl font-bold text-gold mb-4 font-mono">
            {donorMetrics.individualsHoused}
          </div>
          <p class="text-xl text-cream text-opacity-90 mb-6">
            Individual{donorMetrics.individualsHoused === 1 ? '' : 's'} in Colorado
          </p>
          <p class="text-lg text-cream text-opacity-80">
            Based on {formatCurrency(donorMetrics.totalGiving)} in total support
          </p>
        </div>
      </div>

      <!-- Detailed Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <!-- Total Giving -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Total Support</p>
              <p class="text-2xl font-bold text-navy">{formatCurrency(donorMetrics.totalGiving)}</p>
            </div>
          </div>
        </div>

        <!-- Giving Frequency -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Giving Pattern</p>
              <p class="text-lg font-semibold text-navy capitalize">{donorMetrics.givingFrequency} donor</p>
            </div>
          </div>
        </div>

        <!-- First Gift -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">First Gift</p>
              <p class="text-lg font-semibold text-navy">
                {donorMetrics.firstGiftDate ? formatDate(donorMetrics.firstGiftDate) : 'Recent'}
              </p>
            </div>
          </div>
        </div>

        <!-- Latest Gift -->
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-navy text-opacity-70">Latest Gift</p>
              <p class="text-lg font-semibold text-navy">
                {donorMetrics.lastGiftDate ? formatDate(donorMetrics.lastGiftDate) : 'Recent'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Impact Story -->
      {#if impactStories.length > 0}
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-12">
          <h3 class="text-2xl font-serif font-medium text-navy mb-6 text-center">
            A Life Your Support Made Possible
          </h3>

          {#each impactStories as story}
            <div class="flex flex-col md:flex-row gap-8 items-center">
              <div class="flex-1">
                <h4 class="text-xl font-semibold text-navy mb-4">{story.title}</h4>
                <p class="text-navy text-opacity-80 mb-4 leading-relaxed">
                  {story.story}
                </p>
                {#if story.location}
                  <p class="text-sm text-navy text-opacity-60">
                    <svg class="inline h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {story.location}
                  </p>
                {/if}
              </div>
              {#if story.photo_url}
                <div class="flex-shrink-0">
                  <img
                    src="{story.photo_url}"
                    alt="{story.title}"
                    class="w-64 h-48 object-cover rounded-lg shadow-sm"
                  />
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Call to Action -->
      <div class="bg-navy rounded-lg p-8 text-center text-cream">
        <h3 class="text-2xl font-serif font-medium mb-4">
          Ready to Make Even More Impact?
        </h3>
        <p class="text-cream text-opacity-80 mb-6 max-w-2xl mx-auto">
          Every dollar you give directly supports someone in recovery. Your generosity creates lasting change in Colorado communities.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/give-support" class="btn-gold">
            Make Another Gift
          </a>
          <a href="/impact" class="px-6 py-3 bg-cream bg-opacity-10 text-cream border border-cream border-opacity-30 rounded-md hover:bg-opacity-20 transition-colors">
            See Public Impact
          </a>
        </div>
      </div>
    {/if}
  </main>
</div>
