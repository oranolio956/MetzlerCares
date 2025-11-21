<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { goto } from '$app/navigation'

  let mounted = false

  onMount(() => {
    mounted = true
  })

  const features = [
    {
      title: 'Instant Verification',
      description: 'No more waiting weeks. Our automated system verifies eligibility in seconds.',
      icon: '⚡'
    },
    {
      title: 'Dignified Housing',
      description: 'Access our network of verified, high-quality sober living homes.',
      icon: '🏠'
    },
    {
      title: 'Secure Funding',
      description: 'Grants are paid directly to providers, ensuring transparency and trust.',
      icon: '🔒'
    }
  ]

</script>

<svelte:head>
  <title>Metzler Foundations | The Modern Safety Net</title>
  <meta
    name="description"
    content="Instant aid, dignified housing, and a path forward. Metzler Foundations is rebuilding the safety net for recovery."
  />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- Hero Section -->
  <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">

    <div class="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Text Content -->
      <div class="text-center lg:text-left space-y-8">
        <h1 class="text-4xl md:text-6xl font-bold text-charcoal leading-tight tracking-tight mb-6">
          Recovery funding, reimagined.
        </h1>

        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
          We've replaced the red tape with technology. Get approved for housing grants in minutes, not months.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <a
            href="/get-aid/apply"
            class="w-full sm:w-auto px-6 py-3 bg-forest-green text-white rounded-lg font-semibold text-base shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all flex items-center justify-center"
          >
            Get Aid Now
            <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </a>
          <a
            href="/partners"
            class="w-full sm:w-auto px-6 py-3 bg-white text-charcoal border border-gray-300 rounded-lg font-semibold text-base hover:border-forest-green hover:text-forest-green transition-all flex items-center justify-center"
          >
            Partner with Us
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
          The old way is broken. We fixed it.
        </h2>
        <p class="text-xl text-gray-600">
          Traditional aid is slow, confusing, and stigmatizing. We built a platform that treats you like a human, not a
          case number.
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
              <span class="text-2xl md:text-3xl">{feature.icon}</span>
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
        class="inline-flex items-center px-8 py-4 bg-forest-green text-white rounded-lg font-semibold text-lg shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all"
      >
        Apply Now
        <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </section>
</div>

<style>
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0px);
    }
  }
</style>
