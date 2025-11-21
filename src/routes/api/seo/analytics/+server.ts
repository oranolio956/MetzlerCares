// Analytics dashboard API for Colorado SEO performance
import { seoAnalytics } from '$lib/utils/colorado-seo-analytics';
import { coloradoTechnicalSEO } from '$lib/utils/colorado-technical-seo';
import { seoGenerator } from '$lib/utils/colorado-seo-generator';
import { COLORADO_LOCATIONS } from '$lib/utils/colorado-seo-data';

export async function GET({ url }) {
  try {
    const type = url.searchParams.get('type') || 'overview';
    const location = url.searchParams.get('location');
    const dateRange = url.searchParams.get('dateRange') || '30d';

    let data: any = {};

    switch (type) {
      case 'overview':
        data = await getOverviewData();
        break;
      case 'keyword-performance':
        data = await getKeywordPerformance(location);
        break;
      case 'traffic-analytics':
        data = await getTrafficAnalytics(location, dateRange);
        break;
      case 'technical-seo':
        data = await getTechnicalSEOData(location);
        break;
      case 'competitor-analysis':
        data = await getCompetitorAnalysis();
        break;
      case 'content-performance':
        data = await getContentPerformance(location);
        break;
      case 'local-seo':
        data = await getLocalSEOData(location);
        break;
      default:
        data = { error: 'Invalid analytics type' };
    }

    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 minute cache
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate analytics data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Get overview analytics data
async function getOverviewData() {
  const keywordReport = await seoAnalytics.generateKeywordReport();
  const competitorAnalysis = await seoAnalytics.analyzeCompetitors();
  const technicalIssues = await coloradoTechnicalSEO.analyzeCoreWebVitals('https://metzlercares.com');

  // Calculate key metrics
  const totalKeywords = keywordReport.length;
  const top10Rankings = keywordReport.filter(kw => kw.currentPosition <= 10).length;
  const avgPosition = keywordReport.reduce((sum, kw) => sum + kw.currentPosition, 0) / totalKeywords;
  const totalTraffic = keywordReport.reduce((sum, kw) => sum + kw.clicks, 0);

  // Get top performing pages
  const topPages = await getTopPerformingPages();

  // Get recent keyword movements
  const keywordMovements = await getKeywordMovements();

  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalKeywords,
      top10Rankings,
      avgPosition: avgPosition.toFixed(1),
      totalTraffic,
      trafficGrowth: calculateTrafficGrowth(totalTraffic),
      keywordGrowth: calculateKeywordGrowth(totalKeywords)
    },
    keywordMetrics: {
      topPerformers: keywordReport.filter(kw => kw.currentPosition <= 10).slice(0, 5),
      opportunities: keywordReport.filter(kw => kw.currentPosition > 10 && kw.currentPosition <= 30).slice(0, 5),
      positionDistribution: getPositionDistribution(keywordReport)
    },
    competitorMetrics: {
      topCompetitors: competitorAnalysis.slice(0, 5),
      marketShare: calculateMarketShare(competitorAnalysis),
      keywordOverlap: calculateKeywordOverlap(competitorAnalysis)
    },
    technicalMetrics: {
      coreWebVitals: {
        lcp: technicalIssues.lcp,
        fid: technicalIssues.fid,
        cls: technicalIssues.cls,
        score: technicalIssues.overallScore
      },
      issues: technicalIssues.issues.length,
      mobileFriendly: true,
      schemaValid: true
    },
    topPages,
    keywordMovements,
    recommendations: generateRecommendations(keywordReport, competitorAnalysis)
  };
}

// Get keyword performance data
async function getKeywordPerformance(location?: string | null) {
  const keywordReport = await seoAnalytics.generateKeywordReport();

  let keywords = keywordReport;

  // Filter by location if specified
  if (location) {
    keywords = keywords.filter(kw =>
      kw.keyword.toLowerCase().includes(location.toLowerCase())
    );
  }

  return {
    timestamp: new Date().toISOString(),
    location: location || 'All Colorado',
    totalKeywords: keywords.length,
    keywords: keywords.slice(0, 50), // Top 50 keywords
    performanceByPosition: getPositionDistribution(keywords),
    trendingKeywords: getTrendingKeywords(keywords),
    decliningKeywords: getDecliningKeywords(keywords),
    opportunities: getKeywordOpportunities(keywords)
  };
}

