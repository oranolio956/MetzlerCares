<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { goto, invalidateAll } from '$app/navigation';
  export let data;
  import type { ImpactMetrics } from '$lib/types';
  import { buildSanitySrcSet, defaultSizes } from '$lib/utils/image';
  import { onMount } from 'svelte'
  import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
  Chart.register(ArcElement, Tooltip, Legend)

  let metrics: ImpactMetrics | null = data.metrics;
  let story = data.story;
  let loading = false;
  let errorMessage: string | null = data.error ?? null;
  let chartEl: HTMLCanvasElement | null = null

  

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatNumber(num: number) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  function programAmount() {
    const total = metrics?.total_funds_disbursed_usd ?? 0;
    return Math.round(total * 0.9);
  }

  function adminAmount() {
    const total = metrics?.total_funds_disbursed_usd ?? 0;
    return Math.max(0, total - programAmount());
  }

  function programPercent() {
    const total = metrics?.total_funds_disbursed_usd ?? 0;
    const prog = programAmount();
    return Math.min(100, Math.round((prog / (total || 1)) * 100));
  }

  onMount(() => {
    if (metrics && chartEl) {
      const total = (metrics.total_funds_disbursed_usd || 0)
      const prog = Math.round(total * 0.9)
      const admin = Math.max(0, total - prog)
      new Chart(chartEl, {
        type: 'doughnut',
        data: {
          labels: ['Programmatic', 'Administrative'],
          datasets: [{
            data: [prog, admin],
            backgroundColor: ['#556B2F', '#192A56'],
            borderWidth: 0
          }]
        },
        options: {
          plugins: {
            legend: { display: true, labels: { color: '#0b1a33' } },
            tooltip: { enabled: true }
          },
          cutout: '60%'
        }
      })
    }
  })
</script>

<svelte:head>
  <title>Our Impact - Metzler Foundations</title>
  <meta name="description" content="See the real impact of your donations. Live metrics showing how we're helping individuals in recovery find stable housing." />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Our Impact",
      "url": "https://metzlerfoundations.org/impact",
      "description": "Live impact metrics showing how donations help individuals in recovery find stable housing.",
      "isPartOf": {
        "@type": "Organization",
        "name": "Metzler Foundations",
        "url": "https://metzlerfoundations.org/"
      }
    }
  </script>
</svelte:head>

