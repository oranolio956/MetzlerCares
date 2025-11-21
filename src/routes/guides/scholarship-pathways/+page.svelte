<script lang="ts">
  const title = 'Scholarship Pathways for Sober Living in Colorado'
  const description =
    'Step-by-step pathway to secure sober living scholarships: eligibility, documentation, partners, timelines and application tips.'
  const canonical = 'https://metzlercares.org/guides/scholarship-pathways'
  const links = [
    { href: '/scholarships', text: 'Apply for Scholarships' },
    { href: '/faq/sober-living', text: 'Sober Living FAQ' },
    { href: '/co', text: 'Colorado Recovery Directory' }
  ]
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <script type="application/ld+json">
    {
      JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonical })
    }
  </script>
  <script type="application/ld+json">
    {
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: '/guides/scholarship-pathways' }
        ]
      })
    }
  </script>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="bg-teal-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Scholarship Pathways</h1>
      <p class="text-xl text-teal-100 max-w-3xl mx-auto">
        Clear steps to qualify, document, and secure support for sober living in Colorado.
      </p>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-10">
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Eligibility</h2>
          <p class="text-gray-700">
            Colorado residency or placement in Colorado sober living, referral from a recovery professional, financial
            need, and commitment to program requirements.
          </p>
        </section>
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Documentation</h2>
          <p class="text-gray-700">
            Photo ID, proof of residency or placement letter, provider referral, and financial need documentation. Check
            partner-specific requirements.
          </p>
        </section>
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Partners & Timelines</h2>
          <p class="text-gray-700">
            Scholarship decisions typically take 5–10 business days. Partners may request additional information to
            verify eligibility.
          </p>
        </section>
        <section class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Application Tips</h2>
          <p class="text-gray-700">
            Prepare documents early, provide accurate information, and maintain contact with your provider and partner
            organization.
          </p>
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
