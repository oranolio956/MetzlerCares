// Advanced SEO Analytics & Monitoring System
// Real-time tracking, predictive analytics, and competitive intelligence

export interface RankingData {
  keyword: string
  position: number
  previousPosition: number
  change: number
  url: string
  searchVolume: number
  difficulty: number
  ctr: number
  impressions: number
  clicks: number
  date: string
}

export interface CompetitorData {
  domain: string
  visibility: number
  keywords: number
  traffic: number
  backlinks: number
  domainAuthority: number
  topPages: Array<{
    url: string
    traffic: number
    keywords: number
  }>
  rankingChanges: Array<{
    keyword: string
    change: number
    date: string
  }>
}

export interface PerformanceTrend {
  date: string
  organicTraffic: number
  rankings: number
  backlinks: number
  domainAuthority: number
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
  }
}

export interface SEOHealthScore {
  overall: number
  technical: number
  content: number
  backlinks: number
  performance: number
  local: number
  issues: Array<{
    severity: 'critical' | 'warning' | 'info'
    category: string
    description: string
    recommendation: string
  }>
}

export interface PredictiveInsight {
  type: 'opportunity' | 'threat' | 'trend'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  timeframe: string
  actionItems: string[]
  confidence: number
}

export class AdvancedSEOAnalytics {
  private baseUrl: string
  private rankingHistory: RankingData[] = []
  private competitorData: CompetitorData[] = []
  private performanceTrends: PerformanceTrend[] = []

  constructor(baseUrl: string = 'https://metzlercares.com') {
    this.baseUrl = baseUrl
  }

  // Track keyword rankings over time
  trackRanking(keyword: string, position: number, url: string, metadata?: {
    searchVolume?: number
    difficulty?: number
    ctr?: number
    impressions?: number
    clicks?: number
  }): RankingData {
    const previous = this.rankingHistory
      .filter(r => r.keyword === keyword && r.url === url)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    const ranking: RankingData = {
      keyword,
      position,
      previousPosition: previous?.position || position,
      change: previous ? position - previous.position : 0,
      url,
      searchVolume: metadata?.searchVolume || 0,
      difficulty: metadata?.difficulty || 0,
      ctr: metadata?.ctr || 0,
      impressions: metadata?.impressions || 0,
      clicks: metadata?.clicks || 0,
      date: new Date().toISOString()
    }

    this.rankingHistory.push(ranking)
    return ranking
  }

  // Calculate SEO health score
  calculateHealthScore(data: {
    technicalIssues: number
    contentQuality: number
    backlinkCount: number
    performanceScore: number
    localSignals: number
  }): SEOHealthScore {
    const technical = Math.max(0, 100 - (data.technicalIssues * 10))
    const content = data.contentQuality
    const backlinks = Math.min(100, (data.backlinkCount / 100) * 100)
    const performance = data.performanceScore
    const local = data.localSignals

    const overall = (
      technical * 0.25 +
      content * 0.25 +
      backlinks * 0.15 +
      performance * 0.20 +
      local * 0.15
    )

    const issues: SEOHealthScore['issues'] = []

    if (data.technicalIssues > 0) {
      issues.push({
        severity: data.technicalIssues > 5 ? 'critical' : 'warning',
        category: 'Technical SEO',
        description: `${data.technicalIssues} technical issues detected`,
        recommendation: 'Review and fix technical SEO issues'
      })
    }

    if (data.contentQuality < 70) {
      issues.push({
        severity: 'warning',
        category: 'Content Quality',
        description: 'Content quality below optimal threshold',
        recommendation: 'Enhance content depth and value'
      })
    }

    if (data.backlinkCount < 50) {
      issues.push({
        severity: 'info',
        category: 'Backlinks',
        description: 'Backlink profile could be stronger',
        recommendation: 'Develop link building strategy'
      })
    }

    return {
      overall: Math.round(overall),
      technical: Math.round(technical),
      content: Math.round(content),
      backlinks: Math.round(backlinks),
      performance: Math.round(performance),
      local: Math.round(local),
      issues
    }
  }

