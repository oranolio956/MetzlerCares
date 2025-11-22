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
  <!-- Clean background using design tokens -->
  <div class="absolute inset-0 bg-gradient-to-b from-[var(--surface-dusk)] via-[var(--surface-night)] to-[var(--surface-night)]" aria-hidden="true" />
  
  <div class="relative z-10 space-y-0">
      <div class="container mx-auto px-4 pt-6 flex justify-end">
      <LocaleSwitcher currentLocale={locale} />
    </div>
    <HeroSection
      signals={hero.signals}
      tag={hero.tag}
      heading={hero.heading}
      subheading={hero.subheading}
    />
    <CredibilitySection
      items={credibility.items}
      title={credibility.title}
      description={credibility.description}
    />
    <OperatingBlueprintSection
      loops={loops}
      pillars={pillars}
      title={operating.title}
      description={operating.description}
    />
    <OutcomesSection
      stats={outcomes.stats}
      title={outcomes.title}
      description={outcomes.description}
      footnotes={outcomes.footnotes}
    />
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
