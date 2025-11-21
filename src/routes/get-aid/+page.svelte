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
      <h1 class="text-4xl md:text-5xl font-bold text-charcoal mb-6">Targeted Financial Aid</h1>
      <p class="text-xl text-gray-600 mb-8">
        We provide two weeks of rent assistance and one-time grocery support for individuals discharging from treatment to approved sober living homes who are actively seeking employment.
      </p>
      <button 
        class="px-8 py-4 bg-forest-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all min-h-[44px] flex items-center justify-center mx-auto" 
        on:click={() => goto('/get-aid/apply')}
        aria-label="Start your application for housing aid"
      > 
        Check Eligibility 
      </button>
    </div>
  </section>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Eligibility Section -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
        <h2 class="text-3xl font-bold text-charcoal text-center mb-8">Eligibility Requirements</h2>

        <div class="space-y-6">
          <div class="flex items-start space-x-4 p-4 bg-forest-green bg-opacity-5 rounded-lg">
            <div class="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Approved Facility</h3>
              <p class="text-sm opacity-80">You must be residing at or moving into a Metzler-approved sober living partner facility.</p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-forest-green bg-opacity-5 rounded-lg">
            <div class="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Active Job Search</h3>
              <p class="text-sm opacity-80">To qualify for rent assistance, you must be actively applying for jobs or currently employed.</p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-forest-green bg-opacity-5 rounded-lg">
            <div class="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Two-Week Support</h3>
              <p class="text-sm opacity-80">Rent scholarships are awarded in two-week increments to ensure continued progress.</p>
            </div>
          </div>

          <div class="flex items-start space-x-4 p-4 bg-forest-green bg-opacity-5 rounded-lg">
            <div class="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold mb-1">Grocery Assistance</h3>
              <p class="text-sm opacity-80">One-time grocery support available immediately upon discharge to help stock your new home.</p>
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="text-sm font-medium mb-1">Looking for Peer Coaching?</p>
              <p class="text-xs opacity-80">
                If you are currently in a partner treatment facility, ask your case manager about Metzler Peer Support services. We can help you get your ID and SNAP benefits set up <em>before</em> you discharge, at no cost to you.
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
    </main>
</div>
