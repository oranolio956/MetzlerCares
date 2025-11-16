<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let donorboxLoaded = false;

  onMount(() => {
    // Load Donorbox script
    const script = document.createElement('script');
    script.src = 'https://donorbox.org/widget.js';
    script.setAttribute('paypalExpress', 'false');
    script.async = true;
    script.defer = true;
    script.onload = () => {
      donorboxLoaded = true;
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://donorbox.org/widget.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  });
</script>

<svelte:head>
  <title>Donate - Metzler Foundations</title>
  <meta name="description" content="Your donation provides immediate housing support for individuals in recovery. Make a lasting impact today." />
  <meta property="og:title" content="Donate to Metzler Foundations" />
  <meta property="og:description" content="Your donation provides immediate housing support for individuals in recovery." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Donate to Metzler Foundations" />
  <meta name="twitter:description" content="Your donation provides immediate housing support for individuals in recovery." />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "DonateAction",
      "name": "Donate to Metzler Foundations",
      "agent": {
        "@type": "Organization",
        "name": "Metzler Foundations"
      },
      "object": {
        "@type": "Organization",
        "name": "Metzler Foundations"
      },
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://metzlerfoundations.org/donate"
      }
    }
  </script>
</svelte:head>

<div class="min-h-screen bg-soft-white">
  <!-- Header -->
  <header class="bg-soft-white border-b border-deep-navy-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo class="w-8 h-8 text-deep-navy-700" />
          <span class="text-xl font-serif font-medium text-deep-navy-900">Metzler Foundations</span>
        </button>

        <nav class="flex items-center space-x-4">
          <a href="/give-support" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">
            Our Work
          </a>
          <a href="/impact" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">
            Our Impact
          </a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-serif font-medium text-deep-navy-900 mb-4">
          Make a Lasting Impact
        </h1>
        <p class="text-xl text-deep-navy-700 mb-8">
          Your donation provides immediate housing support for individuals in recovery,
          creating stability that enables lasting change.
        </p>

        <!-- Trust indicators -->
        <div class="flex flex-wrap justify-center items-center gap-6 text-sm text-deep-navy-700 mb-8">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-sage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>100% goes to housing support</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-sage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure, encrypted donation</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-sage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Instant processing</span>
          </div>
        </div>
      </div>

      <!-- Donorbox Form Container -->
      <div class="bg-soft-white rounded-lg border border-sage-200 overflow-hidden">
        {#if donorboxLoaded}
          <!-- Donorbox Widget - Replace with actual widget code -->
          <div class="p-8">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-serif font-medium text-deep-navy-900 mb-4">Choose Your Impact Level</h2>
              <p class="text-deep-navy-700">Each contribution provides immediate housing support</p>
            </div>

            <!-- Donation Tiers (High to Low Anchoring) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div class="border border-sage-300 rounded-lg p-4 text-center cursor-pointer">
                <div class="text-2xl font-bold text-deep-navy-900 mb-1">$500</div>
                <div class="text-sm text-deep-navy-700 mb-2">Full-month scholarship</div>
                <div class="text-xs text-deep-navy-700">Provides housing for one resident</div>
              </div>

              <div class="border border-sage-300 rounded-lg p-4 text-center cursor-pointer">
                <div class="text-2xl font-bold text-deep-navy-900 mb-1">$300</div>
                <div class="text-sm text-deep-navy-700 mb-2">One-week scholarship</div>
                <div class="text-xs text-deep-navy-700">Funds safe, sober bed</div>
              </div>

              <div class="border border-sage-200 rounded-lg p-4 text-center cursor-pointer">
                <div class="text-2xl font-bold text-deep-navy-900 mb-1">$75</div>
                <div class="text-sm text-deep-navy-700 mb-2">Welcome Home Kit</div>
                <div class="text-xs text-deep-navy-700">Bedding and toiletries</div>
              </div>

              <div class="border border-sage-200 rounded-lg p-4 text-center cursor-pointer">
                <div class="text-2xl font-bold text-deep-navy-900 mb-1">$50</div>
                <div class="text-sm text-deep-navy-700 mb-2">Weekly bus pass</div>
                <div class="text-xs text-deep-navy-700">Job interviews & meetings</div>
              </div>
            </div>

            <!-- Frequency Selection with Monthly Emphasis -->
            <div class="mb-8">
              <div class="flex justify-center space-x-4 mb-4">
                <button class="bg-sage-600 text-soft-white px-6 py-2 rounded-md font-medium">
                  Monthly <span class="text-xs bg-sage-100 text-deep-navy-900 px-2 py-1 rounded ml-2 font-semibold">RECOMMENDED</span>
                </button>
                <button class="bg-soft-white border border-sage-200 text-deep-navy-900 px-6 py-2 rounded-md font-medium">
                  One-time
                </button>
              </div>
              <p class="text-center text-sm text-deep-navy-700">
                Monthly giving provides sustainable support and enables long-term planning
              </p>
            </div>

            <!-- Custom Amount Input -->
            <div class="mb-8">
              <label for="custom-amount" class="block text-sm font-medium text-deep-navy-900 mb-2">
                Or enter a custom amount:
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-deep-navy-900 font-medium">$</span>
                <input
                  type="number"
                  id="custom-amount"
                  placeholder="Enter amount"
                  class="w-full pl-8 pr-4 py-3 border border-sage-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-600 focus:border-sage-600"
                />
              </div>
            </div>

            <!-- Progress Indicator for Multi-Step -->
            <div class="mb-8">
              <div class="flex items-center justify-center space-x-2 mb-4">
                <div class="w-3 h-3 bg-sage-700 rounded-full"></div>
                <div class="w-8 h-0.5 bg-deep-navy-900 bg-opacity-20"></div>
                <div class="w-3 h-3 bg-deep-navy-900 bg-opacity-20 rounded-full"></div>
                <div class="w-8 h-0.5 bg-deep-navy-900 bg-opacity-20"></div>
                <div class="w-3 h-3 bg-deep-navy-900 bg-opacity-20 rounded-full"></div>
              </div>
              <div class="flex justify-center space-x-12 text-xs text-deep-navy-700">
                <span>Amount</span>
                <span>Payment</span>
                <span>Complete</span>
              </div>
            </div>

            <!-- Payment Methods Highlight -->
            <div class="bg-deep-navy-900 bg-opacity-5 rounded-lg p-6 mb-8">
              <h3 class="text-lg font-medium text-deep-navy-900 mb-4 text-center">Secure Payment Options</h3>
              <div class="flex justify-center items-center space-x-6">
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-deep-navy-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span class="text-sm text-deep-navy-900">Apple Pay</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-deep-navy-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.004 0C8.825 0 5.918.995 3.832 2.795S.175 7.038.175 10.5c0 3.462 2.562 6.705 5.657 8.705S12.004 22 12.004 22s4.08-1.295 6.172-3.295 3.649-5.243 3.649-8.705c0-3.462-1.297-6.705-3.649-8.705S15.183 0 12.004 0zm5.893 14.405c-.763.244-1.543.366-2.334.366-.791 0-1.571-.122-2.334-.366-.763-.244-1.448-.59-2.05-1.032-.602-.442-1.088-.97-1.455-1.573-.367-.603-.552-1.26-.552-1.965 0-.705.185-1.362.552-1.965.367-.603.853-1.131 1.455-1.573.602-.442 1.287-.788 2.05-1.032.763-.244 1.543-.366 2.334-.366.791 0 1.571.122 2.334.366.763.244 1.448.59 2.05 1.032.602.442 1.088.97 1.455 1.573.367.603.552 1.26.552 1.965 0 .705-.185 1.362-.552 1.965-.367.603-.853 1.131-1.455 1.573-.602.442-1.287.788-2.05 1.032z"/>
                  </svg>
                  <span class="text-sm text-deep-navy-900">Google Pay</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6 text-deep-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span class="text-sm text-deep-navy-900">Credit Card</span>
                </div>
              </div>
            </div>

            <!-- Donorbox Widget Placeholder -->
          <div class="text-center">
            <iframe
              src="https://donorbox.org/embed/metzler-foundations-donation?default_interval=m&amount=300"
              name="donorbox"
              title="Donation Form"
              frameborder="0"
              height="900px"
              width="100%"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
              style="max-width: 500px; min-width: 310px; max-height:none!important"
            ></iframe>
          </div>
          </div>
        {:else}
          <!-- Loading State -->
          <div class="flex justify-center items-center py-16" role="status" aria-live="polite">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-navy-900"></div>
            <span class="ml-3 text-deep-navy-900">Loading donation form...</span>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-sm text-deep-navy-700">
        <p>Metzler Foundations is a 501(c)(3) nonprofit. All donations are tax-deductible.</p>
        <p class="mt-2">Questions? Contact us at <a href="mailto:support@metzlerfoundations.org" class="text-sage-700 hover:text-deep-navy-900">support@metzlerfoundations.org</a></p>
      </div>
    </div>
  </main>
</div>

