import type { KeywordCluster } from './colorado-keyword-research';
import { COLORADO_REHAB_KEYWORD_CLUSTERS } from './colorado-keyword-research';
import type { ColoradoLocation } from './colorado-seo-data';
import { COLORADO_LOCATIONS } from './colorado-seo-data';

export interface SEOPageData {
  title: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  content: string;
  schema: object;
  keywords: string[];
  internalLinks: Array<{ anchor: string; url: string }>;
  images: Array<{ alt: string; prompt: string }>;
}

export interface GeneratedPage extends SEOPageData {
  slug: string;
  city: string;
  service: ServiceType;
  priority: 'high' | 'medium' | 'low';
}

export class SEOPageGenerator {
  private static instance: SEOPageGenerator;
  
  private constructor() {}
  
  static getInstance(): SEOPageGenerator {
    if (!SEOPageGenerator.instance) {
      SEOPageGenerator.instance = new SEOPageGenerator();
    }
    return SEOPageGenerator.instance;
  }

  generatePages(): GeneratedPage[] {
    const pages: GeneratedPage[] = [];
    
    // Generate pages for each city and service combination
    COLORADO_LOCATIONS.forEach(city => {
      Object.entries(COLORADO_REHAB_KEYWORD_CLUSTERS).forEach(([serviceType, clusters]) => {
        clusters.forEach(cluster => {
          const page = this.generateCityServicePage(city, serviceType as ServiceType, cluster);
          pages.push(page);
        });
      });
    });

    // Add competitor-beating pages targeting Ripoff Report weaknesses
    pages.push(...this.generateCompetitorBeatingPages());
    
    // Add informational pages targeting Medium-style content
    pages.push(...this.generateInformationalPages());
    
    return pages.sort((a, b) => this.getPagePriority(a) - this.getPagePriority(b));
  }

  private generateCityServicePage(city: ColoradoLocation, service: ServiceType, cluster: KeywordCluster): GeneratedPage {
    const slug = this.generateSlug(city.city, service, cluster.primary);
    const isHighPriority = city.population > 100000 || service === 'detox';
    
    return {
      slug,
      city: city.city,
      service,
      priority: isHighPriority ? 'high' : city.population > 50000 ? 'medium' : 'low',
      ...this.createOptimizedContent(city, service, cluster)
    };
  }

  private createOptimizedContent(city: ColoradoLocation, service: ServiceType, cluster: KeywordCluster): SEOPageData {
    const title = this.generateTitle(city.city, service, cluster.primary);
    const metaDescription = this.generateMetaDescription(city.city, service, cluster);
    const h1 = this.generateH1(city.city, service);
    
    const content = this.generateCompetitorBeatingContent(city, service, cluster);
    const schema = this.generateAdvancedSchema(city, service);
    const keywords = this.generateKeywordList(city.city, service, cluster);
    const internalLinks = this.generateInternalLinks(city.city, service);
    const images = this.generateImageList(city.city, service);
    const h2s = this.generateH2s(service);

    return {
      title,
      metaDescription,
      h1,
      h2s,
      content,
      schema,
      keywords,
      internalLinks,
      images
    };
  }

  private generateTitle(city: string, service: ServiceType, primaryKeyword: string): string {
    const templates = {
      detox: [
        `${primaryKeyword} in ${city} | Medical Detox & Addiction Recovery`,
        `Best ${primaryKeyword} in ${city} | Safe Medical Detoxification`,
        `${city} ${primaryKeyword} | 24/7 Medical Supervision & Support`
      ],
      rehab: [
        `${primaryKeyword} in ${city} | Evidence-Based Treatment Programs`,
        `Top ${primaryKeyword} in ${city} | Comprehensive Recovery Services`,
        `${city} ${primaryKeyword} | Personalized Treatment Plans`
      ],
      'sober-living': [
        `${primaryKeyword} in ${city} | Supportive Recovery Housing`,
        `Best ${primaryKeyword} in ${city} | Safe & Structured Environment`,
        `${city} ${primaryKeyword} | Community-Based Recovery Support`
      ],
      'aftercare': [
        `${primaryKeyword} in ${city} | Long-Term Recovery Support`,
        `Comprehensive ${primaryKeyword} in ${city} | Relapse Prevention`,
        `${city} ${primaryKeyword} | Continued Care & Support`
      ]
    };

    return templates[service][0];
  }

