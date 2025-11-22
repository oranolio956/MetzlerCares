<script lang="ts">
  import HeroSection from '$lib/components/homepage/HeroSection.svelte'
  import CredibilitySection from '$lib/components/homepage/CredibilitySection.svelte'
  import OperatingBlueprintSection from '$lib/components/homepage/OperatingBlueprintSection.svelte'
  import OutcomesSection from '$lib/components/homepage/OutcomesSection.svelte'
  import CtaSection from '$lib/components/homepage/CtaSection.svelte'
  import type { HomepageContent } from '$lib/content/homepage'

  export let data: HomepageContent
  const { hero, credibility, operating, loops, pillars, outcomes, cta } = data
</script>

<svelte:head>
  <title>Metzler Cares | Colorado’s Recovery Infrastructure OS</title>
  <meta
    name="description"
    content="Metzler Cares is the Colorado-born operating system that powers certified peer coaching, Medicaid billing, and auditable outcomes in a single platform."
  />
</svelte:head>

<div
  class="min-h-screen bg-brand-night text-brand-text font-sans selection:bg-brand-iris selection:text-brand-night relative overflow-hidden"
>
  <div class="absolute inset-0 bg-gradient-to-b from-brand-dusk via-brand-night to-brand-night" aria-hidden="true" />
  <div
    class="absolute inset-0 opacity-35"
    aria-hidden="true"
    style="background: radial-gradient(circle at 20% 20%, rgba(45, 212, 191, 0.18), transparent 42%), radial-gradient(circle at 80% 0%, rgba(167, 139, 250, 0.22), transparent 50%);"
  />
  <div
    class="absolute inset-0 opacity-20 mix-blend-soft-light"
    aria-hidden="true"
    style="background-image: linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 80px 80px;"
  />
  <div class="relative z-10 space-y-0">
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
