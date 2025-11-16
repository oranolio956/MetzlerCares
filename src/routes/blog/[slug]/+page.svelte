<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { sanityClient, queries, sanityHelpers, urlFor } from '$lib/utils/sanity'
  import { PortableText } from '@portabletext/svelte'
  import { fade } from 'svelte/transition'
  
  interface BlogPost {
    _id: string
    title: string
    slug: { current: string }
    excerpt: string
    content: any[]
    featuredImage: any
    publishedAt: string
    readTime: number
    tags: string[]
    author: {
      name: string
      title: string
      image: any
      bio: string
    }
    pillarPage: {
      title: string
      slug: { current: string }
      metaDescription: string
    }
  }
  
  interface RelatedPost {
    _id: string
    title: string
    slug: { current: string }
    excerpt: string
    featuredImage: any
    publishedAt: string
    readTime: number
    author: {
      name: string
      image: any
    }
  }
  
  let post: BlogPost | null = null
  let relatedPosts: RelatedPost[] = []
  let loading = true
  let error = ''
  let shareMenuOpen = false
  
  // Get slug from URL
  $: slug = $page.params.slug
  
  async function loadPost() {
    loading = true
    error = ''
    
    try {
      // Fetch the blog post
      post = await sanityClient.fetch(queries.getBlogPostBySlug(slug || ''), { slug: slug || '' })
      
      if (!post) {
        error = 'Blog post not found'
        loading = false
        return
      }
      
      // Fetch related posts
      const related = await sanityClient.fetch(
        queries.getRelatedBlogPosts(post._id, post.tags, 3),
        { postId: post._id, tags: post.tags }
      )
      relatedPosts = related || []
      
      // Update reading time if not set
      if (!post.readTime && post.content) {
        post.readTime = sanityHelpers.calculateReadingTime(post.content)
      }
      
    } catch (err) {
      error = 'Failed to load blog post'
      console.error('Error loading post:', err)
    } finally {
      loading = false
    }
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  function shareOnTwitter() {
    if (!post) return
    const text = encodeURIComponent(`Check out "${post.title}" by ${post.author.name} @MetzlerFoundations`)
    const url = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }
  
  function shareOnLinkedIn() {
    if (!post) return
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
  }
  
  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href)
    shareMenuOpen = false
    // You could add a toast notification here
  }
  
  function scrollToSection(id: string) {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  onMount(() => {
    loadPost()
  })
</script>

<svelte:head>
  {#if post}
    <title>{post.title} - Metzler Foundations</title>
    <meta name="description" content={post.excerpt} />
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.excerpt} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
    {#if post.featuredImage}
      <meta property="og:image" content={urlFor(post.featuredImage).width(1200).height(630).url()} />
    {/if}
    <meta property="article:published_time" content={post.publishedAt} />
    <meta property="article:author" content={post.author.name} />
    <meta property="article:tag" content={post.tags.join(', ')} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@MetzlerFoundations" />
    <meta name="twitter:creator" content="@MetzlerFoundations" />
  {/if}
</svelte:head>

<div class="min-h-screen bg-warm-cream">
  {#if loading}
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div class="h-64 bg-gray-200 rounded-lg mb-8"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  {:else if error}
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <div class="text-red-600 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
        <p class="text-gray-600 mb-4">{error}</p>
        <a href="/blog" class="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Blog
        </a>
      </div>
    </div>
  {:else if post}
    <!-- Hero Section -->
    <section class="bg-white border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav class="mb-8">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" class="hover:text-gray-900">Home</a>
            <span>/</span>
            <a href="/blog" class="hover:text-gray-900">Blog</a>
            <span>/</span>
            <span class="text-gray-900">{post.pillarPage?.title || 'Article'}</span>
          </div>
        </nav>
        
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {post.pillarPage?.title || 'Recovery'}
            </span>
            <span class="text-gray-500 text-sm">
              {formatDate(post.publishedAt)}
            </span>
            <span class="text-gray-500 text-sm">
              {post.readTime} min read
            </span>
          </div>
          
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p class="text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        
        <!-- Author Info -->
        <div class="flex items-center gap-4">
          {#if post.author.image}
            <img
              src={urlFor(post.author.image).width(64).height(64).fit('crop').quality(85).url()}
              alt={post.author.name}
              class="w-16 h-16 rounded-full object-cover"
              loading="lazy"
            />
          {/if}
          <div>
            <p class="font-semibold text-gray-900">{post.author.name}</p>
            <p class="text-gray-600">{post.author.title}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Image -->
    {#if post.featuredImage}
      <section class="bg-gray-100">
        <div class="max-w-6xl mx-auto">
          <img
            src={urlFor(post.featuredImage).width(1200).height(675).fit('crop').quality(90).url()}
            alt={post.featuredImage.alt || post.title}
            class="w-full h-auto max-h-[60vh] object-cover"
            loading="lazy"
          />
        </div>
      </section>
    {/if}

    <!-- Article Content -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article class="prose prose-lg max-w-none">
          <PortableText value={post.content} />
        </article>
        
        <!-- Tags -->
        {#if post.tags && post.tags.length > 0}
          <div class="mt-12 pt-8 border-t border-gray-200">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Tags</h3>
            <div class="flex flex-wrap gap-2">
              {#each post.tags as tag}
                <a
                  href="/blog?tag={encodeURIComponent(tag)}"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </a>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Share Section -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">Share this article</h3>
            <div class="relative">
              <button
                onclick={() => shareMenuOpen = !shareMenuOpen}
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
              
              {#if shareMenuOpen}
                <div transition:fade class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div class="py-1">
                    <button
                      onclick={shareOnTwitter}
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </button>
                    <button
                      onclick={shareOnLinkedIn}
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                    <button
                      onclick={copyToClipboard}
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Author Bio -->
    <section class="bg-gray-50 border-t border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-start gap-6">
          {#if post.author.image}
            <img
              src={urlFor(post.author.image).width(80).height(80).fit('crop').quality(85).url()}
              alt={post.author.name}
              class="w-20 h-20 rounded-full object-cover flex-shrink-0"
              loading="lazy"
            />
          {/if}
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">About {post.author.name}</h3>
            <p class="text-gray-600 leading-relaxed">{post.author.bio}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Posts -->
    {#if relatedPosts.length > 0}
      <section class="py-16 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {#each relatedPosts as relatedPost}
              <article class="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {#if relatedPost.featuredImage}
                  <img
                    src={urlFor(relatedPost.featuredImage).width(400).height(225).fit('crop').quality(85).url()}
                    alt={relatedPost.featuredImage.alt || relatedPost.title}
                    class="w-full h-48 object-cover"
                    loading="lazy"
                  />
                {/if}
                <div class="p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <a href="/blog/{relatedPost.slug.current}" class="hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </a>
                  </h3>
                  <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    {relatedPost.excerpt}
                  </p>
                  <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(relatedPost.publishedAt)}</span>
                    <span>{relatedPost.readTime} min read</span>
                  </div>
                </div>
              </article>
            {/each}
          </div>
        </div>
      </section>
    {/if}
  {/if}
</div>