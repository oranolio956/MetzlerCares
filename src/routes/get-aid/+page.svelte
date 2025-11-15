<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>Get Financial Aid - Metzler Foundations</title>
  <meta name="description" content="Apply for housing scholarships for individuals in recovery. Dignified, fast, and confidential financial assistance." />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Global header is provided by layout -->

  <!-- Main Content -->
  <main class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-medium text-navy mb-6">
          Dignified Housing Support
        </h1>
        <p class="text-xl text-navy text-opacity-80 mb-8">
          We provide one-time scholarships to cover the first month's rent or entry fees
          at certified sober living homes for individuals in recovery.
        </p>
        <button
          on:click={() => goto('/get-aid/apply')}
          class="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Start Application
        </button>
      </div>

      <!-- Eligibility Section -->
      <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-12">
        <h2 class="text-2xl font-medium text-navy mb-6 text-center">Who We Can Help</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-olive mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="font-medium text-navy mb-1">Transitioning from Treatment</h3>
              <p class="text-sm text-navy text-opacity-70">Individuals completing residential treatment programs</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-olive mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="font-medium text-navy mb-1">At Risk of Houselessness</h3>
              <p class="text-sm text-navy text-opacity-70">Those facing immediate housing instability</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-olive mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="font-medium text-navy mb-1">Colorado Residents</h3>
              <p class="text-sm text-navy text-opacity-70">Must reside in Colorado for sober living placement</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-olive mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h3 class="font-medium text-navy mb-1">Income-Eligible</h3>
              <p class="text-sm text-navy text-opacity-70">Our automated verification ensures fair distribution</p>
            </div>
          </div>
        </div>

        <div class="mt-8 p-4 bg-navy bg-opacity-5 rounded-lg">
          <p class="text-sm text-navy text-opacity-80 text-center">
            <strong>Important:</strong> We provide one-time scholarships only.
            This is not recurring assistance or rental subsidies.
          </p>
        </div>
      </div>

      <!-- Process Overview -->
      <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-8 mb-12">
        <h2 class="text-2xl font-medium text-navy mb-6 text-center">Simple, Dignified Process</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-cream font-bold">1</span>
            </div>
            <h3 class="font-medium text-navy mb-2">Quick Application</h3>
            <p class="text-sm text-navy text-opacity-70">
              Online form takes less than 5 minutes. No documents required.
            </p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-cream font-bold">2</span>
            </div>
            <h3 class="font-medium text-navy mb-2">Instant Verification</h3>
            <p class="text-sm text-navy text-opacity-70">
              Automated income check maintains privacy and fairness.
            </p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-cream font-bold">3</span>
            </div>
            <h3 class="font-medium text-navy mb-2">Direct Payment</h3>
            <p class="text-sm text-navy text-opacity-70">
              Funds sent directly to your approved sober living home.
            </p>
          </div>
        </div>
      </div>

      <!-- Trust Signals -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center">
          <svg class="w-8 h-8 text-olive mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 class="font-medium text-navy mb-2">100% Confidential</h3>
          <p class="text-sm text-navy text-opacity-70">Protected by HIPAA and 42 CFR Part 2</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center">
          <svg class="w-8 h-8 text-olive mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 class="font-medium text-navy mb-2">Approval in Minutes</h3>
          <p class="text-sm text-navy text-opacity-70">No waiting weeks for paperwork processing</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6 text-center">
          <svg class="w-8 h-8 text-olive mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="font-medium text-navy mb-2">Vetted Partners</h3>
          <p class="text-sm text-navy text-opacity-70">Only certified, safe sober living homes</p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center">
        <h2 class="text-2xl font-medium text-navy mb-4">Ready to Get Started?</h2>
        <p class="text-navy text-opacity-80 mb-8">
          Take the first step toward stable housing in your recovery journey.
        </p>
        <button
          on:click={() => goto('/get-aid/apply')}
          class="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Start Your Application
        </button>
      </div>
    </div>
  </main>
</div>
