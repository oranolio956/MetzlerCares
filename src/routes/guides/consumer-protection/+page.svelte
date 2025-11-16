<script lang="ts">
  const title = 'Choosing Legitimate Recovery Services: Consumer Protection Guide'
  const description = 'How to identify legitimate recovery services in Colorado: licenses, transparent pricing, reviews, and ethical practices.'
  const canonical = 'https://metzlercares.org/guides/consumer-protection'
  const sections = [
    { h: 'Licensing & Accreditation', p: 'Verify state licensing and any accreditations directly with official sources. Request documentation before committing.' },
    { h: 'Transparent Pricing', p: 'Ask for written pricing with all fees. Avoid providers that cannot provide clear, complete cost information.' },
    { h: 'Reviews & References', p: 'Check reputable reviews and request references. Look for consistent feedback regarding safety and ethics.' },
    { h: 'Ethical Practices', p: 'Avoid high-pressure sales tactics. Ensure consent, privacy, and fair policies are clearly stated.' }
  ]
  const links = [
    { href: '/co', text: 'Colorado Recovery Directory' },
    { href: '/scholarships', text: 'Scholarships' },
    { href: '/faq/sober-living', text: 'Sober Living FAQ' }
  ]
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical })}</script>
  <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Home', item: '/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: '/guides/consumer-protection' } ] })}</script>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="bg-indigo-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Consumer Protection for Recovery Services</h1>
      <p class="text-xl text-indigo-100 max-w-3xl mx-auto">Identify legitimate providers using licensing, transparent pricing, references, and ethical practices.</p>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-10">
        {#each sections as s}
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">{s.h}</h2>
            <p class="text-gray-700">{s.p}</p>
          </section>
        {/each}
      </div>
      <aside class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Related</h3>
          <div class="space-y-2">
            {#each links as l}
              <a href={l.href} class="text-blue-600 hover:text-blue-800 hover:underline">{l.text}</a>
            {/each}
          </div>
        </div>
      </aside>
    </div>
  </div>
</div>
