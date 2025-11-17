<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title>Metzler Foundations - Colorado Recovery Housing Aid | Get Approved in Minutes</title>
  <meta
    name="description"
    content="Fast, dignified housing scholarships for individuals in recovery from addiction. Colorado's trusted recovery housing solution - get approved in minutes, move in today."
  />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlerfoundations.org/" />
  <meta property="og:title" content="Metzler Foundations - Colorado Recovery Housing Aid" />
  <meta
    property="og:description"
    content="Fast, dignified housing scholarships for individuals in recovery from addiction. Colorado's trusted recovery housing solution - get approved in minutes, move in today."
  />
  <meta property="og:image" content="https://metzlerfoundations.org/og-image.jpg" />
  <meta property="og:site_name" content="Metzler Foundations" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://metzlerfoundations.org/" />
  <meta name="twitter:title" content="Metzler Foundations - Colorado Recovery Housing Aid" />
  <meta
    name="twitter:description"
    content="Fast, dignified housing scholarships for individuals in recovery from addiction. Colorado's trusted recovery housing solution - get approved in minutes, move in today."
  />
  <meta name="twitter:image" content="https://metzlerfoundations.org/twitter-image.jpg" />

  <!-- Additional SEO -->
  <meta
    name="keywords"
    content="recovery housing, sober living, housing scholarships, Colorado recovery, addiction recovery housing, recovery aid"
  />
  <meta name="author" content="Metzler Foundations" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

  <!-- Canonical URL -->
  <link rel="canonical" href="https://metzlerfoundations.org/" />

  <!-- Structured Data -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Metzler Foundations",
      "url": "https://metzlerfoundations.org",
      "logo": "https://metzlerfoundations.org/logo.svg",
      "description": "Providing dignified housing support for individuals in recovery from addiction through fast approval housing scholarships",
      "foundingDate": "2024",
      "areaServed": {
        "@type": "State",
        "name": "Colorado",
        "addressRegion": "CO",
        "addressCountry": "US"
      },
      "serviceType": "Recovery Housing Support",
      "offers": {
        "@type": "Offer",
        "name": "Housing Scholarships for Recovery",
        "description": "Immediate housing aid for individuals in recovery from addiction",
        "areaServed": "Colorado"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "url": "https://metzlerfoundations.org/contact"
      },
      "sameAs": ["https://www.linkedin.com/company/metzler-foundations"]
    }
  </script>
</svelte:head>

<!-- Full-screen hero section -->
<div class="hero-section bg-gradient-to-br from-cream via-cream to-olive bg-opacity-95">
  <!-- Logo in top-left -->
  <div class="absolute top-8 left-8 z-10">
    <MetzlerBridgeLogo className="w-12 h-12 text-navy" />
  </div>

  <!-- Main content centered -->
  <div class="max-w-4xl mx-auto px-4 text-center">
    <!-- Primary headline in Lora (storytelling font) -->
    <h1 class="text-5xl md:text-7xl font-serif font-medium text-navy mb-16 leading-tight">
      A safe bed is the first step.
    </h1>

    <!-- Two triage buttons side-by-side -->
    <div class="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-lg mx-auto">
      <!-- Get Financial Aid button -->
      <button
        onclick={() => goto('/get-aid')}
        class="btn-primary text-lg px-8 py-4 min-w-[200px] hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
      >
        Get Financial Aid
      </button>

      <!-- Give Support button -->
      <button
        onclick={() => goto('/give-support')}
        class="btn-primary text-lg px-8 py-4 min-w-[200px] hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
      >
        Give Support
      </button>
    </div>

    <!-- Subtle trust indicator -->
    <div class="mt-12 text-sm text-navy text-opacity-70">
      <p>Nonprofit • HIPAA Compliant • 42 CFR Part 2 Compliant</p>
    </div>
  </div>

  <!-- Professional background image placeholder -->
  <!-- Replace with actual high-quality image in production -->
  <div class="absolute inset-0 opacity-5">
    <div class="w-full h-full bg-gradient-to-br from-navy via-olive to-gold"></div>
  </div>
</div>

<style>
  /* Ensure full-screen coverage */
  .hero-section {
    min-height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Custom button hover effects for psychological weight */
  .btn-primary:hover {
    box-shadow: 0 10px 25px rgba(25, 42, 86, 0.3);
  }
</style>
