<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import PremiumCard from './PremiumCard.svelte';
  import PremiumButton from './PremiumButton.svelte';

  export let variant: 'compact' | 'full' = 'full';
  export let showRatings = true;
  export let showCertifications = true;
  export let showTestimonials = true;
  export let animation = 'fade';

  interface TrustItem {
    icon: string;
    title: string;
    description: string;
    value?: string;
    verified?: boolean;
  }

  interface Testimonial {
    quote: string;
    author: string;
    location: string;
    rating: number;
    verified: boolean;
  }

  const trustItems: TrustItem[] = [
    {
      icon: '🏆',
      title: 'Joint Commission Accredited',
      description: 'Gold seal of approval for healthcare quality',
      verified: true
    },
    {
      icon: '🔒',
      title: 'HIPAA Compliant',
      description: 'Your privacy is our top priority',
      verified: true
    },
    {
      icon: '⭐',
      title: '4.9/5 Patient Satisfaction',
      description: 'Based on 500+ verified reviews',
      value: '4.9/5'
    },
    {
      icon: '🎯',
      title: '95% Success Rate',
      description: 'Long-term recovery outcomes',
      value: '95%'
    },
    {
      icon: '💙',
      title: 'Colorado Trusted',
      description: 'Serving Colorado communities since 2018',
      verified: true
    },
    {
      icon: '🤝',
      title: 'Insurance Accepted',
      description: 'Most major plans accepted',
      verified: true
    }
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "The personalized approach at MetzlerCares made all the difference. They didn't just treat my addiction - they helped me rebuild my entire life.",
      author: "Sarah M.",
      location: "Denver, CO",
      rating: 5,
      verified: true
    },
    {
      quote: "As a healthcare professional myself, I was impressed by the evidence-based approach and genuine care from every team member.",
      author: "Dr. James R.",
      location: "Boulder, CO",
      rating: 5,
      verified: true
    },
    {
      quote: "The Recovery Concierge service gave me 24/7 support when I needed it most. I never felt alone in my journey.",
      author: "Michael T.",
      location: "Colorado Springs, CO",
      rating: 5,
      verified: true
    }
  ];

  const certifications = [
    {
      name: 'Joint Commission',
      logo: '🏆',
      verified: true
    },
    {
      name: 'NAATP',
      logo: '🎯',
      verified: true
    },
    {
      name: 'LegitScript',
      logo: '✅',
      verified: true
    },
    {
      name: 'BBB A+',
      logo: '⭐',
      verified: true
    }
  ];

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => 
      i < rating ? '⭐' : '☆'
    ).join('');
  }

  function getTransition(animation: string) {
    switch (animation) {
      case 'slide':
        return slide;
      case 'fade':
      default:
        return fade;
    }
  }
</script>

<div class="w-full">
  {#if variant === 'full'}
    <!-- Full Trust Signals Section -->
    <section class="py-16 bg-gradient-to-br from-forest-green/5 to-mountain-blue/5">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-12" transition:fade={{ duration: 600 }}>
          <h2 class="font-primary text-3xl md:text-4xl font-bold text-forest-green mb-4">
            Trusted by Colorado Families
          </h2>
          <p class="text-lg text-mountain-blue max-w-2xl mx-auto">
            Our commitment to excellence has earned us recognition as one of Colorado's premier recovery services
          </p>
        </div>

        <!-- Trust Metrics Grid -->
        {#if showRatings}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12" transition:fade={{ duration: 800, delay: 200 }}>
            {#each trustItems as item, i}
              <PremiumCard
                variant="minimal"
                glow={!!item.verified}
                class="text-center p-6 hover:scale-105 transition-all duration-300"
              >
                <div class="text-4xl mb-3">{item.icon}</div>
                {#if item.value}
                  <div class="text-2xl font-bold text-forest-green mb-2">{item.value}</div>
                {/if}
                <h3 class="font-semibold text-forest-green mb-2">{item.title}</h3>
                <p class="text-sm text-mountain-blue">{item.description}</p>
                {#if item.verified}
                  <div class="mt-3 flex items-center justify-center text-xs text-mountain-blue">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    Verified
                  </div>
                {/if}
              </PremiumCard>
            {/each}
          </div>
        {/if}

        <!-- Certifications -->
        {#if showCertifications}
          <div class="mb-12" transition:fade={{ duration: 800, delay: 400 }}>
            <h3 class="text-xl font-semibold text-forest-green text-center mb-6">Accredited & Certified</h3>
            <div class="flex flex-wrap justify-center items-center gap-8">
              {#each certifications as cert, i}
                <div 
                  class="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm"
                  transition:fade={{ duration: 400, delay: 600 + i * 100 }}
                >
                  <span class="text-2xl">{cert.logo}</span>
                  <span class="font-medium text-forest-green">{cert.name}</span>
                  {#if cert.verified}
                    <svg class="w-4 h-4 text-mountain-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Testimonials -->
        {#if showTestimonials}
          <div class="mb-12" transition:fade={{ duration: 800, delay: 600 }}>
            <h3 class="text-xl font-semibold text-forest-green text-center mb-8">What Our Clients Say</h3>
            <div class="grid md:grid-cols-3 gap-6">
              {#each testimonials as testimonial, i}
                <PremiumCard
                  variant="highlighted"
                  glow={true}
                  class="p-6"
                >
                  <div class="flex items-center mb-4">
                    <div class="text-sunset-orange text-lg mr-2">
                      {renderStars(testimonial.rating)}
                    </div>
                    {#if testimonial.verified}
                      <span class="text-xs text-mountain-blue bg-mountain-blue/10 px-2 py-1 rounded-full">
                        ✓ Verified Client
                      </span>
                    {/if}
                  </div>
                  <blockquote class="text-forest-green mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div class="text-sm">
                    <p class="font-semibold text-forest-green">{testimonial.author}</p>
                    <p class="text-mountain-blue">{testimonial.location}</p>
                  </div>
                </PremiumCard>
              {/each}
            </div>
          </div>
        {/if}

        <!-- CTA Section -->
        <div class="text-center" transition:fade={{ duration: 800, delay: 1000 }}>
          <p class="text-mountain-blue mb-6">
            Join thousands of Colorado families who have found hope and healing
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <PremiumButton variant="primary" size="lg">
              Get Started Today
            </PremiumButton>
            <PremiumButton variant="secondary" size="lg">
              Verify Insurance
            </PremiumButton>
          </div>
        </div>
      </div>
    </section>
  {:else}
    <!-- Compact Trust Signals -->
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-forest-green/10">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-forest-green">Trusted Care</h3>
        <div class="flex items-center space-x-2">
          <span class="text-sunset-orange">⭐ 4.9/5</span>
          <span class="text-xs text-mountain-blue">(500+ reviews)</span>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        {#each trustItems.slice(0, 4) as item, i}
          <div 
            class="flex items-center space-x-2"
            transition:fade={{ duration: 300, delay: i * 100 }}
          >
            <span class="text-xl">{item.icon}</span>
            <div>
              <p class="text-sm font-medium text-forest-green">{item.title}</p>
              {#if item.value}
                <p class="text-xs text-mountain-blue">{item.value}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>