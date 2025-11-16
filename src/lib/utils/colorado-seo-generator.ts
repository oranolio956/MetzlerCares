// Programmatic SEO content generator for Colorado recovery services with rapid-ranking features
import { 
  COLORADO_LOCATIONS, 
  SEO_TEMPLATES, 
  COLORADO_RECOVERY_SERVICES, 
  generateLocationContent,
  getPriorityLocations,
  type ColoradoLocation,
  type RecoveryService,
  type SEOContentTemplate
} from './colorado-seo-data';
import { coloradoIndexingAPI } from './colorado-indexing-api';
import { coloradoInternalLinking } from './colorado-internal-linking';
import { coloradoContentVelocity } from './colorado-content-velocity';

export interface GeneratedContent {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  content: string;
  faqs: { question: string; answer: string }[];
  schema: object;
  keywords: string[];
  lastUpdated: string;
  canonical: string;
  velocityScore: number;
  indexingPriority: 'high' | 'medium' | 'low';
  internalLinks: any[];
  freshnessSignals: any[];
}

export class ColoradoSEOGenerator {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'https://metzlercares.com') {
    this.baseUrl = baseUrl;
  }
  
  generateCityContent(location: ColoradoLocation, templateType: string = 'city_sober_living'): GeneratedContent {
    const template = SEO_TEMPLATES[templateType];
    if (!template) {
      throw new Error(`Template ${templateType} not found`);
    }
    
    const locationTemplate = generateLocationContent(template, location);
    const content = this.buildContent(locationTemplate, location);
    const keywords = this.extractKeywords(locationTemplate, location);
    const canonicalUrl = `${this.baseUrl}/co/${location.city.toLowerCase().replace(/\s+/g, '-')}/sober-living`;
    
    // Generate advanced internal links
    const internalLinks = coloradoInternalLinking.generateInternalLinks(canonicalUrl, content);
    
    // Record content update for velocity tracking
    const contentUpdate = {
      url: canonicalUrl,
      type: 'created' as const,
      timestamp: new Date().toISOString(),
      contentHash: this.generateContentHash(content),
      priority: this.getLocationPriority(location) as 'high' | 'medium' | 'low',
      location: location.city,
      serviceType: 'sober_living'
    };
    
    coloradoContentVelocity.recordContentUpdate(contentUpdate);
    
    // Get velocity score
    const velocityScore = coloradoContentVelocity.getVelocityScore(canonicalUrl);
    
    // Get freshness signals
    const freshnessSignals = coloradoContentVelocity.getVelocitySignals(canonicalUrl);
    
    // Trigger rapid indexing for high-priority content
    if (this.shouldTriggerRapidIndexing(location)) {
      this.triggerRapidIndexing(canonicalUrl, location);
    }
    
    return {
      slug: locationTemplate.slug,
      title: locationTemplate.title,
      metaDescription: locationTemplate.metaDescription,
      h1: locationTemplate.h1,
      content,
      faqs: locationTemplate.contentStructure.faqs,
      schema: this.buildSchema(locationTemplate.schema, location),
      keywords,
      lastUpdated: new Date().toISOString(),
      canonical: canonicalUrl,
      velocityScore,
      indexingPriority: this.getLocationPriority(location),
      internalLinks,
      freshnessSignals
    };
  }
  
  private buildContent(template: SEOContentTemplate, location: ColoradoLocation): string {
    const sections = template.contentStructure.sections.map(section => {
      const localServices = this.getLocalServices(location, section.heading);
      
      return `
## ${section.heading}

${section.content}

${localServices ? this.formatLocalServices(localServices) : ''}

${this.generateInternalLinks(location, section.heading)}
`;
    }).join('\n');
    
    return `
${template.contentStructure.introduction}

${sections}

${this.generateResourceSection(location)}
${this.generateReferencesSection()}
`;
  }
  
  private getLocalServices(location: ColoradoLocation, sectionHeading: string): RecoveryService[] {
    const nearbyServices = COLORADO_RECOVERY_SERVICES.filter(service => {
      const distance = this.calculateDistance(
        location.coordinates,
        service.coordinates
      );
      return distance <= 50; // Within 50 miles
    });
    
    // Filter by relevance to section
    if (sectionHeading.toLowerCase().includes('sober living')) {
      return nearbyServices.filter(s => s.type === 'sober_living');
    } else if (sectionHeading.toLowerCase().includes('treatment')) {
      return nearbyServices.filter(s => s.type === 'treatment_center');
    }
    
    return nearbyServices;
  }
  
  private formatLocalServices(services: RecoveryService[]): string {
    return `
### Local Recovery Services

${services.map(service => `
**${service.name}** (${this.getServiceTypeLabel(service.type)})
- ${service.description}
- Phone: ${service.phone}
${service.website ? `- Website: [${service.website}](${service.website})` : ''}
- Services: ${service.services.join(', ')}
- Payment: ${service.paymentOptions.join(', ')}
- Certifications: ${service.certifications.join(', ')}
`).join('\n')}
`;
  }
  
  private getServiceTypeLabel(type: string): string {
    const labels = {
      'sober_living': 'Sober Living',
      'treatment_center': 'Treatment Center',
      'detox': 'Detox Center',
      'outpatient': 'Outpatient Program',
      'support_group': 'Support Group',
      'scholarship': 'Scholarship Program'
    };
    return labels[type] || type;
  }
  
  private generateInternalLinks(location: ColoradoLocation, sectionHeading: string): string {
    const relatedCities = this.getNearbyCities(location, 3);
    
    return `
### Related Resources

- [Recovery Services in ${location.county} County](/co/${location.county.toLowerCase().replace(/\s+/g, '-')}/recovery-services)
${relatedCities.map(city => 
  `- [Sober Living in ${city.city}](/co/${city.city.toLowerCase().replace(/\s+/g, '-')}/sober-living)`
).join('\n')}
`;
  }
  
  private getNearbyCities(location: ColoradoLocation, limit: number = 3): ColoradoLocation[] {
    return COLORADO_LOCATIONS
      .filter(loc => loc.city !== location.city)
      .map(loc => ({
        ...loc,
        distance: this.calculateDistance(location.coordinates, loc.coordinates)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }
  
  private generateResourceSection(location: ColoradoLocation): string {
    return `
## Additional Colorado Recovery Resources

### Statewide Services
- [Colorado Crisis Services](https://coloradocrisisservices.org) - 24/7 support
- [SAMHSA Treatment Locator](https://findtreatment.samhsa.gov) - National treatment directory
- [Colorado Department of Human Services](https://cdhs.colorado.gov) - State resources

### Local Support
- [${location.county} County Health Department](https://www.${location.county.toLowerCase().replace(/\s+/g, '')}.gov)
- [Colorado Recovery Community](https://coloradorecovery.org)
- [Peer Support Services](https://peersupportcolorado.org)

### Financial Assistance
- [Hornbuckle Foundation Scholarships](https://www.hornbucklefoundation.org)
- [Colorado Health Foundation Grants](https://coloradohealth.org)
- [Sliding Scale Treatment Options](https://colorado.gov/health)
`;
  }
  
  private generateReferencesSection(): string {
    return `
## References & Citations

*Last Updated: ${new Date().toLocaleDateString()}*

Sources:
- Substance Abuse and Mental Health Services Administration (SAMHSA)
- Colorado Department of Human Services, Behavioral Health Administration
- Colorado Health Foundation Recovery Programs
- Local recovery organizations and treatment centers
- Colorado Crisis Services data and reports

**Disclaimer:** This information is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for treatment decisions.
`;
  }
  
  private extractKeywords(template: SEOContentTemplate, location: ColoradoLocation): string[] {
    const keywords = new Set<string>();
    
    // Add template keywords
    template.contentStructure.sections.forEach(section => {
      section.keywords.forEach(keyword => keywords.add(keyword));
    });
    
    // Add location-specific keywords
    keywords.add(`sober living ${location.city}`);
    keywords.add(`recovery housing ${location.city}`);
    keywords.add(`addiction treatment ${location.city}`);
    keywords.add(`drug rehab ${location.city} Colorado`);
    keywords.add(`alcohol treatment ${location.city} CO`);
    
    return Array.from(keywords);
  }
  
  private buildSchema(baseSchema: object, location: ColoradoLocation): object {
    const schema = JSON.parse(JSON.stringify(baseSchema));
    
    // Replace location placeholders
    const schemaStr = JSON.stringify(schema)
      .replace(/\{city\}/g, location.city)
      .replace(/\{county\}/g, location.county);
    
    return JSON.parse(schemaStr);
  }
  
  private calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  // Generate content hash for freshness tracking
  private generateContentHash(content: string): string {
    return Buffer.from(content).toString('base64').slice(0, 16);
  }
  
  // Get location priority for indexing
  private getLocationPriority(location: ColoradoLocation): 'high' | 'medium' | 'low' {
    const highPriorityCities = ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins'];
    const mediumPriorityCities = ['Lakewood', 'Thornton', 'Westminster', 'Arvada', 'Pueblo', 'Boulder'];
    
    if (highPriorityCities.includes(location.city)) return 'high';
    if (mediumPriorityCities.includes(location.city)) return 'medium';
    return 'low';
  }
  
  // Check if location should trigger rapid indexing
  private shouldTriggerRapidIndexing(location: ColoradoLocation): boolean {
    const highPriorityCities = ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins'];
    return highPriorityCities.includes(location.city);
  }
  
  // Trigger rapid indexing for high-priority content
  private async triggerRapidIndexing(url: string, location: ColoradoLocation): Promise<void> {
    console.log(`🚀 Triggering rapid indexing for: ${location.city}`);
    
    try {
      // Submit to Google Indexing API
      await coloradoIndexingAPI.submitUrls([url], 'recovery_services');
      
      // Record high-priority content update
      coloradoContentVelocity.recordContentUpdate({
        url,
        type: 'created',
        timestamp: new Date().toISOString(),
        contentHash: this.generateContentHash(url),
        priority: 'high',
        location: location.city,
        serviceType: 'sober_living'
      });
      
      console.log(`✅ Rapid indexing triggered for ${location.city}`);
    } catch (error) {
      console.error(`❌ Rapid indexing failed for ${location.city}:`, error);
    }
  }
  
  // Generate content for all high-priority cities
  generateHighPriorityContent(templateType: string = 'city_sober_living'): GeneratedContent[] {
    const highPriorityCities = getPriorityLocations('high');
    return highPriorityCities.map(location => 
      this.generateCityContent(location, templateType)
    );
  }
  
  // Generate content for all cities
  generateAllContent(templateType: string = 'city_sober_living'): GeneratedContent[] {
    return COLORADO_LOCATIONS.map(location => 
      this.generateCityContent(location, templateType)
    );
  }
  
  // Generate sitemap data
  generateSitemapData(): Array<{ url: string; lastModified: string; priority: number }> {
    const highPriorityCities = getPriorityLocations('high');
    const mediumPriorityCities = getPriorityLocations('medium');
    
    return [
      // High priority pages
      ...highPriorityCities.map(city => ({
        url: `${this.baseUrl}/co/${city.city.toLowerCase().replace(/\s+/g, '-')}/sober-living`,
        lastModified: new Date().toISOString(),
        priority: 0.9
      })),
      
      // Medium priority pages
      ...mediumPriorityCities.map(city => ({
        url: `${this.baseUrl}/co/${city.city.toLowerCase().replace(/\s+/g, '-')}/sober-living`,
        lastModified: new Date().toISOString(),
        priority: 0.7
      }))
    ];
  }
}

// Export singleton instance
export const seoGenerator = new ColoradoSEOGenerator();