<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { sanityClient } from '$lib/utils/sanity'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import type { PageData, FormError, TableOfContentsItem } from '$lib/types'

  // export let data // Removed unused export

  let pageData: PageData | null = null
  let loading = true
  let error: FormError | null = null
  let tableOfContents: TableOfContentsItem[] = []
  let showTOC = false

  onMount(async () => {
    await loadPageData()
  })

  async function loadPageData() {
    try {
      loading = true
      error = null

      const slug = $page.params.slug

      // Check if Sanity client is available
      if (!sanityClient) {
        error = { message: 'Content management system not available' }
        loading = false
        return
      }

      // Query for pillar page first
      let query = `*[_type == "pillarPage" && slug.current == $slug && isPublished == true][0]{
        _type,
        title,
        slug,
        metaDescription,
        heroImage,
        heroTitle,
        heroSubtitle,
        content,
        targetKeywords,
        relatedClusterPages[]->{
          title,
          slug,
          excerpt,
          featuredImage
        },
        publishedAt,
        tableOfContents
      }`

      let result = await sanityClient.fetch(query, { slug })

      // If no pillar page found, try cluster page
      if (!result) {
        query = `*[_type == "clusterPage" && slug.current == $slug && isPublished == true][0]{
          _type,
          title,
          slug,
          excerpt,
          featuredImage,
          pillarPage->{
            title,
            slug
          },
          content,
          tags,
          readTime,
          author->{
            name,
            title
          },
          publishedAt
        }`

        result = await sanityClient.fetch(query, { slug })
      }

      if (!result) {
        error = { message: 'Page not found' }
        return
      }

      pageData = result

      // Generate table of contents for pillar pages
      if (pageData && pageData._type === 'pillarPage' && pageData.tableOfContents && pageData.content) {
        generateTableOfContents(Array.isArray(pageData.content) ? pageData.content : [])
        showTOC = true
      }
    } catch (err) {
      console.error('Error loading page:', err)
      error = { message: 'Failed to load page content' }
    } finally {
      loading = false
    }
  }

  function generateTableOfContents(content: any[]) {
    tableOfContents = []
    let headingCount = 0

    content.forEach((block, index) => {
      if (block._type === 'block' && block.style && block.style.startsWith('h')) {
        const level = parseInt(block.style.replace('h', ''))
        if (level >= 2 && level <= 3) {
          // Only h2 and h3 for TOC
          headingCount++
          tableOfContents.push({
            id: `heading-${headingCount}`,
            text: block.children?.[0]?.text || 'Heading',
            level: level,
            index: index
          })

          // Add ID to the block for anchor linking
          block._key = `heading-${headingCount}`
        }
      }
    })
  }

  function scrollToHeading(headingId: string) {
    const element = document.getElementById(headingId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Schema.org structured data
  $: structuredData = pageData ? generateStructuredData(pageData) : null

  function generateStructuredData(page: any) {
    const baseData = {
      '@context': 'https://schema.org',
      publisher: {
        '@type': 'Organization',
        name: 'Metzler Foundations',
        url: 'https://metzlerfoundations.org',
        logo: 'https://metzlerfoundations.org/logo.svg'
      }
    }

    if (page._type === 'pillarPage') {
      return {
        ...baseData,
        '@type': 'Article',
        headline: page.title,
        description: page.metaDescription || page.excerpt,
        image: page.heroImage?.asset?.url,
        datePublished: page.publishedAt,
        author: {
          '@type': 'Organization',
          name: 'Metzler Foundations'
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://metzlerfoundations.org/resources/${page.slug.current}`
        },
        keywords: page.targetKeywords?.join(', ')
      }
    } else if (page._type === 'clusterPage') {
      return {
        ...baseData,
        '@type': 'Article',
        headline: page.title,
        description: page.excerpt,
        image: page.featuredImage?.asset?.url,
        datePublished: page.publishedAt,
        author: page.author
          ? {
              '@type': 'Person',
              name: page.author.name,
              jobTitle: page.author.title
            }
          : {
              '@type': 'Organization',
              name: 'Metzler Foundations'
            },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://metzlerfoundations.org/resources/${page.slug.current}`
        }
      }
    }

    return baseData
  }
</script>

<svelte:head>
  <title>{pageData?.title || 'Loading...'} - Metzler Foundations</title>
  <meta
    name="description"
    content={pageData?.metaDescription || pageData?.excerpt || 'Resources for sober living and recovery support.'}
  />
  {#if pageData?.targetKeywords}
    <meta name="keywords" content={pageData.targetKeywords.join(', ')} />
  {/if}
  {#if structuredData}
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  {/if}
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
        </button>

        <nav class="hidden md:flex items-center space-x-6">
          <a href="/give-support" class="text-navy hover:text-olive transition-colors duration-200 font-medium">
            Give Support
          </a>
          <a href="/get-aid" class="text-navy hover:text-olive transition-colors duration-200 font-medium">
            Get Financial Aid
          </a>
          <a href="/resources/colorado" class="text-navy hover:text-olive transition-colors duration-200 font-medium">
            Resources
          </a>
        </nav>
      </div>
    </div>
  </header>

  {#if loading}
    <!-- Loading State -->
    <div class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      <span class="ml-3 text-navy">Loading content...</span>
    </div>
  {:else if error}
    <!-- Error State -->
    <div class="max-w-2xl mx-auto px-4 py-16 text-center">
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
          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.01-5.625-2.58a1 1 0 111.25-1.562A6.962 6.962 0 0012 13.5c1.875 0 3.57-.76 4.875-2.02a1 1 0 011.25 1.562A7.962 7.962 0 0112 15z"
        />
      </svg>
      <h1 class="text-2xl font-serif font-medium text-navy mb-2">Content Not Found</h1>
      <p class="text-navy text-opacity-60 mb-6">{error}</p>
      <a href="/resources/colorado" class="btn-primary"> Browse Resources </a>
    </div>
  {:else if pageData}
    <!-- Content Layout -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-4 lg:gap-8">
        <!-- Table of Contents Sidebar (for pillar pages) -->
        {#if showTOC && tableOfContents.length > 0}
          <div class="lg:col-span-1">
            <div class="sticky top-24 bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
              <h3 class="text-lg font-medium text-navy mb-4">Table of Contents</h3>
              <nav class="space-y-2">
                {#each tableOfContents as heading}
                  <button
                    class="block w-full text-left text-sm text-navy hover:text-olive transition-colors py-1 px-2 rounded hover:bg-cream"
                    class:pl-4={heading.level === 3}
                    on:click={() => scrollToHeading(heading.id)}
                  >
                    {heading.text}
                  </button>
                {/each}
              </nav>
            </div>
          </div>
        {/if}

        <!-- Main Content -->
        <div class={showTOC && tableOfContents.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <!-- Hero Section -->
          {#if pageData._type === 'pillarPage' && (pageData.heroImage || pageData.heroTitle)}
            <div class="mb-8">
              {#if pageData.heroImage}
                <img
                  src={pageData.heroImage.asset.url}
                  alt={pageData.heroTitle || pageData.title}
                  class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg mb-6"
                />
              {/if}

              {#if pageData.heroTitle}
                <h1 class="text-3xl md:text-4xl font-serif font-medium text-navy mb-4">
                  {pageData.heroTitle}
                </h1>
              {/if}

              {#if pageData.heroSubtitle}
                <p class="text-xl text-navy text-opacity-80">
                  {pageData.heroSubtitle}
                </p>
              {/if}
            </div>
          {:else if pageData._type === 'clusterPage' && pageData.featuredImage}
            <div class="mb-8">
              <img
                src={pageData.featuredImage.asset.url}
                alt={pageData.title}
                class="w-full h-48 md:h-64 object-cover rounded-lg shadow-lg mb-6"
                loading="lazy"
              />
            </div>
          {/if}

          <!-- Article Header -->
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-serif font-medium text-navy mb-4">
              {pageData.title}
            </h1>

            {#if pageData._type === 'clusterPage' && pageData.excerpt}
              <p class="text-xl text-navy text-opacity-80 mb-4">
                {pageData.excerpt}
              </p>
            {/if}

            <!-- Meta Information -->
            <div
              class="flex flex-wrap items-center gap-4 text-sm text-navy text-opacity-60 border-b border-navy border-opacity-10 pb-4"
            >
              {#if pageData.publishedAt}
                <span>
                  Published {new Date(pageData.publishedAt).toLocaleDateString()}
                </span>
              {/if}

              {#if pageData._type === 'clusterPage' && pageData.readTime}
                <span>• {pageData.readTime} min read</span>
              {/if}

              {#if pageData._type === 'clusterPage' && pageData.author}
                <span>• By {pageData.author.name}</span>
              {/if}

              {#if pageData._type === 'clusterPage' && pageData.pillarPage}
                <span
                  >• Part of <a href="/resources/{pageData.pillarPage.slug.current}" class="text-olive hover:text-navy"
                    >"{pageData.pillarPage.title}"</a
                  ></span
                >
              {/if}
            </div>
          </header>

          <!-- Content -->
          {#if pageData.content}
            <article
              class="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy prose-p:text-navy prose-p:leading-relaxed prose-a:text-olive prose-a:no-underline hover:prose-a:underline prose-strong:text-navy prose-blockquote:border-olive prose-blockquote:text-navy prose-li:text-navy"
            >
              <!-- Render Sanity portable text -->
              {#each pageData.content as block}
                {#if block._type === 'block'}
                  {#if block.style === 'h1'}
                    <h1 id={block._key} class="text-3xl font-serif font-medium text-navy mb-4 mt-8 first:mt-0">
                      {block.children?.[0]?.text}
                    </h1>
                  {:else if block.style === 'h2'}
                    <h2 id={block._key} class="text-2xl font-serif font-medium text-navy mb-3 mt-6">
                      {block.children?.[0]?.text}
                    </h2>
                  {:else if block.style === 'h3'}
                    <h3 id={block._key} class="text-xl font-serif font-medium text-navy mb-2 mt-4">
                      {block.children?.[0]?.text}
                    </h3>
                  {:else if block.style === 'blockquote'}
                    <blockquote class="border-l-4 border-olive pl-4 italic text-navy text-opacity-80 my-6">
                      {block.children?.[0]?.text}
                    </blockquote>
                  {:else}
                    <p class="text-navy leading-relaxed mb-4">{block.children?.[0]?.text}</p>
                  {/if}
                {:else if block._type === 'image'}
                  <figure class="my-8">
                    <img
                      src={block.asset.url}
                      alt={block.alt || ''}
                      class="w-full rounded-lg shadow-md"
                      loading="lazy"
                    />
                    {#if block.caption}
                      <figcaption class="text-center text-sm text-navy text-opacity-60 mt-2">
                        {block.caption}
                      </figcaption>
                    {/if}
                  </figure>
                {/if}
              {/each}
            </article>
          {/if}

          <!-- Tags -->
          {#if pageData._type === 'clusterPage' && pageData.tags}
            <div class="mt-8 pt-6 border-t border-navy border-opacity-10">
              <div class="flex flex-wrap gap-2">
                {#each pageData.tags as tag}
                  <span class="px-3 py-1 bg-olive bg-opacity-10 text-olive text-sm rounded-full">
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Related Cluster Pages (for pillar pages) -->
          {#if pageData._type === 'pillarPage' && pageData.relatedClusterPages && pageData.relatedClusterPages.length > 0}
            <div class="mt-12 pt-8 border-t border-navy border-opacity-10">
              <h2 class="text-2xl font-serif font-medium text-navy mb-6">Related Articles</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each pageData.relatedClusterPages as cluster}
                  <article
                    class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 hover:shadow-md transition-shadow"
                  >
                    {#if cluster.featuredImage}
                      <img
                        src={cluster.featuredImage.asset.url}
                        alt={cluster.title}
                        class="w-full h-32 object-cover rounded-md mb-4"
                        loading="lazy"
                      />
                    {/if}
                    <h3 class="text-lg font-medium text-navy mb-2">
                      <a href="/resources/{cluster.slug.current}" class="hover:text-olive transition-colors">
                        {cluster.title}
                      </a>
                    </h3>
                    {#if cluster.excerpt}
                      <p class="text-navy text-opacity-70 text-sm">{cluster.excerpt}</p>
                    {/if}
                  </article>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
</style>
