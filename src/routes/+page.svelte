<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import PremiumHero from '$lib/components/premium/PremiumHero.svelte'
  import PremiumButton from '$lib/components/premium/PremiumButton.svelte'
  import PremiumCard from '$lib/components/premium/PremiumCard.svelte'
  import PremiumChat from '$lib/components/premium/PremiumChat.svelte'
  import PremiumTrustSignals from '$lib/components/premium/PremiumTrustSignals.svelte'
  import PremiumLeadCapture from '$lib/components/premium/PremiumLeadCapture.svelte'
  import PremiumDashboard from '$lib/components/premium/PremiumDashboard.svelte'
  import { goto } from '$app/navigation'
  
  // Premium brand messaging
  const heroTitle = "Your Colorado Recovery Concierge"
  const heroSubtitle = "Premium, personalized support for your recovery journey. Get approved for housing scholarships in minutes, access 24/7 concierge support, and join thousands who've found lasting recovery."
  
  // Trust indicators
  const trustIndicators = [
    { icon: '🏥', text: 'HIPAA Compliant' },
    { icon: '🛡️', text: '42 CFR Part 2' },
    { icon: '❤️', text: 'Nonprofit' },
    { icon: '⚡', text: 'Same-Day Approval' }
  ]
  
  // State for interactive components
  let showDashboardDemo = false;
  let chatMessages: { message: string; timestamp?: string }[] = [];
  
  onMount(() => {
    // Initialize any client-side functionality
  });
  
  // Action handlers
  function handleGetAid() {
    goto('/get-aid')
  }
  
  function handleGiveSupport() {
    goto('/give-support')
  }
  
  function handleAssessment() {
    // Scroll to assessment form
    document.getElementById('assessment-form')?.scrollIntoView({ behavior: 'smooth' });
  }
  
  function handleChatMessage(event: CustomEvent<{ message: string; timestamp?: string }>) {
    chatMessages = [...chatMessages, event.detail];
  }
</script>

<svelte:head>
  <title>MetzlerCares - Colorado Recovery Concierge | Premium Recovery Support</title>
  <meta
    name="description"
    content="Colorado's premium Recovery Concierge service. Get personalized treatment recommendations, 24/7 support, housing scholarships, and insurance verification. Trusted by thousands for lasting recovery."
  />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/" />
  <meta property="og:title" content="MetzlerCares - Colorado Recovery Concierge" />
  <meta
    property="og:description"
    content="Colorado's premium Recovery Concierge service. Get personalized treatment recommendations, 24/7 support, housing scholarships, and insurance verification."
  />
  <meta property="og:image" content="https://metzlercares.com/og-image.jpg" />
  <meta property="og:site_name" content="MetzlerCares" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://metzlercares.com/" />
  <meta name="twitter:title" content="MetzlerCares - Colorado Recovery Concierge" />
  <meta
    name="twitter:description"
    content="Colorado's premium Recovery Concierge service. Get personalized treatment recommendations, 24/7 support, housing scholarships, and insurance verification."
  />
  <meta name="twitter:image" content="https://metzlercares.com/twitter-image.jpg" />

  <!-- Additional SEO -->
  <meta
    name="keywords"
    content="recovery concierge, addiction treatment, recovery housing, sober living, housing scholarships, Colorado recovery, addiction recovery, personalized treatment, 24/7 support, recovery dashboard"
  />
  <meta name="author" content="MetzlerCares" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://metzlercares.com/" />

  <!-- Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MetzlerCares",
      "url": "https://metzlercares.com",
      "logo": "https://metzlercares.com/logo.svg",
      "description": "Colorado's premier Recovery Concierge service providing personalized addiction treatment support, housing scholarships, and 24/7 recovery assistance",
      "foundingDate": "2024",
      "areaServed": {
        "@type": "State",
        "name": "Colorado",
        "addressRegion": "CO",
        "addressCountry": "US"
      },
      "serviceType": "Recovery Concierge Services",
      "offers": [
        {
          "@type": "Offer",
          "name": "Recovery Assessment",
          "description": "Free personalized addiction treatment assessment",
          "price": "0",
          "priceCurrency": "USD",
          "areaServed": "Colorado"
        },
        {
          "@type": "Offer",
          "name": "Housing Scholarships",
          "description": "Fast approval housing aid for individuals in recovery",
          "areaServed": "Colorado"
        },
        {
          "@type": "Offer",
          "name": "24/7 Recovery Concierge",
          "description": "Round-the-clock recovery support and guidance",
          "areaServed": "Colorado"
        }
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "url": "https://metzlercares.com/contact",
        "telephone": "+1-303-555-HELP",
        "email": "help@metzlercares.com",
        "availableLanguage": ["English"],
        "hoursAvailable": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "00:00",
            "closes": "23:59"
          }
        ]
      },
      "sameAs": [
        "https://www.linkedin.com/company/metzler-cares",
        "https://www.facebook.com/metzlercares",
        "https://twitter.com/metzlercares"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "500"
      }
    }
  </script>
