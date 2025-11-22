<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  let countdown = 15

  onMount(() => {
    const timer = setInterval(() => {
      countdown--
      if (countdown <= 0) {
        clearInterval(timer)
        goto('/get-aid/status')
      }
    }, 1000)

    return () => clearInterval(timer)
  })
</script>

<svelte:head>
  <title>Application Submitted - Metzler Foundations</title>
  <meta
    name="description"
    content="Your scholarship application has been submitted successfully. We'll be in touch soon."
  />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Header -->
  <header class="bg-cream border-b border-navy border-opacity-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/get-aid')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
          <span class="text-xl font-medium text-navy">Metzler Foundations</span>
        </button>
        <a href="/give-support" class="btn-secondary text-sm px-4 py-2"> Give Support </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto text-center">
      <!-- Success Icon -->
      <div class="mb-8">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-olive bg-opacity-20 mb-4">
          <svg class="h-8 w-8 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-medium text-navy mb-2">Application Submitted Successfully</h1>
        <p class="text-navy text-opacity-80">Thank you for applying to Metzler Foundations</p>
      </div>

      <!-- Success Message -->
      <div class="bg-white shadow-md rounded-lg p-8 mb-8">
        <div class="space-y-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-olive mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-3 text-left">
              <h3 class="text-sm font-medium text-navy">Instant Automated Verification Completed</h3>
              <p class="text-sm text-navy text-opacity-70 mt-1">
                Your income eligibility has been verified using secure, encrypted automated services. No paperwork or
                pay stubs were required.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-olive mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3 text-left">
              <h3 class="text-sm font-medium text-navy">Consent Agreement Recorded</h3>
              <p class="text-sm text-navy text-opacity-70 mt-1">
                Your explicit consent for Treatment, Payment, and Operations has been securely recorded and can be
                revoked at any time.
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-olive mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div class="ml-3 text-left">
              <h3 class="text-sm font-medium text-navy">Scholarship Processing Begins</h3>
              <p class="text-sm text-navy text-opacity-70 mt-1">
                Our team will now match you with approved sober living partners in Colorado. You'll receive an email
                within 1-2 business days with placement options.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-navy bg-opacity-5 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-medium text-navy mb-4">What Happens Next?</h3>
        <div class="text-left space-y-3 text-sm text-navy text-opacity-80">
          <div class="flex items-start space-x-3">
            <span
              class="flex-shrink-0 w-6 h-6 bg-navy text-cream rounded-full flex items-center justify-center text-xs font-medium"
              >1</span
            >
            <p>Our case managers review your application and identify suitable sober living homes</p>
          </div>
          <div class="flex items-start space-x-3">
            <span
              class="flex-shrink-0 w-6 h-6 bg-navy text-cream rounded-full flex items-center justify-center text-xs font-medium"
              >2</span
            >
            <p>You'll receive placement options via email with facility details and availability</p>
          </div>
          <div class="flex items-start space-x-3">
            <span
              class="flex-shrink-0 w-6 h-6 bg-navy text-cream rounded-full flex items-center justify-center text-xs font-medium"
              >3</span
            >
            <p>Once you select a facility, we process your scholarship payment directly to them</p>
          </div>
          <div class="flex items-start space-x-3">
            <span
              class="flex-shrink-0 w-6 h-6 bg-navy text-cream rounded-full flex items-center justify-center text-xs font-medium"
              >4</span
            >
            <p>You move into stable, supportive housing within days, not weeks</p>
          </div>
        </div>
      </div>

      <!-- Auto-redirect Notice -->
      <div class="text-center">
        <p class="text-sm text-navy text-opacity-60 mb-2">
          Redirecting to application status in {countdown} seconds...
        </p>
        <button on:click={() => goto('/get-aid/status')} class="text-olive hover:text-navy font-medium text-sm">
          View Application Status Now →
        </button>
      </div>

      <!-- Footer -->
      <div class="mt-12 text-center text-xs text-navy text-opacity-60">
        <p>
          Questions? Contact our support team at <a
            href="mailto:support@metzlercares.com"
            class="text-olive hover:text-navy">support@metzlercares.com</a
          >
        </p>
        <p class="mt-2">Your information is protected under HIPAA and 42 CFR Part 2 regulations.</p>
      </div>
    </div>
  </main>
</div>
