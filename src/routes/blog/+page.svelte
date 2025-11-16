<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { sanityClient, queries, sanityHelpers, urlFor } from '$lib/utils/sanity'
  import AdvancedSearch from '$lib/components/blog/AdvancedSearch.svelte'
  import SearchAnalytics from '$lib/components/blog/SearchAnalytics.svelte'
  
  interface BlogPost {
    _id: string
    title: string
    slug: { current: string }
    excerpt: string
    featuredImage: any
    publishedAt: string
    readTime: number
    tags: string[]
    author: {
      _id: string
      name: string
      title: string
      image: any
    }
    pillarPage: {
      _id: string
      title: string
      slug: { current: string }
    }
  }
  
  interface Author {
    _id: string
    name: string
    title: string
    image: any
  }
  
  interface PillarPage {
    _id: string
    title: string
    slug: { current: string }
  }
  
  let posts: BlogPost[] = []
  let loading = true
  let error = ''
  let currentPage = 1
  let totalPages = 1
  let postsPerPage = 12
  let totalPosts = 0
  
  // Advanced search state
  let searchQuery = ''
  let selectedTag = ''
  let selectedAuthor = ''
  let selectedPillar = ''
  let dateFrom = ''
  let dateTo = ''
  let readTimeMin = ''
  let readTimeMax = ''
  let sortBy = 'publishedAt'
  let sortOrder = 'desc'
  
  // Filter options
  let allTags: string[] = []
  let allAuthors: Author[] = []
  let allPillars: PillarPage[] = []
  
  $: currentPage, loadPosts()
  $: searchFiltersChanged()
  
  function searchFiltersChanged() {
    // Debounced search
    setTimeout(() => {
      currentPage = 1
      loadPosts()
    }, 300)
  }
  
  async function loadFilterOptions() {
    try {
      const [tags, authors, pillars] = await Promise.all([
        sanityClient.fetch(queries.getAllTags()),
        sanityClient.fetch(queries.getAllAuthors()),
        sanityClient.fetch(queries.getPillarPages())
      ])
      
      allTags = tags || []
      allAuthors = authors || []
      allPillars = pillars || []
    } catch (err) {
      console.error('Error loading filter options:', err)
    }
  }
  
  async function loadPosts() {
    loading = true
    error = ''
    
    try {
      const offset = (currentPage - 1) * postsPerPage
      
      // Prepare search options
      const searchOptions = {
        query: searchQuery,
        tag: selectedTag,
        author: selectedAuthor,
        pillar: selectedPillar,
        dateFrom,
        dateTo,
        readTimeMin: readTimeMin ? parseInt(readTimeMin) : 0,
        readTimeMax: readTimeMax ? parseInt(readTimeMax) : 0,
        sortBy,
        sortOrder,
        limit: postsPerPage,
        offset
      }
      
      // Get posts and total count in parallel
      const [postsResult, countResult] = await Promise.all([
        sanityClient.fetch(queries.advancedSearchBlogPosts(searchOptions)),
        sanityClient.fetch(queries.countBlogPosts(searchOptions))
      ])
      
      posts = postsResult || []
      totalPosts = countResult || 0
      totalPages = Math.ceil(totalPosts / postsPerPage) || 1
      
    } catch (err) {
      error = 'Failed to load blog posts'
      console.error('Error loading posts:', err)
    } finally {
      loading = false
    }
  }
  
  function handleAdvancedSearch(event: CustomEvent) {
    const filters = event.detail
    searchQuery = filters.searchQuery
    selectedTag = filters.selectedTag
    selectedAuthor = filters.selectedAuthor
    selectedPillar = filters.selectedPillar
    dateFrom = filters.dateFrom
    dateTo = filters.dateTo
    readTimeMin = filters.readTimeMin
    readTimeMax = filters.readTimeMax
    sortBy = filters.sortBy
    sortOrder = filters.sortOrder
    currentPage = 1
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }
  
  onMount(() => {
    loadFilterOptions()
    loadPosts()
  })
</script>

