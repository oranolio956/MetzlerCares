<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { LoadingSpinner, ErrorMessage } from '$lib'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Colorado Recovery Programs & Addiction Treatment',
    description:
      'Comprehensive guide to Colorado recovery programs, detox centers, rehab facilities, and sober living homes with housing aid available.',
    url: 'https://metzlerfoundations.org/colorado-recovery',
    publisher: {
      '@type': 'Organization',
      name: 'Metzler Foundations',
      url: 'https://metzlerfoundations.org'
    },
    about: {
      '@type': 'Thing',
      name: 'Substance Use Disorder Recovery',
      description: 'Recovery programs and treatment facilities for individuals with substance use disorders in Colorado'
    },
    areaServed: {
      '@type': 'State',
      name: 'Colorado',
      addressRegion: 'CO',
      addressCountry: 'US'
    }
  }

  $: schemaJson = JSON.stringify(schema)
</script>

<svelte:head>
  <title>Colorado Recovery Programs & Addiction Treatment | Housing Aid Available</title>
  <meta
    name="description"
    content="Find Colorado recovery programs, detox centers, rehab facilities, and sober living homes. Immediate housing scholarships available for individuals in recovery from addiction."
  />
  <meta
    name="keywords"
    content="Colorado recovery programs, addiction treatment Colorado, sober living Colorado, detox centers Colorado, rehab facilities Colorado, recovery housing Colorado"
  />
  {@html `<script type="application/ld+json">${schemaJson}</script>`}
</svelte:head>

<div class="min-h-screen bg-white text-charcoal">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 border-opacity-10 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-charcoal" />
          <span class="text-xl font-bold text-charcoal">Metzler Foundations</span>
        </button>
        <nav class="hidden md:flex items-center space-x-6">
          <a href="/colorado-recovery" class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium">
            Colorado Recovery
          </a>
          <a href="/resources/colorado" class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium">
            Resources
          </a>
          <a href="/get-aid" class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium"> Get Aid </a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy via-olive to-gold bg-opacity-10">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-charcoal mb-6">
        Colorado Recovery Programs & Treatment Facilities
      </h1>
      <p class="text-xl text-charcoal text-opacity-80 mb-8">
        Comprehensive directory of Colorado rehab centers, detox facilities, sober living homes, and recovery support
        services. Housing scholarships available for qualified individuals.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/get-aid" class="btn-primary"> Apply for Housing Aid </a>
        <a href="/resources/colorado" class="btn-secondary"> Browse All Resources </a>
      </div>
    </div>
  </section>

  <!-- Recovery Services Grid -->
  <main class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <!-- Rehab Programs -->
        <article
          class="bg-white rounded-lg shadow-lg border border-navy border-opacity-10 p-8 hover:shadow-xl transition-shadow"
        >
          <div class="w-16 h-16 bg-forest-green bg-opacity-20 rounded-full flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-charcoal mb-4">Rehab Programs Colorado</h2>
          <p class="text-charcoal text-opacity-80 mb-6">
            Professional rehabilitation centers across Colorado offering inpatient, outpatient, and intensive treatment
            programs for substance use disorders.
          </p>
          <a href="/resources/colorado-rehab" class="text-forest-green hover:text-charcoal font-semibold transition-colors">
            Find Rehab Programs →
          </a>
        </article>

        <!-- Detox Centers -->
        <article
          class="bg-white rounded-lg shadow-lg border border-navy border-opacity-10 p-8 hover:shadow-xl transition-shadow"
        >
          <div class="w-16 h-16 bg-forest-green bg-opacity-20 rounded-full flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-charcoal mb-4">Detox Centers Colorado</h2>
          <p class="text-charcoal text-opacity-80 mb-6">
            Medical detoxification facilities providing 24/7 supervision during withdrawal, ensuring safety and comfort
            during the critical early recovery phase.
          </p>
          <a href="/resources/colorado-detox" class="text-forest-green hover:text-charcoal font-semibold transition-colors">
            Find Detox Centers →
          </a>
        </article>

        <!-- Sober Living -->
        <article
          class="bg-white rounded-lg shadow-lg border border-navy border-opacity-10 p-8 hover:shadow-xl transition-shadow"
        >
          <div class="w-16 h-16 bg-forest-green bg-opacity-20 rounded-full flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-charcoal mb-4">Sober Living Colorado</h2>
          <p class="text-charcoal text-opacity-80 mb-6">
            Certified sober living homes providing peer support, structure, and accountability in a substance-free
            environment. Housing scholarships available.
          </p>
          <a href="/resources/colorado-sober-living" class="text-forest-green hover:text-charcoal font-semibold transition-colors">
            Find Sober Living →
          </a>
        </article>
      </div>

      <!-- City-Specific Sections -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-charcoal mb-8 text-center">Recovery Resources by Colorado City</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <a
            href="/denver-recovery"
            class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-charcoal mb-2">Denver Recovery</h3>
            <p class="text-sm text-charcoal text-opacity-70">
              Treatment centers, sober living, and support services in Denver
            </p>
          </a>
          <a
            href="/colorado-springs-recovery"
            class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-charcoal mb-2">Colorado Springs Recovery</h3>
            <p class="text-sm text-charcoal text-opacity-70">Recovery programs and housing options in Colorado Springs</p>
          </a>
          <a
            href="#boulder"
            class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-charcoal mb-2">Boulder Recovery</h3>
            <p class="text-sm text-charcoal text-opacity-70">Recovery resources and treatment facilities in Boulder</p>
          </a>
          <a
            href="#fort-collins"
            class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-charcoal mb-2">Fort Collins Recovery</h3>
            <p class="text-sm text-charcoal text-opacity-70">Northern Colorado recovery programs and support</p>
          </a>
          <a
            href="#pueblo"
            class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-charcoal mb-2">Pueblo Recovery</h3>
            <p class="text-sm text-charcoal text-opacity-70">Southern Colorado treatment and recovery services</p>
          </a>
          <a
            href="#grand-junction"
            class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-charcoal mb-2">Grand Junction Recovery</h3>
            <p class="text-sm text-charcoal text-opacity-70">Western Colorado recovery resources and facilities</p>
          </a>
          <a
            href="#greeley"
            class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-charcoal mb-2">Greeley Recovery</h3>
            <p class="text-sm text-charcoal text-opacity-70">Recovery programs serving Weld County area</p>
          </a>
          <a
            href="#aurora"
            class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="font-semibold text-charcoal mb-2">Aurora Recovery</h3>
            <p class="text-sm text-charcoal text-opacity-70">Recovery resources in Aurora and eastern Denver metro</p>
          </a>
        </div>
      </section>

      <!-- Housing Aid CTA -->
      <section class="bg-navy bg-opacity-5 rounded-2xl p-8 text-center border border-navy border-opacity-10">
        <h2 class="text-3xl font-bold text-charcoal mb-4">Housing Support Available for Colorado Residents</h2>
        <p class="text-xl text-charcoal text-opacity-80 mb-8 max-w-3xl mx-auto">
          If you're completing treatment and need immediate housing support, our scholarships cover the first month's
          rent at certified sober living homes across Colorado.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/get-aid" class="btn-primary"> Apply for Housing Aid </a>
          <a href="/impact" class="btn-secondary"> See Success Stories </a>
        </div>
      </section>
    </div>
  </main>
</div>
