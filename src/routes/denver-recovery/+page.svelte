<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title>Denver Recovery Programs & Addiction Treatment | Housing Aid Available</title>
  <meta
    name="description"
    content="Find Denver recovery programs, detox centers, rehab facilities, and sober living homes. Immediate housing scholarships available for individuals in recovery from addiction in Denver."
  />
  <meta
    name="keywords"
    content="Denver recovery programs, addiction treatment Denver, sober living Denver, detox centers Denver, rehab facilities Denver, recovery housing Denver"
  />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Denver Recovery Programs & Addiction Treatment",
      "description": "Comprehensive guide to Denver recovery programs, detox centers, rehab facilities, and sober living homes with housing aid available.",
      "url": "https://metzlerfoundations.org/denver-recovery",
      "publisher": {
        "@type": "Organization",
        "name": "Metzler Foundations",
        "url": "https://metzlerfoundations.org"
      },
      "about": {
        "@type": "Thing",
        "name": "Substance Use Disorder Recovery",
        "description": "Recovery programs and treatment facilities for individuals with substance use disorders in Denver"
      },
      "areaServed": {
        "@type": "City",
        "name": "Denver",
        "addressRegion": "CO",
        "addressCountry": "US"
      }
    }
  </script>
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button onclick={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
        </button>
        <nav class="hidden md:flex items-center space-x-6">
          <a href="/colorado-recovery" class="text-navy hover:text-olive transition-colors duration-200 font-medium">
            Colorado Recovery
          </a>
          <a href="/resources/colorado" class="text-navy hover:text-olive transition-colors duration-200 font-medium">
            Resources
          </a>
          <a href="/get-aid" class="text-navy hover:text-olive transition-colors duration-200 font-medium"> Get Aid </a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy via-olive to-gold bg-opacity-10">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-navy mb-6">
        Denver Recovery Programs & Treatment Facilities
      </h1>
      <p class="text-xl text-navy text-opacity-80 mb-8">
        Comprehensive directory of Denver rehab centers, detox facilities, sober living homes, and recovery support
        services. Housing scholarships available for qualified individuals.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/get-aid" class="btn-primary"> Apply for Denver Housing Aid </a>
        <a href="/resources/colorado" class="btn-secondary"> Browse All Resources </a>
      </div>
    </div>
  </section>

  <!-- Denver Recovery Services -->
  <main class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Denver-Specific Content -->
      <section class="mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-serif font-medium text-navy mb-6">Recovery Support in Denver</h2>
            <p class="text-lg text-navy text-opacity-80 mb-6">
              Denver offers one of Colorado's most comprehensive networks of recovery services, with hundreds of
              treatment programs, sober living homes, and support groups serving individuals from all backgrounds.
            </p>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-3 h-3 text-cream" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-navy">Comprehensive Treatment Network</h3>
                  <p class="text-navy text-opacity-70">Over 150 licensed treatment facilities and programs</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-3 h-3 text-cream" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-navy">Peer Support Communities</h3>
                  <p class="text-navy text-opacity-70">Thousands of AA/NA meetings and recovery groups</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg class="w-3 h-3 text-cream" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-navy">Housing Support Available</h3>
                  <p class="text-navy text-opacity-70">Immediate housing aid for Denver residents in recovery</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-lg border border-navy border-opacity-10 p-8">
            <h3 class="text-2xl font-serif font-medium text-navy mb-6 text-center">
              Denver Recovery Services Overview
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-navy border-opacity-10">
                <span class="text-navy font-medium">Licensed Treatment Centers</span>
                <span class="text-olive font-semibold">150+</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-navy border-opacity-10">
                <span class="text-navy font-medium">Sober Living Homes</span>
                <span class="text-olive font-semibold">75+</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-navy border-opacity-10">
                <span class="text-navy font-medium">AA Meetings Weekly</span>
                <span class="text-olive font-semibold">500+</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-navy border-opacity-10">
                <span class="text-navy font-medium">Recovery Support Groups</span>
                <span class="text-olive font-semibold">200+</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-navy font-medium">Housing Scholarships Available</span>
                <span class="text-olive font-semibold">Yes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Service Categories -->
      <section class="mb-16">
        <h2 class="text-3xl font-serif font-medium text-navy mb-8 text-center">Denver Recovery Services & Programs</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Treatment Programs -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-xl font-semibold text-navy mb-4">Treatment Programs in Denver</h3>
            <p class="text-navy text-opacity-80 mb-4">
              Professional rehabilitation and treatment services for substance use disorders.
            </p>
            <ul class="space-y-2 text-navy text-opacity-70">
              <li>• Inpatient rehabilitation centers</li>
              <li>• Outpatient treatment programs</li>
              <li>• Dual diagnosis treatment</li>
              <li>• Medication-assisted treatment (MAT)</li>
              <li>• Intensive outpatient programs (IOP)</li>
            </ul>
            <a
              href="/resources/colorado-rehab"
              class="inline-block mt-4 text-olive hover:text-navy font-semibold transition-colors"
            >
              Find Denver Treatment Programs →
            </a>
          </div>

          <!-- Detox Services -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-xl font-semibold text-navy mb-4">Detox Centers in Denver</h3>
            <p class="text-navy text-opacity-80 mb-4">
              Medical detoxification facilities providing 24/7 care during withdrawal.
            </p>
            <ul class="space-y-2 text-navy text-opacity-70">
              <li>• Medical detox programs</li>
              <li>• 24/7 medical supervision</li>
              <li>• Medication management</li>
              <li>• Stabilization services</li>
              <li>• Transition to treatment</li>
            </ul>
            <a
              href="/resources/colorado-detox"
              class="inline-block mt-4 text-olive hover:text-navy font-semibold transition-colors"
            >
              Find Denver Detox Centers →
            </a>
          </div>

          <!-- Sober Living -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-xl font-semibold text-navy mb-4">Sober Living in Denver</h3>
            <p class="text-navy text-opacity-80 mb-4">
              Certified sober living homes providing structured, substance-free housing.
            </p>
            <ul class="space-y-2 text-navy text-opacity-70">
              <li>• Certified sober living homes</li>
              <li>• Peer support communities</li>
              <li>• Structured living environments</li>
              <li>• Housing scholarships available</li>
              <li>• Recovery-focused communities</li>
            </ul>
            <a
              href="/resources/colorado-sober-living"
              class="inline-block mt-4 text-olive hover:text-navy font-semibold transition-colors"
            >
              Find Denver Sober Living →
            </a>
          </div>

          <!-- Support Services -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <h3 class="text-xl font-semibold text-navy mb-4">Recovery Support in Denver</h3>
            <p class="text-navy text-opacity-80 mb-4">
              Community support groups and recovery services throughout Denver.
            </p>
            <ul class="space-y-2 text-navy text-opacity-70">
              <li>• Alcoholics Anonymous meetings</li>
              <li>• Narcotics Anonymous groups</li>
              <li>• Recovery support groups</li>
              <li>• Peer recovery coaching</li>
              <li>• Alumni support programs</li>
            </ul>
            <a
              href="/resources/colorado"
              class="inline-block mt-4 text-olive hover:text-navy font-semibold transition-colors"
            >
              Find Denver Support Services →
            </a>
          </div>
        </div>
      </section>

      <!-- Housing Aid CTA -->
      <section class="bg-navy bg-opacity-5 rounded-2xl p-8 text-center border border-navy border-opacity-10">
        <h2 class="text-3xl font-serif font-medium text-navy mb-4">Housing Support for Denver Residents in Recovery</h2>
        <p class="text-xl text-navy text-opacity-80 mb-8 max-w-3xl mx-auto">
          Denver residents completing treatment can access immediate housing scholarships covering the first month's
          rent at certified sober living homes throughout the city.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/get-aid" class="btn-gold"> Apply for Denver Housing Aid </a>
          <a href="/stories" class="btn-secondary"> Read Denver Success Stories </a>
        </div>
      </section>
    </div>
  </main>
</div>
