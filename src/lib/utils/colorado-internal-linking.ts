// Advanced internal linking architecture for Colorado recovery services
// Creates authority transfer and topical relevance similar to ripoffreport.com's structure

export interface InternalLink {
  source: string;
  target: string;
  anchorText: string;
  linkType: 'contextual' | 'navigational' | 'footer' | 'sidebar' | 'breadcrumb';
  priority: 'high' | 'medium' | 'low';
  relevance: number; // 0-1 score for topical relevance
  position: number; // Position in content (0-1, where 0.5 is middle)
  context: string; // Surrounding text context
}

export interface LinkCluster {
  topic: string;
  pillarPage: string;
  clusterPages: string[];
  authorityScore: number;
  internalLinks: InternalLink[];
  externalLinks: ExternalLink[];
}

export interface ExternalLink {
  url: string;
  domain: string;
  anchorText: string;
  authority: number; // Domain authority score
  relevance: number;
  isNofollow: boolean;
}

export interface LinkVelocity {
  date: string;
  newLinks: number;
  removedLinks: number;
  modifiedLinks: number;
  authorityTransfer: number;
}

export class ColoradoInternalLinking {
  private linkClusters: Map<string, LinkCluster> = new Map();
  private internalLinks: Map<string, InternalLink[]> = new Map();
  private authorityScores: Map<string, number> = new Map();
  private linkVelocity: LinkVelocity[] = [];
  
  constructor() {
    this.initializeLinkClusters();
  }
  
  // Initialize comprehensive link clusters for Colorado recovery services
  private initializeLinkClusters(): void {
    // Pillar cluster: Colorado Recovery Services (main hub)
    this.linkClusters.set('colorado-recovery', {
      topic: 'Colorado Recovery Services',
      pillarPage: '/co',
      clusterPages: [
        '/co/denver/recovery-services',
        '/co/colorado-springs/recovery-services',
        '/co/aurora/recovery-services',
        '/co/fort-collins/recovery-services',
        '/co/lakewood/recovery-services',
        '/co/thornton/recovery-services',
        '/co/westminster/recovery-services',
        '/co/arvada/recovery-services'
      ],
      authorityScore: 100,
      internalLinks: [],
      externalLinks: this.getExternalAuthorityLinks('colorado-recovery')
    });
    
    // Sober Living cluster
    this.linkClusters.set('sober-living', {
      topic: 'Colorado Sober Living',
      pillarPage: '/co/sober-living',
      clusterPages: [
        '/co/denver/sober-living',
        '/co/colorado-springs/sober-living',
        '/co/aurora/sober-living',
        '/co/fort-collins/sober-living',
        '/co/lakewood/sober-living',
        '/co/pueblo/sober-living',
        '/co/boulder/sober-living',
        '/co/greeley/sober-living'
      ],
      authorityScore: 95,
      internalLinks: [],
      externalLinks: this.getExternalAuthorityLinks('sober-living')
    });
    
    // Treatment Centers cluster
    this.linkClusters.set('treatment-centers', {
      topic: 'Colorado Treatment Centers',
      pillarPage: '/co/treatment-centers',
      clusterPages: [
        '/co/denver/treatment-centers',
        '/co/colorado-springs/treatment-centers',
        '/co/aurora/treatment-centers',
        '/co/fort-collins/treatment-centers',
        '/co/lakewood/treatment-centers',
        '/co/thornton/treatment-centers',
        '/co/westminster/treatment-centers',
        '/co/arvada/treatment-centers'
      ],
      authorityScore: 90,
      internalLinks: [],
      externalLinks: this.getExternalAuthorityLinks('treatment-centers')
    });
    
    // Recovery Scholarships cluster
    this.linkClusters.set('recovery-scholarships', {
      topic: 'Colorado Recovery Scholarships',
      pillarPage: '/co/recovery-scholarships',
      clusterPages: [
        '/co/denver/recovery-scholarships',
        '/co/colorado-springs/recovery-scholarships',
        '/co/aurora/recovery-scholarships',
        '/co/fort-collins/recovery-scholarships',
        '/co/lakewood/recovery-scholarships',
        '/co/pueblo/recovery-scholarships',
        '/co/boulder/recovery-scholarships',
        '/co/greeley/recovery-scholarships'
      ],
      authorityScore: 85,
      internalLinks: [],
      externalLinks: this.getExternalAuthorityLinks('recovery-scholarships')
    });
    
    // AA/12-Step Meetings cluster
    this.linkClusters.set('aa-meetings', {
      topic: 'Colorado AA Meetings',
      pillarPage: '/co/aa-meetings',
      clusterPages: [
        '/co/denver/aa-meetings',
        '/co/colorado-springs/aa-meetings',
        '/co/aurora/aa-meetings',
        '/co/fort-collins/aa-meetings',
        '/co/lakewood/aa-meetings',
        '/co/pueblo/aa-meetings',
        '/co/boulder/aa-meetings',
        '/co/greeley/aa-meetings'
      ],
      authorityScore: 80,
      internalLinks: [],
      externalLinks: this.getExternalAuthorityLinks('aa-meetings')
    });
  }
  
