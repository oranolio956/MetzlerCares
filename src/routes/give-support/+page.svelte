<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { goto } from '$app/navigation';
  import type { Partner } from '$lib/types';

  export let data;

  let partners: Partner[] = data.partners || [];
  let loading = false; // Data is already loaded server-side
</script>

<svelte:head>
  <title>Give Support - Metzler Foundations</title>
  <meta name="description" content="Your donation provides immediate housing support for individuals in recovery. Join our mission of dignity through speed." />
</svelte:head>

<!-- Global header is provided by layout -->

<!-- Main Content -->
<main class="bg-soft-white">
  <!-- Hero Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-soft-white">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-display-medium font-display text-deep-navy-900 mb-6">
        Dignity Through Speed
      </h1>
      <p class="text-xl text-deep-navy-700 mb-8">
        Your donation provides immediate housing support for individuals in recovery,
        eliminating the bureaucratic delays that often block access to stable housing.
      </p>
      <a href="#donate" class="btn-primary text-lg px-8 py-4">
        Make a Difference Today
      </a>
    </div>
  </section>

  <!-- Our Model Component -->
  <section id="model" class="py-16 px-4 sm:px-6 lg:px-8 bg-sage-50">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-display-small font-display text-deep-navy-900 mb-4">A Modern, Transparent Scholarship</h2>
        <p class="text-lg text-deep-navy-700">How we ensure your donation gets exactly where it's needed</p>
      </div>

      <div class="space-y-8">
        <!-- Instant Verification -->
        <div class="card bg-soft-white p-8">
          <div class="flex items-start space-x-6">
            <div class="w-12 h-12 bg-sage-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-sage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-deep-navy-900 mb-3">Instant Verification</h3>
              <p class="text-deep-navy-700">
                Dignity Through Speed. We use automated verification to approve aid in minutes, not weeks.
                No pay stubs, no invasive paperwork.
              </p>
            </div>
          </div>
        </div>

        <!-- Vetted Partners -->
        <div class="card bg-soft-white p-8">
          <div class="flex items-start space-x-6">
            <div class="w-12 h-12 bg-sage-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-sage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-deep-navy-900 mb-3">Vetted Partners</h3>
              <p class="text-deep-navy-700">
                Guaranteed Quality. We only pay funds directly to a vetted network of certified, safe sober living homes.
              </p>
            </div>
          </div>
        </div>

        <!-- Direct Payment -->
        <div class="card bg-soft-white p-8">
          <div class="flex items-start space-x-6">
            <div class="w-12 h-12 bg-sage-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-sage-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-deep-navy-900 mb-3">Direct Payment</h3>
              <p class="text-deep-navy-700">
                Closed-Loop System. All funds are sent instantly and digitally from our foundation to the provider,
                ensuring your donation gets exactly where it's needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Our Vetted Partners (Social Proof) -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-soft-white">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-display-small font-display text-deep-navy-900 mb-4">Our Trusted Sober Living Partners</h2>
        <p class="text-lg text-deep-navy-700">Professional facilities we work with across Colorado</p>
      </div>

      {#if loading}
        <div class="flex justify-center items-center py-12" role="status" aria-live="polite">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-navy-600" aria-hidden="true"></div>
          <span class="ml-3 text-deep-navy-700">Loading partners...</span>
        </div>
      {:else if partners.length > 0}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {#each partners as partner}
            <div class="card bg-sage-50 p-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-sage-200 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-sage-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 class="text-sm font-medium text-deep-navy-900">{partner.facility_name}</h3>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-12">
          <p class="text-deep-navy-700">Partner information loading...</p>
        </div>
      {/if}
    </div>
  </section>

  <!-- Our Stewardship (Accountability) -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-sage-50">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-display-small font-display text-deep-navy-900 mb-4">Your Trust is Our Foundation</h2>
        <p class="text-lg text-deep-navy-700">
          We are committed to radical transparency. All financial information is publicly available.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="card bg-soft-white p-8">
          <h3 class="text-xl font-semibold text-deep-navy-900 mb-4">Financial Transparency</h3>
          <p class="text-deep-navy-700 mb-6">
            View our complete financial records, including Form 990 and annual reports.
          </p>
          <a href="/impact" class="btn-secondary">
            View Our Financials & Form 990
          </a>
        </div>

        <div class="card bg-soft-white p-8">
          <h3 class="text-xl font-semibold text-deep-navy-900 mb-4">Compliance & Recognition</h3>
          <p class="text-deep-navy-700 mb-6">
            We maintain the highest standards of nonprofit accountability and transparency.
          </p>
          <div class="space-y-2 text-sm text-deep-navy-700">
            <div class="flex items-center space-x-2">
              <span class="font-semibold">•</span>
              <span>GuideStar Platinum Seal</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-semibold">•</span>
              <span>Charity Navigator Rated</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-semibold">•</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Donation Section (Anchor for header button) -->
  <section id="donate" class="py-16 px-4 sm:px-6 lg:px-8 bg-sage-50">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-display-small font-display text-deep-navy-900 mb-4">Ready to Make a Difference?</h2>
      <p class="text-lg text-deep-navy-700 mb-8">
        Your donation provides immediate, life-changing support for individuals seeking stability in recovery.
      </p>

      <!-- Placeholder for Donorbox integration -->
      <div class="card bg-soft-white p-8 max-w-2xl mx-auto">
        <h3 class="text-xl font-semibold text-deep-navy-900 mb-2">Donation Form</h3>
        <p class="text-deep-navy-700 mb-6">
          Donorbox integration will be added here with multi-step form and monthly giving emphasis.
        </p>
        <button class="btn-primary px-8 py-3">
          Donate Now (Coming Soon)
        </button>
      </div>
    </div>
  </section>
</main>

<style>
</style>

