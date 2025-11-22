<script lang="ts">
  const streams = [
    { title: 'Medicaid rail', metric: '$420K', detail: 'H0038 + T1012 pipeline', change: '+18%' },
    { title: 'RideCommand', metric: '0m hold', detail: 'IntelliRide bookings cleared', change: '-45m' },
    { title: 'CourtSync', metric: '32 packets', detail: 'Probation packets auto-filed', change: '100% on time' }
  ]

  const queue = [
    { label: 'PEAK recerts', status: '12 in flight' },
    { label: 'SNAP verifications', status: '3 require docs' },
    { label: 'SDoH pulses', status: '+18 spikes this week' }
  ]

  const watchlist = [
    { name: 'Mesa County', status: 'Stabilized', badge: 'Green', tone: 'text-emerald-300' },
    { name: 'Pueblo', status: 'Escalate', badge: 'Amber', tone: 'text-amber-300' }
  ]

  const actions = [
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
    class="relative rounded-[40px] border border-[var(--homepage-panel-border)] bg-[var(--homepage-panel)]/95 backdrop-blur-3xl shadow-[0_35px_120px_rgba(5,12,28,0.65)] overflow-hidden p-6 sm:p-8"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,var(--homepage-glow-lilac),transparent_60%)] opacity-60 pointer-events-none"
      aria-hidden="true"
    />
    <div class="relative z-10 space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-white/70">Command deck</p>
          <p class="text-2xl font-semibold text-white mt-2">Colorado Recovery Grid</p>
        </div>
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs uppercase tracking-[0.3em] text-white/80">
          <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" aria-hidden="true" />
          Live
        </span>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        {#each streams as stream}
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">{stream.title}</p>
            <p class="text-2xl font-semibold text-white mt-2">{stream.metric}</p>
            <p class="text-sm text-[var(--text-secondary)]">{stream.detail}</p>
            <span class="inline-flex items-center gap-1 text-xs text-emerald-300 mt-3">{stream.change}</span>
          </div>
        {/each}
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
          <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Automation queue</p>
          <ul class="space-y-3 text-sm text-[var(--text-secondary)]">
            {#each queue as item}
              <li class="flex items-center justify-between">
                <span>{item.label}</span>
                <span class="text-white/85 font-semibold">{item.status}</span>
              </li>
            {/each}
          </ul>
        </div>
        <div class="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
          <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">County watchlist</p>
          <div class="space-y-3">
            {#each watchlist as county}
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-white/90">{county.name}</p>
                  <p class={`text-xs font-semibold ${county.tone}`}>{county.status}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.35em] bg-white/10 text-white/70 border border-white/15">
                  {county.badge}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
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
        {#each actions as item}
          <li class="flex items-center justify-between gap-3">
            <span>{item.label}</span>
            <span class={`text-xs font-semibold ${item.tone}`}>{item.status}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
