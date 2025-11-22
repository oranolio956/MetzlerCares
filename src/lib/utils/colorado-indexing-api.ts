// Google's Indexing API integration for rapid content discovery and indexing
// This enables instant indexing similar to how ripoffreport.com and medium.com achieve fast ranking

import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library'

export interface IndexingAPIConfig {
  serviceAccountKey: string
  siteUrl: string
  batchSize: number
  retryAttempts: number
  rateLimitDelay: number
}

export interface IndexingRequest {
  url: string
  type: 'URL_UPDATED' | 'URL_DELETED'
  timestamp: string
  priority: 'high' | 'medium' | 'low'
  contentType: 'recovery_services' | 'treatment_center' | 'sober_living' | 'state_overview'
  location?: string
}

export interface IndexingResponse {
  url: string
  status: 'success' | 'error' | 'rate_limited'
  message: string
  errorCode?: string
  indexedAt?: string
}

export interface ContentFreshnessSignal {
  url: string
  lastModified: string
  contentHash: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly'
  priority: number
}

export class ColoradoIndexingAPI {
  private config: IndexingAPIConfig
  private indexedUrls: Set<string> = new Set()
  private pendingUrls: Map<string, IndexingRequest> = new Map()
  private auth: GoogleAuth | null = null
  private indexingService: any = null

  constructor(config: IndexingAPIConfig) {
    this.config = config
    this.initializeClient()
  }

  private async initializeClient() {
    try {
      // Support multiple credential methods:
      // 1. GOOGLE_SERVICE_ACCOUNT_KEY (base64 encoded JSON)
      // 2. GOOGLE_SERVICE_ACCOUNT_PATH (file path)
      // 3. GOOGLE_APPLICATION_CREDENTIALS (standard env var)
      // 4. config.serviceAccountKey (legacy support)

      const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
      const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS
      const legacyKey = this.config.serviceAccountKey

      let authConfig: any = {
        scopes: ['https://www.googleapis.com/auth/indexing']
      }

      if (serviceAccountKey) {
        // Decode base64 encoded service account JSON
        try {
          const decoded = Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
          authConfig.credentials = JSON.parse(decoded)
        } catch (error) {
          console.error('❌ Failed to decode GOOGLE_SERVICE_ACCOUNT_KEY. Must be base64 encoded JSON.')
          throw error
        }
      } else if (serviceAccountPath) {
        // Use file path
        authConfig.keyFile = serviceAccountPath
      } else if (legacyKey && legacyKey !== 'your-service-account-key.json') {
        // Legacy support
        authConfig.keyFile = legacyKey
      } else {
        throw new Error(
          'Google service account credentials not found. Set GOOGLE_SERVICE_ACCOUNT_KEY (base64 JSON) or GOOGLE_SERVICE_ACCOUNT_PATH (file path)'
        )
      }

      this.auth = new GoogleAuth(authConfig)
      this.indexingService = google.indexing({ version: 'v3', auth: this.auth })
      console.log('✅ Google Indexing API client initialized')
    } catch (error: any) {
      console.warn('⚠️ Google Indexing API client initialization failed (running in simulation mode):', error.message)
      console.warn('💡 Set GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_PATH to enable real API calls')
    }
  }

  // Submit URLs to Google's Indexing API for instant discovery
  async submitUrls(urls: string[], contentType: string = 'recovery_services'): Promise<IndexingResponse[]> {
    const requests: IndexingRequest[] = urls.map(url => ({
      url,
      type: 'URL_UPDATED',
      timestamp: new Date().toISOString(),
      priority: this.getPriorityForUrl(url),
      contentType: contentType as any,
      location: this.extractLocationFromUrl(url)
    }))

    return this.batchSubmitRequests(requests)
  }

  // Batch submit with rate limiting and retry logic
  private async batchSubmitRequests(requests: IndexingRequest[]): Promise<IndexingResponse[]> {
    const responses: IndexingResponse[] = []
    const batches = this.createBatches(requests, this.config.batchSize)

    for (const batch of batches) {
      const batchResponses = await this.processBatchWithRetry(batch)
      responses.push(...batchResponses)

      // Rate limiting delay between batches
      await this.delay(this.config.rateLimitDelay)
    }

    return responses
  }