  private generateMetaDescription(city: string, service: ServiceType, cluster: KeywordCluster): string {
    const baseDescriptions = {
      detox: `Professional medical detox services in ${city}. 24/7 supervised withdrawal management, evidence-based treatment, and comprehensive addiction recovery support.`,
      rehab: `Comprehensive addiction treatment in ${city}. Evidence-based therapies, personalized recovery programs, and long-term support for lasting sobriety.`,
      'sober-living': `Safe and supportive sober living in ${city}. Structured recovery housing with community support and accountability for lasting recovery.`,
      'aftercare': `Comprehensive aftercare programs in ${city}. Continued support, relapse prevention, and long-term recovery maintenance services.`
    };

    const competitorGap = cluster.competitorGap?.[0] || '';
    const trustSignal = cluster.trustSignals?.[0] || 'Licensed & accredited';
    
    return `${baseDescriptions[service]} ${trustSignal}. ${competitorGap ? `Better alternative to ${competitorGap}.` : ''}`;
  }

  private generateH1(city: string, service: ServiceType): string {
    const templates = {
      detox: `Medical Detox Services in ${city}`,
      rehab: `Addiction Treatment Programs in ${city}`,
      'sober-living': `Sober Living Homes in ${city}`,
      'aftercare': `Aftercare Support Programs in ${city}`
    };
    return templates[service];
  }

  private generateH2s(service: ServiceType): string[] {
    const h2Templates = {
      detox: [
        'Why Choose Medical Detox?',
        'Our Detox Process',
        '24/7 Medical Supervision',
        'Comfortable Withdrawal Management',
        'Insurance Coverage Options',
        'What to Expect During Detox',
        'Common Withdrawal Symptoms',
        'Detox Timeline & Duration',
        'Post-Detox Treatment Planning',
        'Getting Started with Detox'
      ],
      rehab: [
        'Comprehensive Treatment Approach',
        'Evidence-Based Therapies',
        'Individualized Treatment Plans',
        'Group Therapy & Support',
        'Family Involvement Programs',
        'Dual Diagnosis Treatment',
        'Holistic Recovery Methods',
        'Life Skills Development',
        'Relapse Prevention Strategies',
        'Continuing Care Planning'
      ],
      'sober-living': [
        'Benefits of Sober Living',
        'House Rules & Expectations',
        'Peer Support Community',
        'Accountability Systems',
        'Life Skills Training',
        'Employment Support',
        'Transportation Services',
        'Recovery Activities',
        'House Management',
        'Transition to Independence'
      ],
      'aftercare': [
        'Long-Term Recovery Support',
        'Relapse Prevention Planning',
        'Ongoing Therapy Options',
        'Support Group Connections',
        'Alumni Programs',
        'Family Support Services',
        'Life Coaching',
        'Crisis Intervention',
        'Recovery Monitoring',
        'Success Stories & Testimonials'
      ]
    };

    return h2Templates[service];
  }

  private generateCompetitorBeatingContent(city: ColoradoLocation, service: ServiceType, cluster: KeywordCluster): string {
    const competitorWeaknesses = {
      'ripoff report': 'Unlike facilities featured in Ripoff Report complaints, our program is fully licensed, transparent about costs, and provides evidence-based care with proven outcomes.',
      'scam': 'We understand concerns about rehab scams. Our facility is state-licensed, Joint Commission accredited, and provides transparent pricing with no hidden fees.',
      'complaints': 'While other facilities have numerous complaints, we maintain a 95% client satisfaction rate and are accredited by national healthcare organizations.',
      'lawsuit': 'Unlike facilities involved in lawsuits, we operate with full legal compliance and maintain the highest ethical standards in addiction treatment.'
    };

    const intro = `Finding quality ${service} services in ${city} can be challenging, especially with so many options available. Our comprehensive ${service} program provides evidence-based treatment with proven results for lasting recovery.`;

    const competitorContent = cluster.competitorGap?.map(gap => {
      const weakness = Object.entries(competitorWeaknesses).find(([key]) => gap.toLowerCase().includes(key));
      return weakness ? weakness[1] : '';
    }).filter(Boolean).join(' ') || '';

    const citySpecific = `${city.city} residents face unique challenges in addiction recovery, including access to quality healthcare services and transportation to treatment facilities. Our ${service} program addresses these specific needs with local expertise and community connections.`;

    const trustBuilding = `We provide transparent pricing, evidence-based care, and comprehensive aftercare support to ensure long-term recovery success.`;

    return `${intro} ${competitorContent} ${citySpecific} ${trustBuilding}`;
  }

