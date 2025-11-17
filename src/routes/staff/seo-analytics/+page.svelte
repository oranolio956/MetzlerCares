<!-- SEO Analytics Dashboard for Colorado Recovery Services -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  interface AnalyticsData {
    timestamp: string;
    summary: {
      totalKeywords: number;
      top10Rankings: number;
      avgPosition: string;
      totalTraffic: number;
      trafficGrowth: string;
      keywordGrowth: string;
    };
    keywordMetrics: {
      topPerformers: Array<{
        keyword: string;
        currentPosition: number;
        clicks: number;
      }>;
      opportunities: Array<{
        keyword: string;
        currentPosition: number;
        searchVolume: number;
      }>;
      positionDistribution: {
        top3: number;
        top10: number;
        top20: number;
        top50: number;
        beyond: number;
      };
    };
    competitorMetrics: {
      topCompetitors: Array<{
        domain: string;
        keywords: number;
        traffic: number;
        domainAuthority: number;
      }>;
      marketShare: number;
    };
    technicalMetrics: {
      coreWebVitals: {
        lcp: number;
        fid: number;
        cls: number;
        score: number;
      };
      issues: number;
    };
    topPages: Array<{
      url: string;
      traffic: number;
      keywords: number;
      conversions: number;
    }>;
    keywordMovements: {
      improved: number;
      declined: number;
      newRankings: number;
      lostRankings: number;
    };
    recommendations: string[];
  }
  
  let analyticsData: AnalyticsData | null = null;
  let loading = true;
  let error: string | null = null;
  let selectedLocation = 'all';
  let dateRange = '30d';
  
  // Fetch analytics data
  async function fetchAnalyticsData() {
    loading = true;
    error = null;
    
    try {
      const params = new URLSearchParams({
        type: 'overview',
        location: selectedLocation,
        dateRange
      });
      
      const response = await fetch(`/api/seo/analytics?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      analyticsData = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load analytics data';
      console.error('Analytics fetch error:', err);
    } finally {
      loading = false;
    }
  }
  
  // Format number with commas
  function formatNumber(num: number): string {
    return num.toLocaleString();
  }
  
  // Format percentage
  function formatPercentage(value: string): string {
    const num = parseFloat(value);
    return num > 0 ? `+${value}` : value;
  }
  
  // Get trend color
  function getTrendColor(value: string): string {
    return value.startsWith('+') ? 'text-green-600' : 'text-red-600';
  }
  
  // Refresh data
  function refreshData() {
    fetchAnalyticsData();
  }
  
  onMount(() => {
    fetchAnalyticsData();
  });
</script>

<svelte:head>
  <title>SEO Analytics Dashboard - Colorado Recovery Services | Metzler Cares</title>
  <meta name="description" content="Comprehensive SEO analytics dashboard for Colorado recovery services performance tracking and optimization" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <div class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">SEO Analytics Dashboard</h1>
          <p class="text-gray-600 mt-1">Colorado Recovery Services Performance Tracking</p>
        </div>
        <div class="flex items-center space-x-4">
          <select 
            bind:value={selectedLocation} 
            on:change={fetchAnalyticsData}
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Colorado</option>
            <option value="denver">Denver</option>
            <option value="colorado-springs">Colorado Springs</option>
            <option value="aurora">Aurora</option>
            <option value="fort-collins">Fort Collins</option>
            <option value="lakewood">Lakewood</option>
          </select>
          
          <select 
            bind:value={dateRange} 
            on:change={fetchAnalyticsData}
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button 
            on:click={refreshData}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Data</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div class="mt-4">
              <button 
                on:click={refreshData}
                class="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    {:else if analyticsData}
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Keywords</p>
              <p class="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.summary.totalKeywords)}</p>
              <p class="text-sm text-gray-600">{formatPercentage(analyticsData.summary.keywordGrowth)}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Top 10 Rankings</p>
              <p class="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.summary.top10Rankings)}</p>
              <p class="text-sm text-gray-600">{analyticsData.summary.top10Rankings}/{analyticsData.summary.totalKeywords} keywords</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Avg Position</p>
              <p class="text-2xl font-semibold text-gray-900">#{analyticsData.summary.avgPosition}</p>
              <p class="text-sm text-gray-600">Average ranking</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Organic Traffic</p>
              <p class="text-2xl font-semibold text-gray-900">{formatNumber(analyticsData.summary.totalTraffic)}</p>
              <p class="text-sm {getTrendColor(analyticsData.summary.trafficGrowth)}">{formatPercentage(analyticsData.summary.trafficGrowth)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts and Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Keyword Performance -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Keywords</h3>
          <div class="space-y-4">
            {#each analyticsData.keywordMetrics.topPerformers as keyword}
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{keyword.keyword}</p>
                  <p class="text-xs text-gray-500">Position {keyword.currentPosition}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">{formatNumber(keyword.clicks)}</p>
                  <p class="text-xs text-gray-500">clicks</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Keyword Opportunities -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Keyword Opportunities</h3>
          <div class="space-y-4">
            {#each analyticsData.keywordMetrics.opportunities as opportunity}
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{opportunity.keyword}</p>
                  <p class="text-xs text-gray-500">Position {opportunity.currentPosition}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">{formatNumber(opportunity.searchVolume)}</p>
                  <p class="text-xs text-gray-500">monthly searches</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
      
      <!-- Technical Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Largest Contentful Paint</span>
              <span class="text-sm font-semibold">{analyticsData.technicalMetrics.coreWebVitals.lcp.toFixed(1)}s</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">First Input Delay</span>
              <span class="text-sm font-semibold">{analyticsData.technicalMetrics.coreWebVitals.fid.toFixed(0)}ms</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Cumulative Layout Shift</span>
              <span class="text-sm font-semibold">{analyticsData.technicalMetrics.coreWebVitals.cls.toFixed(3)}</span>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-900">Overall Score</span>
                <span class="text-lg font-bold text-green-600">{analyticsData.technicalMetrics.coreWebVitals.score.toFixed(0)}/100</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Pages</h3>
          <div class="space-y-4">
            {#each analyticsData.topPages as page}
              <div class="border-l-4 border-blue-500 pl-4">
                <p class="text-sm font-medium text-gray-900 truncate">{page.url}</p>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatNumber(page.traffic)} visits</span>
                  <span>{page.keywords} keywords</span>
                  <span>{page.conversions} conversions</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Keyword Movements</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Improved</span>
              <span class="text-sm font-semibold text-green-600">+{analyticsData.keywordMovements.improved}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Declined</span>
              <span class="text-sm font-semibold text-red-600">-{analyticsData.keywordMovements.declined}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">New Rankings</span>
              <span class="text-sm font-semibold text-blue-600">{analyticsData.keywordMovements.newRankings}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Lost Rankings</span>
              <span class="text-sm font-semibold text-orange-600">{analyticsData.keywordMovements.lostRankings}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">SEO Recommendations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each analyticsData.recommendations as recommendation}
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-sm text-gray-700">{recommendation}</p>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Last Updated -->
      <div class="mt-8 text-center text-sm text-gray-500">
        Last updated: {analyticsData.timestamp ? new Date(analyticsData.timestamp).toLocaleString() : 'Loading...'}
      </div>
    {/if}
  </div>
</div>