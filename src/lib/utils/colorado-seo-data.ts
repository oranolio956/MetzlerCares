// Colorado SEO Data Structures and Exported Constants

// ---- Types ---------------------------------------------------------------
export interface ColoradoLocation {
  city: string;
  county: string;
  coordinates: { lat: number; lng: number };
  priority?: 'high' | 'medium' | 'low';
  // Optional fields used in treatment pages
  population?: number;
  demographics?: string;
  insuranceMix?: string;
  facilities?: number;
  specialPrograms?: string[];
  averageWaitTime?: string;
}

export interface RecoveryService {
  name: string;
  type: string;
  description: string;
  address?: string;
  phone: string;
  website?: string;
  services: string[];
  paymentOptions: string[];
  certifications: string[];
  coordinates: { lat: number; lng: number };
}

export interface Section {
  heading: string;
  content: string;
  keywords: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContentStructure {
  introduction: string;
  sections: Section[];
  faqs: FAQItem[];
}

export interface SEOContentTemplate {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  contentStructure: ContentStructure;
  schema: object;
}

// ---- Locations -----------------------------------------------------------
export const COLORADO_LOCATIONS: ColoradoLocation[] = [
  { city: 'Denver', county: 'Denver', coordinates: { lat: 39.7392, lng: -104.9903 }, priority: 'high' },
  { city: 'Colorado Springs', county: 'El Paso', coordinates: { lat: 38.8339, lng: -104.8214 }, priority: 'high' },
  { city: 'Fort Collins', county: 'Larimer', coordinates: { lat: 40.5853, lng: -105.0844 }, priority: 'high' },
  { city: 'Pueblo', county: 'Pueblo', coordinates: { lat: 38.2544, lng: -104.6091 }, priority: 'medium' },
];

// ---- Recovery Services ----------------------------------------------------
export const COLORADO_RECOVERY_SERVICES: RecoveryService[] = [
  {
    name: 'Hazelbrook Recovery Residences',
    type: 'sober_living',
    description: 'Award‑winning recovery housing programs with multiple locations across Denver Metro, Colorado Springs, Longmont, and Pueblo. Scholarships available.',
    address: 'Multiple Denver Metro Locations',
    phone: '(303) 555-0123',
    website: 'https://hazelbrooksoberliving.com',
    services: ['Sober Living', 'Recovery Coaching', 'Group Therapy', 'Case Management'],
    paymentOptions: ['Scholarships', 'Sliding Scale', 'Private Pay'],
    certifications: ['CCAR Certified'],
    coordinates: { lat: 39.7392, lng: -104.9903 },
  },
  {
    name: 'Hornbuckle Foundation',
    type: 'scholarship',
    description: 'Provides recovery coaching and sober living scholarships for individuals in Colorado.',
    address: 'Denver, CO',
    phone: '(720) 555-0456',
    website: 'https://www.hornbucklefoundation.org',
    services: ['Recovery Coaching', 'Sober Living Scholarships', 'Peer Support'],
    paymentOptions: ['Scholarships', 'Free Services'],
    certifications: ['Peer Recovery Specialist'],
    coordinates: { lat: 39.7392, lng: -104.9903 },
  },
  {
    name: 'Footprints to Recovery Denver',
    type: 'treatment_center',
    description: 'Comprehensive inpatient and outpatient drug and alcohol rehab programs with full continuum of care.',
    address: 'Denver, CO',
    phone: '(866) 955-3218',
    website: 'https://footprintstorecovery.com',
    services: ['Inpatient Treatment', 'Outpatient Treatment', 'Detox', 'Aftercare', 'Sober Living Referrals'],
    paymentOptions: ['Insurance', 'Private Pay', 'Payment Plans'],
    certifications: ['SAMHSA Approved', 'Joint Commission'],
    coordinates: { lat: 39.7392, lng: -104.9903 },
  },
  {
    name: 'Hope Homes Colorado Springs',
    type: 'sober_living',
    description: 'Transitional housing that is drug‑free and self‑supporting with structured recovery environment.',
    address: 'Colorado Springs, CO',
    phone: '(719) 555-0789',
    services: ['Sober Living', 'Transitional Housing', 'Peer Support', 'Life Skills'],
    paymentOptions: ['Private Pay', 'Sliding Scale'],
    certifications: ['State Licensed'],
    coordinates: { lat: 38.8339, lng: -104.8214 },
  },
  {
    name: 'Fort Collins Recovery Community',
    type: 'support_group',
    description: 'Peer‑led recovery support services and community building in Northern Colorado.',
    address: 'Fort Collins, CO',
    phone: '(970) 555-0234',
    services: ['Peer Support', 'Recovery Coaching', 'Community Events', 'Educational Workshops'],
    paymentOptions: ['Free Services', 'Donations'],
    certifications: ['Peer Recovery Specialist'],
    coordinates: { lat: 40.5853, lng: -105.0844 },
  },
  {
    name: 'Pueblo Recovery Center',
    type: 'treatment_center',
    description: 'Comprehensive addiction treatment services serving Southern Colorado.',
    address: 'Pueblo, CO',
    phone: '(719) 555-0567',
    services: ['Outpatient Treatment', 'Intensive Outpatient', 'Peer Support', 'Family Therapy'],
    paymentOptions: ['Insurance', 'Medicaid', 'Sliding Scale'],
    certifications: ['State Licensed', 'SAMHSA Approved'],
    coordinates: { lat: 38.2544, lng: -104.6091 },
  },
];

// ---- SEO Templates -------------------------------------------------------
export const SEO_TEMPLATES: Record<string, SEOContentTemplate> = {
  city_sober_living: {
    slug: '{city}-sober-living-recovery-housing',
    title: 'Best Sober Living & Recovery Housing in {city}, Colorado | Scholarships & Support',
    metaDescription: 'Find top‑rated sober living homes and recovery housing in {city}, Colorado. Scholarships available. Comprehensive guide to safe, supportive recovery environments.',
    h1: 'Sober Living & Recovery Housing in {city}, Colorado',
    contentStructure: {
      introduction: '{city}, Colorado offers numerous sober living and recovery housing options for individuals seeking supportive environments during their recovery journey.',
      sections: [
        {
          heading: 'Top Sober Living Homes in {city}',
          content: 'Discover the highest‑rated sober living facilities in {city}, Colorado, including services, amenities, and scholarship opportunities.',
          keywords: ['sober living {city}', 'recovery housing {city}', 'halfway house {city}'],
        },
        {
          heading: 'Scholarships & Financial Assistance',
          content: 'Learn about available scholarships, grants, and financial assistance programs for sober living in {city}, Colorado.',
          keywords: ['sober living scholarships {city}', 'recovery housing assistance', 'financial help sober living'],
        },
        {
          heading: 'What to Expect in {city} Recovery Housing',
          content: 'Understand the structure, rules, and support systems available in {city} sober living environments.',
          keywords: ['recovery housing rules {city}', 'sober living structure', 'support systems'],
        },
      ],
      faqs: [
        { question: 'How much does sober living cost in {city}, Colorado?', answer: 'Sober living costs in {city} typically range from $600‑$1,550 per month, with scholarships and sliding‑scale options available.' },
        { question: 'Are scholarships available for sober living in {city}?', answer: 'Yes, several organizations offer sober living scholarships in {city}, including the Hornbuckle Foundation and Hazelbrook Recovery Residences.' },
        { question: 'What services are included in {city} recovery housing?', answer: 'Most sober living homes in {city} include peer support, group therapy, life‑skills training, and recovery coaching.' },
      ],
    },
    schema: {
      '@type': 'LocalBusiness',
      '@context': 'https://schema.org',
      name: 'Sober Living {city} Colorado',
      description: 'Recovery housing and sober living services in {city}, Colorado',
      address: {
        '@type': 'PostalAddress',
        addressLocality: '{city}',
        addressRegion: 'CO',
        addressCountry: 'US',
      },
    },
  },
  // Additional templates can be added here.
};

// ---- Keyword Lists -------------------------------------------------------
export const COLORADO_KEYWORDS = {
  primary: [
    'Colorado sober living',
    'recovery housing Colorado',
    'sober living scholarships Colorado',
    'drug rehab Colorado',
    'alcohol treatment Colorado',
    'addiction treatment centers Colorado',
  ],
  location_specific: [
    'Denver sober living',
    'Colorado Springs recovery housing',
    'Aurora addiction treatment',
    'Fort Collins drug rehab',
    'Lakewood alcohol treatment',
    'Pueblo sober living homes',
  ],
  long_tail: [
    'affordable sober living Colorado',
    'scholarships for recovery housing Colorado',
    'best treatment centers in Denver',
    'how to pay for sober living Colorado',
    'Colorado recovery housing requirements',
    'free addiction treatment Colorado',
  ],
  informational: [
    'what is sober living Colorado',
    'how does recovery housing work',
    'Colorado addiction statistics',
    'recovery resources Colorado',
    'sober living rules Colorado',
  ],
};

// ---- Treatment Data -------------------------------------------------------
export const TREATMENT_DATA: Record<string, {
  icon: string;
  name: string;
  description: string;
  services: string[];
  levels: string[];
  successRate: string;
  duration: string;
  insuranceCoverage: string;
}> = {
  rehab: {
    icon: '🏥',
    name: 'Drug & Alcohol Rehab',
    description: 'Comprehensive addiction treatment programs',
    services: ['Medical Detox', 'Individual Therapy', 'Group Counseling', 'Family Therapy', 'Aftercare Planning'],
    levels: ['Residential Inpatient', 'Partial Hospitalization (PHP)', 'Intensive Outpatient (IOP)'],
    successRate: '75%',
    duration: '30-90 days',
    insuranceCoverage: '85%'
  },
  detox: {
    icon: '💊',
    name: 'Medical Detox',
    description: '24/7 medically supervised detoxification',
    services: ['Medical Monitoring', 'Medication Management', 'Withdrawal Support', 'Nutritional Support', 'Transition Planning'],
    levels: ['Inpatient Medical Detox', 'Ambulatory Detox (when appropriate)'],
    successRate: '90%',
    duration: '3-10 days',
    insuranceCoverage: '90%'
  },
  outpatient: {
    icon: '🏢',
    name: 'Outpatient Treatment',
    description: 'Flexible treatment while maintaining daily responsibilities',
    services: ['Individual Counseling', 'Group Therapy', 'Family Sessions', 'Relapse Prevention', 'Life Skills Training'],
    levels: ['Intensive Outpatient (IOP)', 'Standard Outpatient', 'Continuing Care'],
    successRate: '70%',
    duration: '8-12 weeks',
    insuranceCoverage: '80%'
  },
  aftercare: {
    icon: '🏠',
    name: 'Sober Living & Aftercare',
    description: 'Supportive transitional housing and ongoing recovery support',
    services: ['Peer Support', 'Recovery Coaching', 'Life Skills', 'Employment Assistance', 'Community Integration'],
    levels: ['Sober Living Homes', 'Transitional Housing', 'Alumni Programs'],
    successRate: '80%',
    duration: '3-12 months',
    insuranceCoverage: '60%'
  }
};

// ---- Helper Functions ----------------------------------------------------
/** Generate location‑specific content by replacing placeholders in a template */
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
        content: section.content.replace('{city}', city).replace('{county}', county),
      })),
      faqs: template.contentStructure.faqs.map(faq => ({
        question: faq.question.replace('{city}', city),
        answer: faq.answer.replace('{city}', city),
      })),
    },
  };
}

/** Return locations filtered by priority */
export function getPriorityLocations(priority: 'high' | 'medium' | 'low' | 'all' = 'all'): ColoradoLocation[] {
  if (priority === 'all') return COLORADO_LOCATIONS;
  return COLORADO_LOCATIONS.filter(loc => loc.priority === priority);
}