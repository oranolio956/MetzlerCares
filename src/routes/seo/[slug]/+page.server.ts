import type { PageServerLoad } from './$types'
import { seoPageGenerator } from '$lib/utils/seo-page-generator'

export const load: PageServerLoad = async ({ params, url }) => {
  const allPages = seoPageGenerator.generatePages()
  const seoData = allPages.find(p => p.slug === params.slug)

  if (!seoData) {
    return {
      status: 404,
      error: new Error('Not found')
    }
  }

  const canonical = `${url.origin}/seo/${seoData.slug}`

  return {
    seoData,
    canonical
  }
}
