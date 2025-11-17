<script lang="ts">
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  let countdown = 10

  onMount(() => {
    const timer = setInterval(() => {
      countdown--
      if (countdown <= 0) {
        clearInterval(timer)
        goto('/app/dashboard')
      }
    }, 1000)

    return () => clearInterval(timer)
  })
</script>

<svelte:head>
  <title>Application Submitted - Metzler Foundations</title>
  <meta name="description" content="Your application has been successfully submitted. We'll be in touch soon." />
</svelte:head>

<div class="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto">
    <!-- Success Icon -->
    <div class="text-center mb-8">
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
        <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
      <p class="text-gray-600">Thank you for applying to Metzler Foundations</p>
    </div>

    <!-- Success Message -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <div class="space-y-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900">Your beneficiary profile has been created</h3>
            <p class="text-sm text-gray-600 mt-1">Your information is securely stored and protected.</p>
          </div>
        </div>

        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900">Consent agreement recorded</h3>
            <p class="text-sm text-gray-600 mt-1">Your consent for Treatment, Payment, and Operations is active.</p>
          </div>
        </div>

        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900">What's next?</h3>
            <div class="text-sm text-gray-600 mt-1 space-y-2">
              <p>Our team will review your application within 1-2 business days.</p>
              <p>You'll receive an email when we begin the matching process with our sober living partners.</p>
              <p>You can revoke your consent at any time through your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">Your Information is Protected</h3>
          <div class="mt-2 text-sm text-blue-700">
            <p>
              All data is secured according to HIPAA and 42 CFR Part 2 regulations. Your consent can be revoked at any
              time.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Auto-redirect Notice -->
    <div class="text-center">
      <p class="text-sm text-gray-500 mb-2">
        Redirecting to dashboard in {countdown} seconds...
      </p>
      <button onclick={() => goto('/app/dashboard')} class="text-blue-600 hover:text-blue-500 font-medium text-sm">
        Go to Dashboard Now →
      </button>
    </div>

    <!-- Footer -->
    <div class="mt-8 text-center text-xs text-gray-400">
      <p>Metzler Foundations - Supporting Recovery Housing Since 2024</p>
      <p class="mt-1">HIPAA Compliant • 42 CFR Part 2 Compliant • Colorado Privacy Act Compliant</p>
    </div>
  </div>
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