// Get traffic analytics data
async function getTrafficAnalytics(location?: string | null, dateRange: string = '30d') {
  // Mock traffic data (in production, integrate with Google Analytics API)
  const baseTraffic = location ? 1500 : 5000;
  const locationMultiplier = location ? 2 : 1;

  const trafficData = {
    organic: Math.floor(baseTraffic * locationMultiplier * (Math.random() * 0.5 + 0.75)),
    local: Math.floor(baseTraffic * 0.3 * locationMultiplier * (Math.random() * 0.5 + 0.75)),
    direct: Math.floor(baseTraffic * 0.2 * (Math.random() * 0.5 + 0.75)),
    referral: Math.floor(baseTraffic * 0.15 * (Math.random() * 0.5 + 0.75))
  };

  const engagementData = {
    bounceRate: Math.random() * 0.3 + 0.3, // 30-60%
    avgSessionDuration: Math.random() * 180 + 120, // 2-5 minutes
    pagesPerSession: Math.random() * 2 + 2, // 2-4 pages
    conversionRate: Math.random() * 0.02 + 0.01 // 1-3%
  };

  return {
    timestamp: new Date().toISOString(),
    location: location || 'All Colorado',
    dateRange,
    traffic: trafficData,
    engagement: engagementData,
    topReferrers: getTopReferrers(location),
    deviceBreakdown: getDeviceBreakdown(),
    geographicBreakdown: getGeographicBreakdown(location)
  };
}

// Get technical SEO data
async function getTechnicalSEOData(location?: string | null) {
  const pages = location
    ? [`https://metzlercares.com/co/${location}/sober-living`]
    : [
      'https://metzlercares.com/',
      'https://metzlercares.com/co',
      'https://metzlercares.com/co/denver/sober-living',
      'https://metzlercares.com/co/colorado-springs/sober-living'
    ];

  const technicalData = [];

  for (const page of pages) {
    const analysis = await coloradoTechnicalSEO.analyzeCoreWebVitals(page);
    technicalData.push({
      ...analysis,
      url: page
    });
  }

  return {
    timestamp: new Date().toISOString(),
    location: location || 'All Pages',
    pages: technicalData,
    avgScore: technicalData.reduce((sum, page) => sum + page.overallScore, 0) / technicalData.length,
    criticalIssues: technicalData.reduce((sum, page) => sum + page.issues.filter(i => i.severity === 'critical').length, 0),
    warnings: technicalData.reduce((sum, page) => sum + page.issues.filter(i => i.severity === 'warning').length, 0),
    recommendations: generateTechnicalRecommendations(technicalData)
  };
}

// Get competitor analysis data
async function getCompetitorAnalysis() {
  const competitorData = await seoAnalytics.analyzeCompetitors();
  const competitorChanges = await seoAnalytics.trackCompetitorChanges();

  return {
    timestamp: new Date().toISOString(),
    competitors: competitorData,
    marketShare: calculateMarketShare(competitorData),
    keywordOverlap: calculateKeywordOverlap(competitorData),
    competitorChanges,
    opportunities: identifyCompetitorOpportunities(competitorData),
    threats: identifyCompetitorThreats(competitorData)
  };
}

// Get content performance data
async function getContentPerformance(location?: string | null) {
  const pages = location
    ? [`/co/${location}/sober-living`]
    : ['/co', '/co/denver/sober-living', '/co/colorado-springs/sober-living'];

  const contentData = [];

  for (const page of pages) {
    const performance = {
      url: page,
      wordCount: Math.floor(Math.random() * 2000) + 1500,
      keywords: Math.floor(Math.random() * 100) + 20,
      traffic: Math.floor(Math.random() * 2000) + 500,
      engagement: {
        bounceRate: Math.random() * 0.3 + 0.3,
        avgTime: Math.random() * 180 + 120
      },
      socialShares: Math.floor(Math.random() * 50) + 10,
      backlinks: Math.floor(Math.random() * 100) + 20
    };

    contentData.push(performance);
  }

  return {
    timestamp: new Date().toISOString(),
    location: location || 'All Content',
    pages: contentData,
    topPerformingContent: contentData.sort((a, b) => b.traffic - a.traffic).slice(0, 3),
    contentGaps: identifyContentGaps(contentData, location),
    optimizationOpportunities: identifyContentOpportunities(contentData)
  };
}

// Get local SEO data
async function getLocalSEOData(location?: string | null) {
  const locations = location
  const growth = (Math.random() * 40) - 10; // -10% to +30%
  return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
}

function calculateKeywordGrowth(currentKeywords: number): string {
  const growth = (Math.random() * 30) - 5; // -5% to +25%
  return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
}

function getPositionDistribution(keywords: any[]): any {
  const positions = { top3: 0, top10: 0, top20: 0, top50: 0, beyond: 0 };

  keywords.forEach(kw => {
    if (kw.currentPosition <= 3) positions.top3++;
    else if (kw.currentPosition <= 10) positions.top10++;
    else if (kw.currentPosition <= 20) positions.top20++;
    else if (kw.currentPosition <= 50) positions.top50++;
    else positions.beyond++;
  });

  return positions;
}

function getTrendingKeywords(keywords: any[]): any[] {
  return keywords
    .filter(kw => kw.positionChange < 0) // Improving positions
    .sort((a, b) => a.positionChange - b.positionChange)
    .slice(0, 5);
}

function getDecliningKeywords(keywords: any[]): any[] {
  return keywords
    .filter(kw => kw.positionChange > 0) // Declining positions
    .sort((a, b) => b.positionChange - a.positionChange)
    .slice(0, 5);
}