  // Generate external authority links (similar to ripoffreport.com's strategy)
  private getExternalAuthorityLinks(topic: string): ExternalLink[] {
    const authorityLinks: Record<string, ExternalLink[]> = {
      'colorado-recovery': [
        {
          url: 'https://www.samhsa.gov/find-help/national-helpline',
          domain: 'samhsa.gov',
          anchorText: 'SAMHSA National Helpline',
          authority: 95,
          relevance: 0.95,
          isNofollow: false
        },
        {
          url: 'https://www.colorado.gov/pacific/cdhs/adult-treatment',
          domain: 'colorado.gov',
          anchorText: 'Colorado Department of Human Services',
          authority: 90,
          relevance: 0.90,
          isNofollow: false
        }
      ],
      'sober-living': [
        {
          url: 'https://www.ncadd.org/',
          domain: 'ncadd.org',
          anchorText: 'National Council on Alcoholism and Drug Dependence',
          authority: 85,
          relevance: 0.85,
          isNofollow: false
        },
        {
          url: 'https://www.hornbucklefoundation.org/',
          domain: 'hornbucklefoundation.org',
          anchorText: 'Hornbuckle Foundation Recovery Housing',
          authority: 75,
          relevance: 0.95,
          isNofollow: false
        }
      ],
      'treatment-centers': [
        {
          url: 'https://www.asam.org/',
          domain: 'asam.org',
          anchorText: 'American Society of Addiction Medicine',
          authority: 88,
          relevance: 0.90,
          isNofollow: false
        },
        {
          url: 'https://www.colorado.gov/pacific/cdhs/substance-use',
          domain: 'colorado.gov',
          anchorText: 'Colorado Substance Use Treatment',
          authority: 90,
          relevance: 0.92,
          isNofollow: false
        }
      ],
      'recovery-scholarships': [
        {
          url: 'https://www.hornbucklefoundation.org/scholarships',
          domain: 'hornbucklefoundation.org',
          anchorText: 'Recovery Housing Scholarships',
          authority: 75,
          relevance: 0.98,
          isNofollow: false
        }
      ],
      'aa-meetings': [
        {
          url: 'https://www.aa.org/',
          domain: 'aa.org',
          anchorText: 'Alcoholics Anonymous',
          authority: 85,
          relevance: 0.95,
          isNofollow: false
        },
        {
          url: 'https://www.coloradoaa.org/',
          domain: 'coloradoaa.org',
          anchorText: 'Colorado AA Intergroup',
          authority: 70,
          relevance: 0.98,
          isNofollow: false
        }
      ]
    };
    
    return authorityLinks[topic] || [];
  }
  
