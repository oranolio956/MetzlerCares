import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Enhanced Sanity client with caching and error handling
export const sanityClient = createClient({
  projectId: 'qxaj7c29',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
  token: process.env.VITE_SANITY_API_TOKEN, // For write operations
  perspective: 'published', // Only show published content by default
})

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// GROQ queries for blog content
export const queries = {
  // Get all published blog posts with pagination
  getBlogPosts: (limit = 10, offset = 0) => `
    *[_type == "clusterPage" && isPublished == true] | order(publishedAt desc) [$offset...$limit] {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      publishedAt,
      readTime,
      tags,
      author->{
        name,
        title,
        image
      },
      pillarPage->{
        title,
        slug
      }
    }
  `,

  // Get single blog post by slug
  getBlogPostBySlug: (slug: string) => `
    *[_type == "clusterPage" && slug.current == $slug && isPublished == true][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      publishedAt,
      readTime,
      tags,
      author->{
        name,
        title,
        image,
        bio
      },
      pillarPage->{
        title,
        slug,
        metaDescription
      }
    }
  `,

  // Get related blog posts
  getRelatedBlogPosts: (postId: string, tags: string[] = [], limit = 3) => `
    *[_type == "clusterPage" && _id != $postId && isPublished == true && count(tags[@ in $tags]) > 0] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      publishedAt,
      readTime,
      tags,
      author->{
        name,
        image
      }
    }
  `,

  // Get all pillar pages for topic navigation
  getPillarPages: () => `
    *[_type == "pillarPage" && isPublished == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      metaDescription,
      heroTitle,
      heroSubtitle,
      heroImage,
      targetKeywords,
      publishedAt
    }
  `,

  // Get pillar page with related cluster pages
  getPillarPageWithClusters: (slug: string) => `
    *[_type == "pillarPage" && slug.current == $slug && isPublished == true][0] {
      _id,
      title,
      slug,
      metaDescription,
      heroTitle,
      heroSubtitle,
      heroImage,
      content,
      targetKeywords,
      publishedAt,
      "clusterPages": *[_type == "clusterPage" && pillarPage._ref == ^._id && isPublished == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        featuredImage,
        publishedAt,
        readTime,
        tags
      }
    }
  `,

  // Get blog posts by tag
  getBlogPostsByTag: (tag: string, limit = 10) => `
    *[_type == "clusterPage" && isPublished == true && $tag in tags] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      publishedAt,
      readTime,
      tags,
      author->{
        name,
        image
      },
      pillarPage->{
        title,
        slug
      }
    }
  `,

  // Get all unique tags
  getAllTags: () => `
    array::unique(*[_type == "clusterPage" && isPublished == true && defined(tags)].tags[])
  `,

  // Advanced search with multiple filters
  advancedSearchBlogPosts: (options: {
    query?: string
    tag?: string
    author?: string
    pillar?: string
    dateFrom?: string
    dateTo?: string
    readTimeMin?: number
    readTimeMax?: number
    sortBy?: string
    sortOrder?: string
    limit?: number
    offset?: number
  } = {}) => {
    const {
      query = '',
      tag = '',
      author = '',
      pillar = '',
      dateFrom = '',
      dateTo = '',
      readTimeMin = 0,
      readTimeMax = 0,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      limit = 10,
      offset = 0
    } = options
    
    let filters = ['_type == "clusterPage"', 'isPublished == true']
    
    // Text search
    if (query) {
      filters.push(`(title match "${query}" || excerpt match "${query}" || pt::text(content) match "${query}")`)
    }
    
    // Tag filter
    if (tag) {
      filters.push(`"${tag}" in tags`)
    }
    
    // Author filter
    if (author) {
      filters.push(`author._ref == "${author}"`)
    }
    
    // Pillar filter
    if (pillar) {
      filters.push(`pillarPage._ref == "${pillar}"`)
    }
    
    // Date range filters
    if (dateFrom) {
      filters.push(`publishedAt >= "${dateFrom}T00:00:00Z"`)
    }
    if (dateTo) {
      filters.push(`publishedAt <= "${dateTo}T23:59:59Z"`)
    }
    
    // Read time filters
    if (readTimeMin > 0) {
      filters.push(`readTime >= ${readTimeMin}`)
    }
    if (readTimeMax > 0) {
      filters.push(`readTime <= ${readTimeMax}`)
    }
    
    const order = sortOrder === 'asc' ? sortBy : `-${sortBy}`
    
    return `
      *[${filters.join(' && ')}] | order(${order}) [$offset...$limit] {
        _id,
        title,
        slug,
        excerpt,
        featuredImage,
        publishedAt,
        readTime,
        tags,
        author->{
          _id,
          name,
          title,
          image
        },
        pillarPage->{
          _id,
          title,
          slug
        }
      }
    `
  },

  // Count total posts for pagination
  countBlogPosts: (options: {
    query?: string
    tag?: string
    author?: string
    pillar?: string
    dateFrom?: string
    dateTo?: string
    readTimeMin?: number
    readTimeMax?: number
  } = {}) => {
    const {
      query = '',
      tag = '',
      author = '',
      pillar = '',
      dateFrom = '',
      dateTo = '',
      readTimeMin = 0,
      readTimeMax = 0
    } = options
    
    let filters = ['_type == "clusterPage"', 'isPublished == true']
    
    if (query) {
      filters.push(`(title match "${query}" || excerpt match "${query}" || pt::text(content) match "${query}")`)
    }
    if (tag) {
      filters.push(`"${tag}" in tags`)
    }
    if (author) {
      filters.push(`author._ref == "${author}"`)
    }
    if (pillar) {
      filters.push(`pillarPage._ref == "${pillar}"`)
    }
    if (dateFrom) {
      filters.push(`publishedAt >= "${dateFrom}T00:00:00Z"`)
    }
    if (dateTo) {
      filters.push(`publishedAt <= "${dateTo}T23:59:59Z"`)
    }
    if (readTimeMin > 0) {
      filters.push(`readTime >= ${readTimeMin}`)
    }
    if (readTimeMax > 0) {
      filters.push(`readTime <= ${readTimeMax}`)
    }
    
    return `count(*[${filters.join(' && ')}])`
  },

  // Get all authors for filter dropdown
  getAllAuthors: () => `
    *[_type == "author"] | order(name asc) {
      _id,
      name,
      title,
      image
    }
  `,

  // Get recent blog posts for RSS feed
  getRecentBlogPostsForRSS: (limit = 20) => `
    *[_type == "clusterPage" && isPublished == true] | order(publishedAt desc) [0...$limit] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      author->{
        name
      }
    }
  `,
}

