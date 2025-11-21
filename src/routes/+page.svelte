<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'

  let mounted = false

  onMount(() => {
    mounted = true
  })

  const features = [
    {
      title: 'Instant verification',
      description: 'Eligibility confirmed in minutes so you can plan the next step today.',
      icon: '⚡',
      accent: 'bg-navy/10 text-navy'
    },
    {
      title: 'Dignified housing',
      description: 'A vetted network of Colorado homes that feel safe, stable, and modern.',
      icon: '🏠',
      accent: 'bg-olive/10 text-olive'
    },
    {
      title: 'Transparent funding',
      description: 'Scholarships are paid directly to providers, removing surprise fees.',
      icon: '🔒',
      accent: 'bg-gold/10 text-gold'
    }
  ]

  const differentiators = [
    {
      title: 'Colorado-first concierge',
      copy: 'We only work within Colorado so we know every licensure nuance, neighborhood, and waitlist.'
    },
    {
      title: 'People over paperwork',
      copy: 'Templates and medical jargon stay in the background. Plain language, one point of contact, 7 days a week.'
    },
    {
      title: 'Built with providers',
      copy: 'Housing, detox, and rehab partners helped design this process, so referrals land on welcoming desks.'
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
  <section class="relative overflow-hidden bg-cream">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-32 -right-12 h-72 w-72 rounded-full bg-navy/10 blur-3xl" />
      <div class="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl opacity-50" />
    </div>

    <div class="relative container mx-auto grid grid-cols-1 gap-12 px-4 py-24 lg:grid-cols-2 lg:items-center">
      <!-- Text Content -->
      <div class="space-y-8 text-center lg:text-left">
        <div class="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/70">
          Colorado recovery concierge
        </div>

        <h1 class="text-4xl font-semibold text-navy md:text-6xl md:leading-tight">
          Funding recovery without the maze of forms, holds, and waitlists.
        </h1>

        <p class="text-lg text-charcoal/80 md:text-xl">
          Tell us where you are in your recovery journey. We coordinate scholarships, housing, and provider handoffs so you can focus on healing—not paperwork.
        </p>

        <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <a href="/get-aid/apply" class="btn-primary w-full justify-center sm:w-auto">
            Start the 5-minute assessment
          </a>
          <a
            href="tel:970-710-2221"
            class="btn-ghost w-full justify-center border border-[var(--color-border)] text-sm text-navy sm:w-auto"
          >
            Talk to a person
          </a>
        </div>

        <div class="flex flex-col items-center gap-3 pt-6 text-sm text-charcoal/70 sm:flex-row sm:justify-start">
          <div class="flex -space-x-3">
            <div class="h-10 w-10 rounded-full border-2 border-white bg-olive/30" />
            <div class="h-10 w-10 rounded-full border-2 border-white bg-navy/30" />
            <div class="h-10 w-10 rounded-full border-2 border-white bg-gold/40" />
          </div>
          <p class="max-w-xs">Personal guides covering every county in Colorado, 7 days a week.</p>
        </div>
      </div>

      <!-- Visual -->
      <div class="relative">
        {#if mounted}
          <div in:fly={{ y: 40, duration: 900, delay: 150 }} class="relative z-10 rounded-3xl bg-white/90 p-6 shadow-2xl">
            <div class="rounded-2xl bg-cream/70 p-6 text-left">
              <p class="text-sm font-semibold text-charcoal/60">Live status</p>
              <p class="mt-2 text-3xl font-semibold text-navy">$18,450 secured this week</p>
              <p class="text-sm text-charcoal/60">for housing and supportive services across Denver, Boulder, and Mesa counties.</p>
            </div>

            <div class="mt-6 rounded-2xl border border-[var(--color-border)] p-4">
              <p class="text-sm text-charcoal/70">“Metzler handled the phone calls, the paperwork, and even the landlord questions. I just had to say yes.”</p>
              <div class="mt-4 flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-olive/20" />
                <div>
                  <p class="text-sm font-semibold text-navy">Jordan, Lakewood</p>
                  <p class="text-xs text-charcoal/60">Sober living aid in 48 hours</p>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <div class="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-white via-cream to-transparent blur-3xl" />
      </div>
    </div>
  </section>

  <!-- Features Section -->
    <section class="relative overflow-hidden bg-white py-24">
      <div class="container mx-auto px-4">
        <div class="mx-auto mb-16 max-w-3xl text-center">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-charcoal/50">What makes us different</p>
          <h2 class="mt-4 text-4xl font-semibold text-navy">
            The old process was built for administrators— not families. We changed that.
          </h2>
          <p class="mt-4 text-lg text-charcoal/70">
            Every touchpoint combines tech for speed with humans for warmth so nothing feels templated or corporate.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          {#each features as feature}
            <div class="group relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-cream/60 p-8 transition hover:-translate-y-1 hover:border-navy/20 hover:bg-white hover:shadow-xl">
              <div class={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.accent}`}>
                <span class="text-3xl">{feature.icon}</span>
              </div>
              <h3 class="text-2xl font-semibold text-navy">{feature.title}</h3>
              <p class="mt-3 text-charcoal/70 leading-relaxed">{feature.description}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Differentiators -->
    <section class="bg-warm-alabaster py-20">
      <div class="container mx-auto px-4">
        <div class="mx-auto mb-12 max-w-2xl text-center">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-charcoal/50">Colorado promise</p>
          <h2 class="mt-4 text-3xl font-semibold text-navy">We remove noise so you can focus on the next right decision.</h2>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          {#each differentiators as item}
            <article class="rounded-3xl border border-navy/5 bg-white p-6 shadow-sm">
              <h3 class="text-xl font-semibold text-navy">{item.title}</h3>
              <p class="mt-3 text-sm leading-relaxed text-charcoal/70">{item.copy}</p>
            </article>
          {/each}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative overflow-hidden bg-navy py-24 text-cream">
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2), transparent 60%);" />
      <div class="relative z-10 container mx-auto px-4 text-center">
        <h2 class="text-4xl font-semibold md:text-5xl">Let’s make the next step feel doable.</h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-cream/80">
          Share your situation once. We loop in housing, detox, and rehab partners, then text or call you with real options within a day.
        </p>
        <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href="/get-aid/apply" class="btn-gold text-base">
            Start the application
          </a>
          <a href="/give-support" class="btn-ghost border-white !text-cream hover:text-navy hover:bg-cream">
            Support the mission
          </a>
        </div>
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
