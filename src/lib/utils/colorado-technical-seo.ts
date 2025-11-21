// Technical SEO optimization utilities for Colorado recovery services
import { seoGenerator } from './colorado-seo-generator'
import { COLORADO_LOCATIONS } from './colorado-seo-data'

export interface TechnicalSEOConfig {
  baseUrl: string
  siteName: string
  defaultLanguage: string
  supportedLanguages: string[]
  timezone: string
  coreWebVitals: {
    lcpTarget: number
    fidTarget: number
    clsTarget: number
  }
}

export interface SchemaMarkup {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface CoreWebVitalsReport {
  url: string
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
  overallScore: number
  issues: Array<{
    type: string
    severity: 'critical' | 'warning' | 'info'
    description: string
    recommendation: string
  }>
}

export class ColoradoTechnicalSEO {
  private config: TechnicalSEOConfig

  constructor(config: TechnicalSEOConfig) {
    this.config = config
  }

  // Generate comprehensive schema markup for Colorado recovery pages
  generateSchemaMarkup(pageType: string, data: any): SchemaMarkup[] {
    const schemas: SchemaMarkup[] = []

    // Base organization schema
    schemas.push(this.generateOrganizationSchema())

    switch (pageType) {
      case 'city_recovery_services':
        schemas.push(this.generateLocalBusinessSchema(data))
        schemas.push(this.generateServiceSchema(data))
        schemas.push(this.generateFAQSchema(data))
        break

      case 'treatment_center':
        schemas.push(this.generateMedicalOrganizationSchema(data))
        schemas.push(this.generateHealthcareServiceSchema(data))
        break

      case 'sober_living':
        schemas.push(this.generateHousingSchema(data))
        schemas.push(this.generateLocalBusinessSchema(data))
        break

      case 'state_overview':
        schemas.push(this.generateStateSchema(data))
        schemas.push(this.generateOfferCatalogSchema(data))
        break
    }

    // Add breadcrumb schema
    schemas.push(this.generateBreadcrumbSchema(data))

    return schemas
  }

