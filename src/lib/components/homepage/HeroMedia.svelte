<script lang="ts">
  export let imageSrc = '/assets/hero-dashboard.png'
  export let imageAlt = 'RecoveryOS console showing live Medicaid workflows'

  const timeline = [
    { label: 'H0038 exports', status: 'Ready to send', tone: 'text-emerald-300' },
    { label: 'T1012 audits', status: 'In review', tone: 'text-sky-300' },
    { label: 'CourtSync packets', status: 'Auto delivered', tone: 'text-[var(--text-muted)]' }
  ]
</script>

<div class="relative w-full">
  <div
    class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--homepage-glow-mint),transparent_55%)] opacity-60 blur-3xl pointer-events-none"
    aria-hidden="true"
  />
  <div
    class="relative rounded-[40px] border border-[var(--homepage-panel-border)] bg-[var(--homepage-panel)]/95 backdrop-blur-3xl shadow-[0_35px_120px_rgba(5,12,28,0.65)] overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,var(--homepage-glow-lilac),transparent_60%)] opacity-60 pointer-events-none"
      aria-hidden="true"
    />
    <img
      src={imageSrc}
      alt={imageAlt}
      class="w-full h-[420px] sm:h-[520px] lg:h-[580px] object-cover rounded-[40px]"
      loading="eager"
      fetchpriority="high"
    />
    <div class="absolute top-6 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 text-xs uppercase tracking-[0.3em] text-white/80">
      <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" aria-hidden="true" />
      Live Ops Console
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 -mt-12 md:-mt-16">
    <div class="rounded-3xl border border-[var(--homepage-soft-border)] bg-[var(--homepage-soft-card)] p-6 shadow-2xl">
      <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Revenue operations</p>
      <p class="text-3xl font-semibold text-white mt-3">$1.8M</p>
      <p class="text-sm text-[var(--text-secondary)] mt-2">Medicaid pipeline, Q1 to date</p>
      <div class="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
        <span class="w-2 h-2 rounded-full bg-emerald-300" aria-hidden="true" />
        +18% vs last quarter
      </div>
    </div>
    <div class="rounded-3xl border border-[var(--homepage-soft-border)] bg-[var(--homepage-soft-card)] p-6 shadow-2xl">
      <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Next best actions</p>
      <ul class="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
        {#each timeline as item}
          <li class="flex items-center justify-between gap-3">
            <span>{item.label}</span>
            <span class={`text-xs font-semibold ${item.tone}`}>{item.status}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
