<script lang="ts">
  import { onMount } from 'svelte'
  import { enhance } from '$app/forms'
  import { seoAnalyticsTracker } from '$lib/utils/seo-analytics'

  export let data
  export let form

  let analyticsData: any = null
  let keywordRankings: any[] = []
  let competitorAnalysis: any = null
  let loading = true

  $: automationStatus = data.automationStatus

  onMount(async () => {
    await loadSEOData()
  })

  async function loadSEOData() {
    try {
      loading = true

      // Generate sample analytics data
      analyticsData = generateSampleAnalytics()

      // Get keyword rankings
      keywordRankings = generateSampleKeywordRankings()

      // Get competitor analysis
      const keywords = keywordRankings.map(k => k.keyword)
      competitorAnalysis = await seoAnalyticsTracker.analyzeCompetitorGaps(keywords)
    } catch (error) {
      console.error('Error loading SEO data:', error)
    } finally {
      loading = false
    }
  }

  function generateSampleAnalytics() {
    return {
      totalImpressions: 15420,
      totalClicks: 1234,
      avgCTR: 8.01,
      avgPosition: 7.3,
      topPerformingPages: [
        {
          page_slug: 'denver-detox-colorado-detox-centers',
          city: 'Denver',
          service: 'detox',
          clicks: 234,
          position: 3
        },
        {
          page_slug: 'colorado-springs-sober-living-colorado-sober-living',
          city: 'Colorado Springs',
          service: 'sober-living',
          clicks: 189,
          position: 5
        },
        {
          page_slug: 'fort-collins-detox-fort-collins-detox',
          city: 'Fort Collins',
          service: 'detox',
          clicks: 156,
          position: 2
        }
      ],
      improvementOpportunities: [
        {
          page_slug: 'denver-rehab-denver-drug-rehab',
          city: 'Denver',
          service: 'rehab',
          position: 12,
          potential: 'high'
        },
        {
          page_slug: 'boulder-rehab-boulder-addiction-treatment',
          city: 'Boulder',
          service: 'rehab',
          position: 15,
          potential: 'medium'
        }
      ]
    }
  }

  function generateSampleKeywordRankings() {
    return [
      { keyword: 'colorado detox centers', position: 8, searchVolume: 2400, competition: 'medium', trend: 'up' },
      { keyword: 'denver drug rehab', position: 12, searchVolume: 1800, competition: 'high', trend: 'stable' },
      { keyword: 'colorado springs sober living', position: 5, searchVolume: 900, competition: 'low', trend: 'up' },
      {
        keyword: 'boulder addiction treatment',
        position: 15,
        searchVolume: 1200,
        competition: 'medium',
        trend: 'down'
      },
      { keyword: 'fort collins detox', position: 3, searchVolume: 600, competition: 'low', trend: 'up' }
    ]
  }

  function getTrendIcon(trend: string) {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      default:
        return '➡️'
    }
  }
</script>

