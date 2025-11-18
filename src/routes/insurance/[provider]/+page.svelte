<script context="module">
  export async function load({ params, fetch }: { params: { provider: string }; fetch: typeof fetch }) {
    const provider = params.provider;
    
    // Provider-specific data mapping
    const providerData = {
      'aetna': {
        name: 'Aetna',
        logo: '/images/insurance/aetna-logo.svg',
        coverageRate: '94%',
        averageCoverage: '$28,500',
        networkSize: '12+ Colorado facilities',
        verificationTime: '2-3 minutes',
        popularPlans: ['Aetna Better Health', 'Aetna Medicare', 'Aetna Signature Administrators'],
        strengths: ['High coverage rates', 'Fast pre-authorization', 'Extensive Colorado network'],
        considerations: ['Prior auth required for residential', 'In-network preferred for full benefits']
      },
      'blue-cross-blue-shield': {
        name: 'Blue Cross Blue Shield',
        logo: '/images/insurance/bcbs-logo.svg', 
        coverageRate: '96%',
        averageCoverage: '$31,200',
        networkSize: '18+ Colorado facilities',
        verificationTime: '1-2 minutes',
        popularPlans: ['Anthem Blue Cross Blue Shield', 'Blue Advantage', 'Blue Medicare Advantage'],
        strengths: ['Highest coverage rates', 'Lowest out-of-pocket costs', 'Excellent mental health coverage'],
        considerations: ['Network restrictions apply', 'Step-down requirements']
      },
      'kaiser': {
        name: 'Kaiser Permanente',
        logo: '/images/insurance/kaiser-logo.svg',
        coverageRate: '89%',
        averageCoverage: '$24,800',
        networkSize: '8 Kaiser facilities + 15 partners',
        verificationTime: '3-5 minutes',
        popularPlans: ['Kaiser Permanente Colorado', 'Kaiser Medicare Advantage', 'Kaiser Foundation Health Plan'],
        strengths: ['Integrated care model', 'Excellent aftercare coverage', 'Mental health integration'],
        considerations: ['Kaiser facilities preferred', 'Referral requirements']
      },
      'cigna': {
        name: 'Cigna',
        logo: '/images/insurance/cigna-logo.svg',
        coverageRate: '91%',
        averageCoverage: '$26,400',
        networkSize: '14+ Colorado facilities',
        verificationTime: '2-4 minutes',
        popularPlans: ['Cigna Health and Life Insurance', 'Cigna Medicare Advantage', 'Cigna Behavioral Health'],
        strengths: ['Strong mental health coverage', 'Flexible treatment options', 'Good out-of-state coverage'],
        considerations: ['Network adequacy varies', 'Pre-authorization required']
      },
      'unitedhealthcare': {
        name: 'UnitedHealthcare',
        logo: '/images/insurance/uhc-logo.svg',
        coverageRate: '92%',
        averageCoverage: '$27,900',
        networkSize: '16+ Colorado facilities',
        verificationTime: '2-3 minutes',
        popularPlans: ['UnitedHealthcare Colorado', 'UnitedHealthcare Medicare Advantage', 'United Behavioral Health'],
        strengths: ['Comprehensive coverage', 'Good medication-assisted treatment coverage', 'Strong telehealth options'],
        considerations: ['Tiered network costs', 'Prior authorization requirements']
      },
      'medicaid': {
        name: 'Colorado Medicaid',
        logo: '/images/insurance/medicaid-logo.svg',
        coverageRate: '100%',
        averageCoverage: 'Full coverage',
        networkSize: '25+ Colorado facilities',
        verificationTime: '5-10 minutes',
        popularPlans: ['Health First Colorado', 'Colorado Medicaid Expansion', 'Medicaid Medicare Dual Eligible'],
        strengths: ['No out-of-pocket costs', 'Comprehensive coverage', 'No prior authorization for emergency'],
        considerations: ['Income eligibility required', 'Facility network limitations', 'Application process required']
      }
    };

    const data = providerData[provider] || providerData['aetna'];
    
    return {
      props: {
        provider: data,
        slug: provider,
        cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Centennial']
      }
    };
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import InsuranceVerification from '$lib/components/InsuranceVerification.svelte';
  
  export let provider: any;
  export let slug: string;
  export let cities: string[];

  onMount(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: `${provider.name} Insurance Coverage Colorado`,
        page_location: window.location.href,
        custom_map: {
          dimension1: 'insurance_provider',
          dimension2: 'colorado'
        }
      });
    }
  });
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${provider.name} Insurance Coverage for Rehab in Colorado`,
    description: `Complete guide to ${provider.name} insurance coverage for addiction treatment in Colorado`,
    url: `https://recoveryconcierge.org/insurance/${slug}`,
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: `Does ${provider.name} cover drug and alcohol rehab in Colorado?`, acceptedAnswer: { '@type': 'Answer', text: `Yes, ${provider.name} covers drug and alcohol rehab in Colorado with a ${provider.coverageRate} success rate. Coverage includes detox, inpatient, outpatient, and aftercare services.` } },
        { '@type': 'Question', name: `How much does ${provider.name} pay for rehab treatment?`, acceptedAnswer: { '@type': 'Answer', text: `${provider.name} covers an average of ${provider.averageCoverage} for addiction treatment in Colorado, with most patients paying little to nothing out-of-pocket for in-network facilities.` } },
        { '@type': 'Question', name: `How long does ${provider.name} insurance verification take?`, acceptedAnswer: { '@type': 'Answer', text: `${provider.name} insurance verification typically takes ${provider.verificationTime} when using our instant verification system.` } }
      ]
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://recoveryconcierge.org/' },
        { '@type': 'ListItem', position: 2, name: 'Insurance', item: 'https://recoveryconcierge.org/insurance' },
        { '@type': 'ListItem', position: 3, name: `${provider.name}`, item: `https://recoveryconcierge.org/insurance/${slug}` }
      ]
    }
  }
