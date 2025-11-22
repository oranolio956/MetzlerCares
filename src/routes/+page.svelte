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
  <div
    class="absolute inset-0 bg-[url('/assets/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
    style="opacity: 0.05;"
    aria-hidden="true"
  />

  <!-- Richer gradient and glow to avoid flat black panels -->
  <div
    class="absolute inset-0 bg-gradient-to-b from-[var(--homepage-hero-start)] via-[var(--homepage-hero-mid)] to-[var(--homepage-hero-end)] opacity-95"
    aria-hidden="true"
  />
  <div
    class="absolute inset-x-0 -top-16 h-96 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_65%)]"
    aria-hidden="true"
  />
  <div
    class="absolute inset-x-0 top-20 h-[520px] bg-[radial-gradient(circle_at_20%_20%,var(--homepage-glow-mint),transparent_55%)] opacity-70 blur-3xl"
    aria-hidden="true"
  />

  <div class="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 pointer-events-none">
    <div class="pointer-events-auto">
      <LocaleSwitcher currentLocale={locale} />
    </div>
  </div>

  <div class="relative z-10 flex flex-col gap-8 lg:gap-14 pb-14">
    <div class="px-4">
      <HeroSection
        signals={hero.signals}
        tag={hero.tag}
        heading={hero.heading}
        subheading={hero.subheading}
      />
    </div>

    <div class="px-4">
      <CredibilitySection
        items={credibility.items}
        title={credibility.title}
        description={credibility.description}
      />
    </div>

    <div class="px-4">
      <OperatingBlueprintSection
        loops={loops}
        pillars={pillars}
        title={operating.title}
        description={operating.description}
      />
    </div>

    <div class="px-4">
      <OutcomesSection
        stats={outcomes.stats}
        title={outcomes.title}
        description={outcomes.description}
        footnotes={outcomes.footnotes}
      />
    </div>

    <div class="px-4">
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