  // Process batch with exponential backoff retry
  private async processBatchWithRetry(batch: IndexingRequest[]): Promise<IndexingResponse[]> {
    let attempts = 0
    let lastError: Error | null = null

    while (attempts < this.config.retryAttempts) {
      try {
        return await this.processBatch(batch)
      } catch (error) {
        lastError = error as Error
        attempts++

        if (attempts < this.config.retryAttempts) {
          const delay = Math.pow(2, attempts) * 1000 // Exponential backoff
          await this.delay(delay)
        }
      }
    }

    // Return error responses for all URLs in batch
    return batch.map(request => ({
      url: request.url,
      status: 'error' as const,
      message: lastError?.message || 'Max retry attempts exceeded',
      errorCode: 'MAX_RETRIES_EXCEEDED'
    }))
  }

  // Process individual batch through Google's Indexing API
  private async processBatch(batch: IndexingRequest[]): Promise<IndexingResponse[]> {
    const responses: IndexingResponse[] = []

    for (const request of batch) {
      try {
        let response: IndexingResponse

        if (this.indexingService) {
          // Real API call
          await this.indexingService.urlNotifications.publish({
            requestBody: {
              url: request.url,
              type: request.type
            }
          })

          response = {
            url: request.url,
            status: 'success',
            message: 'URL successfully submitted to Google Indexing API',
            indexedAt: new Date().toISOString()
          }
        } else {
          // Simulate API processing if client not initialized
          response = await this.simulateIndexingAPICall(request)
        }

        responses.push(response)

        // Track successful indexing
        if (response.status === 'success') {
          this.indexedUrls.add(request.url)
          this.pendingUrls.delete(request.url)
        }
      } catch (error: any) {
        responses.push({
          url: request.url,
          status: 'error',
          message: error.message || 'API Error',
          errorCode: 'API_ERROR'
        })
      }
    }

    return responses
  }

  // Simulate Google Indexing API response (fallback)
  private async simulateIndexingAPICall(request: IndexingRequest): Promise<IndexingResponse> {
    // Simulate processing delay
    await this.delay(Math.random() * 500 + 200)

    // Simulate success rate (95% for high priority, 85% for medium, 75% for low)
    const successRate = {
      high: 0.95,
      medium: 0.85,
      low: 0.75
    }[request.priority]

    if (Math.random() < successRate) {
      return {
        url: request.url,
        status: 'success',
        message: 'URL successfully submitted for indexing (SIMULATED)',
        indexedAt: new Date().toISOString()
      }
    } else if (Math.random() < 0.1) {
      // 10% chance of rate limiting
      return {
        url: request.url,
        status: 'rate_limited',
        message: 'Rate limit exceeded, retry later',
        errorCode: 'RATE_LIMITED'
      }
    } else {
      return {
        url: request.url,
        status: 'error',
        message: 'Indexing request failed',
        errorCode: 'INDEXING_FAILED'
      }
    }
  }

  // Generate content freshness signals for rapid indexing
  generateFreshnessSignals(urls: string[]): ContentFreshnessSignal[] {
    return urls.map(url => {
      const now = new Date()
      const location = this.extractLocationFromUrl(url)
      const contentType = this.getContentTypeFromUrl(url)

      return {
        url,
        lastModified: now.toISOString(),
        contentHash: this.generateContentHash(url, location, contentType),
        changeFrequency: this.getChangeFrequency(contentType),
        priority: this.calculatePriority(location, contentType)
      }
    })
  }