  // Generate intelligent internal linking structure
  generateInternalLinks(pageUrl: string, content: string): InternalLink[] {
    const links: InternalLink[] = [];
    const cluster = this.findClusterForPage(pageUrl);
    
    if (!cluster) return links;
    
    // Pillar-to-cluster links (hub structure)
    if (pageUrl === cluster.pillarPage) {
      links.push(...this.generatePillarToClusterLinks(cluster));
    }
    
    // Cluster-to-pillar links (spoke structure)
    if (cluster.clusterPages.includes(pageUrl)) {
      links.push(...this.generateClusterToPillarLinks(cluster, pageUrl));
    }
    
    // Cross-cluster links for topical relevance
    links.push(...this.generateCrossClusterLinks(pageUrl, cluster));
    
    // Contextual links based on content analysis
    links.push(...this.generateContextualLinks(pageUrl, content));
    
    // Location-based links for Colorado cities
    links.push(...this.generateLocationBasedLinks(pageUrl));
    
    return this.optimizeLinkPlacement(links, content);
  }
  
  // Generate pillar-to-cluster hub links
  private generatePillarToClusterLinks(cluster: LinkCluster): InternalLink[] {
    return cluster.clusterPages.map((pageUrl, index) => ({
      source: cluster.pillarPage,
      target: pageUrl,
      anchorText: this.generateAnchorText(pageUrl, cluster.topic),
      linkType: 'contextual',
      priority: 'high',
      relevance: 0.95,
      position: 0.3 + (index * 0.1), // Distribute throughout content
      context: this.generateContextText(cluster.topic, pageUrl)
    }));
  }
  
  // Generate cluster-to-pillar spoke links
  private generateClusterToPillarLinks(cluster: LinkCluster, pageUrl: string): InternalLink[] {
    return [{
      source: pageUrl,
      target: cluster.pillarPage,
      anchorText: cluster.topic,
      linkType: 'navigational',
      priority: 'high',
      relevance: 0.95,
      position: 0.1, // Early in content
      context: `Learn more about ${cluster.topic} throughout Colorado`
    }];
  }
  
  // Generate cross-cluster links for topical authority
  private generateCrossClusterLinks(pageUrl: string, currentCluster: LinkCluster): InternalLink[] {
    const links: InternalLink[] = [];
    const relatedClusters = this.findRelatedClusters(currentCluster);
    
    relatedClusters.forEach((cluster, index) => {
      links.push({
        source: pageUrl,
        target: cluster.pillarPage,
        anchorText: this.generateCrossClusterAnchorText(currentCluster.topic, cluster.topic),
        linkType: 'contextual',
        priority: 'medium',
        relevance: 0.80,
        position: 0.6 + (index * 0.05),
        context: this.generateCrossClusterContext(currentCluster.topic, cluster.topic)
      });
    });
    
    return links;
  }
  
  // Generate contextual links based on content analysis
  private generateContextualLinks(pageUrl: string, content: string): InternalLink[] {
    const links: InternalLink[] = [];
    const keywords = this.extractKeywords(content);
    
    keywords.forEach((keyword, index) => {
      const targetUrl = this.findRelevantPage(keyword);
      if (targetUrl && targetUrl !== pageUrl) {
        links.push({
          source: pageUrl,
          target: targetUrl,
          anchorText: keyword,
          linkType: 'contextual',
          priority: 'medium',
          relevance: 0.75,
          position: 0.4 + (index * 0.02),
          context: content.substring(Math.max(0, content.indexOf(keyword) - 50), content.indexOf(keyword) + keyword.length + 50)
        });
      }
    });
    
    return links;
  }
  
  // Generate location-based links for Colorado cities
  private generateLocationBasedLinks(pageUrl: string): InternalLink[] {
    const links: InternalLink[] = [];
    const location = this.extractLocationFromUrl(pageUrl);
    
    if (!location) return links;
    
    // Link to nearby cities
    const nearbyCities = this.getNearbyCities(location);
    nearbyCities.forEach((city, index) => {
      const targetUrl = pageUrl.replace(location.toLowerCase().replace(/\s+/g, '-'), city.toLowerCase().replace(/\s+/g, '-'));
      links.push({
        source: pageUrl,
        target: targetUrl,
        anchorText: `${city} recovery services`,
        linkType: 'contextual',
        priority: 'medium',
        relevance: 0.85,
        position: 0.7 + (index * 0.03),
        context: `Recovery services also available in nearby ${city}`
      });
    });
    
    return links;
  }
  
