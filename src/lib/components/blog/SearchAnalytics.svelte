<script lang="ts">
  import { onMount } from 'svelte'
  
  // Extend Window interface for gtag
  interface Window {
    gtag?: (...args: any[]) => void;
  }
  
  interface SearchAnalytics {
    query: string
    filters: {
      tag?: string
      author?: string
      pillar?: string
      dateFrom?: string
      dateTo?: string
      readTimeMin?: number
      readTimeMax?: number
    }
    resultsCount: number
    timestamp: string
    userAgent?: string
    referrer?: string
  }
  
  export let searchQuery = ''
  export let selectedTag = ''
  export let selectedAuthor = ''
  export let selectedPillar = ''
  export let dateFrom = ''
  export let dateTo = ''
  export let readTimeMin = ''
  export let readTimeMax = ''
  export let resultsCount = 0
  
  let analytics: SearchAnalytics[] = []
  let showAnalytics = false
  
  onMount(() => {
    // Load existing analytics from localStorage
    const stored = localStorage.getItem('blogSearchAnalytics')
    if (stored) {
      try {
        analytics = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to load search analytics:', e)
      }
    }
  })
  
  function trackSearch() {
    if (!searchQuery && !selectedTag && !selectedAuthor && !selectedPillar && 
        !dateFrom && !dateTo && !readTimeMin && !readTimeMax) {
      return // Don't track empty searches
    }
    
    const searchData: SearchAnalytics = {
      query: searchQuery,
      filters: {
        ...(selectedTag && { tag: selectedTag }),
        ...(selectedAuthor && { author: selectedAuthor }),
        ...(selectedPillar && { pillar: selectedPillar }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        ...(readTimeMin && { readTimeMin: parseInt(readTimeMin) }),
        ...(readTimeMax && { readTimeMax: parseInt(readTimeMax) })
      },
      resultsCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    }
    
    analytics = [searchData, ...analytics].slice(0, 100) // Keep last 100 searches
    
    // Save to localStorage
    try {
      localStorage.setItem('blogSearchAnalytics', JSON.stringify(analytics))
    } catch (e) {
      console.error('Failed to save search analytics:', e)
    }
    
    // Send to analytics endpoint (if available)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'blog_search', {
        search_term: searchQuery,
        custom_map: {
          dimension1: selectedTag || 'all',
          dimension2: selectedAuthor || 'all',
          dimension3: selectedPillar || 'all',
          metric1: resultsCount
        }
      })
    }
  }
  
  function clearAnalytics() {
    if (confirm('Are you sure you want to clear all search analytics data?')) {
      analytics = []
      localStorage.removeItem('blogSearchAnalytics')
    }
  }
  
  function exportAnalytics() {
    const dataStr = JSON.stringify(analytics, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `blog-search-analytics-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  
  function getPopularSearches() {
    const queryCounts: Record<string, number> = {}
    analytics.forEach(search => {
      if (search.query) {
        queryCounts[search.query] = (queryCounts[search.query] || 0) + 1
      }
    })
    
    return Object.entries(queryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
  }
  
  function getPopularFilters() {
    const filterCounts: Record<string, number> = {}
    analytics.forEach(search => {
      Object.entries(search.filters).forEach(([key, value]) => {
        const filterKey = `${key}:${value}`
        filterCounts[filterKey] = (filterCounts[filterKey] || 0) + 1
      })
    })
    
    return Object.entries(filterCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
  }
  
  // Track search when filters change
  $: if (searchQuery || selectedTag || selectedAuthor || selectedPillar || 
         dateFrom || dateTo || readTimeMin || readTimeMax) {
    trackSearch()
  }
  
  // Popular searches
  $: popularSearches = getPopularSearches()
  $: popularFilters = getPopularFilters()
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-sm">
  <div class="p-4 border-b border-gray-200 flex items-center justify-between">
    <h3 class="text-lg font-medium text-gray-900">Search Analytics</h3>
    <div class="flex gap-2">
      <button
        on:click={exportAnalytics}
        class="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        disabled={analytics.length === 0}
      >
        Export Data
      </button>
      <button
        on:click={clearAnalytics}
        class="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        disabled={analytics.length === 0}
      >
        Clear Data
      </button>
      <button
        on:click={() => showAnalytics = !showAnalytics}
        class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {showAnalytics ? 'Hide' : 'Show'} Details
      </button>
    </div>
  </div>
  
  {#if showAnalytics}
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Popular Searches -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Popular Search Terms</h4>
          {#if popularSearches.length > 0}
            <div class="space-y-2">
              {#each popularSearches as [query, count]}
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-700 truncate">{query}</span>
                  <span class="text-gray-500 bg-gray-100 px-2 py-1 rounded">{count}</span>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-gray-500">No search data available</p>
          {/if}
        </div>
        
        <!-- Popular Filters -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Popular Filters</h4>
          {#if popularFilters.length > 0}
            <div class="space-y-2">
              {#each popularFilters as [filter, count]}
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-700 truncate">{filter}</span>
                  <span class="text-gray-500 bg-gray-100 px-2 py-1 rounded">{count}</span>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-gray-500">No filter data available</p>
          {/if}
        </div>
      </div>
      
      <!-- Recent Searches -->
      <div class="mt-6">
        <h4 class="text-sm font-medium text-gray-900 mb-3">Recent Searches ({analytics.length})</h4>
        {#if analytics.length > 0}
          <div class="space-y-2 max-h-64 overflow-y-auto">
            {#each analytics.slice(0, 10) as search}
              <div class="p-3 bg-gray-50 rounded-lg">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      {search.query || 'No search term'}
                    </p>
                    {#if Object.keys(search.filters).length > 0}
                      <p class="text-xs text-gray-600 mt-1">
                        Filters: {Object.entries(search.filters).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    {/if}
                  </div>
                  <div class="text-right ml-4">
                    <p class="text-xs text-gray-500">{search.resultsCount} results</p>
                    <p class="text-xs text-gray-400">{new Date(search.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-sm text-gray-500">No search analytics data available</p>
        {/if}
      </div>
    </div>
  {/if}
</div>