  // Generate dynamic sitemap with freshness signals
  generateDynamicSitemap(urls: string[]): string {
    const freshnessSignals = this.generateFreshnessSignals(urls)
    const now = new Date()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${freshnessSignals.map(signal => this.generateUrlEntry(signal, now)).join('\n')}
</urlset>`

    return sitemap
  }

  // Generate individual URL entry with advanced metadata
  private generateUrlEntry(signal: ContentFreshnessSignal, now: Date): string {
    const priority = Math.min(signal.priority / 10, 1.0)
    const changeFreq = signal.changeFrequency

    // Add news sitemap for high-priority content
    const isNews = signal.priority >= 8
    const location = this.extractLocationFromUrl(signal.url)

    let entry = `  <url>
    <loc>${signal.url}</loc>
    <lastmod>${signal.lastModified}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>`

    // Add news sitemap for high-priority Colorado recovery content
    if (isNews && location) {
      entry += `
    <news:news>
      <news:publication>
        <news:name>Metzler Cares Colorado Recovery</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${signal.lastModified}</news:publication_date>
      <news:title>Recovery Services Update: ${location}</news:title>
      <news:keywords>recovery, sober living, ${location}, colorado</news:keywords>
    </news:news>`
    }

    // Add mobile and image annotations
    entry += `
    <mobile:mobile/>
    <image:image>
      <image:loc>https://metzlercares.com/images/colorado-recovery-${
        location?.toLowerCase().replace(/\s+/g, '-') || 'services'
      }.jpg</image:loc>
      <image:title>Recovery Services in ${location || 'Colorado'}</image:title>
      <image:caption>Comprehensive recovery support and sober living resources</image:caption>
    </image:image>
  </url>`

    return entry
  }

  // Monitor indexing status and trigger re-indexing for stale content
  async monitorIndexingStatus(urls: string[]): Promise<void> {
    const now = Date.now()
    const staleThreshold = 24 * 60 * 60 * 1000 // 24 hours

    for (const url of urls) {
      const lastIndexed = this.getLastIndexedTime(url)

      if (now - lastIndexed > staleThreshold) {
        // Content is stale, trigger re-indexing
        await this.submitUrls([url], this.getContentTypeFromUrl(url))
      }
    }
  }

  // Generate real-time content updates for indexing priority
  generateRealtimeUpdate(
    location: string,
    serviceType: string,
    updateType: 'new_service' | 'price_change' | 'availability'
  ): IndexingRequest {
    const url = this.buildServiceUrl(location, serviceType)

    return {
      url,
      type: 'URL_UPDATED',
      timestamp: new Date().toISOString(),
      priority: 'high',
      contentType: this.getContentTypeFromService(serviceType),
      location
    }
  }

  // Helper methods
  private getPriorityForUrl(url: string): 'high' | 'medium' | 'low' {
    if (url.includes('/denver/') || url.includes('/colorado-springs/')) return 'high'
    if (url.includes('/aurora/') || url.includes('/fort-collins/')) return 'medium'
    return 'low'
  }

  private extractLocationFromUrl(url: string): string {
    const match = url.match(/\/co\/([^\/]+)/)
    return match ? match[1].replace(/-/g, ' ') : 'Colorado'
  }

  private getContentTypeFromUrl(url: string): string {
    if (url.includes('/sober-living')) return 'sober_living'
    if (url.includes('/treatment-center')) return 'treatment_center'
    if (url.includes('/recovery-services')) return 'recovery_services'
    return 'state_overview'
  }

  private getContentTypeFromService(serviceType: string): any {
    const typeMap: Record<string, any> = {
      sober_living: 'sober_living',
      treatment: 'treatment_center',
      recovery: 'recovery_services'
    }
    return typeMap[serviceType] || 'recovery_services'
  }

  private generateContentHash(url: string, location: string, contentType: string): string {
    const data = `${url}|${location}|${contentType}|${Date.now()}`
    return Buffer.from(data).toString('base64').slice(0, 16)
  }

  private getChangeFrequency(contentType: string): 'always' | 'hourly' | 'daily' | 'weekly' {
    const freqMap: Record<string, any> = {
      recovery_services: 'daily',
      treatment_center: 'weekly',
      sober_living: 'daily',
      state_overview: 'weekly'
    }
    return freqMap[contentType] || 'weekly'
  }

  private calculatePriority(location: string, contentType: string): number {
    let priority = 5

    // Location-based priority
    if (location.includes('denver')) priority += 3
    else if (location.includes('colorado springs')) priority += 2
    else if (location.includes('aurora') || location.includes('fort collins')) priority += 1

    // Content type priority
    if (contentType === 'recovery_services') priority += 2
    else if (contentType === 'sober_living') priority += 1

    return Math.min(priority, 10)
  }

  private getLastIndexedTime(url: string): number {
    // Mock implementation - in production, this would query actual indexing status
    return Date.now() - Math.random() * 48 * 60 * 60 * 1000 // Random time within last 48 hours
  }

  private buildServiceUrl(location: string, serviceType: string): string {
    const locationSlug = location.toLowerCase().replace(/\s+/g, '-')
    return `https://metzlercares.com/co/${locationSlug}/${serviceType}`
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance with production configuration
// Note: GOOGLE_INDEXING_API_KEY is deprecated, use GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_PATH instead
export const coloradoIndexingAPI = new ColoradoIndexingAPI({
  serviceAccountKey: process.env.GOOGLE_INDEXING_API_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PATH || 'your-service-account-key.json',
  siteUrl: 'https://metzlercares.com',
  batchSize: 100, // Google recommends max 100 URLs per batch
  retryAttempts: 3,
  rateLimitDelay: 1000 // 1 second between batches
})
