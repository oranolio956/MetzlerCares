import { json } from '@sveltejs/kit'
import { seoPageGenerator } from '$lib/utils/seo-page-generator'

export async function GET({ params }) {
  try {
    const allPages = seoPageGenerator.generatePages()
    const pageData = allPages.find(page => page.slug === params.slug)

    if (!pageData) {
      return json({ error: 'Page not found' }, { status: 404 })
    }

    return json(pageData)
  } catch (error) {
    console.error('SEO page API error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
