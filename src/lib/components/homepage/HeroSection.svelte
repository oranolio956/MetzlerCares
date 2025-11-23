<script lang="ts">
  import HeroMedia from './HeroMedia.svelte'
  import type { HeroSignal } from '$lib/content/homepage'
  import { trackEvent } from '$lib/utils/analytics'
  import { fly } from 'svelte/transition'

  export let signals: HeroSignal[] = []
  export let tag = 'Colorado built · RSSO Licensed'
  export let heading = 'Recovery infrastructure built like mission control.'
  export let subheading =
    'Metzler Cares is the operating system for peer-led recovery: telemetry-rich, Medicaid-clean, and designed so clinicians, payers, and field teams finally see the same truth.'
</script>

<section class="relative min-h-[600px] sm:min-h-screen max-h-[900px] flex items-center py-16 sm:py-20 pb-24 sm:pb-32 overflow-hidden" aria-labelledby="hero-title">
  <!-- Simplified gradient background -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-[var(--homepage-hero-start)] via-[var(--homepage-hero-mid)] to-[var(--homepage-hero-end)]"
    aria-hidden="true"
  />
  <!-- Single accent glow -->
  <div
    class="absolute top-0 right-0 w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_top_right,var(--homepage-glow-lilac),transparent_70%)] opacity-30"
    aria-hidden="true"
  />
    <div class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
        <div class="space-y-6">
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-[10px] uppercase tracking-wider text-white/70"
        >
        {tag}
      </div>
      <h1 id="hero-title" class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] font-[family-name:var(--font-primary)]">
        {heading}
      </h1>
      <p class="text-lg text-white/70 max-w-xl font-[family-name:var(--font-secondary)] leading-relaxed">{subheading}</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <a
            href="/contact"
            class="inline-flex items-center justify-center text-base px-7 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg transition-all duration-200 hover:-translate-y-px hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            on:click={() => trackEvent('hero_primary_cta', { destination: '/contact' })}
          >
            Plan a live build
          </a>
          <a
            href="#operating-blueprint"
            class="inline-flex items-center justify-center text-base px-7 py-3 rounded-full border border-white/20 text-white bg-white/5 backdrop-blur-sm font-medium transition-all duration-200 hover:bg-white/10 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            on:click={() => trackEvent('hero_secondary_cta', { destination: '#operating-blueprint' })}
          >
            View the system map
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mb-8">
          {#each signals.slice(0, 3) as signal, index}
            <div
              class="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
              in:fly={{ y: 10, duration: 300, delay: index * 60 }}
            >
              <p class="text-[10px] uppercase tracking-wider text-white/50 font-medium">{signal.label}</p>
              <p class="mt-1 text-xl font-semibold text-white">{signal.value}</p>
              <p class="text-sm text-white/60 mt-0.5">{signal.detail}</p>
            </div>
          {/each}
        </div>
        <div class="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 sm:p-5">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/70">
            <div>
              <p class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Talk to a person</p>
              <a
                href="mailto:support@metzlercares.org"
                class="text-white font-semibold text-base hover:text-emerald-300 transition-colors"
              >
                support@metzlercares.org
              </a>
              <p class="text-[11px] mt-1">Avg. response &lt; 1 business day · Mon–Fri · 9a–5p MST</p>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Emergency resources</p>
              <p class="text-base font-semibold text-white">988 · Colorado Crisis Services</p>
              <p class="text-[11px] mt-1">Housing hotline: 1-800-548-4001 (National Alliance to End Homelessness)</p>
            </div>
            <div>
              <p class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Public footprint</p>
              <p class="text-base font-semibold text-white">Statewide, virtual-first ops</p>
              <a
                href="/impact"
                class="inline-flex items-center gap-1 text-[11px] text-white/70 hover:text-white transition-colors mt-1"
              >
                View public impact log
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
    </div>

      <div class="space-y-4 lg:pl-8 hidden lg:block">
        <HeroMedia />
        <div
          class="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs uppercase tracking-wider text-white/50">Ops Console</p>
              <p class="text-xl font-semibold text-white mt-1">Metzler Field Command</p>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-emerald-400/20 text-emerald-400">
              Live
            </span>
          </div>
            <div class="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              <div class="space-y-3">
                <div class="rounded-xl bg-white/5 p-3">
                  <div class="flex justify-between text-xs text-white/60">
                    <span>Active cohorts</span>
                    <span class="text-white font-semibold">37</span>
                  </div>
                  <div class="h-1 w-full rounded-full bg-white/10 mt-2">
                    <div class="h-full w-4/5 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div class="rounded-xl bg-white/5 p-3">
                  <p class="text-xs text-white/50">SDOH Signals</p>
                  <p class="text-lg font-semibold text-white">+18 spikes</p>
                </div>
              </div>
              <div class="space-y-3">
                <div class="rounded-xl bg-white/5 p-3">
                  <p class="text-xs text-white/50">Mesa County</p>
                  <p class="text-base font-semibold text-white">Stabilized</p>
                  <span class="inline-block mt-1 px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-full bg-emerald-400/20 text-emerald-400">
                    Green
                  </span>
                </div>
                <div class="rounded-xl bg-white/5 p-3">
                  <p class="text-xs text-white/50">Network Status</p>
                  <p class="text-lg font-semibold text-white">98% up</p>
                </div>
              </div>
            </div>
        </div>
      </div>
  </div>
</section>
