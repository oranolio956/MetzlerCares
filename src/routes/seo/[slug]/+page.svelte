<script lang="ts">
  import { page } from '$app/stores';
  
  export let data: any;
  
  let seoData: any = null;
  let loading = false;
  let error = '';
  
  $: seoData = data?.seoData || null;
  
  // Advanced schema markup generator
  function generateAdvancedSchema(data: any) {
    if (!data) return {};
    
    const baseSchema = data.schema;
    
    // Add FAQ schema for better rich snippets
    const faqSchema = {
      '@type': 'FAQPage',
      mainEntity: data.h2s?.slice(0, 5).map((h2: string, index: number) => ({
        '@type': 'Question',
        name: h2,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Learn about ${h2.toLowerCase()} in ${data.city}. Our comprehensive ${data.service} services provide evidence-based treatment with proven results.`
        }
      }))
    };
    
    // Add LocalBusiness schema for local SEO
    const localBusinessSchema = {
      '@type': 'LocalBusiness',
      name: `Metzler Cares - ${data.city} ${data.service.charAt(0).toUpperCase() + data.service.slice(1)} Services`,
      description: data.metaDescription,
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.city,
        addressRegion: 'CO',
        addressCountry: 'US'
      },
      url: `https://metzlercares.org/seo/${data.slug}`
    };
    
    return [baseSchema, faqSchema, localBusinessSchema];
  }
  
  // Generate dynamic content sections
  function generateContentSections(data: any) {
    if (!data) return [];
    
    return data.h2s?.map((h2: string, index: number) => ({
      title: h2,
      content: generateSectionContent(h2, data.city, data.service, index),
      keywords: data.keywords?.slice(index * 2, (index + 1) * 2) || []
    })) || [];
  }
  
  function generateSectionContent(h2: string, city: string, service: string, index: number) {
    const sectionTemplates = {
      'Why Choose Medical Detox?': `Choosing professional medical detox in ${city} ensures safe withdrawal management with 24/7 medical supervision. Our evidence-based approach minimizes discomfort while maximizing safety during the detoxification process.`,
      'Our Detox Process': `Our comprehensive detox process in ${city} begins with a thorough medical assessment, followed by personalized treatment planning and continuous monitoring throughout withdrawal.`,
      '24/7 Medical Supervision': `Round-the-clock medical supervision during detox in ${city} provides immediate intervention for withdrawal complications and ensures patient safety throughout the process.`,
      'Comprehensive Treatment Approach': `Our ${city} addiction treatment programs combine evidence-based therapies including cognitive-behavioral therapy, motivational interviewing, and contingency management for comprehensive recovery.`,
      'Evidence-Based Therapies': `Evidence-based addiction treatment in ${city} includes proven therapeutic modalities such as CBT, DBT, and trauma-informed care, delivered by licensed professionals with specialized addiction training.`,
      'Benefits of Sober Living': `Sober living homes in ${city} provide structured recovery housing with peer support, accountability systems, and life skills training essential for maintaining long-term sobriety.`,
      'Long-Term Recovery Support': `Comprehensive aftercare in ${city} includes ongoing therapy, support group connections, relapse prevention planning, and alumni programs for sustained recovery success.`
    };
    
    return sectionTemplates[h2 as keyof typeof sectionTemplates] || 
           `Learn about ${h2.toLowerCase()} in ${city}. Our professional ${service} services provide comprehensive support and evidence-based treatment for lasting recovery.`;
  }
</script>

<svelte:head>
  {#if seoData && !loading}
    <title>{seoData.title}</title>
    <meta name="description" content={seoData.metaDescription} />
    <meta name="keywords" content={seoData.keywords?.join(', ')} />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content={seoData.title} />
    <meta property="og:description" content={seoData.metaDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={`https://metzlercares.org/${seoData.slug}`} />
    <meta property="og:site_name" content="Metzler Cares" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seoData.title} />
    <meta name="twitter:description" content={seoData.metaDescription} />
    
    <!-- Canonical URL -->
    <link rel="canonical" href={data?.canonical || `https://metzlercares.org/seo/${seoData.slug}`} />
    
    <script type="application/ld+json">
      {JSON.stringify(generateAdvancedSchema(seoData))}
    </script>
  {/if}
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  {#if loading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading content...</p>
      </div>
    </div>
  {:else if error}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="text-red-600 text-xl mb-4">❌</div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Content Not Found</h1>
        <p class="text-gray-600 mb-4">{error}</p>
        <a href="/" class="text-blue-600 hover:text-blue-800 underline">Return to Homepage</a>
      </div>
    </div>
  {:else if seoData}
    <!-- Hero Section -->
    <section class="relative py-20 px-4">
      <div class="max-w-6xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          {seoData.h1}
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {seoData.metaDescription}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Get Help Now
          </button>
          <button class="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
            Call 24/7: (888) 555-0199
          </button>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <section class="py-16 px-4">
      <div class="max-w-4xl mx-auto">
        {#each generateContentSections(seoData) as section, index}
          <div class="mb-16">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">
              {section.title}
            </h2>
            <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>{section.content}</p>
            </div>
            
            <!-- Internal Links -->
            {#if seoData.internalLinks && index === 0}
              <div class="mt-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Related Services</h3>
                <div class="flex flex-wrap gap-4">
                  {#each seoData.internalLinks as link}
                    <a href={link.url} class="text-blue-600 hover:text-blue-800 underline font-medium">
                      {link.anchor}
                    </a>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <!-- Trust Signals -->
    <section class="py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Metzler Cares
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl mb-4">🏥</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Evidence-Based Care</h3>
            <p class="text-gray-600">Care plans built on proven treatment approaches</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">⚕️</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Compassionate Support</h3>
            <p class="text-gray-600">Dedicated team focused on safe, supportive recovery</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">📞</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Quick Help</h3>
            <p class="text-gray-600">Fast response with clear next steps to begin care</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 px-4 bg-blue-600">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-white mb-6">
          Ready to Start Your Recovery Journey?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Take the first step toward lasting recovery. Our compassionate team is here to help 24/7.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
            Verify Insurance
          </button>
          <button class="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Schedule Assessment
          </button>
        </div>
      </div>
    </section>
  {/if}
</div>