<div class="min-h-screen bg-soft-white text-deep-navy-900">
  <!-- Global header is provided by layout -->

  <!-- Main Content -->
  <main class="py-16 px-4 sm:px-6 lg:px-8 bg-soft-white">
    <div class="max-w-7xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-display-medium font-display text-deep-navy-900 mb-6">
          Our Impact in Real Time
        </h1>
        <p class="text-xl text-deep-navy-700 mb-8 max-w-3xl mx-auto">
          Every donation creates immediate change. See exactly how your support
          is helping individuals in recovery find stable housing.
        </p>
        <a href="/give-support" class="btn-primary text-lg px-8 py-4">
          Join Our Mission
        </a>
      </div>

      {#if loading}
        <!-- Loading State -->
        <div class="flex justify-center items-center py-16" role="status" aria-live="polite">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-navy-600" aria-hidden="true"></div>
          <span class="ml-3 text-deep-navy-700 text-lg">Loading impact metrics...</span>
        </div>

        <div class="bg-soft-white rounded-xl shadow-soft p-8 border border-sage-200">
          <h2 class="text-2xl font-serif font-medium text-navy mb-6 text-center">Program vs. Administrative Expenses</h2>
          <div class="flex flex-col items-center justify-center gap-6">
            {#if metrics}
              <canvas bind:this={chartEl} aria-label="Program vs Administrative donut chart"></canvas>
              <div>
                <div class="flex items-center space-x-3 mb-2">
                  <span class="inline-block w-3 h-3 rounded-full" style="background:#556B2F"></span>
                  <span class="text-navy font-medium">Programmatic</span>
                  <span class="text-navy text-opacity-60">{formatCurrency(programAmount())}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="inline-block w-3 h-3 rounded-full" style="background:#192A56"></span>
                  <span class="text-navy font-medium">Administrative</span>
                  <span class="text-navy text-opacity-60">{formatCurrency(adminAmount())}</span>
                </div>
              </div>
              <table class="sr-only">
                <caption>Program vs Administrative amounts</caption>
                <thead>
                  <tr><th>Category</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  <tr><td>Programmatic</td><td>{formatCurrency(programAmount())}</td></tr>
                  <tr><td>Administrative</td><td>{formatCurrency(adminAmount())}</td></tr>
                </tbody>
              </table>
            {/if}
          </div>
          <p class="text-sm text-navy text-opacity-60 mt-4 text-center">Illustrative breakdown based on current disbursements</p>
        </div>

      {:else if errorMessage}
        <!-- Error State -->
      <div class="card bg-red-50 border border-red-200 p-8 text-center" role="alert" aria-live="assertive">
          <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="text-lg font-semibold text-red-800 mb-2">Unable to Load Impact Data</h3>
          <p class="text-red-700 mb-6">{errorMessage}</p>
          <button
            on:click={refreshImpact}
            class="btn-secondary"
          >
            Try Again
          </button>
        </div>

      {:else if metrics}
        <!-- Impact Dashboard -->
        <div class="space-y-16">
          <!-- Hero Metric -->
          <div class="text-center">
            <div class="inline-block bg-soft-white p-8 md:p-12 border border-sage-200">
              <div class="text-display-large font-display text-deep-navy-900 mb-4">
                {formatNumber(metrics.total_beneficiaries_served)}
              </div>
              <div class="text-display-xsmall font-semibold text-deep-navy-900 mb-2">
                Individuals Housed
              </div>
              <div class="text-deep-navy-700">
                Since our founding, real people have found stable housing through your support
              </div>
            </div>
          </div>

          <!-- Supporting Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Funds Disbursed -->
            <div class="card bg-soft-white p-8 text-center">
              <div class="text-3xl font-display text-deep-navy-900 mb-2">
                {formatCurrency(metrics.total_funds_disbursed_usd)}
              </div>
              <div class="text-lg font-semibold text-deep-navy-900 mb-2">
                Scholarships Deployed
              </div>
              <div class="text-deep-navy-700">
                Direct payments to sober living facilities
              </div>
            </div>

            <!-- Average Approval Time -->
            <div class="card bg-soft-white p-8 text-center">
              <div class="text-3xl font-display text-deep-navy-900 mb-2">
                {metrics.average_approval_time_minutes}
              </div>
              <div class="text-lg font-semibold text-deep-navy-900 mb-2">
                Minutes Average
              </div>
              <div class="text-deep-navy-700">
                From application to scholarship approval
              </div>
            </div>

            <!-- Last Updated -->
            <div class="card bg-soft-white p-8 text-center">
              <div class="text-lg font-semibold text-deep-navy-900 mb-2">
                Live Data
              </div>
              <div class="text-deep-navy-700 mb-2">
                Updated in real-time
              </div>
              <div class="text-sm text-deep-navy-600">
                Last updated: {new Date(metrics.last_updated).toLocaleString()}
              </div>
            </div>
          </div>

          <!-- Financial Transparency -->
          <div class="card bg-soft-white p-8">
            <h2 class="text-display-xsmall font-display text-deep-navy-900 mb-6 text-center">
              Your Trust is Our Foundation
            </h2>

            <div class="grid md:grid-cols-2 gap-8 mb-8">
              <div class="text-center">
                <h3 class="text-lg font-semibold text-deep-navy-900 mb-4">Financial Transparency</h3>
                <div class="space-y-2 text-deep-navy-700 mb-6">
                  <div class="flex items-center justify-center space-x-2">
                    <span class="font-semibold">•</span>
                    <span>GuideStar Platinum Seal</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <span class="font-semibold">•</span>
                    <span>Charity Navigator Rated</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <span class="font-semibold">•</span>
                    <span>HIPAA Compliant</span>
                  </div>
                </div>
                <a href="/financials" class="btn-secondary">
                  View Our Financials & Form 990
                </a>
              </div>

              <div class="text-center">
                <h3 class="text-lg font-semibold text-deep-navy-900 mb-4">Download Resources</h3>
                <div class="space-y-3">
                  <a href="https://metzlerfoundations.org/form-990.pdf" target="_blank" rel="noopener noreferrer" class="block text-deep-navy-700 hover:text-deep-navy-900">
                    Form 990 (PDF)
                  </a>
                  <a href="/annual-report" class="block text-deep-navy-700 hover:text-deep-navy-900">
                    Annual Report
                  </a>
                  <a href="/impact-report" class="block text-deep-navy-700 hover:text-deep-navy-900">
                    Impact Report
                  </a>
                </div>
              </div>
            </div>

            <p class="text-sm text-deep-navy-600 text-center">
              Complete transparency in our operations and impact
            </p>
          </div>

          {#if story}
          <div class="card bg-soft-white p-8">
            <div class="grid md:grid-cols-5 gap-8 items-start">
              {#if story.photo?.asset?.url}
                <div class="md:col-span-2">
                  <img
                    src={story.photo.asset.url}
                    srcset={buildSanitySrcSet(story.photo.asset.url, [320, 640, 960, 1280])}
                    sizes={defaultSizes}
                    alt={story.name}
                    class="w-full rounded-lg object-cover aspect-[4/3] md:aspect-[3/2]"
                  />
                </div>
              {/if}
              <div class="md:col-span-3">
                <h2 class="text-display-xsmall font-display text-deep-navy-900 mb-2">{story.headline}</h2>
                <p class="text-deep-navy-700 mb-4">{story.summary}</p>
                <p class="text-deep-navy-900 font-semibold">
                  {story.name} is one of the {formatNumber(metrics.total_beneficiaries_served)} people you helped house.
                </p>
                {#if story.city || story.state}
                  <p class="text-deep-navy-700 mt-2">{story.city}{story.city && story.state ? ', ' : ''}{story.state}</p>
                {/if}
              </div>
            </div>
          </div>
          {/if}
        </div>

      {:else}
        <!-- No Data State -->
        <div class="card text-center py-16">
          <svg class="mx-auto h-12 w-12 text-deep-navy-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 class="text-lg font-semibold text-deep-navy-900 mb-2">Impact metrics coming soon</h3>
          <p class="text-deep-navy-700">We're working to display our real-time impact data.</p>
        </div>
      {/if}
    </div>
  </main>
</div>
  async function refreshImpact() {
    loading = true;
    errorMessage = null;
    try {
      await invalidateAll();
    } catch (e: any) {
      errorMessage = e?.message || 'Failed to refresh';
    } finally {
      loading = false;
    }
  }
