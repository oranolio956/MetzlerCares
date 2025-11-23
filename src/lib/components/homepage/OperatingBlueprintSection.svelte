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
    'Every workflow snaps into a loop—Listen, Support, Improve—so field teams, clinicians, and finance speak the same language without duct-taped software.'

  const handlePillarInteraction = (pillar: PlatformPillar, interaction: 'hover' | 'click' | 'focus') => {
    trackEvent('pillar_expand', {
      interaction,
      pillar_title: pillar.title
    })
  }
</script>

<section id="operating-blueprint" class="relative">
  <div class="container mx-auto grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
    <div class="xl:col-span-2 space-y-4">
      <p class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Infrastructure, not intervention</p>
      <h2 class="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-primary)] leading-tight">{title}</h2>
      <p class="text-base text-white/60 font-[family-name:var(--font-secondary)] leading-relaxed">{description}</p>
      <div class="space-y-3">
        {#each loops as loop, index}
          <div
            class="p-4 rounded-xl border border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/10"
            in:fly={{ x: -10, duration: 300, delay: 50 * index }}
          >
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
                {index + 1}
              </div>
              <div class="flex-1">
                <p class="text-xs font-medium text-white/80">{loop.title}</p>
                <p class="text-sm text-white/60 mt-1">{loop.description}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-2 ml-10">
              {#each loop.chips as chip}
                <span
                  class="px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-full bg-white/5 border border-white/10 text-white/50"
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
        class="relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl"
      >
        <div class="space-y-3">
          {#each pillars as pillar, index}
            <button
              type="button"
              class="text-left w-full group p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 transition-all duration-200 hover:bg-white/10 hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              in:fly={{ y: 10, duration: 300, delay: 50 + index * 50 }}
              on:mouseenter={() => handlePillarInteraction(pillar, 'hover')}
              on:focus={() => handlePillarInteraction(pillar, 'focus')}
              on:click={() => handlePillarInteraction(pillar, 'click')}
            >
              <div
                class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors"
              >
                <IconSymbol name={pillar.icon} class="w-5 h-5 text-white/70" />
              </div>
              <div class="flex-1">
                <p class="text-[10px] uppercase tracking-wider text-white/50">{pillar.stat}</p>
                <h3 class="text-lg font-semibold text-white mt-0.5 font-[family-name:var(--font-primary)]">{pillar.title}</h3>
                <p class="text-sm text-white/60 mt-1 leading-relaxed">{pillar.description}</p>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
