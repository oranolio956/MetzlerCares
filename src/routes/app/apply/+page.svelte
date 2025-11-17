<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import type { ActionData } from './$types'

  export let form: ActionData

  let currentStep = 1
  let formData = {
    full_name: '',
    email: '',
    phone: ''
  }

  let consentAccepted = false
  let isSubmitting = false

  // Form validation
  $: isStep1Valid = formData.full_name.trim() && formData.email.trim() && formData.phone.trim()
  $: isStep2Valid = consentAccepted
  $: canProceed = currentStep === 1 ? isStep1Valid : isStep2Valid

  function nextStep() {
    if (canProceed && currentStep < 2) {
      currentStep++
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--
    }
  }

  function handleSubmit() {
    if (canProceed && currentStep === 2) {
      isSubmitting = true
    }
  }

  // Handle successful submission
  $: if (form?.success) {
    goto('/app/success')
  }
</script>

<svelte:head>
  <title>Apply for Support - Metzler Foundations</title>
  <meta
    name="description"
    content="Begin your journey to recovery housing and support services with Metzler Foundations."
  />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Apply for Support</h1>
      <p class="text-gray-600">Begin your journey to recovery housing and support services</p>
    </div>

    <!-- Progress Indicator -->
    <div class="mb-8">
      <div class="flex items-center justify-center space-x-4">
        <div class="flex items-center">
          <div
            class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            1
          </div>
          <span class="ml-2 text-sm font-medium text-gray-700">Information</span>
        </div>
        <div class="w-8 h-0.5 bg-gray-200"></div>
        <div class="flex items-center">
          <div
            class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            2
          </div>
          <span class="ml-2 text-sm font-medium text-gray-700">Consent</span>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form method="POST" action="?/apply" use:enhance={handleSubmit} class="bg-white shadow-md rounded-lg p-6">
      {#if currentStep === 1}
        <!-- Step 1: Personal Information -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>

          <div>
            <label for="full_name" class="block text-sm font-medium text-gray-700 mb-1"> Full Name * </label>
            <input
              type="text"
              id="full_name"
              bind:value={formData.full_name}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1"> Email Address * </label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1"> Phone Number * </label>
            <input
              type="tel"
              id="phone"
              bind:value={formData.phone}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      {:else if currentStep === 2}
        <!-- Step 2: Consent Agreement -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Consent for Treatment, Payment & Operations</h2>

          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Important Legal Information</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <p class="mb-2">
                    This application involves Protected Health Information (PHI) and Substance Use Disorder (SUD)
                    records.
                  </p>
                  <p>
                    Your consent is required under 42 CFR Part 2 (Confidentiality of Substance Use Disorder Records) and
                    the Colorado Privacy Act.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Consent Agreement</h3>

            <div class="text-sm text-gray-700 space-y-3 mb-4">
              <p>
                <strong>I hereby authorize Metzler Foundations</strong> to use and disclose my protected health information
                for Treatment, Payment, and Operations (TPO) purposes as permitted by 42 CFR Part 2 and applicable law.
              </p>

              <p>
                <strong>This consent includes but is not limited to:</strong>
              </p>
              <ul class="list-disc list-inside ml-4 space-y-1">
                <li>Coordination with sober living facilities and treatment providers</li>
                <li>Assessment of housing eligibility and program participation</li>
                <li>Communication with referral sources and support services</li>
                <li>Quality improvement and program evaluation activities</li>
              </ul>

              <p>
                <strong>I understand that:</strong>
              </p>
              <ul class="list-disc list-inside ml-4 space-y-1">
                <li>This consent is voluntary and I may revoke it at any time</li>
                <li>Revocation will not affect information already shared under this consent</li>
                <li>My information will be protected according to HIPAA and 42 CFR Part 2</li>
                <li>I have the right to request restrictions on certain uses and disclosures</li>
              </ul>

              <p class="font-medium text-gray-900 mt-3">
                By checking the box below, I acknowledge that I have read and understand this consent agreement and
                voluntarily authorize the use and disclosure of my protected health information as described above.
              </p>
            </div>

            <!-- Hidden form fields -->
            <input type="hidden" name="full_name" value={formData.full_name} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="phone" value={formData.phone} />

            <!-- Consent Checkbox -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="consent"
                  name="consent_accepted"
                  type="checkbox"
                  bind:checked={consentAccepted}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="consent" class="font-medium text-gray-700">
                  I have read, understand, and agree to the consent terms above *
                </label>
                <p class="text-gray-500 mt-1">
                  This consent is required to process your application and can be revoked at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Error Display -->
      {#if form?.error}
        <div class="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Application Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{form.error.message || 'An error occurred while processing your application. Please try again.'}</p>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Navigation Buttons -->
      <div class="mt-8 flex justify-between">
        {#if currentStep > 1}
          <button
            type="button"
            onclick={prevStep}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Previous
          </button>
        {:else}
          <div></div>
        {/if}

        {#if currentStep < 2}
          <button
            type="button"
            onclick={nextStep}
            disabled={!canProceed}
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        {:else}
          <button
            type="submit"
            disabled={!canProceed || isSubmitting}
            class="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSubmitting}
              <svg
                class="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            {:else}
              Submit Application
            {/if}
          </button>
        {/if}
      </div>
    </form>

    <!-- Footer -->
    <div class="mt-8 text-center text-sm text-gray-500">
      <p>Your privacy and data security are our top priorities.</p>
      <p class="mt-1">All information is protected under HIPAA and 42 CFR Part 2.</p>
    </div>
  </div>
</div>

<style>
  /* Custom styles for better form appearance */
  input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  button:disabled {
    cursor: not-allowed;
  }
</style>