</script>

<svelte:head>
  <title>{provider.name} Insurance Coverage for Rehab & Detox in Colorado | Recovery Concierge</title>
  <meta name="description" content="Verify {provider.name} insurance coverage for addiction treatment in Colorado. {provider.coverageRate} coverage rate, {provider.averageCoverage} average. Fast 2-minute verification." />
  <meta name="keywords" content="{provider.name} rehab coverage Colorado, {provider.name} addiction treatment, {provider.name} detox insurance, Colorado rehab insurance" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="{provider.name} Insurance Coverage for Rehab & Detox in Colorado" />
  <meta property="og:description" content="Fast insurance verification for {provider.name} coverage. {provider.coverageRate} success rate for Colorado addiction treatment." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Canonical -->
  <link rel="canonical" href="https://recoveryconcierge.org/insurance/{slug}" />
  <script type="application/ld+json">{JSON.stringify(schema)}</script>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <img src={provider.logo} alt="{provider.name} logo" class="h-16" />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {provider.name} Insurance Coverage for Rehab in Colorado
        </h1>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          Fast, free insurance verification. {provider.coverageRate} of Colorado residents qualify for coverage.
          Average coverage: <strong>{provider.averageCoverage}</strong>.
        </p>
        
        <!-- Insurance Verification CTA -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
          <InsuranceVerification provider={provider.name} />
        </div>
      </div>
    </div>
  </section>

  <!-- Coverage Details -->
  <section class="py-16 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            What {provider.name} Covers in Colorado
          </h2>
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Medical Detox</h3>
                <p class="text-gray-600">24/7 medical supervision during withdrawal</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Inpatient Rehab</h3>
                <p class="text-gray-600">30-90 day residential treatment programs</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Outpatient Programs</h3>
                <p class="text-gray-600">IOP and PHP programs for flexible treatment</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Medication-Assisted Treatment</h3>
                <p class="text-gray-600">Suboxone, Vivitrol, and other FDA-approved medications</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            {provider.name} Coverage Strengths
          </h2>
          <div class="bg-blue-50 rounded-lg p-6 mb-6">
            <div class="flex items-center mb-4">
              <div class="text-3xl font-bold text-blue-600">{provider.coverageRate}</div>
              <div class="ml-3 text-sm text-gray-600">of Colorado residents qualify for coverage</div>
            </div>
            <div class="flex items-center mb-4">
              <div class="text-3xl font-bold text-blue-600">{provider.averageCoverage}</div>
              <div class="ml-3 text-sm text-gray-600">average coverage amount</div>
            </div>
            <div class="flex items-center">
              <div class="text-3xl font-bold text-blue-600">{provider.verificationTime}</div>
              <div class="ml-3 text-sm text-gray-600">verification time</div>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
          <ul class="space-y-2">
            {#each provider.strengths as strength}
              <li class="flex items-center text-gray-700">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {strength}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Popular Plans -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
        Popular {provider.name} Plans in Colorado
      </h2>
      <div class="grid md:grid-cols-3 gap-6">
        {#each provider.popularPlans as plan}
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{plan}</h3>
            <p class="text-gray-600 mb-4">Comprehensive addiction treatment coverage</p>
            <div class="text-sm text-gray-500">
              <div class="flex items-center mb-2">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Detox & Medical Services
              </div>
              <div class="flex items-center mb-2">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Residential Treatment
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Outpatient Programs
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Colorado Cities -->
  <section class="py-16 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
        {provider.name} Coverage by Colorado City
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {#each cities as city}
          <a href="/co/{city.toLowerCase().replace(' ', '-')}/insurance/{slug}" class="block">
            <div class="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 text-center transition-colors">
              <div class="text-lg font-semibold text-gray-900">{city}</div>
              <div class="text-sm text-gray-600">View coverage</div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- Verification CTA -->
  <section class="py-16 bg-blue-600 text-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold mb-4">
        Verify Your {provider.name} Coverage in 2 Minutes
      </h2>
      <p class="text-xl mb-8">
        Get instant verification of your {provider.name} benefits for addiction treatment in Colorado.
        No obligations, completely confidential.
      </p>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8">
        <InsuranceVerification provider={provider.name} />
      </div>
      <p class="text-sm mt-4 opacity-75">
        HIPAA-compliant • No spam • Real verification results
      </p>
    </div>
  </section>
</div>