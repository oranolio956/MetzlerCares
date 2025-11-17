import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { sanityClient, queries } from '$lib/utils/sanity'

export const GET: RequestHandler = async ({ url }) => {
  try {
    const searchParams = url.searchParams
    const query = searchParams.get('q') || ''
    const tag = searchParams.get('tag') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let results = []
    let total = 0
    
    if (query) {
      // Search by query
      results = await sanityClient.fetch(queries.searchBlogPosts(query, limit), { query })
      // For simplicity, we'll estimate total based on results length
      // In production, you'd get the actual count
      total = results.length
    } else if (tag) {
      // Filter by tag
      results = await sanityClient.fetch(queries.getBlogPostsByTag(tag, limit), { tag })
      total = results.length
    } else {
      // Get all posts with pagination
      results = await sanityClient.fetch(queries.getBlogPosts(limit, offset), { offset, limit: offset + limit })
      // Estimate total (in production, get actual count)
      total = results.length + offset + (results.length === limit ? 100 : 0)
    }
    
    return json({
      posts: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: results.length === limit
      },
      query: { q: query, tag: tag }
    })
    
  } catch (error) {
    console.error('Blog API error:', error)
    return json({ 
      error: 'Failed to fetch blog posts',
      posts: [],
      pagination: { total: 0, limit: 10, offset: 0, hasMore: false }
    }, { status: 500 })
  }
}

// POST endpoint for creating blog posts (admin only)
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    // This would require authentication in production
    const data = await request.json()
    
    // Validate required fields
    const { title, content, excerpt, tags, author, pillarPage } = data
    
    if (!title || !content || !excerpt) {
      return json({ error: 'Title, content, and excerpt are required' }, { status: 400 })
    }
    
    // Create slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
    
    // Calculate reading time
    const readTime = Math.ceil(content.length / 200) // Rough estimate
    
    // Create the blog post
    const result = await sanityClient.create({
      _type: 'clusterPage',
      title,
      slug: { current: slug },
      content,
      excerpt,
      tags: tags || [],
      author: author ? { _type: 'reference', _ref: author } : undefined,
      pillarPage: pillarPage ? { _type: 'reference', _ref: pillarPage } : undefined,
      readTime,
      publishedAt: new Date().toISOString(),
      isPublished: false // Start as draft
    })
    
    return json({
      success: true,
      post: result,
      message: 'Blog post created successfully'
    })
    
  } catch (error) {
    console.error('Blog creation error:', error)
    return json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}