  private generateAdvancedSchema(city: ColoradoLocation, service: ServiceType): object {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': service === 'detox' ? 'MedicalClinic' : 
               service === 'rehab' ? 'MedicalOrganization' :
               service === 'sober-living' ? 'Residence' : 'Organization',
      name: `${city.city} ${service.charAt(0).toUpperCase() + service.slice(1)} Services`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city.city,
        addressRegion: 'CO',
        addressCountry: 'US'
      },
      url: `https://metzlercares.org/seo/${this.generateSlug(city.city, service, service)}`
    };

    if (service === 'detox') {
      return {
        ...baseSchema,
        medicalSpecialty: 'Addiction Medicine',
        serviceType: ['Medical Detox', 'Withdrawal Management'],
        availableService: [
          {
            '@type': 'Service',
            name: 'Medical Detoxification',
            description: '24/7 medically supervised detox services'
          }
        ]
      };
    }

    if (service === 'rehab') {
      return {
        ...baseSchema,
        medicalSpecialty: 'Addiction Psychiatry',
        serviceType: ['Inpatient Treatment', 'Outpatient Treatment'],
        availableService: [
          {
            '@type': 'Service',
            name: 'Addiction Treatment',
            description: 'Comprehensive addiction recovery programs'
          }
        ]
      };
    }

    return baseSchema;
  }

  private generateKeywordList(city: string, service: ServiceType, cluster: KeywordCluster): string[] {
    const baseKeywords = [cluster.primary, `${service} ${city}`, `${city} ${service}`];
    const variations = cluster.variations?.slice(0, 5) || [];
    const competitorKeywords = cluster.competitorGap?.map(gap => gap.replace('ripoff report', 'legitimate')) || [];
    
    return [...baseKeywords, ...variations, ...competitorKeywords].slice(0, 10);
  }

  private generateInternalLinks(city: string, service: ServiceType): Array<{ anchor: string; url: string }> {
    const services = ['detox', 'rehab', 'sober-living', 'aftercare'];
    const links = [];

    services.forEach(svc => {
      if (svc !== service) {
        links.push({
          anchor: `${svc.charAt(0).toUpperCase() + svc.slice(1)} in ${city}`,
          url: `/seo/${this.generateSlug(city, svc as ServiceType, svc)}`
        });
      }
    });

    return links;
  }

  private generateImageList(city: string, service: ServiceType): Array<{ alt: string; prompt: string }> {
    const prompts = {
      detox: [
        { alt: 'Medical detox facility in Colorado', prompt: 'Modern medical detox facility building in Colorado, professional healthcare setting, welcoming entrance' },
        { alt: 'Comfortable detox room', prompt: 'Comfortable private room for medical detox, medical equipment, peaceful environment' },
        { alt: 'Medical staff supervision', prompt: 'Medical professionals monitoring patient during detox, 24/7 care, professional healthcare team' }
      ],
      rehab: [
        { alt: 'Addiction treatment center', prompt: 'Professional addiction treatment center in Colorado, therapy rooms, group spaces' },
        { alt: 'Group therapy session', prompt: 'Group therapy session for addiction recovery, supportive environment, professional facilitation' },
        { alt: 'Individual counseling room', prompt: 'Private counseling room for addiction therapy, comfortable setting, therapeutic environment' }
      ],
      'sober-living': [
        { alt: 'Sober living home', prompt: 'Comfortable sober living home in Colorado, residential setting, recovery supportive environment' },
        { alt: 'Shared living space', prompt: 'Shared living space in sober home, clean environment, recovery-focused setting' },
        { alt: 'Community kitchen', prompt: 'Shared kitchen in sober living facility, community space, recovery housing amenities' }
      ]
    };

    return prompts[service] || prompts.rehab;
  }

  private generateCompetitorBeatingPages(): GeneratedPage[] {
    const pages = [];
    
    const competitorTargets = [
      {
        keyword: 'colorado rehab scams to avoid',
        competitor: 'ripoff report',
        angle: 'legitimate alternatives'
      },
      {
        keyword: 'colorado detox center complaints',
        competitor: 'ripoff report', 
        angle: 'accredited facilities'
      },
      {
        keyword: 'colorado treatment center lawsuits',
        competitor: 'ripoff report',
        angle: 'legally compliant programs'
      }
    ];

    competitorTargets.forEach(target => {
      pages.push({
        slug: target.keyword.replace(/\s+/g, '-'),
        city: 'Colorado',
        service: 'rehab' as ServiceType,
        priority: 'high',
        title: `${target.keyword} | ${target.angle.charAt(0).toUpperCase() + target.angle.slice(1)}`,
        metaDescription: `Avoid ${target.competitor} complaints. Find ${target.angle} for addiction treatment in Colorado. Licensed, accredited, and transparent care.`,
        h1: `How to Avoid ${target.competitor.charAt(0).toUpperCase() + target.competitor.slice(1)} Issues in Colorado`,
        h2s: [
          'Red Flags to Watch For',
          'Questions to Ask Treatment Centers',
          'Verification of Licenses & Accreditation',
          'Transparent Pricing & No Hidden Fees',
          'Proven Track Record & Success Rates',
          'Client Testimonials & Reviews',
          'Legal Compliance & Ethical Standards',
          'Quality Assurance Measures',
          'Complaint Resolution Process',
          'Choosing Reputable Providers'
        ],
        content: `Learn how to identify and avoid problematic addiction treatment providers in Colorado. Unlike facilities featured in ${target.competitor} complaints, legitimate treatment centers maintain proper licensing, provide transparent pricing, and deliver evidence-based care with proven outcomes.`,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `Avoiding ${target.competitor} Issues in Colorado Addiction Treatment`,
          description: `Guide to identifying legitimate addiction treatment providers in Colorado`
        },
        keywords: [target.keyword, 'colorado rehab scams', 'legitimate treatment centers'],
        internalLinks: [
          { anchor: 'Colorado Detox Services', url: '/colorado-detox-services' },
          { anchor: 'Addiction Treatment Programs', url: '/colorado-addiction-treatment' }
        ],
        images: [
          { alt: 'Licensed treatment facility', prompt: 'Professional licensed addiction treatment facility, accreditation certificates, legitimate healthcare setting' }
        ]
      });
    });

    return pages;
  }

  private generateInformationalPages(): GeneratedPage[] {
    const pages = [];
    
    const informationalTopics = [
      {
        keyword: 'colorado addiction recovery journey',
        title: 'The Complete Colorado Addiction Recovery Journey',
        angle: 'comprehensive guide'
      },
      {
        keyword: 'colorado substance abuse statistics',
        title: 'Colorado Substance Abuse Statistics & Trends',
        angle: 'data-driven insights'
      },
      {
        keyword: 'colorado recovery success stories',
        title: 'Colorado Recovery Success Stories & Testimonials',
        angle: 'inspirational content'
      }
    ];

    informationalTopics.forEach(topic => {
      pages.push({
        slug: topic.keyword.replace(/\s+/g, '-'),
        city: 'Colorado',
        service: 'rehab' as ServiceType,
        priority: 'medium',
        title: topic.title,
        metaDescription: `Discover ${topic.angle} about addiction recovery in Colorado. Comprehensive information and resources for lasting recovery.`,
        h1: topic.title,
        h2s: [
          'Understanding Addiction in Colorado',
          'Available Treatment Options',
          'Recovery Statistics & Outcomes',
          'Support Systems & Resources',
          'Long-Term Recovery Planning',
          'Community Involvement',
          'Family Support Programs',
          'Aftercare Services',
          'Success Factors',
          'Getting Help'
        ],
        content: `Comprehensive information about ${topic.keyword} in Colorado. Learn about treatment options, recovery statistics, and support resources available throughout the state.`,
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: topic.title,
          description: `Comprehensive guide about ${topic.keyword} in Colorado`
        },
        keywords: [topic.keyword, 'colorado addiction recovery', 'substance abuse treatment'],
        internalLinks: [
          { anchor: 'Colorado Treatment Centers', url: '/colorado-treatment-centers' },
          { anchor: 'Recovery Support Services', url: '/colorado-recovery-support' }
        ],
        images: [
          { alt: 'Colorado recovery community', prompt: 'Colorado recovery community support, group meetings, healing environment' }
        ]
      });
    });

    return pages;
  }

  private generateSlug(city: string, service: ServiceType, keyword: string): string {
    const cleanCity = city.toLowerCase().replace(/\s+/g, '-');
    const cleanService = service.toLowerCase().replace(/\s+/g, '-');
    const cleanKeyword = keyword.toLowerCase().replace(/\s+/g, '-');
    
    return `${cleanCity}-${cleanService}-${cleanKeyword}`;
  }

  private getPagePriority(page: GeneratedPage): number {
    const priorityMap = { high: 1, medium: 2, low: 3 };
    return priorityMap[page.priority];
  }
}

export const seoPageGenerator = SEOPageGenerator.getInstance();