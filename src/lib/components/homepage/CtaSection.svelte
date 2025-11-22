<script lang="ts">
  import { trackEvent } from '$lib/utils/analytics'

  export let tag = 'First impression ≠ final delivery'
  export let title = 'Let’s architect recovery infrastructure once, not reinvent it every contract.'
  export let description =
    'We onboard with your clinicians, finance leads, and field teams in the same sprint so everyone is shipping from day one.'
  export let primaryLabel = 'Book a working session'
  export let secondaryLabel = 'Access partner portal'
  export let badges: string[] = ['Medicaid H0038 ready', 'Colorado RSSO certified', 'Security-first delivery']
</script>

<section class="py-24 relative overflow-hidden">
  <div
    class="absolute inset-0 bg-gradient-to-r from-brand-dusk via-brand-night to-brand-card motion-reduce:opacity-80"
    aria-hidden="true"
  />
  <div
    class="absolute inset-y-0 left-1/2 w-1/2 bg-gradient-to-l from-brand-teal/30 to-transparent blur-3xl opacity-60 motion-reduce:hidden"
    aria-hidden="true"
  />
    <div class="container mx-auto px-4 text-center relative z-10">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-teal">{tag}</p>
      <h2 class="text-4xl md:text-5xl font-bold text-white mt-4">
        {title}
      </h2>
      <p class="text-lg text-brand-soft max-w-3xl mx-auto mt-6">
        {description}
      </p>
    <div class="flex flex-col sm:flex-row justify-center gap-4 mt-10">
      <a
        href="/contact"
        class="px-10 py-4 rounded-full bg-white text-brand-night text-lg font-semibold shadow-xl shadow-black/20 hover:scale-[1.01] transition-transform"
          on:click={() => trackEvent('cta_primary_click', { destination: '/contact' })}
      >
          {primaryLabel}
      </a>
      <a
        href="/partner-portal"
        class="px-10 py-4 rounded-full border border-brand-border text-white text-lg font-semibold hover:bg-white/10 transition-colors"
          on:click={() => trackEvent('cta_secondary_click', { destination: '/partner-portal' })}
      >
          {secondaryLabel}
      </a>
    </div>
    <div class="flex flex-wrap justify-center gap-3 mt-8 text-xs uppercase tracking-[0.32em] text-brand-muted">
        {#each badges as badge}
          <span class="px-4 py-2 rounded-full border border-brand-border bg-white/5">{badge}</span>
        {/each}
    </div>
  </div>
</section>
