<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ params, fetch }) => {
    const city = params.city as string;
    const treatment = params.treatment as string;
    
    // Treatment type data mapping
    const treatmentData = {
      'rehab': {
        name: 'Drug & Alcohol Rehab',
        icon: '🏥',
        duration: '30-90 days',
        successRate: '68-85%',
        averageCost: '$15,000-60,000',
        insuranceCoverage: '85-95%',
        description: 'Comprehensive residential treatment programs',
        services: ['24/7 medical supervision', 'Individual therapy', 'Group counseling', 'Family therapy', 'Aftercare planning'],
        levels: ['Detox', 'Residential', 'Partial Hospitalization', 'Intensive Outpatient']
      },
      'detox': {
        name: 'Medical Detox',
        icon: '⚕️',
        duration: '5-14 days',
        successRate: '95%+',
        averageCost: '$3,000-10,000',
        insuranceCoverage: '95-100%',
        description: 'Medically supervised withdrawal management',
        services: ['24/7 medical monitoring', 'Medication management', 'Withdrawal symptom relief', 'Nutritional support', 'Safety protocols'],
        levels: ['Medical Detox', 'Social Detox', 'Medication-Assisted Detox']
      },
      'outpatient': {
        name: 'Outpatient Treatment',
        icon: '🏠',
        duration: '3-12 months',
        successRate: '55-75%',
        averageCost: '$5,000-15,000',
        insuranceCoverage: '80-90%',
        description: 'Flexible treatment while living at home',
        services: ['Individual therapy', 'Group sessions', 'Medication management', 'Family counseling', 'Relapse prevention'],
        levels: ['Intensive Outpatient (IOP)', 'Partial Hospitalization (PHP)', 'Standard Outpatient', 'Aftercare']
      },
      'aftercare': {
        name: 'Aftercare & Sober Living',
        icon: '🌟',
        duration: '6-24 months',
        successRate: '70-80%',
        averageCost: '$2,000-8,000',
        insuranceCoverage: '60-80%',
        description: 'Ongoing support and sober living arrangements',
        services: ['Sober living homes', 'Continuing therapy', 'Peer support groups', 'Life skills training', 'Employment assistance'],
        levels: ['Sober Living', 'Outpatient Aftercare', 'Peer Support', 'Alumni Programs']
      }
    };

    // City data for Colorado
    const cityData = {
      'denver': {
        name: 'Denver',
        population: '715,522',
        county: 'Denver County',
        facilities: 45,
        averageWaitTime: '24-48 hours',
        specialPrograms: ['LGBTQ+ friendly', 'Veterans programs', 'Spanish-speaking', 'Medication-assisted treatment'],
        demographics: 'Diverse urban population with high addiction rates',
        insuranceMix: '60% private, 25% Medicaid, 15% uninsured'
      },
      'colorado-springs': {
        name: 'Colorado Springs',
        population: '478,961',
        county: 'El Paso County',
        facilities: 32,
        averageWaitTime: '12-36 hours',
        specialPrograms: ['Military/veteran focused', 'Christian-based', 'Wilderness therapy', 'Dual diagnosis'],
        demographics: 'Military community with unique addiction challenges',
        insuranceMix: '55% private, 30% military insurance, 15% Medicaid'
      },
      'aurora': {
        name: 'Aurora',
        population: '386,261',
        county: 'Arapahoe County',
        facilities: 28,
        averageWaitTime: '24-72 hours',
        specialPrograms: ['Multicultural programs', 'Refugee services', 'Family-centered care', 'Youth programs'],
        demographics: 'Diverse suburban community with varied addiction patterns',
        insuranceMix: '50% private, 35% Medicaid, 15% uninsured'
      },
      'fort-collins': {
        name: 'Fort Collins',
        population: '169,810',
        county: 'Larimer County',
        facilities: 18,
        averageWaitTime: '48-96 hours',
        specialPrograms: ['College student focused', 'Outdoor therapy', 'Alternative modalities', 'Co-occurring disorders'],
        demographics: 'College town with young adult addiction issues',
        insuranceMix: '45% private, 25% student insurance, 30% Medicaid'
      },
      'lakewood': {
        name: 'Lakewood',
        population: '155,984',
        county: 'Jefferson County',
        facilities: 22,
        averageWaitTime: '24-48 hours',
        specialPrograms: ['Dual diagnosis', 'Trauma-informed care', 'Holistic approaches', 'Family therapy'],
        demographics: 'Suburban families with prescription drug issues',
        insuranceMix: '65% private, 25% Medicaid, 10% uninsured'
      }
    };

    const treatmentInfo = treatmentData[treatment as keyof typeof treatmentData] || treatmentData['rehab'];
    const cityInfo = cityData[city as keyof typeof cityData] || cityData['denver'];
    
    // Generate nearby cities for internal linking
    const nearbyCities = Object.keys(cityData).filter(c => c !== city).slice(0, 4);
    
    return {
      props: {
        treatment: treatmentInfo,
        city: cityInfo,
        slug: `${city}-${treatment}`,
        nearbyCities,
        insuranceProviders: ['Aetna', 'Blue Cross Blue Shield', 'Kaiser', 'Cigna', 'UnitedHealthcare', 'Medicaid']
      }
    };
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import InsuranceVerifier from '$lib/components/InsuranceVerifier.svelte';
  import InsuranceVerification from '$lib/components/InsuranceVerification.svelte';
  
  export let treatment: any;
  export let city: any;
  export let slug: string;
  export let nearbyCities: string[];
  export let insuranceProviders: string[];

  onMount(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: `${treatment.name} ${city.name} Colorado`,
        page_location: window.location.href,
        custom_map: {
          dimension1: 'treatment_type',
          dimension2: 'city',
          dimension3: 'colorado'
        }
      });
    }
  });
  const canonicalCity = city.name.toLowerCase().replace(' ', '-')
  const canonicalTreatment = treatment.name.toLowerCase().replace(' ', '-')
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'MedicalWebPage'],
    name: `${treatment.name} in ${city.name}, Colorado`,
    description: `Find ${treatment.name.toLowerCase()} services in ${city.name}, Colorado. ${city.facilities}+ licensed facilities with ${treatment.successRate} success rates.`,
    url: `https://recoveryconcierge.org/co/${canonicalCity}/${canonicalTreatment}`,
    medicalSpecialty: 'Addiction Medicine',
    about: { '@type': 'MedicalCondition', name: 'Substance Use Disorder', alternateName: 'Drug and Alcohol Addiction' },
    mainEntity: {
      '@type': 'HealthcareService',
      name: `${treatment.name} Services`,
      description: `${treatment.description}`,
      areaServed: { '@type': 'City', name: `${city.name}`, '@id': `https://recoveryconcierge.org/co/${canonicalCity}` },
      provider: { '@type': 'Organization', name: 'Recovery Concierge Colorado', url: 'https://recoveryconcierge.org' },
      serviceType: `${treatment.name}`,
      serviceOutput: 'Addiction Recovery',
      duration: `${treatment.duration}`,
      successRate: `${treatment.successRate}`,
      availableChannel: { '@type': 'ServiceChannel', serviceUrl: `https://recoveryconcierge.org/co/${canonicalCity}/${canonicalTreatment}` }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://recoveryconcierge.org/' },
        { '@type': 'ListItem', position: 2, name: 'Colorado', item: 'https://recoveryconcierge.org/co' },
        { '@type': 'ListItem', position: 3, name: `${city.name}`, item: `https://recoveryconcierge.org/co/${canonicalCity}` },
        { '@type': 'ListItem', position: 4, name: `${treatment.name}`, item: `https://recoveryconcierge.org/co/${canonicalCity}/${canonicalTreatment}` }
      ]
    }
  }
