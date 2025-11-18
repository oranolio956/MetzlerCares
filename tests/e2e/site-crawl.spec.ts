import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

function isLocal(u: string) {
  return u.startsWith('http://127.0.0.1:4173') || u.startsWith('http://localhost:4173')
}

function slug(u: string) {
  return u.replace('http://127.0.0.1:4173', '').replace('http://localhost:4173', '').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'home'
}

test('crawl sitemap and validate pages', async ({ page, request, browserName }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.ok()).toBeTruthy()
  const xml = await res.text()
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter(isLocal)

  const visited = new Set<string>()
  const queue: string[] = [...urls]

  const consoleErrors: string[] = []
  const httpErrors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('response', (resp) => {
    if (resp.status() >= 500) httpErrors.push(`${resp.status()} ${resp.url()}`)
  })

  while (queue.length) {
    const url = queue.shift()!
    if (visited.has(url)) continue
    visited.add(url)

    const resp = await page.goto(url, { waitUntil: 'networkidle' })
    expect(resp?.status()).toBeLessThan(400)

    await page.waitForLoadState('networkidle')

    const axe = await new AxeBuilder({ page }).analyze()
    const critical = axe.violations.filter((v) => v.impact === 'critical')
    expect(critical.length).toBe(0)

    await page.screenshot({ path: `test-results/screenshots/${slug(url)}-${browserName}.png`, fullPage: true })

    const links = await page.$$eval('a[href]', (as) => as.map((a) => (a as HTMLAnchorElement).href))
    for (const l of links) if (isLocal(l) && !visited.has(l)) queue.push(l)
  }

  expect(consoleErrors.length).toBe(0)
  expect(httpErrors.length).toBe(0)
})