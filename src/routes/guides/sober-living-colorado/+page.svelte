<script lang="ts">
  const title = 'Sober Living in Colorado: Complete Guide'
  const description = 'Understand sober living in Colorado: structure, costs, scholarships, rules, and how to choose the right environment.'
  const canonical = 'https://metzlercares.org/guides/sober-living-colorado'
  const links = [
    { href: '/scholarships', text: 'Sober Living Scholarships' },
    { href: '/faq/sober-living', text: 'Sober Living FAQ' },
    { href: '/co', text: 'Colorado Recovery Directory' }
  ]
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical })}</script>
  <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Home', item: '/' }, { '@type': 'ListItem', position: 2, name: 'Guides', item: '/guides/sober-living-colorado' } ] })}</script>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="bg-blue-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Sober Living in Colorado</h1>
      <p class="text-xl text-blue-100 max-w-3xl mx-auto">Structure, expectations, costs, scholarships and how to choose the right environment for recovery.</p>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-10">
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">What Is Sober Living?</h2>
          <p class="text-gray-700">Sober living provides drug-free housing with rules and peer accountability. Residents maintain recovery goals, attend meetings, and build life skills in a structured environment.</p>
        </section>
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Typical Costs</h2>
          <p class="text-gray-700">Costs vary by city and amenities. Common ranges are $600–$1,550 per month. Scholarships and sliding scale options may be available.</p>
        </section>
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Rules & Expectations</h2>
          <p class="text-gray-700">Curfews, random testing, meeting attendance, employment or program participation, and house chores are typical and support sustained recovery.</p>
        </section>
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Scholarships</h2>
          <p class="text-gray-700">Scholarships may cover part of housing costs for qualified residents. Review eligibility and documentation on the Scholarships page.</p>
        </section>
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