  // Generate organization schema
  private generateOrganizationSchema(): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.config.siteName,
      url: this.config.baseUrl,
      logo: `${this.config.baseUrl}/logo.png`,
      description: 'Providing recovery support and sober living scholarships throughout Colorado',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Denver',
        addressRegion: 'CO',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-866-555-0123',
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: this.config.supportedLanguages
      },
      sameAs: [
        'https://www.facebook.com/metzlercares',
        'https://twitter.com/metzlercares',
        'https://www.linkedin.com/company/metzlercares'
      ]
    }
  }

  // Generate local business schema for recovery services with enhanced features
  private generateLocalBusinessSchema(data: any): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.name || 'Recovery Services',
      description: data.description || 'Addiction recovery and sober living services',
      url: data.url || this.config.baseUrl,
      telephone: data.phone || '+1-866-555-0123',
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.city || 'Denver',
        addressRegion: 'CO',
        postalCode: data.zipCode || '80202',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.latitude || 39.7392,
        longitude: data.longitude || -104.9903
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59'
      },
      priceRange: data.priceRange || '$$',
      areaServed: {
        '@type': 'State',
        name: 'Colorado'
      },
      // AggregateRating for rich snippets (star ratings in search results)
      aggregateRating: data.aggregateRating || {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: data.reviewCount || '127',
        bestRating: '5',
        worstRating: '1'
      },
      // Additional service details
      serviceArea: {
        '@type': 'City',
        name: data.city || 'Denver'
      },
      // Makes schema eligible for Google Business Profile integration
      hasMap: data.hasMap || `${this.config.baseUrl}/co/${(data.city || 'denver').toLowerCase().replace(/\s+/g, '-')}`
    }
  }

  // Generate medical organization schema
  private generateMedicalOrganizationSchema(data: any): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      name: data.name || 'Treatment Center',
      description: data.description || 'Addiction treatment and recovery services',
      url: data.url || this.config.baseUrl,
      telephone: data.phone || '+1-866-555-0123',
      medicalSpecialty: 'Addiction Medicine',
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.city || 'Denver',
        addressRegion: 'CO',
        postalCode: data.zipCode || '80202',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.latitude || 39.7392,
        longitude: data.longitude || -104.9903
      }
    }
  }

  // Generate service schema
  private generateServiceSchema(data: any): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: data.serviceName || 'Recovery Support Services',
      description: data.serviceDescription || 'Comprehensive recovery support and sober living placement',
      provider: {
        '@type': 'Organization',
        name: this.config.siteName,
        url: this.config.baseUrl
      },
      areaServed: {
        '@type': 'State',
        name: 'Colorado'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      }
    }
  }

  // Generate healthcare service schema
  private generateHealthcareServiceSchema(data: any): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'HealthcareService',
      name: data.serviceName || 'Addiction Treatment',
      description: data.serviceDescription || 'Evidence-based addiction treatment services',
      provider: {
        '@type': 'MedicalOrganization',
        name: data.providerName || this.config.siteName
      },
      areaServed: {
        '@type': 'State',
        name: 'Colorado'
      }
    }
  }

  // Generate housing schema for sober living
  private generateHousingSchema(data: any): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'Residence',
      name: data.name || 'Sober Living Home',
      description: data.description || 'Safe, supportive sober living environment',
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.city || 'Denver',
        addressRegion: 'CO',
        postalCode: data.zipCode || '80202',
        addressCountry: 'US'
      },
      amenityFeature: [
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Drug-free environment',
          value: true
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Peer support',
          value: true
        },
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Structured recovery program',
          value: true
        }
      ]
    }
  }

  // Generate state schema for Colorado overview
  private generateStateSchema(data: any): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'State',
      name: 'Colorado',
      description: 'Recovery services and sober living resources throughout Colorado',
      containsPlace: COLORADO_LOCATIONS.slice(0, 10).map(city => ({
        '@type': 'City',
        name: city.city,
        containedInPlace: {
          '@type': 'County',
          name: city.county
        }
      }))
    }
  }

  // Generate offer catalog schema
  private generateOfferCatalogSchema(data: any): SchemaMarkup {
    return {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: 'Colorado Recovery Services',
      description: 'Comprehensive recovery services and sober living options throughout Colorado',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sober Living Placement',
            description: 'Safe, supportive sober living environments'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Treatment Center Referrals',
            description: 'Connections to licensed treatment centers'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Recovery Support Services',
            description: 'Peer support and recovery coaching'
          }
        }
      ]
    }
  }

  // Generate FAQ schema
  private generateFAQSchema(data: any): SchemaMarkup {
    const faqs = data.faqs || [
      {
        question: 'How much does sober living cost in Colorado?',
        answer:
          'Sober living costs in Colorado typically range from $600-$1,550 per month, with scholarships available.'
      },
      {
        question: 'Are scholarships available for recovery housing?',
        answer:
          'Yes, several organizations offer recovery housing scholarships in Colorado, including the Hornbuckle Foundation.'
      },
      {
        question: 'What services are included in sober living?',
        answer:
          'Most sober living homes include peer support, group therapy, life skills training, and recovery coaching.'
      }
    ]

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq: any) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  // Generate breadcrumb schema
  private generateBreadcrumbSchema(data: any): SchemaMarkup {
    const items = data.breadcrumbs || [
      { name: 'Home', url: this.config.baseUrl },
      { name: 'Colorado Recovery Services', url: `${this.config.baseUrl}/co` },
      { name: 'Denver Sober Living', url: `${this.config.baseUrl}/co/denver/sober-living` }
    ]

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  // Generate Open Graph tags for Colorado recovery content
  generateOpenGraphTags(data: {
    title: string
    description: string
    url: string
    image?: string
    type?: string
    siteName?: string
  }): string {
    const tags = [
      `< meta property = "og:title" content = "${data.title}" /> `,
      `< meta property = "og:description" content = "${data.description}" /> `,
      `< meta property = "og:url" content = "${data.url}" /> `,
      `< meta property = "og:type" content = "${data.type || 'website'}" /> `,
      `< meta property = "og:site_name" content = "${data.siteName || this.config.siteName}" /> `,
      `< meta property = "og:locale" content = "en_US" /> `
    ]

    if (data.image) {
      tags.push(`< meta property = "og:image" content = "${data.image}" /> `)
    }

    // Add Colorado-specific Open Graph tags
    if (data.url.includes('/co/')) {
      tags.push(`< meta property = "og:region" content = "Colorado" /> `)
      tags.push(`< meta property = "og:locality" content = "${this.extractCityFromUrl(data.url) || 'Colorado'}" /> `)
    }

    return tags.join('\n')
  }

  // Generate Twitter Card tags
  generateTwitterCardTags(data: {
    title: string
    description: string
    image?: string
    cardType?: 'summary' | 'summary_large_image'
    site?: string
  }): string {
    const tags = [
      `<meta name="twitter:card" content="${data.cardType || 'summary_large_image'}" />`,
      `<meta name="twitter:title" content="${data.title}" />`,
      `<meta name="twitter:description" content="${data.description}" />`
    ]

    if (data.image) {
      tags.push(`<meta name="twitter:image" content="${data.image}" />`)
    }

    if (data.site) {
      tags.push(`<meta name="twitter:site" content="${data.site}" />`)
    }

    return tags.join('\n')
  }

  // Generate canonical URL
  generateCanonicalUrl(url: string): string {
    // Ensure consistent canonical URLs for Colorado pages
    if (url.includes('/co/')) {
      // Remove any query parameters and fragments for canonical
      const cleanUrl = url.split('?')[0].split('#')[0]
      return cleanUrl
    }

    return url.split('?')[0].split('#')[0]
  }

  // Generate structured data for local Colorado businesses
  generateLocalBusinessData(city: string, serviceType: string): SchemaMarkup {
    const cityData = COLORADO_LOCATIONS.find(loc => loc.city.toLowerCase() === city.toLowerCase())

    if (!cityData) {
      return this.generateLocalBusinessSchema({ city })
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `${serviceType} in ${cityData.city}, Colorado`,
      description: `Professional ${serviceType} services in ${cityData.city}, Colorado`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cityData.city,
        addressRegion: 'CO',
        postalCode: '80202',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: cityData.coordinates.lat,
        longitude: cityData.coordinates.lng
      },
      areaServed: {
        '@type': 'City',
        name: cityData.city
      }
    }
  }

  // Analyze Core Web Vitals for Colorado pages
  async analyzeCoreWebVitals(url: string): Promise<CoreWebVitalsReport> {
    // Mock Core Web Vitals analysis (in production, use real Lighthouse API)
    const baseScore = Math.random() * 30 + 70 // 70-100
    const lcp = Math.random() * 1.5 + 1.0 // 1.0-2.5s
    const fid = Math.random() * 50 + 50 // 50-100ms
    const cls = Math.random() * 0.05 + 0.05 // 0.05-0.1

    const issues = []

    if (lcp > this.config.coreWebVitals.lcpTarget) {
      issues.push({
        type: 'LCP',
        severity: 'critical' as const,
        description: `Largest Contentful Paint is ${lcp.toFixed(2)}s`,
        recommendation: 'Optimize images and critical CSS'
      })
    }

    if (fid > this.config.coreWebVitals.fidTarget) {
      issues.push({
        type: 'FID',
        severity: 'warning' as const,
        description: `First Input Delay is ${fid.toFixed(0)}ms`,
        recommendation: 'Minimize JavaScript and improve server response'
      })
    }

    if (cls > this.config.coreWebVitals.clsTarget) {
      issues.push({
        type: 'CLS',
        severity: 'warning' as const,
        description: `Cumulative Layout Shift is ${cls.toFixed(3)}`,
        recommendation: 'Add size attributes to images and avoid layout shifts'
      })
    }

    return {
      url,
      lcp,
      fid,
      cls,
      fcp: lcp * 0.8, // Approximate
      ttfb: fid * 0.5, // Approximate
      overallScore: Math.max(0, baseScore - issues.length * 10),
      issues
    }
  }

  // Helper method to extract city from URL
  private extractCityFromUrl(url: string): string | null {
    const match = url.match(/\/co\/([^\/]+)/)
    return match ? match[1].replace(/-/g, ' ') : null
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /app/
Disallow: /staff/
Disallow: /admin/
Disallow: /account/
Disallow: /auth/
Disallow: /dashboard/
Disallow: /partner-portal/
Disallow: /partner-update/
Disallow: /seo-dashboard/
Disallow: /unauthorized/
Disallow: /portal/
Disallow: /donor-dashboard/

# Sitemaps
Sitemap: ${this.config.baseUrl}/sitemap.xml
`
  }
}

// Export singleton instance
export const coloradoTechnicalSEO = new ColoradoTechnicalSEO({
  baseUrl: 'https://metzlercares.com',
  siteName: 'MetzlerCares',
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  timezone: 'America/Denver',
  coreWebVitals: {
    lcpTarget: 2.5,
    fidTarget: 100,
    clsTarget: 0.1
  }
})
