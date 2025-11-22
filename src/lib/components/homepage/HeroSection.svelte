<script lang="ts">
  import type { HeroSignal } from '$lib/content/homepage'

  export let signals: HeroSignal[] = []
</script>

<section class="relative min-h-screen flex items-center pt-28 pb-20" aria-labelledby="hero-title">
  <div
    class="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-30 blur-3xl"
    aria-hidden="true"
  />
  <div class="container mx-auto px-4 grid grid-cols-1 xl:grid-cols-10 gap-16 items-center">
    <div class="xl:col-span-5 space-y-8">
      <div
        class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-border bg-white/5 text-[11px] uppercase tracking-[0.28em] text-brand-muted/90"
      >
        Colorado built · RSSO Licensed
      </div>
      <h1 id="hero-title" class="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight text-balance">
        Recovery infrastructure built like mission control.
      </h1>
      <p class="text-lg md:text-xl text-brand-muted max-w-2xl">
        Metzler Cares is the operating system for peer-led recovery: telemetry-rich, Medicaid-clean, and designed so
        clinicians, payers, and field teams finally see the same truth.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <a
          href="/contact"
          class="px-9 py-4 rounded-full text-lg font-semibold text-brand-night bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-cyan shadow-xl shadow-teal-500/25 hover:scale-[1.01] transition-transform duration-200"
        >
          Plan a live build
        </a>
        <a
          href="#operating-blueprint"
          class="px-9 py-4 rounded-full border border-brand-border text-brand-soft hover:bg-white/10 text-lg font-semibold transition-colors duration-200 text-center"
        >
          View the system map
        </a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
        {#each signals as signal}
          <div class="p-5 rounded-2xl border border-brand-border bg-brand-card/60 backdrop-blur-md">
            <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">{signal.label}</p>
            <p class="mt-2 text-2xl font-semibold text-white">{signal.value}</p>
            <p class="text-sm text-brand-muted">{signal.detail}</p>
          </div>
        {/each}
      </div>
    </div>

    <div class="xl:col-span-5">
      <div class="relative">
        <div
          class="absolute -inset-6 bg-gradient-to-r from-brand-teal/25 via-transparent to-brand-iris/25 blur-3xl"
          aria-hidden="true"
        />
        <div class="relative space-y-6">
          <div
            class="rounded-[32px] border border-brand-border bg-brand-card/80 backdrop-blur-2xl p-8 shadow-[0_25px_80px_rgba(5,6,10,0.75)]"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Ops Console</p>
                <p class="text-2xl font-semibold text-white mt-3">Metzler Field Command</p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.4em] bg-emerald-400/20 text-emerald-200"
              >
                Live
              </span>
            </div>
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm text-brand-muted">
                    <span>Active cohorts</span>
                    <span>37</span>
                  </div>
                  <div class="h-1.5 w-full rounded-full bg-white/10 mt-2">
                    <div class="h-full w-4/5 rounded-full bg-gradient-to-r from-teal-300 to-emerald-500" />
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm text-brand-muted">
                    <span>Escalations resolved</span>
                    <span>92%</span>
                  </div>
                  <div class="h-1.5 w-full rounded-full bg-white/10 mt-2">
                    <div class="h-full w-[92%] rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                  </div>
                </div>
                <div class="rounded-2xl border border-brand-border bg-brand-card/70 p-4">
                  <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">SDOH Signals</p>
                  <p class="text-3xl font-semibold text-white mt-2">+18 spikes</p>
                  <p class="text-sm text-brand-muted">Auto-routed to peer supervisors</p>
                </div>
              </div>
              <div class="space-y-4">
                <div
                  class="rounded-2xl bg-brand-card/70 border border-brand-border p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p class="text-sm text-brand-muted">Mesa County</p>
                    <p class="text-xl font-semibold text-white">Stabilized</p>
                  </div>
                  <span
                    class="px-3 py-1 text-xs uppercase tracking-[0.35em] rounded-full bg-emerald-400/15 text-emerald-200"
                  >
                    Green
                  </span>
                </div>
                <div class="rounded-2xl bg-brand-card/70 border border-brand-border p-4">
                  <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Billing Queue</p>
                  <div class="mt-3 space-y-2 text-sm text-brand-muted">
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
                      <span class="text-brand-muted">awaiting sign-off</span>
                    </div>
                  </div>
                </div>
                <div
                  class="rounded-2xl border border-brand-border p-4 bg-gradient-to-br from-brand-teal/15 to-brand-iris/15"
                >
                  <p class="text-sm text-brand-soft">Next best action</p>
                  <p class="text-2xl font-semibold text-white mt-2">Deploy harm reduction kit</p>
                  <p class="text-xs uppercase tracking-[0.32em] text-brand-muted mt-2">Triggered by sentiment dip</p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="rounded-2xl border border-brand-border bg-brand-card/70 p-5 flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">H0038 Claim</p>
                <p class="text-2xl font-semibold text-white mt-2">Ready</p>
              </div>
              <span class="text-sm text-emerald-300">→ Payer portal</span>
            </div>
            <div class="rounded-2xl border border-brand-border bg-brand-card/70 p-5">
              <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Network pulse</p>
              <p class="text-2xl font-semibold text-white mt-2">98% uptime</p>
              <p class="text-sm text-brand-muted">APIs + field hardware</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
