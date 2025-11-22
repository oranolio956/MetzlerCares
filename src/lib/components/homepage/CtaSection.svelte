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
  <!-- Clean gradients -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-[var(--homepage-hero-mid)] via-[var(--homepage-hero-end)] to-[#1b2745]"
    aria-hidden="true"
  />
  <div
    class="absolute inset-y-0 left-1/3 w-2/3 bg-[radial-gradient(circle_at_30%_30%,var(--homepage-glow-mint),transparent_60%)] opacity-40 blur-3xl"
    aria-hidden="true"
  />
    <div class="container mx-auto px-4 text-center relative z-10">
      <p class="text-xs uppercase tracking-[0.32em] text-[var(--color-accent)] font-bold">{tag}</p>
      <h2 class="text-4xl md:text-5xl font-bold text-white mt-4 font-[family-name:var(--font-primary)]">
        {title}
      </h2>
      <p class="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto mt-6 font-[family-name:var(--font-secondary)]">
        {description}
      </p>
    <div class="flex flex-col sm:flex-row justify-center gap-4 mt-10">
      <a
        href="/contact"
        class="btn-primary text-lg px-10 py-4 rounded-full text-white font-semibold shadow-xl hover:scale-[1.01] transition-transform"
          on:click={() => trackEvent('cta_primary_click', { destination: '/contact' })}
      >
          {primaryLabel}
      </a>
      <a
        href="/partner-portal"
        class="btn-outline text-lg px-10 py-4 rounded-full border-[var(--surface-border)] text-white font-semibold hover:bg-[var(--surface-glass)] transition-colors"
          on:click={() => trackEvent('cta_secondary_click', { destination: '/partner-portal' })}
      >
          {secondaryLabel}
      </a>
    </div>
      <div class="flex flex-wrap justify-center gap-3 mt-8 text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">
        {#each badges as badge}
          <span class="px-4 py-2 rounded-full border border-[var(--surface-border)] bg-white/5">{badge}</span>
        {/each}
    </div>
  </div>
</section>
