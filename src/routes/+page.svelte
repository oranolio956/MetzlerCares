<script lang="ts">
  import IconLightning from '$lib/components/icons/IconLightning.svelte'
  import IconHome from '$lib/components/icons/IconHome.svelte'
  import IconLock from '$lib/components/icons/IconLock.svelte'

  const features = [
    {
      title: 'Peer Coaching',
      description: 'Insurance-covered case management to help you get your ID, SNAP benefits, and employment.',
      icon: IconLightning
    },
    {
      title: 'Rent Assistance',
      description: 'Up to two weeks of rent scholarships for those at partner facilities actively seeking employment.',
      icon: IconHome
    },
    {
      title: 'Transition Support',
      description: 'One-time grocery assistance and essential support when moving from treatment to sober living.',
      icon: IconLock
    }
  ]

</script>

<svelte:head>
  <title>Metzler Foundations | Comprehensive Recovery Support</title>
  <meta
    name="description"
    content="Insurance-covered peer coaching, life stabilization, and targeted financial aid for individuals in recovery. We partner with facilities to build a path forward."
  />
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/" />
  <meta property="og:title" content="Metzler Foundations | Comprehensive Recovery Support" />
  <meta
    property="og:description"
    content="Insurance-covered peer coaching, life stabilization, and targeted financial aid for individuals in recovery. We partner with facilities to build a path forward."
  />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Metzler Foundations | Comprehensive Recovery Support" />
  <meta
    name="twitter:description"
    content="Insurance-covered peer coaching, life stabilization, and targeted financial aid for individuals in recovery. We partner with facilities to build a path forward."
  />
  <link rel="canonical" href="https://metzlercares.com/" />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- Hero Section -->
  <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">

    <div class="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Text Content -->
      <div class="text-center lg:text-left space-y-8">
        <h1 class="text-4xl md:text-6xl font-bold text-charcoal leading-tight tracking-tight mb-6">
          Real support for real recovery.
        </h1>

        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
          We partner with treatment centers to provide insurance-covered peer coaching—helping you get your ID, benefits, and job—plus rent and food assistance when you graduate.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <a
            href="/get-aid/apply"
            class="w-full sm:w-auto px-6 py-3 bg-forest-green text-white rounded-lg font-semibold text-base shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all flex items-center justify-center min-h-[44px]"
            aria-label="Get aid now - Start your application"
          >
            Get Support
            <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </a>
          <a
            href="/partners"
            class="w-full sm:w-auto px-6 py-3 bg-white text-charcoal border border-gray-300 rounded-lg font-semibold text-base hover:border-forest-green hover:text-forest-green transition-all flex items-center justify-center min-h-[44px]"
            aria-label="Partner with us"
          >
            For Facilities
          </a>
        </div>
      </div>

    </div>
  </section>

  <!-- Features Section -->
  <section class="py-16 md:py-24 bg-white relative overflow-hidden">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-6 text-charcoal">
          More than just funding.
        </h2>
        <p class="text-xl text-gray-600">
          We bridge the gap between treatment and independence. Our Peer Support Specialists work directly with you at partner facilities to handle the practical steps of rebuilding your life.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {#each features as feature, i}
          <div
            class="group p-6 md:p-8 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div
              class="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-forest-green bg-opacity-10 flex items-center justify-center mb-6"
            >
              <svelte:component this={feature.icon} className="w-6 h-6 md:w-8 md:h-8 text-forest-green" aria-hidden="true" />
            </div>

            <h3 class="text-xl md:text-2xl font-bold mb-3 text-charcoal">{feature.title}</h3>
            <p class="text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>


  <!-- CTA Section -->
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl md:text-5xl font-bold text-charcoal mb-6">Ready to start your journey?</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Get approved for housing grants in minutes, not months.
      </p>
      <a
        href="/get-aid/apply"
        class="inline-flex items-center px-8 py-4 bg-forest-green text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all min-h-[44px]"
        aria-label="Apply now for housing aid"
      >
        Apply Now
        <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </section>
</div>

