<script lang="ts">
  import IconSymbol from '$lib/components/icons/IconSymbol.svelte'
  import type { OperatingLoop, PlatformPillar } from '$lib/content/homepage'
  import { trackEvent } from '$lib/utils/analytics'
  import { revealOnScroll } from '$lib/utils/viewport'
  import { fly } from 'svelte/transition'

  export let loops: OperatingLoop[] = []
  export let pillars: PlatformPillar[] = []
  export let title = 'A three-layer operating system that captures the entire recovery loop.'
  export let description =
    'Every workflow snaps into a loop—Signal, Orchestrate, Prove—so field teams, clinicians, and finance speak the same language without duct-taped software.'

  const handlePillarInteraction = (pillar: PlatformPillar, interaction: 'hover' | 'click' | 'focus') => {
    trackEvent('pillar_expand', {
      interaction,
      pillar_title: pillar.title
    })
  }
</script>

<section id="operating-blueprint" class="py-24 relative">
  <div
    class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-10 pointer-events-none motion-reduce:opacity-0"
    aria-hidden="true"
  />
  <div class="container mx-auto px-4 grid grid-cols-1 xl:grid-cols-5 gap-12 items-start">
      <div class="xl:col-span-2 space-y-8">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Infrastructure, not intervention</p>
        <h2 class="text-3xl md:text-4xl font-bold text-white">{title}</h2>
        <p class="text-lg text-brand-muted">{description}</p>
        <div class="space-y-6">
        {#each loops as loop, index}
              <div
                class="p-5 rounded-2xl border border-brand-border bg-white/[0.03] backdrop-blur transition duration-500 opacity-0 translate-y-4 data-[reveal=visible]:opacity-100 data-[reveal=visible]:translate-y-0"
                in:fly={{ x: -16, duration: 450, delay: 80 * index }}
                use:revealOnScroll={{ threshold: 0.2 }}
              >
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
          class="absolute inset-0 opacity-30 motion-reduce:opacity-10"
          aria-hidden="true"
          style="background-image: linear-gradient(120deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 140px 120px; mask-image: radial-gradient(circle at 30% 30%, rgba(0,0,0,0.9), rgba(0,0,0,0));"
        />
        <div
          class="absolute -right-20 top-10 w-72 h-72 bg-teal-500/20 blur-[120px] motion-reduce:hidden"
          aria-hidden="true"
        />
          <div class="relative space-y-6">
              {#each pillars as pillar, index}
              <button
                type="button"
                class="text-left w-full group relative p-6 rounded-3xl bg-brand-card/70 border border-brand-border backdrop-blur flex flex-col gap-4 md:flex-row md:items-center transition duration-500 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-emerald/70 focus-visible:ring-offset-brand-night focus-visible:ring-offset-2 opacity-0 translate-y-6 data-[reveal=visible]:opacity-100 data-[reveal=visible]:translate-y-0"
                in:fly={{ y: 24, duration: 500, delay: 120 + index * 90 }}
                use:revealOnScroll={{ threshold: 0.3 }}
                on:mouseenter={() => handlePillarInteraction(pillar, 'hover')}
                on:focus={() => handlePillarInteraction(pillar, 'focus')}
                on:click={() => handlePillarInteraction(pillar, 'click')}
              >
              <div
                class="w-14 h-14 rounded-2xl bg-white/5 border border-brand-border flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan/10 transition-colors"
              >
                  <IconSymbol name={pillar.icon} sizeClass="w-7 h-7" />
              </div>
              <div class="flex-1">
                <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">{pillar.stat}</p>
                <h3 class="text-2xl font-semibold text-white mt-2">{pillar.title}</h3>
                <p class="text-sm text-brand-muted mt-2 leading-relaxed">{pillar.description}</p>
                </div>
              </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
