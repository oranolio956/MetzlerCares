<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/utils/supabase'
  import { onMount } from 'svelte'
  import SkeletonLoader from '$lib/components/SkeletonLoader.svelte'
  import type { ImpactMetrics, FormError } from '$lib/types'
  import type { PageData } from './$types'
  // Dynamic import for Chart.js to reduce initial bundle size
  // import { Chart, registerables } from 'chart.js'
  // Chart.register(...registerables)

  export let data: PageData

  let metrics: ImpactMetrics | null = null
  let stories: any[] = []
  let loading = true
  let error: FormError | null = null
  let chartCanvas: HTMLCanvasElement
  let chartInstance: any = null // Type as any since Chart is loaded dynamically

  onMount(async () => {
    // Use server-loaded data
    metrics = data.metrics
    stories = data.stories || []
    loading = false

    // Create chart if we have data and canvas exists
    if (metrics && chartCanvas) {
      createChart()
    }
  })

  async function createChart() {
    if (!metrics || !chartCanvas) return

    const ctx = chartCanvas.getContext('2d')
    if (!ctx) return

    // Dynamically load Chart.js
    const { Chart, registerables } = await import('chart.js')
    Chart.register(...registerables)

    // Calculate program vs administrative costs (simplified)
    const programCosts = metrics.total_funds_disbursed_usd || 0
    const administrativeCosts = Math.floor(programCosts * 0.15) // Assume 15% admin costs
    const totalCosts = programCosts + administrativeCosts

    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Program Services', 'Administrative'],
        datasets: [
          {
            data: [programCosts, administrativeCosts],
            backgroundColor: ['#2D5016', '#F5F5DC'], // olive and cream
            borderColor: ['#1a2f0d', '#e8e8d0'],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#192A56', // navy
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Program vs Administrative',
            color: '#192A56', // navy
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }
    })
  }

  function reloadData() {
    // Trigger a page reload to refresh server data
    window.location.reload()
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  function formatNumber(num: number) {
    return new Intl.NumberFormat('en-US').format(num)
  }
</script>

<svelte:head>
  <title>Our Impact - Metzler Foundations</title>
  <meta
    name="description"
    content="See the measurable impact of Metzler Foundations' housing scholarship program in Colorado. Real numbers, real lives changed."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/impact" />
  <meta property="og:title" content="Our Impact - Metzler Foundations" />
  <meta
    property="og:description"
    content="See the measurable impact of Metzler Foundations' housing scholarship program in Colorado. Real numbers, real lives changed."
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Our Impact - Metzler Foundations" />
  <link rel="canonical" href="https://metzlercares.com/impact" />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal">
  <!-- Global header is provided by layout -->

  <!-- Main Content -->
  <main class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-charcoal mb-6">Our Impact in Real Time</h1>
        <p class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Every donation creates immediate change. See exactly how your support is helping individuals in recovery find
          stable housing.
        </p>
        <a
          href="/give-support"
          class="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Join Our Mission
        </a>
      </div>

      {#if loading}
        <!-- Loading State -->
        <div class="flex justify-center items-center py-16" role="status" aria-live="polite">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green" aria-hidden="true" />
          <span class="ml-3 text-gray-600 text-lg">Loading impact metrics...</span>
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
          <h3 class="text-lg font-medium text-red-800 mb-2">Unable to Load Impact Data</h3>
          <p class="text-red-700 mb-6">{data.error || 'An unexpected error occurred while loading impact data.'}</p>
          <button
            on:click={reloadData}
            class="bg-red-100 px-4 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      {:else if metrics}
        <!-- Impact Dashboard -->
        <div class="space-y-16">
          <!-- Hero Metric -->
          <div class="text-center">
            <div class="inline-block bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
              <div class="text-6xl md:text-8xl font-bold text-charcoal mb-4">
                {formatNumber(metrics.total_beneficiaries_served ?? 0)}
              </div>
              <div class="text-2xl md:text-3xl font-medium text-charcoal mb-2">Individuals Housed</div>
              <div class="text-gray-600">
                Since our founding, real people have found stable housing through your support
              </div>
            </div>
          </div>

          <!-- Supporting Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Funds Disbursed -->
            <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
              <div class="w-12 h-12 bg-forest-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div class="text-2xl font-bold text-charcoal mb-1">
                {formatCurrency(metrics.total_funds_disbursed_usd ?? 0)}
              </div>
              <div class="text-sm font-medium text-charcoal mb-1">Scholarships Deployed</div>
              <div class="text-xs text-gray-600">Direct payments to facilities</div>
            </div>

            <!-- Success Rate -->
            <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="text-2xl font-bold text-charcoal mb-1">
                {metrics.success_rate_percentage}%
              </div>
              <div class="text-sm font-medium text-charcoal mb-1">Success Rate</div>
              <div class="text-xs text-gray-600">Applications funded</div>
            </div>

            <!-- Average Approval Time -->
            <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
              <div class="w-12 h-12 bg-sunset-orange bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-sunset-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="text-2xl font-bold text-charcoal mb-1">
                {metrics.average_approval_time_minutes}
              </div>
              <div class="text-sm font-medium text-charcoal mb-1">Minutes Average</div>
              <div class="text-xs text-gray-600">Application to approval</div>
            </div>

            <!-- Applications Processed -->
            <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
              <div class="w-12 h-12 bg-mountain-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-mountain-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div class="text-2xl font-bold text-charcoal mb-1">
                {metrics.total_applications_processed}
              </div>
              <div class="text-sm font-medium text-charcoal mb-1">Applications Processed</div>
              <div class="text-xs text-gray-600">Total applications received</div>
            </div>
          </div>

          <!-- Additional Metrics Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <!-- Funded Applications -->
            <div class="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
              <div class="text-2xl font-bold text-forest-green mb-2">
                {metrics.funded_applications_count}
              </div>
              <div class="text-sm font-medium text-charcoal mb-1">Lives Changed</div>
              <div class="text-xs text-gray-600">Scholarships awarded</div>
            </div>

            <!-- Real-time Update -->
            <div class="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
              <div class="w-8 h-8 bg-forest-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-4 h-4 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div class="text-sm font-medium text-charcoal mb-1">Live Data</div>
              <div class="text-xs text-gray-600">
                Updated: {new Date(metrics.last_updated ?? new Date()).toLocaleString()}
              </div>
            </div>

            <!-- Housing Units Secured -->
            <div class="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
              <div class="text-2xl font-bold text-forest-green mb-2">
                {Math.floor((metrics.total_funds_disbursed_usd ?? 0) / 300)}
              </div>
              <div class="text-sm font-medium text-charcoal mb-1">Housing Units</div>
              <div class="text-xs text-gray-600">Months of stable housing</div>
            </div>
          </div>

          <!-- Financial Transparency -->
          <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 class="text-2xl font-bold text-charcoal mb-6 text-center">Your Trust is Our Foundation</h2>

            <!-- Financial Chart -->
            {#if metrics && metrics.total_funds_disbursed_usd > 0}
              <div class="mb-8">
                <div class="max-w-md mx-auto h-64">
                  <canvas bind:this={chartCanvas} aria-label="Program vs Administrative donut chart" />
                </div>
              </div>
            {:else}
              <div class="text-center py-8" role="alert">
                <div
                  class="w-16 h-16 bg-forest-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg class="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-charcoal mb-2">Chart Data Loading</h3>
                <p class="text-gray-600">
                  Financial transparency chart will appear when data is available.
                </p>
              </div>
            {/if}

            <!-- Trust Seals -->
            <div class="flex flex-wrap justify-center items-center gap-8 mb-8">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-forest-green bg-opacity-10 rounded-full flex items-center justify-center">
                  <span class="text-forest-green font-bold text-sm">GS</span>
                </div>
                <span class="text-charcoal font-medium">GuideStar Platinum Seal</span>
              </div>

              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-sunset-orange bg-opacity-10 rounded-full flex items-center justify-center">
                  <span class="text-sunset-orange font-bold text-sm">CN</span>
                </div>
                <span class="text-charcoal font-medium">Charity Navigator</span>
              </div>

              <div class="flex items-center space-x-3">
                <div class="w-16 h-8 bg-forest-green rounded flex items-center justify-center">
                  <span class="text-white font-bold text-xs">HIPAA</span>
                </div>
                <span class="text-charcoal font-medium">HIPAA Compliant</span>
              </div>
            </div>

            <!-- Financials Link -->
            <div class="text-center">
              <a href="/financials" class="btn-secondary inline-block hover:bg-opacity-90 transition-all duration-200">
                View Our Financials & Form 990
              </a>
              <p class="text-sm text-gray-600 mt-2">Complete transparency in our operations and impact</p>
            </div>
          </div>

          <!-- Impact Stories Section -->
          <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 class="text-2xl font-bold text-charcoal mb-8 text-center">Real Stories of Transformation</h2>

            {#if stories && stories.length > 0}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each stories as story}
                  <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div class="flex items-start space-x-4">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-forest-green bg-opacity-10 rounded-full flex items-center justify-center">
                          <svg class="w-6 h-6 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <h3 class="text-lg font-medium text-charcoal mb-2">{story.title}</h3>
                        <p class="text-sm text-gray-600 mb-3 line-clamp-4">{story.story}</p>

                        <div class="space-y-2">
                          <div class="flex items-center text-xs text-gray-500">
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
                          </div>

                          <div class="flex items-center text-xs text-gray-500">
                            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            {story.housing_type}
                          </div>

                          <div class="flex items-center text-xs text-gray-500">
                            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Housed in {story.time_to_housing}
                          </div>
                        </div>

                        {#if story.success_indicators && story.success_indicators.length > 0}
                          <div class="mt-3 pt-3 border-t border-gray-200">
                            <p class="text-xs font-medium text-charcoal mb-2">Success Indicators:</p>
                            <div class="flex flex-wrap gap-1">
                              {#each story.success_indicators.slice(0, 2) as indicator}
                                <span
                                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-forest-green bg-opacity-10 text-forest-green"
                                >
                                  {indicator}
                                </span>
                              {/each}
                              {#if story.success_indicators.length > 2}
                                <span
                                  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-sunset-orange bg-opacity-20 text-sunset-orange"
                                >
                                  +{story.success_indicators.length - 2} more
                                </span>
                              {/if}
                            </div>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>

              <div class="mt-8 text-center">
                <button on:click={() => goto('/stories')} class="btn-secondary"> View All Stories → </button>
              </div>
            {:else}
              <div class="text-center py-8">
                <div
                  class="w-16 h-16 bg-forest-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <svg class="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-charcoal mb-2">Stories Coming Soon</h3>
                <p class="text-gray-600">
                  We're collecting and preparing stories of transformation. Check back soon to see the real impact of
                  your support.
                </p>
              </div>
            {/if}
          </div>
        </div>
      {:else}
        <!-- No Data State -->
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 class="text-lg font-medium text-charcoal mb-2">Impact metrics coming soon</h3>
          <p class="text-gray-600">We're working to display our real-time impact data.</p>
        </div>
      {/if}
    </div>
  </main>
</div>
