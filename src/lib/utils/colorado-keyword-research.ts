// Advanced Colorado Rehab SEO Keyword Research & Competitor Analysis
// Targets Ripoff Report, Medium, and top-ranking competitors

export interface KeywordCluster {
  primary: string;
  secondary: string[];
  longTail: string[];
  semantic: string[];
  competitorGap: string[];
  searchVolume: number;
  difficulty: number;
  cpc: number;
  intent: 'informational' | 'navigational' | 'commercial' | 'transactional';
}

export interface CompetitorAnalysis {
  domain: string;
  authority: number;
  topKeywords: string[];
  contentGaps: string[];
  backlinkStrategy: string[];
  rankingFactors: string[];
  weaknesses: string[];
}

export interface LocalSEOKeywords {
  city: string;
  county: string;
  primaryClusters: KeywordCluster[];
  competitorAnalysis: CompetitorAnalysis[];
  semanticTopics: string[];
  entityRelationships: string[];
}

// Advanced keyword clusters targeting competitor gaps
export const COLORADO_REHAB_KEYWORD_CLUSTERS: Record<string, KeywordCluster[]> = {
  detox: [
    {
      primary: "colorado detox centers",
      secondary: ["medical detox colorado", "alcohol detox colorado", "drug detox colorado"],
      longTail: [
        "best medical detox centers in colorado",
        "affordable detox programs colorado springs",
        "same day admission detox denver",
        "medicaid covered detox colorado",
        "private detox facilities boulder"
      ],
      semantic: [
        "withdrawal management", "medical supervision", "detoxification process",
        "substance abuse treatment", "addiction recovery", "medical monitoring"
      ],
      competitorGap: [
        "ripoff report detox colorado", "detox center complaints colorado",
        "legitimate detox facilities colorado", "verified detox centers denver"
      ],
      searchVolume: 2400,
      difficulty: 45,
      cpc: 12.50,
      intent: "commercial"
    },
    {
      primary: "colorado alcohol detox",
      secondary: ["alcohol withdrawal colorado", "alcohol treatment colorado"],
      longTail: [
        "24 hour alcohol detox colorado",
        "medically assisted alcohol detox denver",
        "alcohol detox insurance coverage colorado",
        "luxury alcohol detox facilities colorado",
        "rapid alcohol detox programs"
      ],
      semantic: [
        "alcohol withdrawal symptoms", "delirium tremens treatment", "alcohol dependence",
        "medical alcohol detox", "alcohol addiction treatment", "withdrawal management"
      ],
      competitorGap: [
        "alcohol detox success rates colorado", "alcohol detox reviews denver",
        "affordable alcohol detox colorado springs", "medicaid alcohol detox"
      ],
      searchVolume: 1600,
      difficulty: 38,
      cpc: 15.75,
      intent: "transactional"
    }
  ],
  
  rehab: [
    {
      primary: "colorado drug rehab",
      secondary: ["drug treatment colorado", "substance abuse treatment colorado"],
      longTail: [
        "best drug rehab centers colorado",
        "long term drug rehab colorado",
        "holistic drug rehab colorado",
        "drug rehab for professionals colorado",
        "drug rehab with family therapy colorado"
      ],
      semantic: [
        "substance abuse treatment", "addiction treatment programs", "drug addiction recovery",
        "residential treatment", "outpatient treatment", "intensive outpatient"
      ],
      competitorGap: [
        "ripoff report drug rehab colorado", "legitimate drug treatment centers",
        "verified drug rehab facilities", "drug rehab scam avoidance colorado"
      ],
      searchVolume: 3200,
      difficulty: 52,
      cpc: 18.90,
      intent: "commercial"
    },
    {
      primary: "colorado inpatient rehab",
      secondary: ["residential treatment colorado", "inpatient addiction treatment"],
      longTail: [
        "30 day inpatient rehab colorado",
        "90 day residential treatment colorado",
        "luxury inpatient rehab colorado",
        "inpatient rehab for executives colorado",
        "medicaid inpatient rehab colorado"
      ],
      semantic: [
        "residential addiction treatment", "24-hour care", "structured environment",
        "medical supervision", "therapeutic community", "inpatient facilities"
      ],
      competitorGap: [
        "inpatient rehab waiting lists colorado", "inpatient rehab success rates",
        "affordable inpatient treatment colorado", "inpatient rehab insurance coverage"
      ],
      searchVolume: 1900,
      difficulty: 41,
      cpc: 22.30,
      intent: "transactional"
    }
  ],

  "sober-living": [
    {
      primary: "colorado sober living",
      secondary: ["recovery housing colorado", "transitional housing colorado"],
      longTail: [
        "affordable sober living colorado",
        "luxury sober living homes colorado",
        "sober living for women colorado",
        "sober living for men colorado",
        "pet friendly sober living colorado"
      ],
      semantic: [
        "recovery residences", "transitional living", "supportive housing",
        "recovery housing", "sober housing", "halfway house"
      ],
      competitorGap: [
        "sober living scholarships colorado", "free sober living colorado",
        "verified sober living homes", "legitimate recovery residences"
      ],
      searchVolume: 1100,
      difficulty: 35,
      cpc: 8.75,
      intent: "commercial"
    }
  ],

  // High-intent, competitor-targeting keywords
  "competitor-gap": [
    {
      primary: "colorado rehab reviews",
      secondary: ["rehab center ratings colorado", "treatment facility reviews"],
      longTail: [
        "best rated rehab centers colorado",
        "rehab center testimonials colorado",
        "verified rehab reviews denver",
        "rehab success stories colorado",
        "ripoff report rehab colorado"
      ],
      semantic: [
        "treatment center reviews", "rehab facility ratings", "patient testimonials",
        "recovery success rates", "treatment outcomes", "verified reviews"
      ],
      competitorGap: [
        "avoid rehab scams colorado", "legitimate rehab centers",
        "rehab center complaints", "verified treatment facilities"
      ],
      searchVolume: 880,
      difficulty: 28,
      cpc: 6.25,
      intent: "informational"
    },
    {
      primary: "colorado addiction treatment cost",
      secondary: ["rehab cost colorado", "treatment pricing colorado"],
      longTail: [
        "how much does rehab cost colorado",
        "affordable addiction treatment colorado",
        "insurance coverage rehab colorado",
        "sliding scale treatment colorado",
        "free addiction treatment colorado"
      ],
      semantic: [
        "treatment costs", "rehab pricing", "insurance coverage",
        "affordable treatment", "payment options", "financial assistance"
      ],
      competitorGap: [
        "hidden rehab costs colorado", "rehab pricing transparency",
        "no hidden fees treatment", "affordable quality rehab"
      ],
      searchVolume: 1300,
      difficulty: 31,
      cpc: 9.40,
      intent: "informational"
    }
  ]
};

