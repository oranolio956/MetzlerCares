<script lang="ts">
  const title = 'Colorado Sober Living Scholarships | Metzler Cares'
  const description =
    'Apply for sober living scholarships in Colorado. Eligibility, documentation, partners, and step-by-step application process.'
  const canonical = 'https://metzlercares.org/scholarships'
  const faqs = [
    {
      question: 'Who is eligible for sober living scholarships?',
      answer: 'Applicants with demonstrated recovery commitment and financial need in Colorado. Documentation required.'
    },
    {
      question: 'What documents do I need?',
      answer:
        'Photo ID, proof of residency, referral letter, and financial need documentation. Additional items may be requested.'
    },
    {
      question: 'How long does approval take?',
      answer: 'Typically 5–10 business days after submission, depending on partner turnaround.'
    }
  ]
  const breadcrumb = [
    { name: 'Home', href: '/' },
    { name: 'Scholarships', href: '/scholarships' }
  ]
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonical
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <script type="application/ld+json">
    {
      JSON.stringify(schema)
    }
  </script>
  <script type="application/ld+json">
    {
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer }
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
  <div class="bg-blue-700 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">Colorado Sober Living Scholarships</h1>
      <p class="text-xl text-blue-100 max-w-3xl mx-auto">
        Financial assistance to help you access safe, supportive recovery housing across Colorado.
      </p>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 grid-cols-1 lg:grid-cols-3">
    <div class="lg:col-span-2 space-y-10">
      <section class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Eligibility & Requirements</h2>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>Colorado residency or placement in Colorado sober living</li>
          <li>Referral from recovery professional or program</li>
          <li>Demonstrated financial need</li>
          <li>Commitment to recovery and house requirements</li>
        </ul>
      </section>
      <section class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Documentation Checklist</h2>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>Photo ID</li>
          <li>Proof of residency or placement letter</li>
          <li>Referral letter from provider</li>
          <li>Financial documentation</li>
        </ul>
      </section>
      <section class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Partners</h2>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>Hornbuckle Foundation</li>
          <li>Colorado recovery housing partners</li>
          <li>Local peer support organizations</li>
        </ul>
      </section>
      <section class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div class="space-y-4">
          {#each faqs as f}
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{f.question}</h3>
              <p class="text-gray-700">{f.answer}</p>
            </div>
          {/each}
        </div>
      </section>
    </div>
    <aside class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Apply for Support</h3>
        <a
          href="/get-aid/apply"
          class="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >Start Application</a
        >
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
        <div class="space-y-2">
          <a href="/co" class="text-blue-600 hover:text-blue-800 hover:underline"
            >Colorado Recovery Services Directory</a
          >
          <a href="/faq/sober-living" class="text-blue-600 hover:text-blue-800 hover:underline">Sober Living FAQ</a>
        </div>
      </div>
    </aside>
  </div>
</div>
