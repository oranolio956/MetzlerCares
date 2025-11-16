// Colorado SEO Data Structure for Programmatic Content Generation
export const RECOVERY_SERVICES = {
  sober_living: 'Sober Living',
  treatment_center: 'Treatment Center',
  detox: 'Detox',
  outpatient: 'Outpatient',
  support_group: 'Support Group',
  scholarship: 'Scholarship'
} as const;

export interface ColoradoLocation {
  city: string;
  county: string;
  population: number;
  zipCodes: string[];
  coordinates: { lat: number; lng: number };
  priority: 'high' | 'medium' | 'low';
}

export interface RecoveryService {
  type: 'sober_living' | 'treatment_center' | 'detox' | 'outpatient' | 'support_group' | 'scholarship';
  name: string;
  description: string;
  address: string;
  phone: string;
  website?: string;
  services: string[];
  paymentOptions: string[];
  certifications: string[];
  coordinates: { lat: number; lng: number };
}

export interface SEOContentTemplate {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  contentStructure: {
    introduction: string;
    sections: {
      heading: string;
      content: string;
      keywords: string[];
    }[];
    faqs: {
      question: string;
      answer: string;
    }[];
  };
  schema: object;
}

// Major Colorado cities and counties prioritized for SEO
export const COLORADO_LOCATIONS: ColoradoLocation[] = [
  // High Priority - Major metropolitan areas
  { city: 'Denver', county: 'Denver County', population: 715522, zipCodes: ['80202', '80203', '80204', '80205', '80206', '80207', '80209', '80210', '80211', '80218', '80220', '80221', '80222', '80223', '80224', '80230', '80231', '80238'], coordinates: { lat: 39.7392, lng: -104.9903 }, priority: 'high' },
  { city: 'Colorado Springs', county: 'El Paso County', population: 478961, zipCodes: ['80903', '80904', '80905', '80906', '80907', '80908', '80909', '80910', '80911', '80914', '80915', '80916', '80917', '80918', '80919', '80920', '80921', '80922'], coordinates: { lat: 38.8339, lng: -104.8214 }, priority: 'high' },
  { city: 'Aurora', county: 'Arapahoe County', population: 386261, zipCodes: ['80010', '80011', '80012', '80013', '80014', '80015', '80016', '80017', '80018', '80019', '80045'], coordinates: { lat: 39.7294, lng: -104.8319 }, priority: 'high' },
  { city: 'Fort Collins', county: 'Larimer County', population: 169810, zipCodes: ['80521', '80524', '80525', '80526', '80528'], coordinates: { lat: 40.5853, lng: -105.0844 }, priority: 'high' },
  { city: 'Lakewood', county: 'Jefferson County', population: 155984, zipCodes: ['80214', '80215', '80226', '80227', '80228', '80232', '80235'], coordinates: { lat: 39.7047, lng: -105.0814 }, priority: 'high' },
  
  // Medium Priority - Large cities
  { city: 'Thornton', county: 'Adams County', population: 141867, zipCodes: ['80229', '80233', '80241', '80260'], coordinates: { lat: 39.8680, lng: -104.9719 }, priority: 'medium' },
  { city: 'Arvada', county: 'Jefferson County', population: 124402, zipCodes: ['80001', '80002', '80003', '80004', '80005', '80007'], coordinates: { lat: 39.8028, lng: -105.0875 }, priority: 'medium' },
  { city: 'Westminster', county: 'Adams County', population: 116317, zipCodes: ['80030', '80031', '80035', '80036'], coordinates: { lat: 39.8367, lng: -105.0372 }, priority: 'medium' },
  { city: 'Pueblo', county: 'Pueblo County', population: 111876, zipCodes: ['81001', '81003', '81004', '81005', '81006', '81007', '81008'], coordinates: { lat: 38.2544, lng: -104.6091 }, priority: 'medium' },
  { city: 'Greeley', county: 'Weld County', population: 108795, zipCodes: ['80631', '80632', '80633', '80634', '80638', '80639'], coordinates: { lat: 40.4233, lng: -104.7091 }, priority: 'medium' },
  { city: 'Boulder', county: 'Boulder County', population: 105673, zipCodes: ['80301', '80302', '80303', '80304', '80305', '80309', '80310'], coordinates: { lat: 40.0150, lng: -105.2705 }, priority: 'medium' },
  { city: 'Longmont', county: 'Boulder County', population: 98911, zipCodes: ['80501', '80503', '80504'], coordinates: { lat: 40.1672, lng: -105.1019 }, priority: 'medium' },
  { city: 'Loveland', county: 'Larimer County', population: 78977, zipCodes: ['80537', '80538', '80539'], coordinates: { lat: 40.3977, lng: -105.0750 }, priority: 'medium' },
  { city: 'Centennial', county: 'Arapahoe County', population: 110218, zipCodes: ['80015', '80016', '80111', '80112', '80121', '80122'], coordinates: { lat: 39.5807, lng: -104.8771 }, priority: 'medium' },
  { city: 'Englewood', county: 'Arapahoe County', population: 35508, zipCodes: ['80110', '80111', '80112', '80113', '80150', '80151'], coordinates: { lat: 39.6477, lng: -104.9878 }, priority: 'medium' },
  { city: 'Littleton', county: 'Arapahoe County', population: 48007, zipCodes: ['80120', '80121', '80122', '80123', '80124', '80125', '80126', '80127', '80128', '80129', '80130', '80160', '80161', '80162', '80163', '80165', '80166'], coordinates: { lat: 39.6133, lng: -105.0166 }, priority: 'medium' },
  
  // Additional cities for comprehensive coverage
  { city: 'Castle Rock', county: 'Douglas County', population: 73563, zipCodes: ['80104', '80108', '80109'], coordinates: { lat: 39.3722, lng: -104.8561 }, priority: 'low' },
  { city: 'Commerce City', county: 'Adams County', population: 62218, zipCodes: ['80022', '80037'], coordinates: { lat: 39.8083, lng: -104.9342 }, priority: 'low' },
  { city: 'Grand Junction', county: 'Mesa County', population: 65060, zipCodes: ['81501', '81502', '81503', '81504', '81505', '81506', '81507'], coordinates: { lat: 39.0639, lng: -108.5506 }, priority: 'low' },
  { city: 'Durango', county: 'La Plata County', population: 19339, zipCodes: ['81301', '81302', '81303'], coordinates: { lat: 37.2753, lng: -107.8801 }, priority: 'low' }
];