// Competitor analysis data
export const COLORADO_COMPETITORS: CompetitorAnalysis[] = [
  {
    domain: "ripoffreport.com",
    authority: 78,
    topKeywords: [
      "rehab scams", "treatment center complaints", "addiction treatment fraud",
      "rehab ripoffs", "treatment center reviews"
    ],
    contentGaps: [
      "legitimate rehab alternatives", "verified treatment centers",
      "rehab success stories", "quality addiction treatment"
    ],
    backlinkStrategy: [
      "controversial content", "user-generated reviews", "scam reporting",
      "consumer protection", "investigative journalism"
    ],
    rankingFactors: [
      "domain authority", "user engagement", "fresh content", "brand mentions"
    ],
    weaknesses: [
      "negative user experience", "lack of solutions", "outdated information",
      "no treatment recommendations", "poor site structure"
    ]
  },
  {
    domain: "medium.com",
    authority: 95,
    topKeywords: [
      "addiction recovery stories", "sobriety journey", "recovery advice",
      "addiction treatment experiences", "rehab success stories"
    ],
    contentGaps: [
      "local treatment resources", "professional treatment guidance",
      "evidence-based treatment information", "local support services"
    ],
    backlinkStrategy: [
      "thought leadership", "personal stories", "expert opinions",
      "community engagement", "social sharing"
    ],
    rankingFactors: [
      "high domain authority", "quality content", "user engagement",
      "social signals", "expert authorship"
    ],
    weaknesses: [
      "generic content", "lack of local focus", "no treatment resources",
      "personal opinions vs facts", "limited actionable information"
    ]
  }
];

