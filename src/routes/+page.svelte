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

<div class="min-h-screen bg-[var(--surface-night)] text-white font-[family-name:var(--font-secondary)] selection:bg-white selection:text-gray-900 relative">
  <!-- Single subtle background gradient -->
  <div
    class="fixed inset-0 bg-gradient-to-b from-gray-900 via-[#0a0f1b] to-black opacity-50 pointer-events-none"
    aria-hidden="true"
  />

  <div class="fixed top-4 right-4 sm:top-6 sm:right-8 z-50">
    <LocaleSwitcher currentLocale={locale} />
  </div>

  <div class="relative z-10 flex flex-col">
    <div class="px-4 sm:px-6 lg:px-8">
      <HeroSection
        signals={hero.signals}
        tag={hero.tag}
        heading={hero.heading}
        subheading={hero.subheading}
      />
    </div>

    <div class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <CredibilitySection
        items={credibility.items}
        title={credibility.title}
        description={credibility.description}
      />
    </div>

    <div class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-black/30">
      <OperatingBlueprintSection
        loops={loops}
        pillars={pillars}
        title={operating.title}
        description={operating.description}
      />
    </div>

    <div class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <OutcomesSection
        stats={outcomes.stats}
        title={outcomes.title}
        description={outcomes.description}
        footnotes={outcomes.footnotes}
      />
    </div>

    <div class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-black/50">
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