// Recovery services and organizations in Colorado
export const COLORADO_RECOVERY_SERVICES: RecoveryService[] = [
  // Denver Metro Area
  {
    type: 'sober_living',
    name: 'Hazelbrook Recovery Residences',
    description: 'Award-winning recovery housing programs with multiple locations across Denver Metro, Colorado Springs, Longmont, and Pueblo. Scholarships available.',
    address: 'Multiple Denver Metro Locations',
    phone: '(303) 555-0123',
    website: 'https://hazelbrooksoberliving.com',
    services: ['Sober Living', 'Recovery Coaching', 'Group Therapy', 'Case Management'],
    paymentOptions: ['Scholarships', 'Sliding Scale', 'Private Pay'],
    certifications: ['CCAR Certified'],
    coordinates: { lat: 39.7392, lng: -104.9903 }
  },
  {
    type: 'scholarship',
    name: 'Hornbuckle Foundation',
    description: 'Provides recovery coaching and sober living scholarships for individuals in Colorado.',
    address: 'Denver, CO',
    phone: '(720) 555-0456',
    website: 'https://www.hornbucklefoundation.org',
    services: ['Recovery Coaching', 'Sober Living Scholarships', 'Peer Support'],
    paymentOptions: ['Scholarships', 'Free Services'],
    certifications: ['Peer Recovery Specialist'],
    coordinates: { lat: 39.7392, lng: -104.9903 }
  },
  {
    type: 'treatment_center',
    name: 'Footprints to Recovery Denver',
    description: 'Comprehensive inpatient and outpatient drug and alcohol rehab programs with full continuum of care.',
    address: 'Denver, CO',
    phone: '(866) 955-3218',
    website: 'https://footprintstorecovery.com',
    services: ['Inpatient Treatment', 'Outpatient Treatment', 'Detox', 'Aftercare', 'Sober Living Referrals'],
    paymentOptions: ['Insurance', 'Private Pay', 'Payment Plans'],
    certifications: ['SAMHSA Approved', 'Joint Commission'],
    coordinates: { lat: 39.7392, lng: -104.9903 }
  },
  
  // Colorado Springs
  {
    type: 'sober_living',
    name: 'Hope Homes Colorado Springs',
    description: 'Transitional housing that is drug-free and self-supporting with structured recovery environment.',
    address: 'Colorado Springs, CO',
    phone: '(719) 555-0789',
    services: ['Sober Living', 'Transitional Housing', 'Peer Support', 'Life Skills'],
    paymentOptions: ['Private Pay', 'Sliding Scale'],
    certifications: ['State Licensed'],
    coordinates: { lat: 38.8339, lng: -104.8214 }
  },
  
  // Fort Collins
  {
    type: 'support_group',
    name: 'Fort Collins Recovery Community',
    description: 'Peer-led recovery support services and community building in Northern Colorado.',
    address: 'Fort Collins, CO',
    phone: '(970) 555-0234',
    services: ['Peer Support', 'Recovery Coaching', 'Community Events', 'Educational Workshops'],
    paymentOptions: ['Free Services', 'Donations'],
    certifications: ['Peer Recovery Specialist'],
    coordinates: { lat: 40.5853, lng: -105.0844 }
  },
  
  // Pueblo
  {
    type: 'treatment_center',
    name: 'Pueblo Recovery Center',
    description: 'Comprehensive addiction treatment services serving Southern Colorado.',
    address: 'Pueblo, CO',
    phone: '(719) 555-0567',
    services: ['Outpatient Treatment', 'Intensive Outpatient', 'Peer Support', 'Family Therapy'],
    paymentOptions: ['Insurance', 'Medicaid', 'Sliding Scale'],
    certifications: ['State Licensed', 'SAMHSA Approved'],
    coordinates: { lat: 38.2544, lng: -104.6091 }
  }
];