  // Analyze competitor performance
  analyzeCompetitors(competitors: CompetitorData[]): {
    insights: string[]
    opportunities: string[]
    threats: string[]
    recommendations: string[]
  } {
    const insights: string[] = []
    const opportunities: string[] = []
    const threats: string[] = []
    const recommendations: string[] = []

    // Find top competitor
    const topCompetitor = competitors.sort((a, b) => b.visibility - a.visibility)[0]

    if (topCompetitor) {
      insights.push(`${topCompetitor.domain} leads with ${topCompetitor.visibility} visibility points`)
      
      // Analyze their top pages
      const topPages = topCompetitor.topPages.slice(0, 5)
      opportunities.push(`Target keywords from ${topCompetitor.domain}'s top pages: ${topPages.map(p => p.url).join(', ')}`)
      
      // Check for gaps
      if (topCompetitor.backlinks > 1000) {
        threats.push(`${topCompetitor.domain} has ${topCompetitor.backlinks} backlinks - significant link advantage`)
        recommendations.push('Develop aggressive link building campaign')
      }
    }

    // Find keyword opportunities
    const lowCompetitionKeywords = competitors
      .flatMap(c => c.rankingChanges)
      .filter(rc => Math.abs(rc.change) > 5)
      .map(rc => rc.keyword)

    if (lowCompetitionKeywords.length > 0) {
      opportunities.push(`Keywords with ranking volatility: ${lowCompetitionKeywords.slice(0, 10).join(', ')}`)
      recommendations.push('Target volatile keywords where competitors are losing ground')
    }

    return { insights, opportunities, threats, recommendations }
  }

  // Generate predictive insights
  generatePredictiveInsights(trends: PerformanceTrend[]): PredictiveInsight[] {
    const insights: PredictiveInsight[] = []

    if (trends.length < 2) return insights

    // Calculate growth rates
    const recent = trends[trends.length - 1]
    const previous = trends[trends.length - 2]

    const trafficGrowth = ((recent.organicTraffic - previous.organicTraffic) / previous.organicTraffic) * 100
    const rankingGrowth = recent.rankings - previous.rankings

    // Traffic opportunity
    if (trafficGrowth > 10) {
      insights.push({
        type: 'opportunity',
        title: 'Rapid Traffic Growth Detected',
        description: `Organic traffic increased by ${trafficGrowth.toFixed(1)}% in the last period`,
        impact: 'high',
        timeframe: 'Continue current strategy',
        actionItems: [
          'Double down on high-performing content',
          'Expand successful keyword targeting',
          'Optimize conversion paths for increased traffic'
        ],
        confidence: 85
      })
    }

    // Ranking opportunity
    if (rankingGrowth > 20) {
      insights.push({
        type: 'opportunity',
        title: 'Significant Ranking Improvements',
        description: `Gained ${rankingGrowth} new keyword rankings`,
        impact: 'high',
        timeframe: '2-4 weeks to see traffic impact',
        actionItems: [
          'Monitor new rankings for stability',
          'Optimize pages for featured snippets',
          'Build backlinks to newly ranking pages'
        ],
        confidence: 80
      })
    }

    // Performance threat
    if (recent.coreWebVitals.lcp > 2.5) {
      insights.push({
        type: 'threat',
        title: 'Performance Degradation Risk',
        description: `LCP is ${recent.coreWebVitals.lcp.toFixed(2)}s, above optimal threshold`,
        impact: 'medium',
        timeframe: 'Address within 2 weeks',
        actionItems: [
          'Optimize images and assets',
          'Implement lazy loading',
          'Review server response times'
        ],
        confidence: 90
      })
    }

    // Trend analysis
    if (trends.length >= 7) {
      const weeklyTrend = trends.slice(-7)
      const avgTraffic = weeklyTrend.reduce((sum, t) => sum + t.organicTraffic, 0) / 7
      
      if (recent.organicTraffic > avgTraffic * 1.2) {
        insights.push({
          type: 'trend',
          title: 'Upward Traffic Trend',
          description: 'Traffic consistently above 7-day average',
          impact: 'high',
          timeframe: 'Sustained growth expected',
          actionItems: [
            'Maintain content publishing frequency',
            'Continue SEO optimization efforts',
            'Scale successful strategies'
          ],
          confidence: 75
        })
      }
    }

    return insights
  }

