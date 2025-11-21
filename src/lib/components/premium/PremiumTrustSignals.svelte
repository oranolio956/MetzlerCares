<script lang="ts">
  import { fade, slide } from 'svelte/transition'
  import PremiumCard from './PremiumCard.svelte'
  import PremiumButton from './PremiumButton.svelte'
  import Icon from '../Icon.svelte'

  export let variant: 'compact' | 'full' = 'full'
  export let showRatings = true
  export let showCertifications = true
  export let showTestimonials = true
  export let animation = 'fade'

  interface TrustItem {
    icon: string
    title: string
    description: string
    value?: string
    verified?: boolean
  }

  interface Testimonial {
    quote: string
    author: string
    location: string
    rating: number
    verified: boolean
  }

  const trustItems: TrustItem[] = [
    {
      icon: 'badge-check',
      title: 'Joint Commission Accredited',
      description: 'Gold seal of approval for healthcare quality',
      verified: true
    },
    {
      icon: 'shield-check',
      title: 'HIPAA Compliant',
      description: 'Your privacy is our top priority',
      verified: true
    },
    {
      icon: 'star',
      title: '4.9/5 Patient Satisfaction',
      description: 'Based on 500+ verified reviews',
      value: '4.9/5'
    },
    {
      icon: 'chart-bar',
      title: '95% Success Rate',
      description: 'Long-term recovery outcomes',
      value: '95%'
    },
    {
      icon: 'location-marker',
      title: 'Colorado Trusted',
      description: 'Serving Colorado communities since 2018',
      verified: true
    },
    {
      icon: 'users',
      title: 'Insurance Accepted',
      description: 'Most major plans accepted',
      verified: true
    }
  ]

  const testimonials: Testimonial[] = [
    {
      quote:
        "The personalized approach at MetzlerCares made all the difference. They didn't just treat my addiction - they helped me rebuild my entire life.",
      author: 'Sarah M.',
      location: 'Denver, CO',
      rating: 5,
      verified: true
    },
    {
      quote:
        'As a healthcare professional myself, I was impressed by the evidence-based approach and genuine care from every team member.',
      author: 'Dr. James R.',
      location: 'Boulder, CO',
      rating: 5,
      verified: true
    },
    {
      quote:
        'The Recovery Concierge service gave me 24/7 support when I needed it most. I never felt alone in my journey.',
      author: 'Michael T.',
      location: 'Colorado Springs, CO',
      rating: 5,
      verified: true
    }
  ]

  const certifications = [
    {
      name: 'Joint Commission',
      icon: 'badge-check',
      verified: true
    },
    {
      name: 'NAATP',
      icon: 'target',
      verified: true
    },
    {
      name: 'LegitScript',
      icon: 'check-circle',
      verified: true
    },
    {
      name: 'BBB A+',
      icon: 'star',
      verified: true
    }
  ]

  $: transitionType = animation === 'slide' ? slide : fade
</script>