<svelte:head>
  <title>SEO Dashboard - Metzler Cares Colorado Rehab</title>
  <meta
    name="description"
    content="Advanced SEO analytics dashboard for Colorado rehab, detox, and sober living services"
  />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">SEO Analytics Dashboard</h1>
      <p class="text-gray-600">Colorado Rehab, Detox & Sober Living SEO Performance</p>
    </div>

    <!-- Automation Controls -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Automation Controls</h2>

      {#if form?.message}
        <div class="mb-4 p-4 rounded-md {form.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}">
          {form.message}
        </div>
      {/if}

      <div class="grid md:grid-cols-2 gap-6">
        <div class="border rounded-lg p-4">
          <h3 class="font-medium text-gray-900 mb-2">Content Generation</h3>
          <p class="text-sm text-gray-600 mb-4">
            Generate SEO content for all cities and service types based on templates.
          </p>
          <div class="flex justify-between items-center">
            <div class="text-sm">
              <span class="text-gray-500">Generated:</span>
              <span class="font-medium">{automationStatus.generatedPages} pages</span>
            </div>
            <form method="POST" action="?/generateContent" use:enhance>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                disabled={automationStatus.isRunning}
              >
                {automationStatus.isRunning ? 'Running...' : 'Run Full Generation'}
              </button>
            </form>
          </div>
        </div>

        <div class="border rounded-lg p-4">
          <h3 class="font-medium text-gray-900 mb-2">Bulk Indexing</h3>
          <p class="text-sm text-gray-600 mb-4">
            Submit all generated URLs to Google Indexing API for rapid discovery.
          </p>
          <div class="flex justify-between items-center">
            <div class="text-sm">
              <span class="text-gray-500">Indexed:</span>
              <span class="font-medium">{automationStatus.indexedPages} URLs</span>
            </div>
            <form method="POST" action="?/triggerIndexing" use:enhance>
              <button
                type="submit"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                disabled={automationStatus.isRunning}
              >
                {automationStatus.isRunning ? 'Running...' : 'Trigger Indexing'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {#if automationStatus.lastRun}
        <div class="mt-4 text-xs text-gray-500 text-right">
          Last run: {new Date(automationStatus.lastRun).toLocaleString()}
        </div>
      {/if}
    </div>

    {#if loading}
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p class="text-gray-600">Loading SEO data...</p>
        </div>
      </div>
    {:else if analyticsData}
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Total Impressions</div>
          <div class="text-2xl font-bold text-gray-900">{analyticsData.totalImpressions.toLocaleString()}</div>
          <div class="text-sm text-green-600 mt-1">+12% from last week</div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Total Clicks</div>
          <div class="text-2xl font-bold text-gray-900">{analyticsData.totalClicks.toLocaleString()}</div>
          <div class="text-sm text-green-600 mt-1">+8% from last week</div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Average CTR</div>
          <div class="text-2xl font-bold text-gray-900">{analyticsData.avgCTR}%</div>
          <div class="text-sm text-blue-600 mt-1">Industry avg: 6.2%</div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-sm font-medium text-gray-500 mb-1">Average Position</div>
          <div class="text-2xl font-bold text-gray-900">#{analyticsData.avgPosition}</div>
          <div class="text-sm text-green-600 mt-1">Improved by 2.1 positions</div>
        </div>
      </div>

      <!-- Keyword Rankings -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Keyword Rankings</h2>
          <p class="text-sm text-gray-600">Colorado rehab, detox & sober living keywords</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >Search Volume</th
                >
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >Competition</th
                >
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each keywordRankings as keyword}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {keyword.keyword}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {keyword.position <=
                      5
                        ? 'bg-green-100 text-green-800'
                        : keyword.position <= 10
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'}"
                    >
                      #{keyword.position}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {keyword.searchVolume.toLocaleString()}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {keyword.competition ===
                      'low'
                        ? 'bg-green-100 text-green-800'
                        : keyword.competition === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'}"
                    >
                      {keyword.competition}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getTrendIcon(keyword.trend)}
                    {keyword.trend}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Competitor Analysis -->
      {#if competitorAnalysis}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">High Opportunity Keywords</h2>
              <p class="text-sm text-gray-600">Keywords with high search volume and low competition</p>
            </div>
            <div class="p-6">
              {#if competitorAnalysis.highOpportunity.length > 0}
                {#each competitorAnalysis.highOpportunity.slice(0, 5) as opportunity}
                  <div class="flex items-center justify-between py-2">
                    <span class="text-sm font-medium text-gray-900">{opportunity.keyword}</span>
                    <div class="text-right">
                      <div class="text-sm text-gray-600">{opportunity.searchVolume.toLocaleString()} searches</div>
                      <div class="text-xs text-green-600">{opportunity.competition} competition</div>
                    </div>
                  </div>
                {/each}
              {:else}
                <p class="text-gray-500 text-sm">No high opportunity keywords found</p>
              {/if}
            </div>
          </div>

          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Competitor Weaknesses</h2>
              <p class="text-sm text-gray-600">Areas where competitors are vulnerable</p>
            </div>
            <div class="p-6">
              {#if competitorAnalysis.competitorWeaknesses.length > 0}
                {#each competitorAnalysis.competitorWeaknesses.slice(0, 5) as weakness}
                  <div class="mb-4">
                    <div class="text-sm font-medium text-gray-900 mb-1">{weakness.keyword}</div>
                    {#each weakness.weaknesses as w}
                      <div class="text-xs text-gray-600">• {w}</div>
                    {/each}
                  </div>
                {/each}
              {:else}
                <p class="text-gray-500 text-sm">No competitor weaknesses identified</p>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <!-- Top Performing Pages -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Top Performing Pages</h2>
          <p class="text-sm text-gray-600">Pages driving the most organic traffic</p>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            {#each analyticsData.topPerformingPages as page}
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div class="text-sm font-medium text-gray-900">{page.city} {page.service}</div>
                  <div class="text-xs text-gray-600">{page.page_slug}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">{page.clicks} clicks</div>
                  <div class="text-xs text-gray-600">Position #{page.position}</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Improvement Opportunities -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Improvement Opportunities</h2>
          <p class="text-sm text-gray-600">Pages with potential for higher rankings</p>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            {#each analyticsData.improvementOpportunities as opportunity}
              <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <div class="text-sm font-medium text-gray-900">{opportunity.city} {opportunity.service}</div>
                  <div class="text-xs text-gray-600">{opportunity.page_slug}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">Position #{opportunity.position}</div>
                  <div class="text-xs text-yellow-600">{opportunity.potential} potential</div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Action Items -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">Next Steps for SEO Domination</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium text-blue-800 mb-2">Content Strategy</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Create more pages for high-opportunity keywords</li>
              <li>• Optimize existing pages with position 11-20</li>
              <li>• Add FAQ sections for rich snippets</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium text-blue-800 mb-2">Technical SEO</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Improve Core Web Vitals scores</li>
              <li>• Add more schema markup</li>
              <li>• Optimize for mobile-first indexing</li>
            </ul>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-12 text-gray-500">Failed to load SEO data. Please try refreshing the page.</div>
    {/if}
  </div>
</div>
