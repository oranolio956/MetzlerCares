<script lang="ts">
  import type { OperatingLoop, PlatformPillar } from '$lib/content/homepage'

  export let loops: OperatingLoop[] = []
  export let pillars: PlatformPillar[] = []
</script>

<section id="operating-blueprint" class="py-24 relative">
  <div
    class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-10 pointer-events-none"
    aria-hidden="true"
  />
  <div class="container mx-auto px-4 grid grid-cols-1 xl:grid-cols-5 gap-12 items-start">
    <div class="xl:col-span-2 space-y-8">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Infrastructure, not intervention</p>
      <h2 class="text-3xl md:text-4xl font-bold text-white">
        A three-layer operating system that captures the entire recovery loop.
      </h2>
      <p class="text-lg text-brand-muted">
        Every workflow snaps into a loop—Signal, Orchestrate, Prove—so field teams, clinicians, and finance speak the
        same language without duct-taped software.
      </p>
      <div class="space-y-6">
        {#each loops as loop, index}
          <div class="p-5 rounded-2xl border border-brand-border bg-white/[0.03] backdrop-blur">
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white"
              >
                {index + 1}
              </div>
              <div>
                <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">{loop.title}</p>
                <p class="text-base text-brand-soft mt-2">{loop.description}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mt-4">
              {#each loop.chips as chip}
                <span
                  class="px-3 py-1 text-[11px] uppercase tracking-[0.22em] rounded-full bg-brand-card/60 border border-brand-border text-brand-soft"
                >
                  {chip}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
    <div class="xl:col-span-3">
      <div
        class="relative p-10 rounded-[36px] border border-brand-border bg-brand-card/90 backdrop-blur-xl shadow-[0_30px_120px_rgba(3,4,6,0.95)] overflow-hidden"
      >
        <div
          class="absolute inset-0 opacity-30"
          aria-hidden="true"
          style="background-image: linear-gradient(120deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 140px 120px; mask-image: radial-gradient(circle at 30% 30%, rgba(0,0,0,0.9), rgba(0,0,0,0));"
        />
        <div class="absolute -right-20 top-10 w-72 h-72 bg-teal-500/20 blur-[120px]" aria-hidden="true" />
        <div class="relative space-y-6">
          {#each pillars as pillar}
            <div
              class="group relative p-6 rounded-3xl bg-brand-card/70 border border-brand-border backdrop-blur flex flex-col gap-4 md:flex-row md:items-center"
            >
              <div
                class="w-14 h-14 rounded-2xl bg-white/5 border border-brand-border flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan/10 transition-colors"
              >
                {#if pillar.icon === 'chart'}
                  <svg class="w-7 h-7 text-brand-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                {:else if pillar.icon === 'network'}
                  <svg class="w-7 h-7 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                {:else if pillar.icon === 'cpu'}
                  <svg class="w-7 h-7 text-brand-iris" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                {:else}
                  <svg class="w-7 h-7 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                {/if}
              </div>
              <div class="flex-1">
                <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">{pillar.stat}</p>
                <h3 class="text-2xl font-semibold text-white mt-2">{pillar.title}</h3>
                <p class="text-sm text-brand-muted mt-2 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