  // Generate ranking report
  generateRankingReport(keywords: string[], timeframe: '7d' | '30d' | '90d' = '30d'): {
    summary: {
      totalKeywords: number
      averagePosition: number
      top10Count: number
      top3Count: number
      improvements: number
      declines: number
    }
    topPerformers: RankingData[]
    opportunities: RankingData[]
    threats: RankingData[]
  } {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const recentRankings = this.rankingHistory
      .filter(r => keywords.includes(r.keyword))
      .filter(r => new Date(r.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Get latest position for each keyword
    const latestRankings = new Map<string, RankingData>()
    recentRankings.forEach(r => {
      const existing = latestRankings.get(r.keyword)
      if (!existing || new Date(r.date) > new Date(existing.date)) {
        latestRankings.set(r.keyword, r)
      }
    })

    const rankings = Array.from(latestRankings.values())

    const summary = {
      totalKeywords: rankings.length,
      averagePosition: rankings.reduce((sum, r) => sum + r.position, 0) / rankings.length,
      top10Count: rankings.filter(r => r.position <= 10).length,
      top3Count: rankings.filter(r => r.position <= 3).length,
      improvements: rankings.filter(r => r.change < 0).length,
      declines: rankings.filter(r => r.change > 0).length
    }

    const topPerformers = rankings
      .filter(r => r.position <= 10)
      .sort((a, b) => a.position - b.position)
      .slice(0, 10)

    const opportunities = rankings
      .filter(r => r.position > 10 && r.position <= 30 && r.change < 0)
      .sort((a, b) => a.position - b.position)
      .slice(0, 10)

    const threats = rankings
      .filter(r => r.position <= 10 && r.change > 3)
      .sort((a, b) => b.change - a.change)
      .slice(0, 10)

    return { summary, topPerformers, opportunities, threats }
  }

  // Monitor Core Web Vitals
  trackCoreWebVitals(url: string, vitals: {
    lcp: number
    fid: number
    cls: number
    fcp?: number
    ttfb?: number
  }): {
    score: number
    status: 'excellent' | 'good' | 'needs-improvement' | 'poor'
    recommendations: string[]
  } {
    let score = 100
    const recommendations: string[] = []

    // LCP scoring
    if (vitals.lcp > 4.0) {
      score -= 30
      recommendations.push('LCP is very slow - optimize images and critical resources')
    } else if (vitals.lcp > 2.5) {
      score -= 15
      recommendations.push('LCP could be improved - consider image optimization')
    }

    // FID scoring
    if (vitals.fid > 300) {
      score -= 25
      recommendations.push('FID is very high - reduce JavaScript execution time')
    } else if (vitals.fid > 100) {
      score -= 10
      recommendations.push('FID could be improved - optimize JavaScript')
    }

    // CLS scoring
    if (vitals.cls > 0.25) {
      score -= 20
      recommendations.push('CLS is high - add size attributes to images and avoid layout shifts')
    } else if (vitals.cls > 0.1) {
      score -= 10
      recommendations.push('CLS could be improved - ensure stable layouts')
    }

    let status: 'excellent' | 'good' | 'needs-improvement' | 'poor'
    if (score >= 90) status = 'excellent'
    else if (score >= 75) status = 'good'
    else if (score >= 50) status = 'needs-improvement'
    else status = 'poor'

    return { score, status, recommendations }
  }

  // Generate competitive gap analysis
  generateGapAnalysis(ourData: {
    keywords: number
    traffic: number
    backlinks: number
    domainAuthority: number
  }, competitorData: CompetitorData[]): {
    gaps: Array<{
      metric: string
      ourValue: number
      competitorValue: number
      gap: number
      priority: 'high' | 'medium' | 'low'
    }>
    recommendations: string[]
  } {
    const topCompetitor = competitorData.sort((a, b) => b.visibility - a.visibility)[0]
    if (!topCompetitor) return { gaps: [], recommendations: [] }

    const gaps = [
      {
        metric: 'Keywords',
        ourValue: ourData.keywords,
        competitorValue: topCompetitor.keywords,
        gap: topCompetitor.keywords - ourData.keywords,
        priority: topCompetitor.keywords > ourData.keywords * 2 ? 'high' : 'medium' as const
      },
      {
        metric: 'Traffic',
        ourValue: ourData.traffic,
        competitorValue: topCompetitor.traffic,
        gap: topCompetitor.traffic - ourData.traffic,
        priority: topCompetitor.traffic > ourData.traffic * 3 ? 'high' : 'medium' as const
      },
      {
        metric: 'Backlinks',
        ourValue: ourData.backlinks,
        competitorValue: topCompetitor.backlinks,
        gap: topCompetitor.backlinks - ourData.backlinks,
        priority: topCompetitor.backlinks > ourData.backlinks * 5 ? 'high' : 'medium' as const
      },
      {
        metric: 'Domain Authority',
        ourValue: ourData.domainAuthority,
        competitorValue: topCompetitor.domainAuthority,
        gap: topCompetitor.domainAuthority - ourData.domainAuthority,
        priority: topCompetitor.domainAuthority > ourData.domainAuthority + 10 ? 'high' : 'low' as const
      }
    ]

    const recommendations: string[] = []
    
    gaps.forEach(gap => {
      if (gap.priority === 'high') {
        if (gap.metric === 'Backlinks') {
          recommendations.push(`Urgent: Develop link building strategy to close ${gap.gap} backlink gap`)
        } else if (gap.metric === 'Keywords') {
          recommendations.push(`High priority: Expand keyword targeting to close ${gap.gap} keyword gap`)
        } else if (gap.metric === 'Traffic') {
          recommendations.push(`Focus on conversion optimization to maximize traffic value`)
        }
      }
    })

    return { gaps, recommendations }
  }
}

// Export singleton instance
export const advancedAnalytics = new AdvancedSEOAnalytics('https://metzlercares.com')