// SEO content templates for different page types
export const SEO_TEMPLATES: Record<string, SEOContentTemplate> = {
  city_sober_living: {
    slug: '{city}-sober-living-recovery-housing',
    title: 'Best Sober Living & Recovery Housing in {city}, Colorado | Scholarships & Support',
    metaDescription: 'Find top-rated sober living homes and recovery housing in {city}, Colorado. Scholarships available. Comprehensive guide to safe, supportive recovery environments.',
    h1: 'Sober Living & Recovery Housing in {city}, Colorado',
    contentStructure: {
      introduction: '{city}, Colorado offers numerous sober living and recovery housing options for individuals seeking supportive environments during their recovery journey. From structured programs to independent living, find the perfect fit for your needs.',
      sections: [
        {
          heading: 'Top Sober Living Homes in {city}',
          content: 'Discover the highest-rated sober living facilities in {city}, Colorado, including services, amenities, and scholarship opportunities.',
          keywords: ['sober living {city}', 'recovery housing {city}', 'halfway house {city}']
        },
        {
          heading: 'Scholarships & Financial Assistance',
          content: 'Learn about available scholarships, grants, and financial assistance programs for sober living in {city}, Colorado.',
          keywords: ['sober living scholarships {city}', 'recovery housing assistance', 'financial help sober living']
        },
        {
          heading: 'What to Expect in {city} Recovery Housing',
          content: 'Understand the structure, rules, and support systems available in {city} sober living environments.',
          keywords: ['recovery housing rules {city}', 'sober living structure', 'support systems']
        }
      ],
      faqs: [
        {
          question: 'How much does sober living cost in {city}, Colorado?',
          answer: 'Sober living costs in {city} typically range from $600-$1,550 per month, with scholarships and sliding scale options available.'
        },
        {
          question: 'Are scholarships available for sober living in {city}?',
          answer: 'Yes, several organizations offer sober living scholarships in {city}, including the Hornbuckle Foundation and Hazelbrook Recovery Residences.'
        },
        {
          question: 'What services are included in {city} recovery housing?',
          answer: 'Most sober living homes in {city} include peer support, group therapy, life skills training, and recovery coaching.'
        }
      ]
    },
    schema: {
      '@type': 'LocalBusiness',
      '@context': 'https://schema.org',
      'name': 'Sober Living {city} Colorado',
      'description': 'Recovery housing and sober living services in {city}, Colorado',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': '{city}',
        'addressRegion': 'CO',
        'addressCountry': 'US'
      }
    }
  },
  
  city_treatment_centers: {
    slug: '{city}-drug-alcohol-treatment-centers',
    title: 'Best Drug & Alcohol Treatment Centers in {city}, Colorado | Detox & Rehab',
    metaDescription: 'Top-rated addiction treatment centers in {city}, Colorado. Detox, inpatient, outpatient programs. Insurance accepted. Find the right treatment option today.',
    h1: 'Drug & Alcohol Treatment Centers in {city}, Colorado',
    contentStructure: {
      introduction: 'Find comprehensive addiction treatment options in {city}, Colorado. From medical detox to outpatient programs, discover evidence-based treatment centers that can help you or your loved one begin the recovery journey.',
      sections: [
        {
          heading: 'Top Rated Treatment Centers in {city}',
          content: 'Review the best addiction treatment facilities in {city}, Colorado, including services, specialties, and success rates.',
          keywords: ['drug rehab {city}', 'alcohol treatment {city}', 'addiction treatment centers']
        },
        {
          heading: 'Treatment Programs Available in {city}',
          content: 'Explore different levels of care including detox, inpatient, outpatient, and aftercare programs in {city}.',
          keywords: ['detox {city}', 'inpatient rehab {city}', 'outpatient treatment {city}']
        },
        {
          heading: 'Insurance & Payment Options',
          content: 'Learn about insurance coverage, payment plans, and financial assistance for addiction treatment in {city}, Colorado.',
          keywords: ['insurance coverage rehab {city}', 'payment plans treatment', 'financial assistance']
        }
      ],
      faqs: [
        {
          question: 'What types of addiction treatment are available in {city}?',
          answer: '{city} offers detox, inpatient residential, intensive outpatient (IOP), partial hospitalization (PHP), and outpatient programs.'
        },
        {
          question: 'Does insurance cover addiction treatment in {city}, Colorado?',
          answer: 'Most insurance plans cover addiction treatment in {city}. Many facilities accept Medicaid, Medicare, and private insurance.'
        },
        {
          question: 'How long does addiction treatment last in {city}?',
          answer: 'Treatment duration varies: detox (3-7 days), inpatient (30-90 days), outpatient (8-12 weeks), with ongoing aftercare support.'
        }
      ]
    },
    schema: {
      '@type': 'MedicalOrganization',
      '@context': 'https://schema.org',
      'name': 'Addiction Treatment {city} Colorado',
      'description': 'Drug and alcohol treatment centers in {city}, Colorado',
      'medicalSpecialty': 'Addiction Medicine',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': '{city}',
        'addressRegion': 'CO',
        'addressCountry': 'US'
      }
    }
  }
  ,
  city_sober_living_affordable: {
    slug: '{city}-affordable-sober-living',
    title: 'Affordable Sober Living in {city}, Colorado | Scholarships & Sliding Scale',
    metaDescription: 'Find affordable sober living in {city}. Scholarships and sliding scale options available. Compare costs and financial assistance.',
    h1: 'Affordable Sober Living in {city}, Colorado',
    contentStructure: {
      introduction: 'Explore cost-effective sober living options in {city}, Colorado. Learn how scholarships, sliding scale, and payment plans can reduce housing costs.',
      sections: [
        { heading: 'Cost Ranges in {city}', content: 'Typical ranges are $600–$1,550/month depending on amenities and location.', keywords: ['affordable sober living {city}', 'low cost sober living {city}'] },
        { heading: 'Scholarships & Sliding Scale', content: 'Discover organizations and homes offering scholarships and sliding scale payment options.', keywords: ['sober living scholarships {city}', 'sliding scale {city}'] },
        { heading: 'Budget Planning Tips', content: 'How to prepare documents, verify assistance, and manage monthly costs.', keywords: ['budget sober living {city}', 'finance recovery housing'] }
      ],
      faqs: [
        { question: 'What makes sober living affordable in {city}?', answer: 'Scholarships, sliding scale fees, and shared amenities help reduce monthly costs.' },
        { question: 'Can I get financial help in {city}?', answer: 'Yes. Several partners provide scholarships and flexible payment options in {city}.' }
      ]
    },
    schema: { '@type': 'WebPage', '@context': 'https://schema.org', 'name': 'Affordable Sober Living {city}', 'description': 'Affordable sober living in {city}, Colorado' }
  },
  city_sober_living_scholarships: {
    slug: '{city}-sober-living-scholarships',
    title: 'Sober Living Scholarships in {city}, Colorado | Eligibility & Documentation',
    metaDescription: 'Apply for sober living scholarships in {city}. Review eligibility, documentation, partners, timelines, and application tips.',
    h1: 'Sober Living Scholarships in {city}, Colorado',
    contentStructure: {
      introduction: 'Learn how to qualify for and apply to sober living scholarships in {city}, including the documentation required and partner timelines.',
      sections: [
        { heading: 'Eligibility Requirements', content: 'Residency/placement, referral letter, financial need, and commitment to rules.', keywords: ['sober living scholarship {city}', 'eligibility {city}'] },
        { heading: 'Documentation Checklist', content: 'Photo ID, placement or residency, referral, and financial documentation.', keywords: ['documentation {city}', 'apply scholarship {city}'] },
        { heading: 'Partner Timelines', content: 'Typical decisions 5–10 business days; partner-specific variations may apply.', keywords: ['scholarship timeline {city}', 'partner processing {city}'] }
      ],
      faqs: [
        { question: 'How long does approval take in {city}?', answer: 'Usually 5–10 business days after full submission, depending on the partner.' }
      ]
    },
    schema: { '@type': 'WebPage', '@context': 'https://schema.org', 'name': 'Sober Living Scholarships {city}', 'description': 'Scholarships for sober living in {city}, Colorado' }
  },
  city_sober_living_women: {
    slug: '{city}-women-sober-living',
    title: 'Women’s Sober Living in {city}, Colorado | Safe & Supportive Housing',
    metaDescription: 'Find women’s sober living options in {city}. Safe, supportive recovery housing and community resources.',
    h1: 'Women’s Sober Living in {city}, Colorado',
    contentStructure: {
      introduction: 'Explore women-focused sober living environments in {city} that emphasize safety, structure, and peer support.',
      sections: [
        { heading: 'Women-Focused Homes in {city}', content: 'Programs with rules and supports tailored to women’s recovery needs.', keywords: ['women sober living {city}', 'female recovery housing {city}'] },
        { heading: 'Community & Safety', content: 'Peer support, life skills, privacy policies, and safety standards.', keywords: ['women support {city}', 'safe housing {city}'] }
      ],
      faqs: []
    },
    schema: { '@type': 'WebPage', '@context': 'https://schema.org', 'name': 'Women Sober Living {city}', 'description': 'Women’s sober living in {city}, Colorado' }
  },
  city_sober_living_pet_friendly: {
    slug: '{city}-pet-friendly-sober-living',
    title: 'Pet-Friendly Sober Living in {city}, Colorado | Policies & Options',
    metaDescription: 'Find pet-friendly sober living options in {city}. Review pet policies, deposits, and availability.',
    h1: 'Pet-Friendly Sober Living in {city}, Colorado',
    contentStructure: {
      introduction: 'Some sober living homes in {city} offer pet-friendly policies. Learn about deposits, rules, and availability.',
      sections: [
        { heading: 'Pet Policies in {city}', content: 'Common requirements: deposits, breed/size limits, vaccination records.', keywords: ['pet friendly sober living {city}', 'pets recovery housing {city}'] },
        { heading: 'Finding Availability', content: 'Contact providers early to verify current openings and pet accommodations.', keywords: ['pet housing availability {city}', 'contact providers {city}'] }
      ],
      faqs: []
    },
    schema: { '@type': 'WebPage', '@context': 'https://schema.org', 'name': 'Pet-Friendly Sober Living {city}', 'description': 'Pet-friendly sober living in {city}, Colorado' }
  },
  city_sober_living_near_me: {
    slug: '{city}-sober-living-near-me',
    title: 'Sober Living Near Me in {city}, Colorado | Local Recovery Housing',
    metaDescription: 'Find sober living near you in {city}. Local housing options within commuting distance and transit access.',
    h1: 'Sober Living Near Me in {city}, Colorado',
    contentStructure: {
      introduction: 'Discover sober living homes near your location in {city}, with transit access and local community support.',
      sections: [
        { heading: 'Nearby Options in {city}', content: 'Homes within commuting distance and accessible by local transit.', keywords: ['sober living near me {city}', 'nearby recovery housing {city}'] },
        { heading: 'Transportation & Access', content: 'Bus and rail lines; commute planning and routes to employment/services.', keywords: ['transit access {city}', 'commute sober living {city}'] }
      ],
      faqs: []
    },
    schema: { '@type': 'WebPage', '@context': 'https://schema.org', 'name': 'Sober Living Near Me {city}', 'description': 'Sober living near me in {city}, Colorado' }
  }
};

