import { seoGenerator } from './colorado-seo-generator'
import { coloradoIndexingAPI } from './colorado-indexing-api'
import { COLORADO_LOCATIONS, SEO_TEMPLATES, generateLocationContent } from './colorado-seo-data'

export interface AutomationStatus {
  lastRun: string | null
  generatedPages: number
  indexedPages: number
  errors: string[]
  isRunning: boolean
}

export class ColoradoSEOAutomation {
  private status: AutomationStatus = {
    lastRun: null,
    generatedPages: 0,
    indexedPages: 0,
    errors: [],
    isRunning: false
  }

  async runFullSiteGeneration(): Promise<AutomationStatus> {
    if (this.status.isRunning) {
      throw new Error('Automation is already running')
    }

    this.status.isRunning = true
    this.status.generatedPages = 0
    this.status.errors = []

    try {
      console.log('🚀 Starting full site generation...')

      for (const location of COLORADO_LOCATIONS) {
        for (const [templateType, template] of Object.entries(SEO_TEMPLATES)) {
          try {
            // Generate content (this also updates velocity metrics)
            seoGenerator.generateCityContent(location, templateType)
            this.status.generatedPages++
          } catch (e: any) {
            console.error(`Error generating ${templateType} for ${location.city}:`, e)
            this.status.errors.push(`${location.city} - ${templateType}: ${e.message}`)
          }
        }
      }

      this.status.lastRun = new Date().toISOString()
      console.log(`✅ Site generation complete. Generated ${this.status.generatedPages} pages.`)
    } catch (e: any) {
      console.error('Critical error in site generation:', e)
      this.status.errors.push(`Critical: ${e.message}`)
    } finally {
      this.status.isRunning = false
    }

    return this.status
  }

  async triggerBulkIndexing(): Promise<AutomationStatus> {
    if (this.status.isRunning) {
      throw new Error('Automation is already running')
    }

    this.status.isRunning = true
    this.status.indexedPages = 0
    this.status.errors = []

    try {
      console.log('🚀 Starting bulk indexing...')

      // Collect all URLs
      const urlsToIndex: string[] = []

      for (const location of COLORADO_LOCATIONS) {
        for (const template of Object.values(SEO_TEMPLATES)) {
          const generatedTemplate = generateLocationContent(template, location)
          // Construct URL based on slug pattern
          // Assuming base URL is https://recoveryconcierge.org (should be configurable)
          const url = `https://recoveryconcierge.org/co/${location.city.toLowerCase().replace(/\s+/g, '-')}/${
            generatedTemplate.slug
          }`
          urlsToIndex.push(url)
        }
      }

      // Submit in batches of 200 (API limit)
      const batchSize = 200
      for (let i = 0; i < urlsToIndex.length; i += batchSize) {
        const batch = urlsToIndex.slice(i, i + batchSize)
        try {
          await coloradoIndexingAPI.submitUrls(batch, 'recovery_services')
          this.status.indexedPages += batch.length
        } catch (e: any) {
          console.error('Error submitting batch to indexing API:', e)
          this.status.errors.push(`Batch ${i / batchSize + 1}: ${e.message}`)
        }
      }

      console.log(`✅ Bulk indexing complete. Submitted ${this.status.indexedPages} URLs.`)
    } catch (e: any) {
      console.error('Critical error in bulk indexing:', e)
      this.status.errors.push(`Critical: ${e.message}`)
    } finally {
      this.status.isRunning = false
    }

    return this.status
  }

  getStatus(): AutomationStatus {
    return this.status
  }
}

export const seoAutomation = new ColoradoSEOAutomation()
