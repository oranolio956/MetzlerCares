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

<section class="relative" id="cta-section">
    <div class="container mx-auto text-center max-w-4xl">
      <p class="text-[10px] uppercase tracking-wider text-white/50 font-medium">{tag}</p>
      <h2 class="text-3xl md:text-4xl font-bold text-white mt-3 font-[family-name:var(--font-primary)] leading-tight">
        {title}
      </h2>
      <p class="text-base text-white/60 max-w-2xl mx-auto mt-4 font-[family-name:var(--font-secondary)] leading-relaxed">
        {description}
      </p>
    <div class="flex flex-col sm:flex-row justify-center gap-3 mt-8">
      <a
        href="/contact"
        class="inline-flex items-center justify-center text-base px-8 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:-translate-y-px hover:shadow-xl transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          on:click={() => trackEvent('cta_primary_click', { destination: '/contact' })}
      >
          {primaryLabel}
      </a>
      <a
        href="/partner-portal"
        class="inline-flex items-center justify-center text-base px-8 py-3 rounded-full border border-white/20 text-white bg-white/5 backdrop-blur-sm font-medium hover:bg-white/10 hover:-translate-y-px transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          on:click={() => trackEvent('cta_secondary_click', { destination: '/partner-portal' })}
      >
          {secondaryLabel}
      </a>
    </div>
      <div class="flex flex-wrap justify-center gap-2 mt-6 text-[10px] uppercase tracking-wider text-white/40">
        {#each badges as badge}
          <span class="px-3 py-1.5 rounded-full border border-white/10 bg-white/5">{badge}</span>
        {/each}
    </div>
  </div>
</section>