  // Optimize link placement for maximum SEO impact
  private optimizeLinkPlacement(links: InternalLink[], content: string): InternalLink[] {
    // Sort by priority and relevance
    links.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.relevance - a.relevance;
    });
    
    // Limit links per page (avoid over-optimization)
    const maxLinks = 15;
    return links.slice(0, maxLinks);
  }
  
  // Generate anchor text with keyword variation
  private generateAnchorText(url: string, topic: string): string {
    const location = this.extractLocationFromUrl(url);
    const serviceType = this.extractServiceTypeFromUrl(url);
    
    const variations = [
      `${location} ${serviceType}`,
      `${serviceType} in ${location}`,
      `${location} Colorado ${serviceType}`,
      `${serviceType} services in ${location}`,
      `${location} recovery support`
    ];
    
    return variations[Math.floor(Math.random() * variations.length)];
  }
  
  // Generate cross-cluster anchor text
  private generateCrossClusterAnchorText(sourceTopic: string, targetTopic: string): string {
    const crossClusterVariations: Record<string, Record<string, string[]>> = {
      'sober-living': {
        'treatment-centers': ['treatment centers', 'addiction treatment', 'rehab programs'],
        'recovery-scholarships': ['recovery housing scholarships', 'sober living funding', 'recovery support'],
        'aa-meetings': ['AA meetings', '12-step programs', 'peer support groups']
      },
      'treatment-centers': {
        'sober-living': ['sober living homes', 'recovery housing', 'transitional living'],
        'recovery-scholarships': ['treatment scholarships', 'recovery funding', 'financial assistance'],
        'aa-meetings': ['aftercare support', 'ongoing recovery', 'peer meetings']
      }
    };
    
    const variations = crossClusterVariations[sourceTopic]?.[targetTopic] || [targetTopic];
    return variations[Math.floor(Math.random() * variations.length)];
  }
  
  // Generate context text for links
  private generateContextText(topic: string, url: string): string {
    const location = this.extractLocationFromUrl(url);
    return `Comprehensive ${topic} available in ${location} with professional support services.`;
  }
  
  // Generate cross-cluster context
  private generateCrossClusterContext(sourceTopic: string, targetTopic: string): string {
    const contexts: Record<string, Record<string, string>> = {
      'sober-living': {
        'treatment-centers': 'Many individuals start with treatment before transitioning to sober living.',
        'recovery-scholarships': 'Financial assistance available for qualified individuals seeking recovery housing.',
        'aa-meetings': 'Ongoing peer support through regular meetings and community engagement.'
      },
      'treatment-centers': {
        'sober-living': 'After completing treatment, many transition to supportive sober living environments.',
        'recovery-scholarships': 'Treatment costs can be offset through various scholarship programs.',
        'aa-meetings': 'Continuing care through peer support groups and 12-step programs.'
      }
    };
    
    return contexts[sourceTopic]?.[targetTopic] || `Learn more about ${targetTopic}.`;
  }
  
  // Helper methods
  private findClusterForPage(pageUrl: string): LinkCluster | null {
    for (const cluster of this.linkClusters.values()) {
      if (cluster.pillarPage === pageUrl || cluster.clusterPages.includes(pageUrl)) {
        return cluster;
      }
    }
    return null;
  }
  
  private findRelatedClusters(currentCluster: LinkCluster): LinkCluster[] {
    const related: LinkCluster[] = [];
    for (const cluster of this.linkClusters.values()) {
      if (cluster.topic !== currentCluster.topic) {
        related.push(cluster);
      }
    }
    return related;
  }
  
  private extractLocationFromUrl(url: string): string {
    const match = url.match(/\/co\/([^\/]+)/);
    return match ? match[1].replace(/-/g, ' ') : '';
  }
  
  private extractServiceTypeFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'recovery services';
  }
  
  private extractKeywords(content: string): string[] {
    // Simple keyword extraction - in production, use NLP libraries
    const keywords = [
      'sober living', 'recovery', 'treatment', 'addiction', 'rehab',
      'detox', 'counseling', 'support', 'scholarships', 'housing',
      'AA meetings', '12-step', 'peer support', 'aftercare'
    ];
    
    return keywords.filter(keyword => content.toLowerCase().includes(keyword));
  }
  
  private findRelevantPage(keyword: string): string {
    const keywordMap: Record<string, string> = {
      'sober living': '/co/sober-living',
      'treatment': '/co/treatment-centers',
      'recovery': '/co/recovery-services',
      'scholarships': '/co/recovery-scholarships',
      'AA meetings': '/co/aa-meetings',
      '12-step': '/co/aa-meetings'
    };
    
    return keywordMap[keyword] || '';
  }
  
  private getNearbyCities(location: string): string[] {
    const nearbyMap: Record<string, string[]> = {
      'denver': ['aurora', 'lakewood', 'thornton', 'westminster', 'arvada'],
      'colorado springs': ['pueblo', 'fountain', 'monument', 'woodland park'],
      'aurora': ['denver', 'lakewood', 'thornton', 'westminster'],
      'fort collins': ['loveland', 'greeley', 'windsor', 'timnath']
    };
    
    return nearbyMap[location.toLowerCase()] || [];
  }
  
  // Track link velocity and authority transfer
  trackLinkVelocity(): LinkVelocity {
    const today = new Date().toISOString().split('T')[0];
    const existing = this.linkVelocity.find(v => v.date === today);
    
    if (existing) {
      existing.newLinks++;
      existing.authorityTransfer += Math.random() * 5; // Simulate authority transfer
    } else {
      this.linkVelocity.push({
        date: today,
        newLinks: 1,
        removedLinks: 0,
        modifiedLinks: 0,
        authorityTransfer: Math.random() * 5
      });
    }
    
    return this.linkVelocity[this.linkVelocity.length - 1];
  }
  
  // Get authority score for specific page
  getPageAuthority(pageUrl: string): number {
    const cluster = this.findClusterForPage(pageUrl);
    if (!cluster) return 50; // Default authority
    
    const baseAuthority = cluster.authorityScore;
    const linkBonus = this.internalLinks.get(pageUrl)?.length || 0;
    const freshnessBonus = this.calculateFreshnessBonus(pageUrl);
    
    return Math.min(100, baseAuthority + (linkBonus * 2) + freshnessBonus);
  }
  
  // Calculate freshness bonus for recently updated content
  private calculateFreshnessBonus(pageUrl: string): number {
    // Mock implementation - in production, track actual content updates
    return Math.random() * 10;
  }
  
  // Generate comprehensive link audit report
  generateLinkAudit(): any {
    const totalLinks = Array.from(this.internalLinks.values()).flat().length;
    const totalClusters = this.linkClusters.size;
    const avgAuthority = Array.from(this.authorityScores.values()).reduce((a, b) => a + b, 0) / this.authorityScores.size || 50;
    
    return {
      totalInternalLinks: totalLinks,
      totalClusters: totalClusters,
      averageAuthorityScore: avgAuthority,
      linkVelocity: this.linkVelocity.slice(-7), // Last 7 days
      topClusters: Array.from(this.linkClusters.values())
        .sort((a, b) => b.authorityScore - a.authorityScore)
        .slice(0, 5),
      recommendations: this.generateLinkRecommendations()
    };
  }
  
  // Generate link building recommendations
  private generateLinkRecommendations(): string[] {
    return [
      'Increase cross-cluster linking between treatment centers and sober living',
      'Add more contextual links within city-specific pages',
      'Create additional pillar pages for specialized recovery topics',
      'Improve anchor text diversity to avoid over-optimization',
      'Add more external authority links to government and medical sites'
    ];
  }
}

// Export singleton instance
export const coloradoInternalLinking = new ColoradoInternalLinking();