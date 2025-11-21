<script lang="ts">
  import { onMount } from 'svelte'
  import { trackEvent } from '$lib/utils/analytics'

  let openSections: Set<string> = new Set()
  let searchQuery = ''
  let filteredFAQs = []

  // FAQ data structure
  const faqCategories = [
    {
      id: 'applications',
      title: 'Housing Applications',
      icon: 'home',
      faqs: [
        {
          question: 'Who is eligible for housing scholarships?',
          answer:
            'Individuals 18+ actively engaged in addiction recovery who meet facility requirements. You must be committed to your recovery journey and follow program guidelines.'
        },
        {
          question: 'How much does a scholarship cover?',
          answer:
            'Scholarships typically cover $300 per month in housing costs, though amounts may vary by facility and availability. Payments are made directly to approved sober living homes.'
        },
        {
          question: 'How long does the application process take?',
          answer:
            "Most applications are processed within 15 minutes using our automated verification system. You'll receive immediate feedback on your eligibility."
        },
        {
          question: 'What information do I need to apply?',
          answer:
            "You'll need: full name, email, phone, date of birth, SSN (for verification), current address, and details about your recovery journey and housing needs."
        },
        {
          question: 'Can I apply for multiple facilities?',
          answer:
            'Yes, you can apply to multiple facilities. However, scholarships are typically limited to one facility at a time to ensure focused recovery support.'
        }
      ]
    },
    {
      id: 'facilities',
      title: 'Sober Living Facilities',
      icon: 'building',
      faqs: [
        {
          question: 'How do you verify sober living homes?',
          answer:
            'All partner facilities undergo thorough background checks, license verification, and quality assessments. We regularly audit facilities to ensure they maintain high standards.'
        },
        {
          question: 'What services do facilities provide?',
          answer:
            'Facilities typically offer: structured living environments, peer support, house meetings, recovery-focused activities, transportation assistance, and connections to community resources.'
        },
        {
          question: 'Can I choose my facility?',
          answer:
            "You can apply to specific facilities that interest you. We'll help match you with facilities that best fit your recovery needs and location preferences."
        },
        {
          question: 'What are house rules like?',
          answer:
            'Rules vary by facility but typically include: no substance use, curfew policies, participation in house activities, respectful behavior, and maintaining a clean living space.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'shield',
      faqs: [
        {
          question: 'How is my personal information protected?',
          answer:
            'We follow HIPAA regulations and industry best practices. Your information is encrypted, access is restricted to authorized personnel only, and we never sell your data.'
        },
        {
          question: 'Who can see my application information?',
          answer:
            'Only authorized Metzler Foundations staff and your chosen facility can access your application details. Information is shared on a need-to-know basis only.'
        },
        {
          question: 'Do you share information with insurance companies?',
          answer:
            'No. We do not share any information with insurance companies, employers, or government agencies unless legally required and with your explicit consent.'
        },
        {
          question: 'How long do you keep my information?',
          answer:
            'Application data is retained for 7 years as required by healthcare regulations, then securely deleted. You can request deletion of your data at any time.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Funding',
      icon: 'credit-card',
      faqs: [
        {
          question: 'How are scholarships paid?',
          answer:
            'Scholarships are paid directly to approved facilities monthly. Residents are not given cash - this ensures funds are used for housing and supports accountability.'
        },
        {
          question: 'When are payments made?',
          answer:
            'Payments are processed on the 1st of each month for approved scholarships. New approvals may take 1-2 business days to process.'
        },
        {
          question: 'What if my scholarship is denied?',
          answer:
            "If denied, you'll receive specific feedback about why. You can reapply after addressing the issues, typically after 30-90 days depending on circumstances."
        },
        {
          question: 'Can scholarships be renewed?',
          answer:
            'Yes, scholarships can be renewed monthly based on: continued recovery progress, facility compliance, positive resident reports, and funding availability.'
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Resources',
      icon: 'heart',
      faqs: [
        {
          question: 'What support do you provide?',
          answer:
            'We connect you with facilities, provide recovery resources, offer application assistance, and help resolve any issues that arise during your housing journey.'
        },
        {
          question: 'Are there additional resources available?',
          answer:
            'Yes! We provide access to: recovery meeting information, counseling referrals, employment assistance, transportation resources, and community support programs.'
        },
        {
          question: 'What if I have questions during my stay?',
          answer:
            'You can contact us anytime. We provide 24/7 emergency support and regular check-ins to ensure your recovery journey is successful.'
        },
        {
          question: 'How do I report concerns about my facility?',
          answer:
            'Contact us immediately if you have concerns. We take all reports seriously and will investigate promptly to ensure your safety and well-being.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: 'cog',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer:
            'Use the "Forgot Password" link on the login page. We\'ll send reset instructions to your email. Passwords must be 8+ characters with mixed case, numbers, and symbols.'
        },
        {
          question: 'Why do I need to verify my email?',
          answer:
            'Email verification ensures we can communicate important updates about your application and recovery support. It also helps prevent unauthorized access.'
        },
        {
          question: 'How do I update my contact information?',
          answer:
            'Log into your beneficiary portal and update your profile. Changes are verified and may require additional documentation for security.'
        },
        {
          question: 'What browsers do you support?',
          answer:
            'We support the latest versions of Chrome, Firefox, Safari, and Edge. Mobile browsers are fully supported. For best experience, keep your browser updated.'
        }
      ]
    }
  ]

  $: allFAQs = faqCategories.flatMap(cat => cat.faqs.map(faq => ({ ...faq, category: cat.title, categoryId: cat.id })))

  $: filteredFAQs = searchQuery
    ? allFAQs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFAQs

  function toggleSection(sectionId: string) {
    if (openSections.has(sectionId)) {
      openSections.delete(sectionId)
    } else {
      openSections.add(sectionId)
    }
    openSections = openSections
  }

  function toggleFAQ(faqId: string) {
    if (openSections.has(faqId)) {
      openSections.delete(faqId)
    } else {
      openSections.add(faqId)
    }
    openSections = openSections
  }

  onMount(() => {
    trackEvent('faq_page_viewed')
  })
</script>

<svelte:head>
  <title>Frequently Asked Questions - Metzler Foundations</title>
  <meta
    name="description"
    content="Find answers to common questions about housing scholarships, sober living facilities, application process, privacy, and recovery support services."
  />
  <meta
    name="keywords"
    content="recovery housing FAQ, sober living questions, housing scholarship help, recovery support FAQ"
  />
  <link rel="canonical" href="https://metzlerfoundations.org/faq" />
</svelte:head>

<div class="min-h-screen bg-cream text-forest-green">
  <!-- Hero Section -->
  <section class="hero gradient-forest">
    <div class="container mx-auto text-center">
      <h1 class="hero-title">Frequently Asked Questions</h1>
      <p class="hero-subtitle">
        Find answers to common questions about our housing scholarships, sober living facilities, and recovery support
        services.
      </p>

      <!-- Search -->
      <div class="max-w-md mx-auto">
        <div class="relative">
          <input
            bind:value={searchQuery}
            type="search"
            placeholder="Search FAQs..."
            class="w-full px-4 py-3 pl-12 text-forest-green bg-white border border-forest-green border-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green"
          />
          <svg
            class="absolute left-4 top-3.5 w-5 h-5 text-forest-green opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Content -->
  <section class="section">
    <div class="container mx-auto">
      {#if searchQuery}
        <!-- Search Results -->
        <div class="mb-8">
          <h2 class="section-title">
            Search Results ({filteredFAQs.length})
          </h2>

          {#if filteredFAQs.length === 0}
            <div class="text-center py-12">
              <svg
                class="w-16 h-16 text-forest-green opacity-30 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.966-5.5-2.291m15 7.291H3a2 2 0 01-2-2V7a2 2 0 012-2h18a2 2 0 012 2v10a2 2 0 01-2 2z"
                />
              </svg>
              <h3 class="text-xl font-medium text-forest-green mb-2">No results found</h3>
              <p class="text-forest-green opacity-70 mb-6">
                Try adjusting your search terms or browse our categories below.
              </p>
                <button on:click={() => (searchQuery = '')} class="btn btn-secondary"> Clear Search </button>
            </div>
          {:else}
            <div class="space-y-4">
              {#each filteredFAQs as faq, index}
                <div class="card overflow-hidden">
                  <button
                    on:click={() => toggleFAQ(`search-${index}`)}
                    class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-cream hover:bg-opacity-50 transition-colors"
                    aria-expanded={openSections.has(`search-${index}`)}
                  >
                    <div>
                      <span class="text-sm text-forest-green font-medium uppercase tracking-wide">
                        {faq.category}
                      </span>
                      <h3 class="text-lg font-medium text-forest-green mt-1">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      class="w-5 h-5 text-forest-green opacity-50 transition-transform {openSections.has(`search-${index}`)
                        ? 'rotate-180'
                        : ''}"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {#if openSections.has(`search-${index}`)}
                    <div class="px-6 pb-4 border-t border-forest-green border-opacity-10">
                      <p class="text-forest-green opacity-80 leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        <!-- Category Sections -->
        <div class="space-y-8">
          {#each faqCategories as category}
            <div class="card overflow-hidden">
              <!-- Category Header -->
              <button
                on:click={() => toggleSection(category.id)}
                class="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-cream hover:bg-opacity-50 transition-colors"
                aria-expanded={openSections.has(category.id)}
              >
                <div class="flex items-center space-x-4">
                  <div class="icon-circle bg-forest-green bg-opacity-10 text-forest-green">
                    {#if category.icon === 'home'}
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    {:else if category.icon === 'building'}
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    {:else if category.icon === 'shield'}
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    {:else if category.icon === 'credit-card'}
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    {:else if category.icon === 'heart'}
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    {:else}
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    {/if}
                  </div>
                  <div>
                    <h2 class="text-xl font-serif font-medium text-forest-green">
                      {category.title}
                    </h2>
                    <p class="text-forest-green opacity-60 mt-1">
                      {category.faqs.length} questions
                    </p>
                  </div>
                </div>
                <svg
                  class="w-5 h-5 text-forest-green opacity-50 transition-transform {openSections.has(category.id)
                    ? 'rotate-180'
                    : ''}"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- FAQ Items -->
              {#if openSections.has(category.id)}
                <div class="divide-y divide-forest-green divide-opacity-10">
                  {#each category.faqs as faq, index}
                    <div>
                      <button
                        on:click={() => toggleFAQ(`${category.id}-${index}`)}
                        class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-cream hover:bg-opacity-50 transition-colors"
                        aria-expanded={openSections.has(`${category.id}-${index}`)}
                      >
                        <h3 class="text-lg font-medium text-forest-green pr-4">
                          {faq.question}
                        </h3>
                        <svg
                          class="w-5 h-5 text-forest-green opacity-50 transition-transform flex-shrink-0 {openSections.has(
                            `${category.id}-${index}`
                          )
                            ? 'rotate-180'
                            : ''}"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {#if openSections.has(`${category.id}-${index}`)}
                        <div class="px-6 pb-4">
                          <p class="text-forest-green opacity-80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Contact CTA -->
      <div class="mt-16 card bg-forest-green bg-opacity-5 text-center">
        <h2 class="section-title">Still have questions?</h2>
        <p class="text-forest-green opacity-70 mb-6 max-w-2xl mx-auto">
          Can't find the answer you're looking for? Our support team is here to help. Contact us and we'll get back to
          you within 24 hours.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/contact" class="btn btn-primary">Contact Support</a>
          <a href="tel:+1-555-0123" class="btn btn-secondary">Call Us</a>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  /* Use unified design system classes */
  .hero {
    @apply py-16 px-4 sm:px-6 lg:px-8;
  }
  
  .hero-title {
    @apply text-4xl md:text-5xl font-serif font-medium text-forest-green mb-6;
  }
  
  .hero-subtitle {
    @apply text-xl text-forest-green opacity-80 mb-8;
  }
  
  .section {
    @apply py-16 px-4 sm:px-6 lg:px-8;
  }
  
  .section-title {
    @apply text-3xl font-serif font-medium text-forest-green mb-8;
  }
  
  .container {
    @apply max-w-6xl;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-forest-green border-opacity-10 p-8;
  }
  
  .icon-circle {
    @apply w-12 h-12 rounded-full flex items-center justify-center;
  }
  
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-forest-green text-white hover:bg-forest-green-dark;
  }
  
  .btn-secondary {
    @apply bg-sunset-orange text-white hover:bg-sunset-orange-dark;
  }
</style>