<svelte:head>
  <title>Thought Leadership Blog - Metzler Foundations</title>
  <meta name="description" content="Expert insights on sober living, recovery support, and nonprofit innovation from Metzler Foundations." />
  <meta property="og:title" content="Thought Leadership Blog - Metzler Foundations" />
  <meta property="og:description" content="Expert insights on sober living, recovery support, and nonprofit innovation." />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="min-h-screen bg-warm-cream">
  <!-- Hero Section -->
  <section class="bg-deep-navy-900 text-soft-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Thought Leadership
        </h1>
        <p class="text-xl text-cream text-opacity-80 max-w-3xl mx-auto">
          Expert insights on sober living, recovery support, and nonprofit innovation that drives measurable impact in our communities.
        </p>
      </div>
    </div>
  </section>

  <!-- Advanced Search Section -->
  <section class="bg-white border-b border-gray-200 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdvancedSearch
        bind:searchQuery
        bind:selectedTag
        bind:selectedAuthor
        bind:selectedPillar
        bind:dateFrom
        bind:dateTo
        bind:readTimeMin
        bind:readTimeMax
        bind:sortBy
        bind:sortOrder
        availableTags={allTags}
        availableAuthors={allAuthors}
        availablePillars={allPillars}
        on:filter={handleAdvancedSearch}
      />
    </div>
  </section>

  <!-- Search Analytics Section (for staff/admin users) -->
  <section class="py-8 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SearchAnalytics
        {searchQuery}
        {selectedTag}
        {selectedAuthor}
        {selectedPillar}
        {dateFrom}
        {dateTo}
        {readTimeMin}
        {readTimeMax}
        resultsCount={totalPosts}
      />
    </div>
  </section>

  <!-- Blog Posts Grid -->
  <section class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Results Summary -->
      {#if !loading && totalPosts > 0}
        <div class="mb-8 flex items-center justify-between">
          <div class="text-gray-600">
            Showing {posts.length} of {totalPosts} article{totalPosts !== 1 ? 's' : ''}
            {#if searchQuery || selectedTag || selectedAuthor || selectedPillar || dateFrom || dateTo || readTimeMin || readTimeMax}
              <span class="text-gray-500"> • 
                {#if searchQuery}Search: "{searchQuery}"{/if}
                {#if selectedTag} • Topic: {selectedTag}{/if}
                {#if selectedAuthor} • Author selected{/if}
                {#if selectedPillar} • Hub selected{/if}
                {#if dateFrom || dateTo} • Date range{/if}
                {#if readTimeMin || readTimeMax} • Reading time filter{/if}
              </span>
            {/if}
          </div>
          
          <div class="text-sm text-gray-500">
            Sorted by {sortBy === 'publishedAt' ? 'publish date' : sortBy === 'title' ? 'title' : 'reading time'} ({sortOrder === 'desc' ? 'newest first' : 'oldest first'})
          </div>
        </div>
      {/if}
      
      {#if loading}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each Array(6) as _, i}
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div class="h-48 bg-gray-200"></div>
              <div class="p-6">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-6 bg-gray-200 rounded mb-4"></div>
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-4 bg-gray-200 rounded mb-4"></div>
                <div class="flex justify-between items-center">
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
                  <div class="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else if error}
        <div class="text-center py-12">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p class="text-gray-600 mb-4">{error}</p>
          <button
            onclick={loadPosts}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      {:else if posts.length === 0}
        <div class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
          <button
            onclick={() => {
              searchQuery = ''
              selectedTag = ''
              selectedAuthor = ''
              selectedPillar = ''
              dateFrom = ''
              dateTo = ''
              readTimeMin = ''
              readTimeMax = ''
              currentPage = 1
            }}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each posts as post}
            <article class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {#if post.featuredImage}
                <div class="aspect-w-16 aspect-h-9">
                  <img
                    src={urlFor(post.featuredImage).width(400).height(225).fit('crop').quality(85).url()}
                    alt={post.featuredImage.alt || post.title}
                    class="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </div>
              {/if}
              
              <div class="p-6">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-sm text-blue-600 font-medium">
                    {post.pillarPage?.title || 'Recovery'}
                  </span>
                  <span class="text-gray-400">•</span>
                  <span class="text-sm text-gray-500">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                
                <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  <a href="/blog/{post.slug.current}" class="hover:text-blue-600 transition-colors">
                    {post.title}
                  </a>
                </h2>
                
                <p class="text-gray-600 mb-4 line-clamp-3">
                  {truncateText(post.excerpt, 150)}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    {#if post.author?.image}
                      <img
                        src={urlFor(post.author.image).width(32).height(32).fit('crop').quality(85).url()}
                        alt={post.author.name}
                        class="w-8 h-8 rounded-full object-cover"
                        loading="lazy"
                      />
                    {/if}
                    <div>
                      <p class="text-sm font-medium text-gray-900">{post.author?.name}</p>
                      <p class="text-xs text-gray-500">{post.author?.title}</p>
                    </div>
                  </div>
                  
                  {#if post.readTime}
                    <span class="text-sm text-gray-500">
                      {post.readTime} min read
                    </span>
                  {/if}
                </div>
                
                {#if post.tags && post.tags.length > 0}
                  <div class="mt-4 flex flex-wrap gap-2">
                    {#each post.tags.slice(0, 3) as tag}
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- Pagination -->
  {#if totalPages > 1 && !loading && posts.length > 0}
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-center gap-2">
          <button
            onclick={() => currentPage > 1 && currentPage--}
            disabled={currentPage === 1}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {#each Array(totalPages) as _, i}
            {@const page = i + 1}
            <button
              onclick={() => currentPage = page}
              class="px-4 py-2 text-sm font-medium rounded-lg {currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}"
            >
              {page}
            </button>
          {/each}
          
          <button
            onclick={() => currentPage < totalPages && currentPage++}
            disabled={currentPage === totalPages}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  {/if}
</div>