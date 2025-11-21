<script lang="ts">
  import { onMount } from 'svelte';
  import InsuranceVerification from '$lib/components/InsuranceVerification.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import { TREATMENT_DATA } from '$lib/utils/colorado-seo-data';

  export let data;
  
  $: ({ seoContent, location, templateType } = data);
  
  // Map template type to treatment data key
  $: treatmentKey = getTreatmentKey(templateType);
  $: treatmentInfo = TREATMENT_DATA[treatmentKey] || TREATMENT_DATA['rehab'];
  
  // Fallback for optional location data
  $: cityStats = {
    facilities: location.facilities || 15,
    averageWaitTime: location.averageWaitTime || '24-48 hours',
    specialPrograms: location.specialPrograms || ['Dual Diagnosis', 'Holistic Care', 'Family Support'],
    demographics: location.demographics || 'Diverse community with varied needs',
    insuranceMix: location.insuranceMix || 'Private insurance, Medicaid, Self-pay'
  };

  function getTreatmentKey(type: string): string {
    if (type.includes('sober_living')) return 'aftercare';
    if (type.includes('detox')) return 'detox';
    if (type.includes('outpatient')) return 'outpatient';
    if (type.includes('aftercare')) return 'aftercare';
    return 'rehab';
  }
  
  // Generate breadcrumb data
  $: breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Colorado Recovery', url: '/co' },
    { name: location.city, url: `/co/${location.city.toLowerCase().replace(/\s+/g, '-')}` },
    { name: treatmentInfo.name, url: seoContent.canonical }
  ];

  const insuranceProviders = ['Aetna', 'Blue Cross Blue Shield', 'Kaiser', 'Cigna', 'UnitedHealthcare', 'Medicaid'];

  onMount(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: seoContent.title,
        page_location: window.location.href,
        custom_map: {
          dimension1: treatmentKey,
          dimension2: location.city,
          dimension3: 'colorado'
        }
      });
    }
  });

  // JSON-LD Schemas
  $: schemaJson = JSON.stringify(seoContent.schema);
  $: faqSchemaJson = seoContent.faqs && seoContent.faqs.length > 0 ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': seoContent.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  }) : null;

  $: breadcrumbSchemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `https://metzlercares.com${item.url}`
    }))
  });
</script>