</script>

<svelte:head>
  <title>{treatment.name} in {city.name}, Colorado | Recovery Concierge</title>
  <meta name="description" content="Find {treatment.name.toLowerCase()} in {city.name}, Colorado. {city.facilities}+ licensed facilities. {treatment.successRate} success rate. Insurance accepted. Fast placement." />
  <meta name="keywords" content="{treatment.name.toLowerCase()} {city.name.toLowerCase()} colorado, {treatment.name.toLowerCase()} near me, {city.name.toLowerCase()} addiction treatment, colorado rehab" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="{treatment.name} in {city.name}, Colorado" />
  <meta property="og:description" content="{city.facilities}+ licensed {treatment.name.toLowerCase()} facilities in {city.name}. Insurance accepted, fast placement." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Canonical -->
  <link rel="canonical" href="https://recoveryconcierge.org/co/{city.name.toLowerCase().replace(' ', '-')}/{treatment.name.toLowerCase().replace(' ', '-')}" />
  <script type="application/ld+json">{JSON.stringify(schema)}</script>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <div class="text-6xl mb-6">{treatment.icon}</div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {treatment.name} in {city.name}, Colorado
        </h1>
        <p class="text-xl mb-4 max-w-3xl mx-auto">
          {city.facilities}+ licensed {treatment.name.toLowerCase()} facilities. {treatment.successRate} success rate. 
          Average wait time: {city.averageWaitTime}.
        </p>
        <p class="text-lg opacity-90 mb-8">
          Insurance accepted: {treatment.insuranceCoverage} coverage rate.
        </p>
        
        <!-- Insurance Verification CTA -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
          <InsuranceVerification provider={insuranceProviders?.[0] || 'Medicaid'} />
        </div>
      </div>
    </div>
  </section>

  <!-- Treatment Overview -->
  <section class="py-16 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            About {treatment.name} in {city.name}
          </h2>
          <p class="text-lg text-gray-700 mb-6">
            {treatment.description} in {city.name}, Colorado. With {city.population} residents, 
            {city.name} has {city.facilities} licensed {treatment.name.toLowerCase()} facilities serving the community.
          </p>
          <p class="text-gray-600 mb-6">
            {city.demographics}. Insurance coverage breakdown: {city.insuranceMix}.
          </p>
          
          <div class="bg-blue-50 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Key Statistics</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-2xl font-bold text-blue-600">{treatment.successRate}</div>
                <div class="text-sm text-gray-600">Success Rate</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-blue-600">{treatment.duration}</div>
                <div class="text-sm text-gray-600">Typical Duration</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-blue-600">{city.facilities}</div>
                <div class="text-sm text-gray-600">Local Facilities</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-blue-600">{treatment.insuranceCoverage}</div>
                <div class="text-sm text-gray-600">Insurance Coverage</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-6">
            {treatment.name} Services Offered
          </h3>
          <div class="space-y-4">
            {#each treatment.services as service}
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-gray-900 font-medium">{service}</div>
                </div>
              </div>
            {/each}
          </div>
          
          <h3 class="text-2xl font-bold text-gray-900 mb-4 mt-8">
            Treatment Levels Available
          </h3>
          <div class="space-y-2">
            {#each treatment.levels as level}
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-gray-900 font-medium">{level}</div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Special Programs -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
        Special Programs in {city.name}
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each city.specialPrograms as program}
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="text-2xl mb-3">✨</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{program}</h3>
            <p class="text-gray-600 text-sm">
              Specialized {treatment.name.toLowerCase()} program tailored for {program.toLowerCase()} in {city.name}.
            </p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Insurance Coverage -->
  <section class="py-16 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
        Insurance Coverage in {city.name}
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each insuranceProviders as provider}
          <a href="/insurance/{provider.toLowerCase().replace(' ', '-')}" class="block">
            <div class="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 text-center transition-colors">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{provider}</h3>
              <p class="text-gray-600 text-sm mb-3">
                Coverage available for {treatment.name.toLowerCase()} in {city.name}
              </p>
              <div class="text-blue-600 text-sm font-medium">
                View Coverage Details →
              </div>
            </div>
          </a>
        {/each}
      </div>
      
      <div class="text-center mt-8">
        <div class="bg-green-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {treatment.insuranceCoverage} Insurance Coverage Rate
          </h3>
          <p class="text-gray-600">
            Most {city.name} residents qualify for significant coverage. Verify your benefits in 2 minutes.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Nearby Cities -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
        {treatment.name} in Nearby Colorado Cities
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each nearbyCities as nearbyCity}
          <a href="/co/{nearbyCity}/{treatment.name.toLowerCase().replace(' ', '-')}" class="block">
            <div class="bg-white hover:bg-blue-50 rounded-lg p-4 text-center transition-colors">
              <div class="text-lg font-semibold text-gray-900 capitalize">{nearbyCity.replace('-', ' ')}</div>
              <div class="text-sm text-gray-600">{treatment.name}</div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="py-16 bg-blue-600 text-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl font-bold mb-4">
        Find {treatment.name} in {city.name} Today
      </h2>
      <p class="text-xl mb-8">
        Get connected to {city.facilities}+ licensed {treatment.name.toLowerCase()} facilities in {city.name}. 
        Insurance verification takes 2 minutes.
      </p>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8">
        <InsuranceVerification provider={insuranceProviders?.[0] || 'Medicaid'} />
      </div>
      <p class="text-sm mt-4 opacity-75">
        Available 24/7 • HIPAA-compliant • No cost or obligation
      </p>
    </div>
  </section>
</div>