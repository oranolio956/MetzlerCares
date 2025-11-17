import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  try {
    const sitemapUrl = `${url.origin}/sitemap.xml`
    const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    const bingPing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`

    const results: Record<string, number> = {}
    try {
      const g = await fetch(googlePing)
      results.google = g.status
    } catch (e) {
      results.google = 0
    }
    try {
      const b = await fetch(bingPing)
      results.bing = b.status
    } catch (e) {
      results.bing = 0
    }

    return new Response(JSON.stringify({ sitemap: sitemapUrl, results }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to ping sitemap' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const body = await request.json()
    const urls: string[] = Array.isArray(body?.urls) ? body.urls : []
    const origin = url.origin

    const results: Array<{ url: string, status: number }> = []
    for (const u of urls) {
      const target = u.startsWith('http') ? u : `${origin}${u}`
      try {
        const g = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(target)}`)
        results.push({ url: target, status: g.status })
      } catch (e) {
        results.push({ url: target, status: 0 })
      }
    }
    return new Response(JSON.stringify({ results }), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to submit URLs' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}