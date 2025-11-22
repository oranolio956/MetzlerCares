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

<section class="relative min-h-[85vh] flex items-center pt-28 pb-20 overflow-hidden" aria-labelledby="hero-title">
  <div
    class="absolute inset-0 bg-gradient-to-br from-[var(--homepage-hero-start)] via-[var(--homepage-hero-mid)] to-[var(--homepage-hero-end)] opacity-95"
    aria-hidden="true"
  />
  <div
    class="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.08),transparent_55%)]"
    aria-hidden="true"
  />
  <div
    class="absolute -right-32 bottom-0 w-[480px] h-[480px] bg-[var(--homepage-glow-lilac)] opacity-40 blur-3xl"
    aria-hidden="true"
  />
    <div class="container mx-auto px-4 grid grid-cols-1 xl:grid-cols-10 gap-16 items-center relative z-10">
      <div class="xl:col-span-5 space-y-8">
        <div
          class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-[11px] uppercase tracking-[0.28em] text-white/80 shadow-[0_10px_30px_rgba(4,9,20,0.45)]"
        >
        {tag}
      </div>
      <h1 id="hero-title" class="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight text-balance font-[family-name:var(--font-primary)]">
        {heading}
      </h1>
      <p class="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl font-[family-name:var(--font-secondary)]">{subheading}</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a
            href="/contact"
            class="inline-flex items-center justify-center text-lg px-9 py-4 rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-strong)] to-[var(--color-accent-lilac)] text-[#04121f] font-semibold shadow-[0_25px_60px_rgba(45,212,191,0.35)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            on:click={() => trackEvent('hero_primary_cta', { destination: '/contact' })}
          >
            Plan a live build
          </a>
          <a
            href="#operating-blueprint"
            class="inline-flex items-center justify-center text-lg px-9 py-4 rounded-full border border-white/25 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 shadow-[0_15px_45px_rgba(4,9,20,0.55)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            on:click={() => trackEvent('hero_secondary_cta', { destination: '#operating-blueprint' })}
          >
            View the system map
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          {#each signals as signal, index}
            <div
              class="p-5 rounded-2xl border border-[var(--homepage-soft-border)] bg-[var(--homepage-soft-card)] backdrop-blur-xl shadow-[0_20px_45px_rgba(4,9,20,0.55)]"
              in:fly={{ y: 14, duration: 400, delay: index * 80 }}
            >
              <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">{signal.label}</p>
              <p class="mt-2 text-2xl font-semibold text-white">{signal.value}</p>
              <p class="text-sm text-[var(--text-muted)]">{signal.detail}</p>
            </div>
          {/each}
        </div>
    </div>

      <div class="xl:col-span-5 space-y-8">
        <HeroMedia />
        <div
          class="relative rounded-[32px] border border-[var(--homepage-panel-border)] bg-[var(--homepage-panel)]/90 backdrop-blur-2xl p-8 shadow-[0_40px_100px_rgba(4,9,20,0.65)]"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Ops Console</p>
              <p class="text-2xl font-semibold text-white mt-3">Metzler Field Command</p>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.4em] bg-emerald-400/20 text-emerald-200">
              Live
            </span>
          </div>
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Active cohorts</span>
                  <span>37</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-white/10 mt-2">
                  <div class="h-full w-4/5 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-success)]" />
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Escalations resolved</span>
                  <span>92%</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-white/10 mt-2">
                  <div class="h-full w-[92%] rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                </div>
              </div>
                <div class="rounded-2xl border border-[var(--homepage-soft-border)] bg-[var(--homepage-soft-card)] p-4">
                <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">SDOH Signals</p>
                <p class="text-3xl font-semibold text-white mt-2">+18 spikes</p>
                <p class="text-sm text-[var(--text-muted)]">Auto-routed to peer supervisors</p>
              </div>
            </div>
            <div class="space-y-4">
                <div class="rounded-2xl bg-[var(--homepage-soft-card)] border border-[var(--homepage-soft-border)] p-4 flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm text-[var(--text-muted)]">Mesa County</p>
                  <p class="text-xl font-semibold text-white">Stabilized</p>
                </div>
                <span class="px-3 py-1 text-xs uppercase tracking-[0.35em] rounded-full bg-emerald-400/15 text-emerald-200">
                  Green
                </span>
              </div>
                <div class="rounded-2xl bg-[var(--homepage-soft-card)] border border-[var(--homepage-soft-border)] p-4">
                <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Billing Queue</p>
                <div class="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                  <div class="flex justify-between">
                    <span>H0038 · 14 claims</span>
                    <span class="text-emerald-300">auto coded</span>
                  </div>
                  <div class="flex justify-between">
                    <span>T1012 · 6 claims</span>
                    <span class="text-sky-300">review</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Peer supervision</span>
                    <span class="text-[var(--text-muted)]">awaiting sign-off</span>
                  </div>
                </div>
              </div>
                <div class="rounded-2xl border border-[var(--homepage-soft-border)] p-4 bg-gradient-to-br from-[var(--color-accent)]/20 via-[var(--color-accent-strong)]/15 to-[var(--color-accent-lilac)]/20">
                <p class="text-sm text-[var(--text-secondary)]">Next best action</p>
                <p class="text-2xl font-semibold text-white mt-2">Deploy harm reduction kit</p>
                <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)] mt-2">Triggered by sentiment dip</p>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div class="rounded-2xl border border-[var(--homepage-soft-border)] bg-[var(--homepage-soft-card)] p-5 flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">H0038 Claim</p>
                <p class="text-2xl font-semibold text-white mt-2">Ready</p>
              </div>
              <span class="text-sm text-emerald-300">→ Payer portal</span>
            </div>
              <div class="rounded-2xl border border-[var(--homepage-soft-border)] bg-[var(--homepage-soft-card)] p-5">
              <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Network pulse</p>
              <p class="text-2xl font-semibold text-white mt-2">98% uptime</p>
              <p class="text-sm text-[var(--text-muted)]">APIs + field hardware</p>
            </div>
          </div>
        </div>
      </div>
  </div>
</section>
