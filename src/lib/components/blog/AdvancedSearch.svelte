<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import SearchWithSuggestions from './SearchWithSuggestions.svelte'
  
  export let searchQuery = ''
  export let selectedTag = ''
  export let selectedAuthor = ''
  export let selectedPillar = ''
  export let dateFrom = ''
  export let dateTo = ''
  export let sortBy = 'publishedAt'
  export let sortOrder = 'desc'
  export let readTimeMin = ''
  export let readTimeMax = ''
  
  export let availableTags: string[] = []
  export let availableAuthors: Array<{_id: string, name: string}> = []
  export let availablePillars: Array<{_id: string, title: string}> = []
  
  let isExpanded = false
  
  const dispatch = createEventDispatcher()
  
  function applyFilters() {
    dispatch('filter', {
      searchQuery,
      selectedTag,
      selectedAuthor,
      selectedPillar,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      readTimeMin,
      readTimeMax
    })
  }
  
  function clearAllFilters() {
    searchQuery = ''
    selectedTag = ''
    selectedAuthor = ''
    selectedPillar = ''
    dateFrom = ''
    dateTo = ''
    sortBy = 'publishedAt'
    sortOrder = 'desc'
    readTimeMin = ''
    readTimeMax = ''
    applyFilters()
  }
  
  function hasActiveFilters() {
    return searchQuery || selectedTag || selectedAuthor || selectedPillar || 
           dateFrom || dateTo || sortBy !== 'publishedAt' || sortOrder !== 'desc' ||
           readTimeMin || readTimeMax
  }
  
  $: applyFilters()
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-sm">
  <!-- Basic Search Bar -->
  <div class="p-4 border-b border-gray-200">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <SearchWithSuggestions
          bind:searchQuery
          on:search={(e) => {
            searchQuery = e.detail.query
            dispatch('filter', {
              searchQuery,
              selectedTag,
              selectedAuthor,
              selectedPillar,
              dateFrom,
              dateTo,
              sortBy,
              sortOrder,
              readTimeMin,
              readTimeMax
            })
          }}
        />
      </div>
      
      <div class="flex gap-2">
        <button
          on:click={() => isExpanded = !isExpanded}
          class="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {#if hasActiveFilters()}
            <span class="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Active</span>
          {/if}
        </button>
        
        {#if hasActiveFilters()}
          <button
            on:click={clearAllFilters}
            class="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Advanced Filters -->
  {#if isExpanded}
    <div class="p-6 border-b border-gray-200 bg-gray-50">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Tag Filter -->
        <div>
          <label for="tag-filter" class="block text-sm font-medium text-gray-700 mb-2">Topic/Tag</label>
          <select
            id="tag-filter"
            bind:value={selectedTag}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Topics</option>
            {#each availableTags as tag}
              <option value={tag}>{tag}</option>
            {/each}
          </select>
        </div>
        
        <!-- Author Filter -->
        <div>
          <label for="author-filter" class="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <select
            id="author-filter"
            bind:value={selectedAuthor}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Authors</option>
            {#each availableAuthors as author}
              <option value={author._id}>{author.name}</option>
            {/each}
          </select>
        </div>
        
        <!-- Pillar Filter -->
        <div>
          <label for="pillar-filter" class="block text-sm font-medium text-gray-700 mb-2">Content Hub</label>
          <select
            id="pillar-filter"
            bind:value={selectedPillar}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Hubs</option>
            {#each availablePillars as pillar}
              <option value={pillar._id}>{pillar.title}</option>
            {/each}
          </select>
        </div>
        
        <!-- Date Range -->
        <div>
          <label for="date-from" class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            id="date-from"
            type="date"
            bind:value={dateFrom}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label for="date-to" class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            id="date-to"
            type="date"
            bind:value={dateTo}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <!-- Read Time Filter -->
        <div>
          <label for="read-time-min" class="block text-sm font-medium text-gray-700 mb-2">Reading Time (minutes)</label>
          <div class="flex gap-2">
            <input
              type="number"
              bind:value={readTimeMin}
              placeholder="Min"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="self-center text-gray-500">to</span>
            <input
              type="number"
              bind:value={readTimeMax}
              placeholder="Max"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <!-- Sort Options -->
        <div>
          <label for="sort-by" class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            id="sort-by"
            bind:value={sortBy}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="publishedAt">Publish Date</option>
            <option value="title">Title</option>
            <option value="readTime">Reading Time</option>
          </select>
        </div>
        
        <div>
          <label for="sort-order" class="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
          <select
            id="sort-order"
            bind:value={sortOrder}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  {/if}
</div>