// Keyword research data for Colorado recovery services
export const COLORADO_KEYWORDS = {
  primary: [
    'Colorado sober living',
    'recovery housing Colorado',
    'sober living scholarships Colorado',
    'drug rehab Colorado',
    'alcohol treatment Colorado',
    'addiction treatment centers Colorado'
  ],
  
  location_specific: [
    'Denver sober living',
    'Colorado Springs recovery housing',
    'Aurora addiction treatment',
    'Fort Collins drug rehab',
    'Lakewood alcohol treatment',
    'Pueblo sober living homes'
  ],
  
  long_tail: [
    'affordable sober living Colorado',
    'scholarships for recovery housing Colorado',
    'best treatment centers in Denver',
    'how to pay for sober living Colorado',
    'Colorado recovery housing requirements',
    'free addiction treatment Colorado'
  ],
  
  informational: [
    'what is sober living Colorado',
    'how does recovery housing work',
    'Colorado addiction statistics',
    'recovery resources Colorado',
    'sober living rules Colorado'
  ]
};

// Content generation utilities
export function generateLocationContent(template: SEOContentTemplate, location: ColoradoLocation): SEOContentTemplate {
  const city = location.city;
  const county = location.county;
  
  return {
    ...template,
    slug: template.slug.replace('{city}', city.toLowerCase().replace(/\s+/g, '-')),
    title: template.title.replace('{city}', city),
    metaDescription: template.metaDescription.replace('{city}', city),
    h1: template.h1.replace('{city}', city),
    contentStructure: {
      ...template.contentStructure,
      introduction: template.contentStructure.introduction.replace('{city}', city),
      sections: template.contentStructure.sections.map(section => ({
        ...section,
        heading: section.heading.replace('{city}', city),
        content: section.content.replace('{city}', city).replace('{county}', county)
      })),
      faqs: template.contentStructure.faqs.map(faq => ({
        question: faq.question.replace('{city}', city),
        answer: faq.answer.replace('{city}', city)
      }))
    }
  };
}

export function getPriorityLocations(priority: 'high' | 'medium' | 'low' | 'all' = 'all'): ColoradoLocation[] {
  if (priority === 'all') return COLORADO_LOCATIONS;
  return COLORADO_LOCATIONS.filter(loc => loc.priority === priority);
}