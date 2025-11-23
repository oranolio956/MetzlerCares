<script lang="ts">
  import IconSymbol from '$lib/components/icons/IconSymbol.svelte'
  import type { CredibilitySignal } from '$lib/content/homepage'
  import { trackEvent } from '$lib/utils/analytics'
  import { revealOnScroll } from '$lib/utils/viewport'
  import { fly } from 'svelte/transition'

  export let items: CredibilitySignal[] = []
  export let title = 'Infrastructure signals the boardroom remembers.'
  export let description =
    'Instead of generic logo farms, we lead with the regulatory, billing, and security receipts that matter to CFOs, Medicaid reviewers, and CMOs evaluating behavioral health partners.'

  const handleInspect = (item: CredibilitySignal, interaction: 'focus' | 'click') => {
    trackEvent('credibility_inspect', {
      interaction,
      card_label: item.label,
      card_title: item.title
    })
  }
</script>

<section class="relative overflow-hidden" id="credibility-section">
  <div class="container mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
    <div class="lg:col-span-2 space-y-4">
      <p class="text-[10px] uppercase tracking-wider text-white/50 font-medium">Proof instead of platitudes</p>
      <h2 class="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-primary)] leading-tight">{title}</h2>
      <p class="text-base text-white/60 font-[family-name:var(--font-secondary)] leading-relaxed">{description}</p>
      <div class="flex items-center gap-2 text-xs text-white/50">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
        SOC 2 · HIPAA · 7 CFR 273.2(n)
      </div>
    </div>
      <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {#each items as item, index}
          <button
            type="button"
            class="text-left p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 transition-all duration-200 hover:-translate-y-px"
            in:fly={{ y: 10, duration: 300, delay: 50 + index * 50 }}
            use:revealOnScroll={{ threshold: 0.25 }}
            on:focus={() => handleInspect(item, 'focus')}
            on:click={() => handleInspect(item, 'click')}
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <IconSymbol name={item.icon} class="w-4 h-4 text-white/70" />
              </div>
              <div class="text-[10px] uppercase tracking-wider text-white/50 font-medium">{item.label}</div>
            </div>
            <h3 class="text-lg font-semibold text-white mb-1.5 font-[family-name:var(--font-primary)]">{item.title}</h3>
            <p class="text-sm text-white/60 leading-relaxed font-[family-name:var(--font-secondary)]">{item.detail}</p>
          </button>
      {/each}
    </div>
  </div>
</section>