</svelte:head>

<!-- Premium Hero Section -->
<PremiumHero
  title={heroTitle}
  subtitle={heroSubtitle}
  backgroundGradient="linear-gradient(135deg, var(--color-forest-green) 0%, var(--color-mountain-blue) 100%)"
  overlayOpacity={0.3}
  textAlign="center"
  minHeight="100vh"
  showTrustIndicators={true}
  showScrollIndicator={true}
  particles={true}
  animation="fade-in"
  animationDelay={0}
>
  <div slot="actions" class="hero-actions">
    <PremiumButton
      variant="primary"
      size="lg"
      on:click={handleGetAid}
      icon="<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z' fill='currentColor'/></svg>"
      iconPosition="left"
    >
      Get Financial Aid
    </PremiumButton>
    
    <PremiumButton
      variant="accent"
      size="lg"
      on:click={handleAssessment}
      icon="<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' fill='currentColor'/></svg>"
      iconPosition="left"
    >
      Free Assessment
    </PremiumButton>
    
    <PremiumButton
      variant="secondary"
      size="lg"
      on:click={handleGiveSupport}
      icon="<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='currentColor'/></svg>"
      iconPosition="left"
    >
      Give Support
    </PremiumButton>
  </div>
</PremiumHero>

<!-- Value Proposition Section -->
<section class="value-section py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-5xl font-primary text-forest-green mb-6">
        Why Choose MetzlerCares?
      </h2>
      <p class="text-xl text-charcoal opacity-80 max-w-3xl mx-auto">
        We're Colorado's recovery concierge, providing premium support with the warmth and accessibility your recovery journey deserves.
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      <PremiumCard
        variant="highlighted"
        elevation="lg"
        padding="lg"
        hover={true}
        animated={true}
      >
        <div class="text-center">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="text-2xl font-primary text-forest-green mb-4">Same-Day Approval</h3>
          <p class="text-charcoal opacity-80">
            Get approved for housing scholarships in minutes, not days. Our streamlined process respects your urgency.
          </p>
        </div>
      </PremiumCard>
      
      <PremiumCard
        variant="default"
        elevation="lg"
        padding="lg"
        hover={true}
        animated={true}
      >
        <div class="text-center">
          <div class="text-4xl mb-4">🤝</div>
          <h3 class="text-2xl font-primary text-forest-green mb-4">Dignified Process</h3>
          <p class="text-charcoal opacity-80">
            Experience a judgment-free, respectful application process designed with your dignity in mind.
          </p>
        </div>
      </PremiumCard>
      
      <PremiumCard
        variant="highlighted"
        elevation="lg"
        padding="lg"
        hover={true}
        animated={true}
      >
        <div class="text-center">
          <div class="text-4xl mb-4">🏔️</div>
          <h3 class="text-2xl font-primary text-forest-green mb-4">Colorado Expertise</h3>
          <p class="text-charcoal opacity-80">
            Deep local knowledge of Colorado's recovery landscape and housing options across the state.
          </p>
        </div>
      </PremiumCard>
    </div>
  </div>
</section>

