<script lang="ts">
  const title = 'Sober Living FAQ | Colorado Recovery Housing'
  const description =
    'Answers to common questions about sober living in Colorado: costs, rules, timelines, eligibility, and scholarships.'
  const canonical = 'https://metzlercares.org/faq/sober-living'
  const faqs = [
    {
      q: 'What is sober living?',
      a: 'Structured, drug-free housing supporting recovery with rules and peer accountability.'
    },
    {
      q: 'How much does it cost in Colorado?',
      a: 'Typical ranges are $600–$1,550/month depending on location and amenities.'
    },
    {
      q: 'What are common rules?',
      a: 'Curfews, meeting attendance, random testing, chores, employment or program participation.'
    },
    { q: 'How long do people stay?', a: 'Common stays are 3–9 months with gradual transition to independence.' },
    { q: 'Are scholarships available?', a: 'Yes, see our Scholarships page for eligibility and documentation.' }
  ]
  const breadcrumb = [
    { name: 'Home', href: '/' },
    { name: 'FAQ', href: '/faq/sober-living' }
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
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      })
    }
  </script>
  <script type="application/ld+json">
    {
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: b.href
        }))
      })
    }
  </script>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="bg-indigo-700 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Sober Living FAQ</h1>
      <p class="text-xl text-indigo-100 max-w-3xl mx-auto">
        Clear answers to help you make informed decisions about recovery housing in Colorado.
      </p>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 grid-cols-1 lg:grid-cols-3">
    <div class="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
      <div class="space-y-6">
        {#each faqs as f}
          <div class="border-b border-gray-200 pb-6 last:border-b-0">
            <h2 class="text-xl font-semibold text-gray-900">{f.q}</h2>
            <p class="text-gray-700">{f.a}</p>
          </div>
        {/each}
      </div>
    </div>
    <aside class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Related</h3>
        <div class="space-y-2">
          <a href="/scholarships" class="text-blue-600 hover:text-blue-800 hover:underline">Sober Living Scholarships</a
          >
          <a href="/co" class="text-blue-600 hover:text-blue-800 hover:underline">Colorado Recovery Services</a>
        </div>
      </div>
    </aside>
  </div>
</div>
