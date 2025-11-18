import type { PageServerLoad } from './$types'
import { sanityClient } from '$lib/utils/sanity'

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  // Set caching headers for content-heavy pages
  setHeaders({
    'Cache-Control': 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 1 day CDN
    'CDN-Cache-Control': 'public, max-age=86400'
  })

  try {
    if (!sanityClient) {
      return {
        status: 503,
        error: 'CMS not configured'
      }
    }
    const { slug } = params

    // Query Sanity for the pillar page content
    const page = await sanityClient.fetch(
      `
      *[_type == "pillarPage" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        content,
        "relatedPages": *[_type == "clusterPage" && references(^._id)]{
          title,
          slug,
          excerpt,
          publishedAt
        }
      }
    `,
      { slug }
    )

    if (!page) {
      return {
        status: 404,
        error: 'Page not found'
      }
    }

    return {
      page
    }
  } catch (error) {
    console.error('Server error in pillar page:', error)
    return {
      status: 500,
      error: 'Failed to load page content'
    }
  }
}