<div class="w-full">
  {#if variant === 'full'}
    <!-- Full Trust Signals Section -->
    <section class="py-16 bg-gradient-to-br from-forest-green/5 to-mountain-blue/5">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-12" transition:transitionType={{ duration: 600 }}>
          <h2 class="font-primary text-3xl md:text-4xl font-bold text-forest-green mb-4">
            Trusted by Colorado Families
          </h2>
          <p class="text-lg text-mountain-blue max-w-2xl mx-auto">
            Our commitment to excellence has earned us recognition as one of Colorado's premier recovery services
          </p>
        </div>

        <!-- Trust Metrics Grid -->
        {#if showRatings}
          <div
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12"
            transition:transitionType={{ duration: 800, delay: 200 }}
          >
            {#each trustItems as item, i}
              <PremiumCard
                variant="minimal"
                glow={!!item.verified}
                class="text-center p-6 hover:scale-105 transition-all duration-300"
              >
                <div class="mb-3 flex justify-center">
                  <Icon name={item.icon} size={48} color="var(--color-primary-main)" />
                </div>
                {#if item.value}
                  <div class="text-2xl font-bold text-primary-main mb-2">{item.value}</div>
                {/if}
                <h3 class="font-semibold text-primary-main mb-2">{item.title}</h3>
                <p class="text-sm text-secondary-main">{item.description}</p>
                {#if item.verified}
                  <div class="mt-3 flex items-center justify-center text-xs text-status-success">
                    <Icon name="check-circle" size={16} className="mr-1" />
                    Verified
                  </div>
                {/if}
              </PremiumCard>
            {/each}
          </div>
        {/if}

        <!-- Certifications - Greyscale to Color Trust Bar -->
        {#if showCertifications}
          <div class="mb-12" transition:fade={{ duration: 800, delay: 400 }}>
            <h3 class="text-sm font-semibold text-text-muted text-center mb-6 uppercase tracking-wider">Accredited & Certified for Clinical Excellence</h3>
            <div class="flex flex-wrap justify-center items-center gap-8">
              {#each certifications as cert, i}
                <div
                  class="group flex items-center space-x-3 bg-surface-card backdrop-blur-sm rounded-lg px-6 py-4 shadow-sm border border-primary-main/10 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  transition:fade={{ duration: 400, delay: 600 + i * 100 }}
                  style="filter: grayscale(100%); transition: filter 0.3s ease;"
                  on:mouseenter={e => e.currentTarget.style.filter = 'grayscale(0%)'}
                  on:mouseleave={e => e.currentTarget.style.filter = 'grayscale(100%)'}
                >
                  <Icon name={cert.icon} size={24} color="var(--color-status-success)" />
                  <span class="font-medium text-primary-main">{cert.name}</span>
                  {#if cert.verified}
                    <Icon name="check-circle" size={16} color="var(--color-status-success)" />
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Testimonials - Clean, Left-Aligned, No Gradients -->
        {#if showTestimonials}
          <div class="mb-12" transition:fade={{ duration: 800, delay: 600 }}>
            <h3 class="text-xl font-semibold text-primary-main text-center mb-8">What Our Clients Say</h3>
            <div class="grid md:grid-cols-3 gap-6">
              {#each testimonials as testimonial, i}
                <div class="bg-surface-card rounded-xl p-8 border border-primary-main/10 hover:shadow-lg transition-shadow">
                  <!-- Large decorative quote mark -->
                  <div class="relative mb-4">
                    <svg class="w-12 h-12 text-primary-main/10 absolute -left-2 -top-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <!-- Star rating with SVG icons -->
                  <div class="flex items-center mb-4 gap-1">
                    {#each Array(testimonial.rating) as _, i}
                      <Icon name="star-filled" size={16} color="#F4D03F" />
                    {/each}
                    {#if testimonial.verified}
                      <span class="text-xs text-status-success bg-status-success/10 px-2 py-1 rounded-full ml-2 flex items-center">
                        <Icon name="check-circle" size={12} className="mr-1" />
                        Verified Client
                      </span>
                    {/if}
                  </div>
                  <!-- Left-aligned quote -->
                  <blockquote class="text-text-body mb-6 text-left leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div class="text-sm text-left">
                    <p class="font-semibold text-primary-main">{testimonial.author}</p>
                    <p class="text-text-muted">{testimonial.location}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- CTA Section -->
        <div class="text-center" transition:fade={{ duration: 800, delay: 1000 }}>
          <p class="text-mountain-blue mb-6">Join thousands of Colorado families who have found hope and healing</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <PremiumButton variant="primary" size="lg">Get Started Today</PremiumButton>
            <PremiumButton variant="secondary" size="lg">Verify Insurance</PremiumButton>
          </div>
        </div>
      </div>
    </section>
  {:else}
    <!-- Compact Trust Signals -->
    <div class="bg-surface-card/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-main/10">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-primary-main">Trusted Care</h3>
        <div class="flex items-center space-x-2">
          <Icon name="star-filled" size={16} color="#F4D03F" />
          <span class="text-primary-main font-semibold">4.9/5</span>
          <span class="text-xs text-text-muted">(500+ reviews)</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        {#each trustItems.slice(0, 4) as item, i}
          <div class="flex items-center space-x-3" transition:fade={{ duration: 300, delay: i * 100 }}>
            <Icon name={item.icon} size={24} color="var(--color-primary-main)" />
            <div>
              <p class="text-sm font-medium text-primary-main">{item.title}</p>
              {#if item.value}
                <p class="text-xs text-text-muted">{item.value}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