function getKeywordOpportunities(keywords: any[]): any[] {
  return keywords
    .filter(kw => kw.currentPosition > 10 && kw.searchVolume > 1000)
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 10);
}

function calculateMarketShare(competitors: any[]): number {
  const totalVisibility = competitors.reduce((sum, comp) => sum + comp.visibility, 0);
  const ourVisibility = 25; // Mock our visibility
  return (ourVisibility / (totalVisibility + ourVisibility)) * 100;
}

function calculateKeywordOverlap(competitors: any[]): number {
  return Math.floor(Math.random() * 200) + 50; // Mock overlap
}

function getTopPerformingPages(): any[] {
  return [
    { url: '/co/denver/sober-living', traffic: 2500, keywords: 45, conversions: 25 },
    { url: '/co', traffic: 1800, keywords: 120, conversions: 18 },
    { url: '/co/colorado-springs/sober-living', traffic: 1200, keywords: 32, conversions: 15 },
    { url: '/get-aid', traffic: 800, keywords: 28, conversions: 32 },
    { url: '/co/aurora/sober-living', traffic: 600, keywords: 24, conversions: 12 }
  ];
}

function getKeywordMovements(): any {
  return {
    improved: Math.floor(Math.random() * 20) + 10,
    declined: Math.floor(Math.random() * 10) + 5,
    newRankings: Math.floor(Math.random() * 15) + 5,
    lostRankings: Math.floor(Math.random() * 5) + 2
  };
}

function generateRecommendations(keywordReport: any, competitorAnalysis: any): string[] {
  return [
    'Focus on high-opportunity keywords with positions 11-20',
    'Build more local citations for Colorado cities',
    'Optimize Core Web Vitals for better user experience',
    'Create more FAQ content for featured snippet opportunities',
    'Develop location-specific landing pages for underserved cities'
  ];
}

function getTopReferrers(location?: string | null): any[] {
  return [
    { source: 'Google Search', traffic: location ? 1200 : 3500 },
    { source: 'Facebook', traffic: location ? 150 : 400 },
    { source: 'Colorado.gov', traffic: location ? 80 : 200 },
    { source: 'SAMHSA.gov', traffic: location ? 60 : 150 },
    { source: 'Direct', traffic: location ? 300 : 800 }
  ];
}

function getDeviceBreakdown(): any {
  return {
    desktop: 45,
    mobile: 48,
    tablet: 7
  };
}

function getGeographicBreakdown(location?: string | null): any[] {
  if (location) {
    return [{ city: location, traffic: 1000, percentage: 100 }];
  }

  return [
    { city: 'Denver', traffic: 1800, percentage: 36 },
    { city: 'Colorado Springs', traffic: 900, percentage: 18 },
    { city: 'Aurora', traffic: 600, percentage: 12 },
    { city: 'Fort Collins', traffic: 400, percentage: 8 },
    { city: 'Other', traffic: 1300, percentage: 26 }
  ];
}

function generateTechnicalRecommendations(technicalData: any[]): string[] {
  return [
    'Optimize images for faster loading',
    'Enable browser caching',
    'Minimize CSS and JavaScript',
    'Use CDN for static assets',
    'Implement lazy loading for images'
  ];
}

function identifyCompetitorOpportunities(competitors: any[]): any[] {
  return competitors.slice(0, 3).map(comp => ({
    domain: comp.domain,
    opportunity: comp.keywords > 1000 ? 'high' : 'medium',
    focus: 'content gap analysis'
  }));
}

function identifyCompetitorThreats(competitors: any[]): any[] {
  return competitors.filter(comp => comp.visibility > 40).map(comp => ({
    domain: comp.domain,
    threat: 'high',
    reason: 'high visibility and keyword coverage'
  }));
}

function identifyContentGaps(contentData: any[], location?: string | null): string[] {
  return [
    'Add more FAQ sections',
    'Include more local testimonials',
    'Add cost comparison tables',
    'Include more visual content'
  ];
}

function identifyContentOpportunities(contentData: any[]): string[] {
  return [
    'Create more long-form content',
    'Add more internal linking',
    'Optimize for featured snippets',
    'Add more multimedia content'
  ];
}

function identifyCitationOpportunities(localData: any[]): any[] {
  return localData.filter(loc => loc.citations < 25).map(loc => ({
    city: loc.city,
    currentCitations: loc.citations,
    opportunity: 'high',
    recommendations: ['Google My Business', 'Yelp', 'Colorado directories']
  }));
}

function identifyReviewOpportunities(localData: any[]): any[] {
  return localData.filter(loc => loc.reviews < 50).map(loc => ({
    city: loc.city,
    currentReviews: loc.reviews,
    opportunity: 'medium',
    recommendations: ['Email campaigns', 'SMS follow-ups', 'Incentive programs']
  }));
}

function generateLocalRecommendations(localData: any[]): string[] {
  return [
    'Optimize Google My Business listings',
    'Build local citations',
    'Encourage customer reviews',
    'Create location-specific content',
    'Build local backlinks'
  ];
}