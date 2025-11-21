<script lang="ts">
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title>Get Financial Aid - Metzler Foundations</title>
  <meta
    name="description"
    content="Apply for housing scholarships for individuals in recovery. Dignified, fast, and confidential financial assistance."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/get-aid" />
  <meta property="og:title" content="Get Financial Aid - Metzler Foundations" />
  <meta
    property="og:description"
    content="Apply for housing scholarships for individuals in recovery. Dignified, fast, and confidential financial assistance."
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Get Financial Aid - Metzler Foundations" />
  <link rel="canonical" href="https://metzlercares.com/get-aid" />
</svelte:head>

<div class="min-h-screen bg-white">
  <!-- Hero Section -->
  <section class="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-charcoal mb-6">Dignified Housing Support</h1>
      <p class="text-xl text-gray-600 mb-8">
        We provide one-time scholarships to cover the first month's rent or entry fees at certified sober living homes
        for individuals in recovery.
      </p>
      <button 
        class="px-8 py-4 bg-forest-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all min-h-[44px] flex items-center justify-center mx-auto" 
        on:click={() => goto('/get-aid/apply')}
        aria-label="Start your application for housing aid"
      > 
        Start Application 
      </button>
    </div>
  </section>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Eligibility Section -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
        <h2 class="text-3xl font-bold text-charcoal text-center mb-8">Who We Can Help</h2>

        <div class="space-y-6">
          <div class="flex items-start space-x-4 p-4 bg-forest-green bg-opacity-5 rounded-lg">
            <div class="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Transitioning from Treatment</h3>
              <p class="text-sm opacity-80">Individuals completing residential treatment programs</p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-forest-green bg-opacity-5 rounded-lg">
            <div class="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">At Risk of Houselessness</h3>
              <p class="text-sm opacity-80">Those facing immediate housing instability</p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-forest-green bg-opacity-5 rounded-lg">
            <div class="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Colorado Residents</h3>
              <p class="text-sm opacity-80">Must reside in Colorado for sober living placement</p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-forest-green bg-opacity-5 rounded-lg">
            <div class="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Income-Eligible</h3>
              <p class="text-sm opacity-80">Our automated verification ensures fair distribution</p>
            </div>
          </div>
        </div>

        <!-- Important notice -->
        <div class="mt-6 p-4 bg-sunset-orange bg-opacity-10 border border-sunset-orange border-opacity-20 rounded-lg">
          <div class="flex items-start space-x-2">
            <svg
              class="w-5 h-5 text-sunset-orange flex-shrink-0 mt-0.5"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium mb-1">Important Notice</p>
              <p class="text-xs opacity-80">
                We provide one-time scholarships only. This is not recurring assistance or rental subsidies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Process Overview -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
        <h2 class="text-3xl font-bold text-charcoal text-center mb-8">Simple, Dignified Process</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">1</span>
            </div>
            <h3 class="font-semibold mb-2">Quick Application</h3>
            <p class="text-sm opacity-80">Online form takes less than 5 minutes. No documents required.</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">2</span>
            </div>
            <h3 class="font-semibold mb-2">Instant Verification</h3>
            <p class="text-sm opacity-80">Automated income check maintains privacy and fairness.</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">3</span>
            </div>
            <h3 class="font-semibold mb-2">Direct Payment</h3>
            <p class="text-sm opacity-80">Funds sent directly to your approved sober living home.</p>
          </div>
        </div>
      </div>

      <!-- Trust Signals -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
          <svg class="w-12 h-12 text-forest-green mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 class="font-semibold mb-2">100% Confidential</h3>
          <p class="text-sm opacity-80">Protected by HIPAA and 42 CFR Part 2</p>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
          <svg class="w-12 h-12 text-forest-green mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 class="font-semibold mb-2">Approval in Minutes</h3>
          <p class="text-sm opacity-80">No waiting weeks for paperwork processing</p>
        </div>

        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
          <svg class="w-12 h-12 text-forest-green mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 class="font-semibold mb-2">Vetted Partners</h3>
          <p class="text-sm opacity-80">Only certified, safe sober living homes</p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center">
        <h2 class="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p class="opacity-80 mb-8">Take the first step toward stable housing in your recovery journey.</p>
        <button 
          class="px-8 py-4 bg-forest-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all min-h-[44px] flex items-center justify-center mx-auto" 
          on:click={() => goto('/get-aid/apply')}
          aria-label="Start your application for housing aid"
        > 
          Start Your Application 
        </button>
      </div>
    </div>
  </main>
</div>
