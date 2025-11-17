import { json } from '@sveltejs/kit'
import { sanityClient, queries } from '$lib/utils/sanity'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  try {
    const searchParams = url.searchParams
    
    // Parse search parameters
    const query = searchParams.get('q') || ''
    const tag = searchParams.get('tag') || ''
    const author = searchParams.get('author') || ''
    const pillar = searchParams.get('pillar') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    const readTimeMin = parseInt(searchParams.get('readTimeMin') || '0')
    const readTimeMax = parseInt(searchParams.get('readTimeMax') || '0')
    const sortBy = searchParams.get('sortBy') || 'publishedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeSuggestions = searchParams.get('suggestions') === 'true'
    
    // Build search options
    const searchOptions = {
      query,
      tag,
      author,
      pillar,
      dateFrom,
      dateTo,
      readTimeMin: readTimeMin > 0 ? readTimeMin : 0,
      readTimeMax: readTimeMax > 0 ? readTimeMax : 0,
      sortBy,
      sortOrder,
      limit,
      offset
    }
    
    // Execute search queries in parallel
    const [posts, totalCount] = await Promise.all([
      sanityClient.fetch(queries.advancedSearchBlogPosts(searchOptions)),
      sanityClient.fetch(queries.countBlogPosts(searchOptions))
    ])
    
    // Get search suggestions if requested
    let suggestions: string[] = []
    if (includeSuggestions && query.length >= 2) {
      suggestions = await getSearchSuggestions(query)
    }
    
    // Get related content for better discovery
    let relatedContent = []
    if (query && posts.length > 0) {
      const firstPost = posts[0]
      if (firstPost.tags && firstPost.tags.length > 0) {
        relatedContent = await sanityClient.fetch(
          queries.getRelatedBlogPosts(firstPost._id, firstPost.tags, 3)
        )
      }
    }
    
    // Log search analytics (for internal use)
    if (query || tag || author || pillar) {
      console.log('Blog search:', {
        query,
        filters: { tag, author, pillar, dateFrom, dateTo, readTimeMin, readTimeMax },
        resultsCount: posts.length,
        totalCount,
        timestamp: new Date().toISOString()
      })
    }
    
    return json({
      success: true,
      data: {
        posts: posts || [],
        totalCount: totalCount || 0,
        hasMore: offset + limit < totalCount,
        suggestions,
        relatedContent: relatedContent || []
      },
      searchParams: {
        query,
        filters: {
          tag,
          author,
          pillar,
          dateFrom,
          dateTo,
          readTimeMin: readTimeMin > 0 ? readTimeMin : undefined,
          readTimeMax: readTimeMax > 0 ? readTimeMax : undefined
        },
        sort: { by: sortBy, order: sortOrder },
        pagination: { limit, offset }
      }
    })
    
  } catch (error) {
    console.error('Blog search API error:', error)
    
    return json({
      success: false,
      error: 'Failed to search blog posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Generate search suggestions based on query
async function getSearchSuggestions(query: string): Promise<string[]> {
  const suggestions = [
    'addiction recovery',
    'sober living',
    'mental health',
    'substance abuse treatment',
    'nonprofit management',
    'community outreach',
    'family support',
    'relapse prevention',
    'holistic healing',
    'peer support',
    'trauma informed care',
    'evidence based treatment',
    'recovery housing',
    'case management',
    'behavioral health'
  ]
  
  const lowerQuery = query.toLowerCase()
  return suggestions
    .filter(suggestion => suggestion.toLowerCase().includes(lowerQuery))
    .slice(0, 5)
}

// POST endpoint for search analytics
export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json()
    
    const {
      query,
      filters = {},
      resultsCount,
      userAgent,
      referrer,
      timestamp = new Date().toISOString()
    } = data
    
    // Validate required fields
    if (!query && Object.keys(filters).length === 0) {
      return json({
        success: false,
        error: 'Query or filters are required'
      }, { status: 400 })
    }
    
    // Log search analytics
    console.log('Search analytics:', {
      query,
      filters,
      resultsCount,
      userAgent,
      referrer,
      timestamp
    })
    
    // Here you could save to a database, send to analytics service, etc.
    // For now, we just log and acknowledge
    
    return json({
      success: true,
      message: 'Search analytics recorded'
    })
    
  } catch (error) {
    console.error('Search analytics API error:', error)
    
    return json({
      success: false,
      error: 'Failed to record search analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}