// Helper functions
export const sanityHelpers = {
  // Format date for display
  formatDate: (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },

  // Calculate estimated reading time
  calculateReadingTime: (content: any[]) => {
    const text = content?.map(block => 
      block.children?.map(child => child.text).join(' ') || ''
    ).join(' ') || ''
    
    const wordsPerMinute = 200
    const words = text.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  },

  // Generate SEO-friendly URL
  generateBlogUrl: (slug: { current: string }) => {
    return `/blog/${slug.current}`
  },

  // Generate pillar page URL
  generatePillarUrl: (slug: { current: string }) => {
    return `/resources/${slug.current}`
  },

  // Extract plain text from Sanity content
  extractPlainText: (content: any[]) => {
    return content?.map(block => 
      block.children?.map(child => child.text).join(' ') || ''
    ).join(' ') || ''
  },

  // Get responsive image URL
  getResponsiveImageUrl: (image: any, width = 800) => {
    return urlFor(image)
      .width(width)
      .auto('format')
      .quality(85)
      .url()
  },

  // Get optimized image for different screen sizes
  getOptimizedImage: (image: any, sizes = { sm: 400, md: 800, lg: 1200 }) => {
    return {
      sm: urlFor(image).width(sizes.sm).auto('format').quality(80).url(),
      md: urlFor(image).width(sizes.md).auto('format').quality(85).url(),
      lg: urlFor(image).width(sizes.lg).auto('format').quality(90).url(),
    }
  }
}