<svelte:head>
  <title>{seoContent.title}</title>
  <meta name="description" content={seoContent.metaDescription} />
  <meta name="keywords" content={seoContent.keywords.join(', ')} />
  
  <!-- Open Graph -->
  <meta property="og:title" content={seoContent.title} />
  <meta property="og:description" content={seoContent.metaDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Canonical -->
  <link rel="canonical" href={seoContent.canonical} />
  
  <!-- Main Schema -->
  {@html `<script type="application/ld+json">${schemaJson}</script>`}
  
  <!-- FAQPage Schema for Rich Snippets -->
  {#if faqSchemaJson}
    {@html `<script type="application/ld+json">${faqSchemaJson}</script>`}
  {/if}
  
  <!-- BreadcrumbList Schema -->
  {@html `<script type="application/ld+json">${breadcrumbSchemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-cream">
  <!-- Breadcrumb Navigation -->
  <div class="bg-white border-b border-warm-gray">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  </div>
  
  <!-- Hero Section -->
  <section class="hero-premium min-h-[60vh]">
    <div class="hero-premium__content">
      <div class="text-6xl mb-6 animate-fade-in">{treatmentInfo.icon}</div>
      <h1 class="hero-premium__title">
        {seoContent.h1}
      </h1>
      <p class="hero-premium__subtitle">
        {cityStats.facilities}+ licensed {treatmentInfo.name.toLowerCase()} facilities in {location.city}. 
        {treatmentInfo.successRate} success rate. 
        Average wait time: {cityStats.averageWaitTime}.
      </p>
      <p class="text-lg opacity-90 mb-8 font-secondary">
        Insurance accepted: {treatmentInfo.insuranceCoverage} coverage rate.
      </p>
      
      <!-- Insurance Verification CTA -->
      <div class="bg-white/10 backdrop-blur-premium rounded-xl p-8 max-w-2xl mx-auto border border-white/20 shadow-premium">
        <InsuranceVerification provider={insuranceProviders[0]} />
      </div>
    </div>
  </section>

  <!-- Trust Signals -->
  <section class="py-12 bg-white border-b border-warm-gray">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
        <div class="flex flex-col items-center text-center">
          <div class="text-3xl mb-2">🏆</div>
          <div class="text-sm font-bold text-brand-navy">Top Rated in {location.city}</div>
        </div>
        <div class="flex flex-col items-center text-center">
          <div class="text-3xl mb-2">✓</div>
          <div class="text-sm font-bold text-brand-navy">Verified Facilities</div>
        </div>
        <div class="flex flex-col items-center text-center">
          <div class="text-3xl mb-2">🛡️</div>
          <div class="text-sm font-bold text-brand-navy">HIPAA Compliant</div>
        </div>
        <div class="flex flex-col items-center text-center">
          <div class="text-3xl mb-2">🤝</div>
          <div class="text-sm font-bold text-brand-navy">Community Backed</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Treatment Overview -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-forest-green mb-6">
            About {treatmentInfo.name} in {location.city}
          </h2>
          <p class="text-lg text-charcoal mb-6 leading-relaxed">
            {treatmentInfo.description} in {location.city}, Colorado. With a population of {location.population?.toLocaleString() || 'N/A'}, 
            {location.city} has {cityStats.facilities} licensed facilities serving the community.
          </p>
          <p class="text-charcoal mb-8 leading-relaxed">
            {cityStats.demographics}. Insurance coverage breakdown: {cityStats.insuranceMix}.
          </p>
          
          <div class="bg-cream rounded-xl p-8 border border-warm-gray shadow-lg">
            <h3 class="text-xl font-semibold text-forest-green mb-6">Key Statistics</h3>
            <div class="grid grid-cols-2 gap-8">
              <div>
                <div class="text-3xl font-bold text-mountain-blue mb-1">{treatmentInfo.successRate}</div>
                <div class="text-sm text-charcoal font-medium">Success Rate</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-mountain-blue mb-1">{treatmentInfo.duration}</div>
                <div class="text-sm text-charcoal font-medium">Typical Duration</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-mountain-blue mb-1">{cityStats.facilities}</div>
                <div class="text-sm text-charcoal font-medium">Local Facilities</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-mountain-blue mb-1">{treatmentInfo.insuranceCoverage}</div>
                <div class="text-sm text-charcoal font-medium">Insurance Coverage</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-2xl font-bold text-forest-green mb-8">
            {treatmentInfo.name} Services Offered
          </h3>
          <div class="space-y-4 mb-12">
            {#each treatmentInfo.services as service}
              <div class="flex items-center p-4 bg-gray-50 rounded-lg border border-warm-gray hover:border-mountain-blue transition-colors duration-200">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-forest-green/10 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-forest-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-charcoal font-medium">{service}</div>
                </div>
              </div>
            {/each}
          </div>
          
          <h3 class="text-2xl font-bold text-forest-green mb-6">
            Treatment Levels Available
          </h3>
          <div class="flex flex-wrap gap-3">
            {#each treatmentInfo.levels as level}
              <span class="px-4 py-2 bg-mountain-blue/10 text-mountain-blue font-medium rounded-full text-sm border border-mountain-blue/20">
                {level}
              </span>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Special Programs -->
  <section class="py-20 bg-cream">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-forest-green mb-12 text-center">
        Special Programs in {location.city}
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each cityStats.specialPrograms as program}
          <div class="card-premium p-8 hover:border-sunset-orange group">
            <div class="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">✨</div>
            <h3 class="text-xl font-bold text-forest-green mb-3">{program}</h3>
            <p class="text-charcoal text-sm leading-relaxed">
              Specialized {treatmentInfo.name.toLowerCase()} program tailored for {program.toLowerCase()} in {location.city}.
            </p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Local Resource Grid -->
  <section class="py-20 bg-white border-y border-warm-gray/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-forest-green mb-12 text-center">
        Local Recovery Resources
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-xl border border-warm-gray shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-mountain-blue/10 rounded-lg flex items-center justify-center mb-4 text-2xl">🏥</div>
          <h3 class="text-lg font-bold text-brand-navy mb-2">Medical Detox</h3>
          <p class="text-charcoal/80 text-sm mb-4">Safe, supervised withdrawal management facilities in {location.city}.</p>
          <a href="/co/{location.city.toLowerCase().replace(/\s+/g, '-')}/detox" class="text-mountain-blue font-medium text-sm hover:underline">Find Detox Centers &rarr;</a>
        </div>
        <div class="bg-white p-6 rounded-xl border border-warm-gray shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-forest-green/10 rounded-lg flex items-center justify-center mb-4 text-2xl">🏡</div>
          <h3 class="text-lg font-bold text-brand-navy mb-2">Sober Living</h3>
          <p class="text-charcoal/80 text-sm mb-4">Structured recovery housing and transitional living in {location.city}.</p>
          <a href="/co/{location.city.toLowerCase().replace(/\s+/g, '-')}/sober-living" class="text-mountain-blue font-medium text-sm hover:underline">View Housing Options &rarr;</a>
        </div>
        <div class="bg-white p-6 rounded-xl border border-warm-gray shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-sunset-orange/10 rounded-lg flex items-center justify-center mb-4 text-2xl">👥</div>
          <h3 class="text-lg font-bold text-brand-navy mb-2">Support Groups</h3>
          <p class="text-charcoal/80 text-sm mb-4">AA, NA, and SMART Recovery meetings available in {location.city}.</p>
          <a href="/resources/colorado" class="text-mountain-blue font-medium text-sm hover:underline">Find Meetings &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Detailed Content (SEO) -->
  <section class="py-20 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg prose-headings:font-primary prose-headings:text-forest-green prose-p:text-charcoal prose-a:text-mountain-blue">
      <h2 class="text-center mb-12">Comprehensive Guide</h2>
      <div class="whitespace-pre-wrap font-secondary text-charcoal">
        {seoContent.content}
      </div>
    </div>
  </section>

  <!-- FAQs -->
  <section class="py-20 bg-cream">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-forest-green mb-12 text-center">
        Frequently Asked Questions
      </h2>
      <div class="space-y-6">
        {#each seoContent.faqs as faq}
          <div class="card-premium p-8">
            <h3 class="text-xl font-bold text-forest-green mb-3">{faq.question}</h3>
            <p class="text-charcoal leading-relaxed">{faq.answer}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Insurance Coverage -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-forest-green mb-12 text-center">
        Insurance Coverage in {location.city}
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each insuranceProviders as provider}
          <a href="/insurance/{provider.toLowerCase().replace(' ', '-')}" class="block group">
            <div class="card-premium p-8 text-center h-full group-hover:border-mountain-blue">
              <h3 class="text-xl font-bold text-forest-green mb-3 group-hover:text-mountain-blue transition-colors">{provider}</h3>
              <p class="text-charcoal text-sm mb-6">
                Coverage available for {treatmentInfo.name.toLowerCase()} in {location.city}
              </p>
              <div class="text-mountain-blue font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                View Coverage Details 
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="py-24 bg-forest-green text-white relative overflow-hidden">
    <div class="absolute inset-0 bg-mountain-blue/20 mix-blend-overlay"></div>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h2 class="text-3xl md:text-5xl font-bold mb-6 font-primary">
        Find {treatmentInfo.name} in {location.city} Today
      </h2>
      <p class="text-xl mb-12 text-white/90 font-secondary max-w-2xl mx-auto">
        Get connected to {cityStats.facilities}+ licensed {treatmentInfo.name.toLowerCase()} facilities in {location.city}. 
        Insurance verification takes 2 minutes.
      </p>
      <div class="bg-white/10 backdrop-blur-premium rounded-xl p-8 border border-white/20 shadow-premium mb-8">
        <InsuranceVerification provider={insuranceProviders[0]} />
      </div>
      <p class="text-sm opacity-75 font-medium tracking-wide">
        AVAILABLE 24/7 • HIPAA-COMPLIANT • NO COST OR OBLIGATION
      </p>
    </div>
  </section>
</div>