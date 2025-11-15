import type { RequestHandler } from './$types'
import { sanityClient } from '$lib/utils/sanity'

const staticRoutes = [
  '/',
  '/get-aid',
  '/give-support',
  '/impact',
  '/partners',
  '/resources/colorado'
]

export const GET: RequestHandler = async () => {
  const base = 'https://metzlerfoundations.org'
  let dynamic: string[] = []
  try {
    const entries = await sanityClient.fetch<{ slug: { current: string }, publishedAt?: string }[]>(`*[_type in ["pillarPage","clusterPage"] && defined(slug.current)]{ slug, publishedAt }`)
    dynamic = entries.map((s) => `/resources/${s.slug.current}`)
    const urlEntries = [...staticRoutes, ...dynamic]
      .map((path) => {
        const match = entries.find((e) => `/resources/${e.slug.current}` === path)
        const lastmod = match?.publishedAt || new Date().toISOString()
        return `<url><loc>${base}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
      })
      .join('')
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}</urlset>`
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
  } catch (_) {
    dynamic = []
  }
  const urls = [...staticRoutes]
    .map((path) => `<url><loc>${base}${path}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`)
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}