// Blog post CRUD operations
export const blogOperations = {
  // Create a new blog post
  createBlogPost: async (postData: {
    title: string
    slug: string
    excerpt: string
    content: string
    author?: string
    tags?: string[]
    pillar?: string
    publishedAt?: string
    featuredImage?: any
    status?: 'draft' | 'published'
  }) => {
    try {
      const doc = {
        _type: 'clusterPage',
        title: postData.title,
        slug: {
          current: postData.slug
        },
        excerpt: postData.excerpt,
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: postData.content
              }
            ]
          }
        ],
        author: postData.author ? {
          _type: 'reference',
          _ref: postData.author
        } : undefined,
        tags: postData.tags || [],
        pillarPage: postData.pillar ? {
          _type: 'reference',
          _ref: postData.pillar
        } : undefined,
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt).toISOString() : new Date().toISOString(),
        featuredImage: postData.featuredImage,
        isPublished: postData.status === 'published',
        readTime: sanityHelpers.calculateReadingTime([
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: postData.content
              }
            ]
          }
        ])
      }
      
      const result = await sanityClient.create(doc)
      return result
    } catch (error) {
      console.error('Error creating blog post:', error)
      throw new Error('Failed to create blog post')
    }
  },

  // Update an existing blog post
  updateBlogPost: async (postId: string, postData: {
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    author?: string
    tags?: string[]
    pillar?: string
    publishedAt?: string
    featuredImage?: any
    status?: 'draft' | 'published'
  }) => {
    try {
      const updateData: any = {
        _type: 'clusterPage'
      }
      
      if (postData.title) updateData.title = postData.title
      if (postData.slug) {
        updateData.slug = {
          current: postData.slug
        }
      }
      if (postData.excerpt) updateData.excerpt = postData.excerpt
      if (postData.content) {
        updateData.content = [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: postData.content
              }
            ]
          }
        ]
        updateData.readTime = sanityHelpers.calculateReadingTime(updateData.content)
      }
      if (postData.author) {
        updateData.author = {
          _type: 'reference',
          _ref: postData.author
        }
      }
      if (postData.tags) updateData.tags = postData.tags
      if (postData.pillar) {
        updateData.pillarPage = {
          _type: 'reference',
          _ref: postData.pillar
        }
      }
      if (postData.publishedAt) {
        updateData.publishedAt = new Date(postData.publishedAt).toISOString()
      }
      if (postData.featuredImage) updateData.featuredImage = postData.featuredImage
      if (postData.status) updateData.isPublished = postData.status === 'published'
      
      const result = await sanityClient.patch(postId).set(updateData).commit()
      return result
    } catch (error) {
      console.error('Error updating blog post:', error)
      throw new Error('Failed to update blog post')
    }
  },

  // Delete a blog post
  deleteBlogPost: async (postId: string) => {
    try {
      await sanityClient.delete(postId)
      return { success: true }
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw new Error('Failed to delete blog post')
    }
  },

  // Get all blog posts (including drafts for admin)
  getBlogPosts: async (options: {
    status?: 'all' | 'published' | 'draft'
    limit?: number
    offset?: number
    sortBy?: 'publishedAt' | 'title' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
  } = {}) => {
    try {
      const { status = 'published', limit = 10, offset = 0, sortBy = 'publishedAt', sortOrder = 'desc' } = options
      
      let filter = '_type == "clusterPage"'
      if (status !== 'all') {
        filter += status === 'published' ? ' && isPublished == true' : ' && isPublished == false'
      }
      
      const order = sortOrder === 'asc' ? sortBy : `-${sortBy}`
      
      const query = `*[
        ${filter}
      ] | order(${order}) [$offset...$limit] {
        _id,
        _createdAt,
        title,
        slug,
        excerpt,
        featuredImage,
        publishedAt,
        readTime,
        tags,
        isPublished,
        author->{
          name,
          title,
          image
        },
        pillarPage->{
          title,
          slug
        }
      }`
      
      const posts = await sanityClient.fetch(query, { offset, limit })
      return posts
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      throw new Error('Failed to fetch blog posts')
    }
  },

  // Get pillar pages
  getPillarPages: async () => {
    try {
      const query = `*[_type == "pillarPage"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        metaDescription,
        heroTitle,
        heroSubtitle,
        heroImage,
        targetKeywords,
        publishedAt
      }`
      
      const pillars = await sanityClient.fetch(query)
      return pillars
    } catch (error) {
      console.error('Error fetching pillar pages:', error)
      throw new Error('Failed to fetch pillar pages')
    }
  }
}
