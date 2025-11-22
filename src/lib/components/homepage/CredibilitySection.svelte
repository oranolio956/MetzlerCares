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

<section class="py-20 relative isolate overflow-hidden">
  <div
    class="absolute inset-0 bg-[var(--surface-night)]/40 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0))]"
    aria-hidden="true"
  />
  <div
    class="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,var(--homepage-glow-mint),transparent_55%)] opacity-50 blur-3xl"
    aria-hidden="true"
  />
  <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative z-10">
    <div class="lg:col-span-2 space-y-6">
      <p class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">Proof instead of platitudes</p>
      <h2 class="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-primary)]">{title}</h2>
      <p class="text-lg text-[var(--text-muted)] font-[family-name:var(--font-secondary)]">{description}</p>
      <div class="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
        <span class="w-2 h-2 rounded-full bg-emerald-300" aria-hidden="true" />
        Audited stack: SOC 2 · HIPAA · 7 CFR 273.2(n)
      </div>
    </div>
      <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {#each items as item, index}
          <button
            type="button"
            class="text-left p-6 rounded-2xl border border-[var(--homepage-soft-border)] bg-[var(--homepage-soft-card)]/95 hover:bg-[var(--homepage-soft-card)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-night)] transition duration-500 opacity-0 translate-y-6 data-[reveal=visible]:opacity-100 data-[reveal=visible]:translate-y-0 shadow-[0_25px_60px_rgba(4,9,20,0.55)] hover:-translate-y-1"
            in:fly={{ y: 18, duration: 500, delay: 100 + index * 90 }}
            use:revealOnScroll={{ threshold: 0.25 }}
            on:focus={() => handleInspect(item, 'focus')}
            on:click={() => handleInspect(item, 'click')}
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[var(--color-accent)]">
                <IconSymbol name={item.icon} />
              </div>
              <div class="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">{item.label}</div>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2 font-[family-name:var(--font-primary)]">{item.title}</h3>
            <p class="text-sm text-[var(--text-muted)] leading-relaxed font-[family-name:var(--font-secondary)]">{item.detail}</p>
          </button>
      {/each}
    </div>
  </div>
</section>