// Entity relationships for semantic SEO
export const COLORADO_REHAB_ENTITIES = {
  medical: ["addiction medicine", "substance abuse treatment", "medical detox", "medication-assisted treatment"],
  legal: ["court ordered rehab", "DUI treatment", "probation requirements", "legal compliance"],
  financial: ["insurance coverage", "medicaid", "scholarships", "sliding scale", "payment plans"],
  support: ["peer support", "12-step programs", "family therapy", "aftercare", "relapse prevention"],
  facilities: ["residential treatment", "outpatient programs", "intensive outpatient", "partial hospitalization"],
  demographics: ["veterans", "professionals", "young adults", "women", "men", "LGBTQ+"]
};

// Advanced semantic topics for topical authority
export const SEMANTIC_TOPICS = [
  "addiction neuroscience", "recovery psychology", "treatment modalities",
  "relapse prevention strategies", "family systems therapy", "trauma-informed care",
  "medication-assisted treatment", "behavioral therapy", "group therapy dynamics",
  "individual counseling approaches", "holistic recovery methods", "evidence-based treatment"
];

// Generate comprehensive keyword strategy for any Colorado city
export function generateCityKeywordStrategy(city: string, county: string): LocalSEOKeywords {
  const baseKeywords = Object.entries(COLORADO_REHAB_KEYWORD_CLUSTERS).flatMap(([category, clusters]) => 
    clusters.map(cluster => ({
      ...cluster,
      primary: cluster.primary.replace('colorado', city.toLowerCase()),
      secondary: cluster.secondary.map(k => k.replace('colorado', city.toLowerCase())),
      longTail: cluster.longTail.map(k => k.replace('colorado', city.toLowerCase()).replace('denver', city.toLowerCase())),
      semantic: [...cluster.semantic, ...COLORADO_REHAB_ENTITIES.medical, ...COLORADO_REHAB_ENTITIES.legal]
    }))
  );

  return {
    city,
    county,
    primaryClusters: baseKeywords,
    competitorAnalysis: COLORADO_COMPETITORS,
    semanticTopics: SEMANTIC_TOPICS,
    entityRelationships: Object.values(COLORADO_REHAB_ENTITIES).flat()
  };
}

// Advanced keyword difficulty and opportunity scoring
export function calculateKeywordOpportunity(keyword: string, searchVolume: number, difficulty: number): number {
  // Custom algorithm for addiction treatment keywords
  const intentMultiplier = keyword.includes('cost') || keyword.includes('price') ? 1.5 : 1;
  const localMultiplier = keyword.includes('near me') || keyword.includes('colorado') ? 1.3 : 1;
  const commercialMultiplier = ['rehab', 'treatment', 'detox'].some(term => keyword.includes(term)) ? 1.4 : 1;
  
  return (searchVolume * (100 - difficulty) * intentMultiplier * localMultiplier * commercialMultiplier) / 1000;
}

// Generate content briefs for maximum topical authority
export function generateContentBrief(topic: string, city: string): {
  primaryKeywords: string[];
  semanticKeywords: string[];
  competitorGaps: string[];
  contentStructure: string[];
  internalLinking: string[];
  schemaTypes: string[];
} {
  const strategy = generateCityKeywordStrategy(city, '');
  const relevantClusters = strategy.primaryClusters.filter(cluster => 
    cluster.primary.includes(topic) || cluster.secondary.some(s => s.includes(topic))
  );

  return {
    primaryKeywords: relevantClusters.flatMap(c => [c.primary, ...c.secondary]),
    semanticKeywords: [...strategy.semanticTopics, ...strategy.entityRelationships],
    competitorGaps: relevantClusters.flatMap(c => c.competitorGap),
    contentStructure: [
      'Introduction with local statistics',
      'Problem identification and local context',
      'Solution overview with local services',
      'Detailed service explanations',
      'Cost and insurance information',
      'Success stories and testimonials',
      'Local resources and support',
      'Next steps and calls to action'
    ],
    internalLinking: [
      `/co/${city.toLowerCase()}/detox`,
      `/co/${city.toLowerCase()}/rehab`,
      `/co/${city.toLowerCase()}/sober-living`
    ],
    schemaTypes: ['MedicalOrganization', 'LocalBusiness', 'FAQPage', 'Article']
  };
}