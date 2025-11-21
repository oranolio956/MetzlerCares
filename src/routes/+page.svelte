<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { goto } from '$app/navigation'
  import PremiumTrustSignals from '$lib/components/premium/PremiumTrustSignals.svelte'
  import Icon from '$lib/components/Icon.svelte'

  let mounted = false

  onMount(() => {
    mounted = true
  })

  // Asymmetric Bento Grid Features - No emojis, professional icons
  const features = [
    {
      title: 'Evidence-Based Recovery',
      description: 'Holistic care combining clinical expertise with compassionate support tailored to your journey.',
      icon: 'shield-check',
      size: 'large', // Takes more space in bento grid
      image: true
    },
    {
      title: 'Structured Living',
      description: 'CARR-certified sober living homes providing stability and community.',
      icon: 'home',
      size: 'small'
    },
    {
      title: 'Financial Aid Available',
      description: 'We help secure funding so recovery is accessible to all.',
      icon: 'hand',
      size: 'small'
    }
  ]

  const stats = [
    { value: '$2.5M', label: 'Aid Distributed' },
    { value: '1,200+', label: 'Lives Impacted' },
    { value: '450+', label: 'Partner Facilities' }
  ]
</script>

<svelte:head>
  <title>Rebuilding Lives in the Heart of Colorado | Metzler Foundations</title>
  <meta
    name="description"
    content="Structured, CARR-certified recovery housing and holistic support for Colorado families. Evidence-based care for lasting recovery."
  />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- Hero Section - Clean, Light Overlay -->
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-surface-bg">
    <!-- Background Image with Light Overlay -->
    <div class="absolute inset-0 z-0">
      <img src="/assets/hero-bg.png" alt="Colorado Mountains" class="w-full h-full object-cover opacity-30" />
      <div class="absolute inset-0 bg-gradient-to-b from-white/90 to-surface-bg/95" />
    </div>

    <div class="container mx-auto px-6 z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
      <!-- Text Content -->
      <div class="text-center lg:text-left space-y-8">
        <!-- Trust Badge -->
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-surface-card border border-primary-main/20 shadow-sm">
          <Icon name="check-circle" size={16} color="var(--color-status-success)" className="mr-2" />
          <span class="text-sm font-semibold text-primary-main tracking-wide">CARR-Certified Recovery Housing</span>
        </div>

        <!-- Hero Title - Serif Font for Authority -->
        <h1 class="text-5xl md:text-7xl font-bold text-text-body leading-tight" style="font-family: var(--font-heading);">
          Rebuilding Lives in the <br />
          <span class="text-primary-main">Heart of Colorado</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
          Structured, CARR-certified recovery housing and holistic support for families seeking lasting recovery.
        </p>

        <!-- CTAs - Side by Side -->
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
          <a
            href="/get-aid/apply"
            class="w-full sm:w-auto px-8 py-4 bg-primary-main text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:bg-primary-light hover:translate-y-[-2px] transition-all flex items-center justify-center min-h-[48px]"
          >
            Apply for Housing Aid
            <Icon name="lightning-bolt" size={20} color="white" className="ml-2" />
          </a>
          <a
            href="/resources"
            class="w-full sm:w-auto px-8 py-4 bg-surface-card text-primary-main border-2 border-primary-main rounded-lg font-semibold text-lg hover:bg-primary-main hover:text-white transition-all flex items-center justify-center min-h-[48px]"
          >
            Browse All Resources
          </a>
        </div>

        <!-- Social Proof - Rating Snippet -->
        <div class="pt-6 flex items-center justify-center lg:justify-start space-x-3 text-sm">
          <div class="flex items-center space-x-1">
            {#each Array(5) as _, i}
              <Icon name="star-filled" size={16} color="#F4D03F" />
            {/each}
          </div>
          <p class="text-text-muted font-medium">Rated 5/5 by Families</p>
        </div>
      </div>

      <!-- Visual Content - Removed Mascot, Keep it Clean -->
      <div class="relative hidden lg:flex items-center justify-center">
        {#if mounted}
          <div in:fade={{ duration: 800, delay: 200 }} class="relative z-10 w-full max-w-lg">
            <!-- Stats Cards Floating -->
            <div class="space-y-4">
              {#each stats as stat, i}
                <div 
                  in:fly={{ x: 50, duration: 600, delay: 400 + i * 150 }}
                  class="bg-surface-card/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-main/10 hover:shadow-xl transition-shadow"
                >
                  <div class="text-4xl font-bold text-primary-main mb-1" style="font-family: var(--font-heading);">
                    {stat.value}
                  </div>
                  <div class="text-text-muted font-medium">{stat.label}</div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <!-- Features Section - Asymmetric Bento Grid -->
  <section class="py-32 bg-surface-bg relative overflow-hidden">
    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-20">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-text-body" style="font-family: var(--font-heading);">
          A Holistic Approach to <span class="text-primary-main">Recovery</span>
        </h2>
        <p class="text-xl text-text-muted leading-relaxed">
          Evidence-based care that addresses physical, mental, emotional, and spiritual well-being.
        </p>
      </div>

      <!-- Asymmetric Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <!-- Large Feature - Takes full left column -->
        <div class="md:row-span-2 relative overflow-hidden rounded-2xl bg-primary-main text-white group hover:shadow-xl transition-shadow">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-main to-primary-light opacity-90" />
          <div class="relative p-12 h-full flex flex-col justify-between min-h-[400px]">
            <div>
              <div class="mb-6">
                <Icon name={features[0].icon} size={64} color="white" />
              </div>
              <h3 class="text-3xl font-bold mb-4" style="font-family: var(--font-heading);">
                {features[0].title}
              </h3>
              <p class="text-white/90 text-lg leading-relaxed">
                {features[0].description}
              </p>
            </div>
            <!-- Optional: Background pattern -->
            <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>

        <!-- Small Feature 1 - Top right -->
        <div class="relative overflow-hidden rounded-2xl bg-surface-card border border-primary-main/10 group hover:shadow-lg hover:border-primary-main/20 transition-all">
          <div class="p-8">
            <div class="mb-4">
              <Icon name={features[1].icon} size={48} color="var(--color-primary-main)" />
            </div>
            <h3 class="text-2xl font-bold mb-3 text-primary-main" style="font-family: var(--font-heading);">
              {features[1].title}
            </h3>
            <p class="text-text-muted leading-relaxed">
              {features[1].description}
            </p>
          </div>
        </div>

        <!-- Small Feature 2 - Bottom right -->
        <div class="relative overflow-hidden rounded-2xl bg-secondary-main/5 border border-secondary-main/10 group hover:shadow-lg hover:border-secondary-main/20 transition-all">
          <div class="p-8">
            <div class="mb-4">
              <Icon name={features[2].icon} size={48} color="var(--color-secondary-main)" />
            </div>
            <h3 class="text-2xl font-bold mb-3 text-secondary-main" style="font-family: var(--font-heading);">
              {features[2].title}
            </h3>
            <p class="text-text-muted leading-relaxed">
              {features[2].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Impact Stats - Clean Background -->
  <section class="py-24 bg-white relative overflow-hidden">
    <div class="container mx-auto px-6 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
        {#each stats as stat}
          <div class="group">
            <div
              class="text-5xl md:text-6xl font-bold mb-3 text-primary-main group-hover:text-secondary-main transition-colors"
              style="font-family: var(--font-heading);"
            >
              {stat.value}
            </div>
            <div class="text-xl text-text-muted font-medium">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Trust Signals -->
  <section class="py-20 bg-surface-bg border-t border-primary-main/10">
    <div class="container mx-auto px-6">
      <PremiumTrustSignals />
    </div>
  </section>

  <!-- CTA Section - Clean, No Gradients -->
  <section class="py-32 relative overflow-hidden bg-primary-main">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-main/90 to-secondary-main/90" />
    
    <div class="container mx-auto px-6 relative z-10 text-center">
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-8" style="font-family: var(--font-heading);">
        Ready to Start Your Journey?
      </h2>
      <p class="text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed">
        Join thousands of Colorado families who have found stability and hope through evidence-based recovery support.
      </p>
      <a
        href="/get-aid/apply"
        class="inline-flex items-center px-10 py-5 bg-white text-primary-main rounded-lg font-bold text-xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all min-h-[56px]"
        style="font-family: var(--font-secondary);"
      >
        Apply in 5 Minutes
        <Icon name="lightning-bolt" size={24} color="var(--color-primary-main)" className="ml-2" />
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
