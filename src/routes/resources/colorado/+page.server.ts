import type { PageServerLoad } from './$types'
import { sanityClient } from '$lib/utils/sanity'

export const load: PageServerLoad = async ({ setHeaders, url }) => {
  setHeaders({ 'Cache-Control': 'public, max-age=1800, s-maxage=86400' })

  try {
    const query = `*[_type == "localResource"] | order(organizationName asc) {
      _id,
      organizationName,
      description,
      phone,
      website,
      city
    }`

    const result = await sanityClient.fetch(query)

    const cities = Array.from(new Set((result || []).map((r: any) => r.city).filter(Boolean))).sort()

    return { resources: result || [], cities: ['all', ...cities], canonical: `${url.origin}/resources/colorado` }
  } catch (error) {
    console.error('Server error loading resources:', error)
    return { resources: [], cities: ['all'], error: 'Failed to load resource directory' }
  }
}