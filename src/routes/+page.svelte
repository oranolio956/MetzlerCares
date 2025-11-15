<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>Metzler Foundations - Safe Housing is the Foundation for Recovery</title>
  <meta name="description" content="Providing dignified housing support for individuals in recovery. Professional, confidential assistance to help you find stability and rebuild your life." />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Metzler Foundations",
      "url": "https://metzlerfoundations.org/",
      "logo": "https://metzlerfoundations.org/favicon.svg",
      "sameAs": [],
      "description": "Providing dignified housing support for individuals in recovery.",
      "foundingDate": "2024",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-METZLER",
        "contactType": "customer service"
      }
    }
  </script>
</svelte:head>

<!-- Clean, professional hero section -->
<section class="min-h-screen bg-soft-white flex items-center">
  <div class="container mx-auto px-6 lg:px-8">
    <div class="grid lg:grid-cols-12 gap-16 items-center">
      <!-- Left column - 7/12 width -->
      <div class="lg:col-span-7 space-y-8">
        <!-- Professional headline -->
        <h1 class="text-display-medium font-display text-deep-navy-900 leading-tight">
          Safe housing is the foundation for recovery
        </h1>
        
        <!-- Clear subheadline -->
        <p class="text-body-large text-deep-navy-700 max-w-2xl leading-relaxed">
          We provide dignified housing support for individuals in recovery, 
          because everyone deserves a safe place to rebuild their life.
        </p>
        
        <!-- Professional CTAs -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            on:click={() => goto('/get-aid')}
            class="btn-primary text-lg"
          >
            Get Support Now
          </button>
          
          <button
            on:click={() => goto('/give-support')}
            class="btn-secondary-outline text-lg"
          >
            Help Others
          </button>
        </div>

        <div class="pt-8 border-t border-sage-200">
          <p class="text-sm text-deep-navy-600">
            <span class="font-semibold">42 CFR Part 2 Compliant</span> • 
            <span class="font-semibold">Nonprofit Organization</span>
          </p>
        </div>
      </div>
      
      <!-- Right column - 5/12 width -->
      <div class="lg:col-span-5">
        <div class="bg-sage-50 p-8 rounded-lg">
          <h3 class="text-xl font-semibold text-deep-navy-900 mb-4">Eligibility Requirements</h3>
          <ul class="space-y-3 text-deep-navy-700">
            <li class="flex items-start gap-3">
              <span class="text-sage-600 mt-1">•</span>
              <span>Currently in recovery program</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-sage-600 mt-1">•</span>
              <span>Demonstrated financial need</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-sage-600 mt-1">•</span>
              <span>Commitment to sobriety</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-sage-600 mt-1">•</span>
              <span>Referral from treatment provider</span>
            </li>
          </ul>
          
          <div class="mt-6 pt-6 border-t border-sage-200">
            <p class="text-sm text-deep-navy-600">
              Questions? Contact us at <a href="mailto:help@metzlerfoundations.org" class="text-deep-navy-700 underline">help@metzlerfoundations.org</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Professional approach section -->
<section class="py-20 bg-soft-white">
  <div class="container mx-auto px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-12">
        <h2 class="text-headline-large font-display text-deep-navy-900 mb-6">
          A respectful approach to housing support
        </h2>
        <p class="text-body-large text-deep-navy-700 leading-relaxed">
          We believe that safe, stable housing is fundamental to recovery. Our process is designed 
          to be straightforward, confidential, and focused on your needs.
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-12 items-start">
        <div class="space-y-6">
          <div class="border-l-4 border-sage-400 pl-6">
            <h3 class="text-xl font-semibold text-deep-navy-900 mb-2">Streamlined Process</h3>
            <p class="text-deep-navy-700">
              Our application takes minutes to complete. We focus on essential information 
              and maintain your privacy throughout.
            </p>
          </div>
          
          <div class="border-l-4 border-sage-400 pl-6">
            <h3 class="text-xl font-semibold text-deep-navy-900 mb-2">Clear Communication</h3>
            <p class="text-deep-navy-700">
              You'll receive timely updates about your application status and next steps. 
              No confusion, no delays.
            </p>
          </div>
          
          <div class="border-l-4 border-sage-400 pl-6">
            <h3 class="text-xl font-semibold text-deep-navy-900 mb-2">Continued Partnership</h3>
            <p class="text-deep-navy-700">
              Our support doesn't end with housing placement. We remain available 
              throughout your recovery journey.
            </p>
          </div>
        </div>
        
        <div class="bg-sage-50 p-8 rounded-lg">
          <h3 class="text-xl font-semibold text-deep-navy-900 mb-4">What to Expect</h3>
          <ul class="space-y-3 text-deep-navy-700">
            <li class="flex items-start gap-3">
              <span class="text-sage-600 mt-1">•</span>
              <span>Complete application in under 15 minutes</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-sage-600 mt-1">•</span>
              <span>Response within 2-3 business days</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-sage-600 mt-1">•</span>
              <span>Confidential review process</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-sage-600 mt-1">•</span>
              <span>Ongoing support and check-ins</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>