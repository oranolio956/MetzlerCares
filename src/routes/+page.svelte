<script lang="ts">
  import HeroSection from '$lib/components/homepage/HeroSection.svelte'
  import CredibilitySection from '$lib/components/homepage/CredibilitySection.svelte'
  import OperatingBlueprintSection from '$lib/components/homepage/OperatingBlueprintSection.svelte'
  import OutcomesSection from '$lib/components/homepage/OutcomesSection.svelte'
  import CtaSection from '$lib/components/homepage/CtaSection.svelte'
  import LocaleSwitcher from '$lib/components/homepage/LocaleSwitcher.svelte'
  import type { HomepageContent } from '$lib/content/homepage'

  export let data: {
    content: HomepageContent
    locale: string
  }

  const { content, locale } = data
  const { hero, credibility, operating, loops, pillars, outcomes, cta } = content
</script>

<svelte:head>
  <title>Metzler Cares | Colorado’s Recovery Infrastructure OS</title>
  <meta
    name="description"
    content="Metzler Cares is the Colorado-born operating system that powers certified peer coaching, Medicaid billing, and auditable outcomes in a single platform."
  />
</svelte:head>

<div class="min-h-screen bg-[var(--surface-night)] text-[var(--text-primary)] font-[family-name:var(--font-secondary)] selection:bg-[var(--color-accent-lilac)] selection:text-[var(--surface-night)] relative overflow-hidden">
  <!-- Subtle grid pattern for depth -->
  <div class="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style="opacity: 0.05;" aria-hidden="true"></div>
  
  <!-- Improved gradient for mobile: Lighter top to avoid "black void" feeling -->
  <div class="absolute inset-0 bg-gradient-to-b from-[var(--surface-dusk)] via-[var(--surface-night)] to-[var(--surface-night)] opacity-90" aria-hidden="true" />
  
  <div class="relative z-10 space-y-0 md:space-y-12 lg:space-y-0">
      <div class="container mx-auto px-4 pt-6 flex justify-end">
      <LocaleSwitcher currentLocale={locale} />
    </div>
    
    <!-- Alternating backgrounds for mobile visual rhythm -->
    <div class="bg-transparent">
      <HeroSection
        signals={hero.signals}
        tag={hero.tag}
        heading={hero.heading}
        subheading={hero.subheading}
      />
    </div>

    <div class="bg-[var(--surface-card)]/10 md:bg-transparent py-12 md:py-0">
      <CredibilitySection
        items={credibility.items}
        title={credibility.title}
        description={credibility.description}
      />
    </div>

    <div class="bg-transparent py-12 md:py-0">
      <OperatingBlueprintSection
        loops={loops}
        pillars={pillars}
        title={operating.title}
        description={operating.description}
      />
    </div>

    <div class="bg-[var(--surface-card)]/10 md:bg-transparent py-12 md:py-0">
      <OutcomesSection
        stats={outcomes.stats}
        title={outcomes.title}
        description={outcomes.description}
        footnotes={outcomes.footnotes}
      />
    </div>

    <div class="pb-12 md:pb-0">
      <CtaSection
        tag={cta.tag}
        title={cta.title}
        description={cta.description}
        primaryLabel={cta.primaryLabel}
        secondaryLabel={cta.secondaryLabel}
        badges={cta.badges}
      />
    </div>
  </div>
</div>
