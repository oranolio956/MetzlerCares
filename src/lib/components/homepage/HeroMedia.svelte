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
    class="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-5 overflow-hidden"
  >
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[10px] uppercase tracking-wider text-white/50">Command deck</p>
          <p class="text-lg font-semibold text-white mt-0.5">Colorado Recovery Grid</p>
        </div>
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 border border-white/10 text-[9px] uppercase tracking-wider text-white/70">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          Live
        </span>
      </div>

      <div class="grid grid-cols-3 gap-3">
        {#each streams as stream}
          <div class="rounded-lg bg-white/5 p-3">
            <p class="text-[9px] uppercase tracking-wider text-white/40">{stream.title}</p>
            <p class="text-base font-semibold text-white mt-1">{stream.metric}</p>
            <p class="text-[10px] text-white/50">{stream.detail}</p>
            <span class="inline-block text-[10px] text-emerald-400 mt-1">{stream.change}</span>
          </div>
        {/each}
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-lg bg-white/5 p-3 space-y-2">
          <p class="text-[10px] uppercase tracking-wider text-white/40">Automation queue</p>
          <ul class="space-y-1.5 text-xs">
            {#each queue.slice(0, 2) as item}
              <li class="flex items-center justify-between text-white/60">
                <span class="text-[11px]">{item.label}</span>
                <span class="text-white/80 font-medium text-[11px]">{item.status}</span>
              </li>
            {/each}
          </ul>
        </div>
        <div class="rounded-lg bg-white/5 p-3 space-y-2">
          <p class="text-[10px] uppercase tracking-wider text-white/40">County status</p>
          <div class="space-y-1.5">
            {#each watchlist.slice(0, 2) as county}
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs text-white/80">{county.name}</p>
                  <p class={`text-[10px] font-medium ${county.tone}`}>{county.status}</p>
                </div>
                <span class="px-1.5 py-0.5 rounded-full text-[8px] uppercase tracking-wider bg-white/10 text-white/60">
                  {county.badge}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
