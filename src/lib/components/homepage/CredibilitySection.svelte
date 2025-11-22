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

<section class="py-20">
  <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
    <div class="lg:col-span-2 space-y-6">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-muted">Proof instead of platitudes</p>
      <h2 class="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      <p class="text-lg text-brand-muted">{description}</p>
    </div>
      <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {#each items as item, index}
          <button
            type="button"
            class="text-left p-6 rounded-2xl border border-brand-border bg-gradient-to-br from-white/[0.05] via-brand-card/40 to-brand-card/20 backdrop-blur focus-visible:ring-2 focus-visible:ring-brand-emerald/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-night transition duration-500 opacity-0 translate-y-6 data-[reveal=visible]:opacity-100 data-[reveal=visible]:translate-y-0"
            in:fly={{ y: 18, duration: 500, delay: 100 + index * 90 }}
            use:revealOnScroll={{ threshold: 0.25 }}
            on:focus={() => handleInspect(item, 'focus')}
            on:click={() => handleInspect(item, 'click')}
          >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-cyan">
              <IconSymbol name={item.icon} />
            </div>
            <div class="text-xs uppercase tracking-[0.32em] text-brand-muted">{item.label}</div>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">{item.title}</h3>
          <p class="text-sm text-brand-muted leading-relaxed">{item.detail}</p>
          </button>
      {/each}
    </div>
  </div>
</section>