<!-- Trust & Compliance Section -->
<section class="trust-section py-20 md:py-32 bg-warm-gray">
  <div class="max-w-7xl mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-5xl font-primary text-forest-green mb-6">
        Your Privacy & Security Matter
      </h2>
      <p class="text-xl text-charcoal opacity-80 max-w-3xl mx-auto">
        We maintain the highest standards of confidentiality and compliance to protect your recovery journey.
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each trustIndicators as indicator}
        <PremiumCard
          variant="minimal"
          elevation="sm"
          padding="md"
          hover={true}
          animated={true}
        >
          <div class="text-center">
            <div class="text-3xl mb-3">{indicator.icon}</div>
            <p class="text-charcoal font-medium">{indicator.text}</p>
          </div>
        </PremiumCard>
      {/each}
    </div>
  </div>
</section>

<!-- Comprehensive Trust Signals Section -->
<PremiumTrustSignals 
  variant="full" 
  showRatings={true}
  showCertifications={true}
  showTestimonials={true}
  animation="fade"
/>

<!-- Free Assessment Lead Capture Section -->
<section id="assessment-form" class="assessment-section py-20 md:py-32 bg-gradient-to-br from-forest-green/5 to-mountain-blue/5">
  <div class="max-w-4xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-5xl font-primary text-forest-green mb-6">
        Get Your Free Recovery Assessment
      </h2>
      <p class="text-xl text-charcoal opacity-80 max-w-2xl mx-auto">
        Take our 2-minute assessment to receive a personalized treatment recommendation and learn about your housing options.
      </p>
    </div>
    
    <PremiumLeadCapture
      variant="assessment"
      multiStep={true}
      showProgress={true}
      on:submit={(e) => console.log('Assessment submitted:', e.detail)}
    />
  </div>
</section>

<!-- Personalized Dashboard Demo Section -->
<section class="dashboard-section py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-5xl font-primary text-forest-green mb-6">
        Your Personal Recovery Dashboard
      </h2>
      <p class="text-xl text-charcoal opacity-80 max-w-2xl mx-auto">
        Experience our premium Recovery Concierge platform with personalized progress tracking, appointment management, and 24/7 support.
      </p>
    </div>
    
    <div class="flex justify-center mb-8">
      <PremiumButton
        variant="secondary"
        on:click={() => showDashboardDemo = !showDashboardDemo}
      >
        {showDashboardDemo ? 'Hide Demo' : 'View Demo'}
      </PremiumButton>
    </div>
    
    {#if showDashboardDemo}
      <div transition:fade={{ duration: 600 }}>
        <PremiumDashboard
          userName="Sarah"
          userProgress={{ daysSober: 45, totalDays: 90, milestones: 3, nextMilestone: 60 }}
        />
      </div>
    {/if}
  </div>
</section>

<!-- Insurance Verification Section -->
<section class="insurance-section py-20 md:py-32 bg-warm-gray">
  <div class="max-w-4xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-5xl font-primary text-forest-green mb-6">
        Verify Your Insurance in 30 Seconds
      </h2>
      <p class="text-xl text-charcoal opacity-80 max-w-2xl mx-auto">
        Check your coverage instantly and learn about your treatment options. Most major insurance plans accepted.
      </p>
    </div>
    
    <PremiumLeadCapture
      variant="insurance"
      multiStep={false}
      showProgress={false}
      on:submit={(e) => console.log('Insurance verification submitted:', e.detail)}
    />
  </div>
</section>

<!-- Recovery Concierge Chat Integration -->
<PremiumChat
  isOpen={false}
  messages={chatMessages}
  on:message={handleChatMessage}
/>

<style>
  /* Custom animations and transitions */
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .value-section,
  .trust-section,
  .assessment-section,
  .dashboard-section,
  .insurance-section {
    scroll-margin-top: 80px;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .hero-actions {
      flex-direction: column;
      align-items: center;
    }
    
    .hero-actions :global(.premium-btn) {
      width: 100%;
      max-width: 300px;
    }
  }
  
  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .value-section,
    .trust-section,
    .dashboard-section {
      background-color: var(--color-charcoal);
    }
    
    .trust-section,
    .insurance-section {
      background-color: var(--color-charcoal);
      color: var(--color-cream);
    }
    
    .assessment-section {
      background: linear-gradient(135deg, var(--color-charcoal) 0%, rgba(45, 80, 22, 0.1) 100%);
    }
  }
</style>
