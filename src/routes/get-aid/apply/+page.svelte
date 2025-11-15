<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte';
  import { enhance } from '$app/forms';
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  export let form;
  export let data;

  let currentStep = 1;
  let formData = {
    eligibilityAccepted: false,
    consentAccepted: false,
    fullName: '',
    dateOfBirth: '',
    ssn: ''
  };

  // Form validation
  $: isStep1Valid = formData.eligibilityAccepted;
  $: isStep2Valid = formData.consentAccepted;
  $: isStep3Valid = formData.fullName.trim() && formData.dateOfBirth && formData.ssn.replace(/\D/g, '').length === 9;
  $: canProceed = currentStep === 1 ? isStep1Valid :
                  currentStep === 2 ? isStep2Valid :
                  isStep3Valid;

  let statusMessage = ''
  let stepContainer: HTMLDivElement | null = null

  function nextStep() {
    if (canProceed && currentStep < 3) {
      currentStep++;
      statusMessage = `Moved to step ${currentStep}`
      tick().then(() => { stepContainer?.focus() })
    } else {
      statusMessage = currentStep === 1
        ? 'Please accept eligibility to continue'
        : currentStep === 2
        ? 'Please accept the consent agreement to continue'
        : 'Please complete your verification details to submit'
      tick().then(() => { stepContainer?.focus() })
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      statusMessage = `Returned to step ${currentStep}`
      tick().then(() => { stepContainer?.focus() })
    }
  }

  let isSubmitting = false
  function handleSubmit() {
    if (canProceed && currentStep === 3) {
      statusMessage = 'Submitting your application'
      isSubmitting = true
    }
  }

  // Format SSN input
  function formatSSN(value: string) {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return cleaned;
  }

  $: if (form?.success) {
    goto('/get-aid/success');
  }
</script>

<svelte:head>
  <title>Apply for Aid - Metzler Foundations</title>
  <meta name="description" content="Apply for housing scholarships. Dignified, fast, and confidential assistance for individuals in recovery." />
</svelte:head>

<div class="min-h-screen bg-warm-cream text-deep-navy-900">
  <!-- Header -->
  <header class="bg-soft-white border-b border-deep-navy-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/get-aid')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-deep-navy-700" />
          <span class="text-xl font-display font-medium text-deep-navy-900">Metzler Foundations</span>
        </button>
        <a href="/give-support" class="btn-secondary text-sm">
          Give Support
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4 mb-4">
          <div class="flex items-center">
            <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-deep-navy-700 text-soft-white' : 'bg-sage-200 text-deep-navy-700'
            }`}>
              1
            </div>
            <span class="ml-2 text-sm font-medium text-deep-navy-800">Eligibility</span>
          </div>
          <div class="w-8 h-0.5 bg-gray-200"></div>
          <div class="flex items-center">
            <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-deep-navy-700 text-soft-white' : 'bg-sage-200 text-deep-navy-700'
            }`}>
              2
            </div>
            <span class="ml-2 text-sm font-medium text-deep-navy-800">Consent</span>
          </div>
          <div class="w-8 h-0.5 bg-gray-200"></div>
          <div class="flex items-center">
            <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 3 ? 'bg-deep-navy-700 text-soft-white' : 'bg-sage-200 text-deep-navy-700'
            }`}>
              3
            </div>
            <span class="ml-2 text-sm font-medium text-deep-navy-800">Verification</span>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div tabindex="-1" bind:this={stepContainer}></div>
      <div class="sr-only" aria-live="polite" role="status">{statusMessage}</div>
      <form
        method="POST"
        action="?/apply"
        use:enhance={handleSubmit}
        class="card p-8"
      >
        <input type="hidden" name="csrf_token" value={data.csrfToken} />
        {#if currentStep === 1}
          <!-- Step 1: Eligibility Check -->
          <div class="space-y-6">
            <h2 class="text-2xl font-display font-medium text-deep-navy-900 mb-6 text-center">Who We Can Help</h2>

            <div class="bg-sage-50 border border-sage-200 rounded-lg p-6 mb-6">
              <h3 class="font-medium text-deep-navy-900 mb-3">Our scholarships are for individuals in Colorado who are:</h3>
              <ul class="space-y-2 text-deep-navy-800">
                <li>• Transitioning from a treatment facility</li>
                <li>• At immediate risk of houselessness</li>
                <li>• Seeking entry into a certified sober living home</li>
              </ul>
            </div>

            <div class="border border-sage-300 rounded-lg p-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="eligibility"
                    bind:checked={formData.eligibilityAccepted}
                    type="checkbox"
                    class="h-4 w-4 text-deep-navy-700 focus:ring-sage-600 border-sage-300 rounded"
                    required
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="eligibility" class="font-medium text-deep-navy-900">
                    I understand and meet these initial eligibility criteria
                  </label>
                  <p class="text-deep-navy-700 mt-1">
                    Our scholarships are one-time only and cannot be combined with other rental assistance programs.
                  </p>
                </div>
              </div>
            </div>
          </div>

        {:else if currentStep === 2}
          <!-- Step 2: Legal Consent -->
          <div class="space-y-6">
            <h2 class="text-2xl font-display font-medium text-deep-navy-900 mb-6 text-center">Your Privacy is Our Priority</h2>

            <div class="bg-sage-50 border border-sage-200 rounded-lg p-6 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-sage-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 000 16zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-deep-navy-800">
                    Because we handle Protected Health Information (PHI) and Substance Use Disorder (SUD) records,
                    we are bound by federal law (42 CFR Part 2) and the Colorado Privacy Act (CPA).
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-sage-50 border border-sage-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-deep-navy-900 mb-4">Consent Agreement</h3>

              <div class="text-sm text-deep-navy-800 space-y-3 mb-6">
                <p>
                  I consent to allow Metzler Foundations to use my information to verify my eligibility for social service programs
                  and to coordinate my scholarship payment with a sober living provider.
                </p>

                <p><strong>This consent includes:</strong></p>
                <ul class="list-disc list-inside ml-4 space-y-1">
                  <li>Automated income verification using secure third-party services</li>
                  <li>Coordination with approved sober living facilities</li>
                  <li>Communication regarding scholarship status and requirements</li>
                  <li>Quality assurance and program evaluation activities</li>
                </ul>

                <p><strong>I understand that:</strong></p>
                <ul class="list-disc list-inside ml-4 space-y-1">
                  <li>My information is encrypted and protected by HIPAA and 42 CFR Part 2</li>
                  <li>I can revoke this consent at any time</li>
                  <li>This consent is specific to housing assistance programs only</li>
                  <li>My data will never be sold or shared for marketing purposes</li>
                </ul>
              </div>

              <!-- Consent Checkbox -->
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="consent"
                    bind:checked={formData.consentAccepted}
                    type="checkbox"
                    class="h-4 w-4 text-deep-navy-700 focus:ring-sage-600 border-sage-300 rounded"
                    required
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="consent" class="font-medium text-deep-navy-900">
                    I have read and understand the consent agreement above
                  </label>
                  <p class="text-deep-navy-700 mt-1">
                    This consent is required to process your scholarship application.
                  </p>
                </div>
              </div>
            </div>
          </div>

        {:else if currentStep === 3}
          <!-- Step 3: Automated Verification -->
          <div class="space-y-6">
            <h2 class="text-2xl font-display font-medium text-deep-navy-900 mb-6 text-center">Instant Automated Verification</h2>

            <div class="bg-sage-50 border border-sage-200 rounded-lg p-6 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-sage-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-deep-navy-800">
                    <strong>Dignity Through Speed:</strong> No pay stubs or paperwork required.
                    We use secure, automated verification services to respect your privacy.
                  </p>
                </div>
              </div>
            </div>

            <!-- Hidden form fields -->
            <input type="hidden" name="eligibility_accepted" value={formData.eligibilityAccepted} />
            <input type="hidden" name="consent_accepted" value={formData.consentAccepted} />

            <!-- Full Name -->
            <div>
              <label for="full_name" class="form-label">
                Full Legal Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                bind:value={formData.fullName}
                required
                class="form-input"
                placeholder="Enter your full legal name"
              />
            </div>

            <!-- Date of Birth -->
            <div>
              <label for="date_of_birth" class="form-label">
                Date of Birth *
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                bind:value={formData.dateOfBirth}
                required
                class="form-input"
                max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>

            <!-- SSN -->
            <div>
              <label for="ssn" class="form-label">
                Social Security Number *
              </label>
              <input
                type="text"
                id="ssn"
                name="ssn"
                bind:value={formData.ssn}
                on:input={(e) => formData.ssn = formatSSN((e.target as HTMLInputElement)?.value || '')}
                maxlength="11"
                required
                class="form-input"
                placeholder="XXX-XX-XXXX"
              />
              <p class="text-xs text-deep-navy-700 mt-2">
                <strong>We use this ONLY</strong> to securely and instantly check your income eligibility with an automated verification service like The Work Number.
                Your SSN is encrypted, never stored, and never shared.
              </p>
            </div>

            <div class="bg-sage-50 border border-sage-200 rounded-lg p-4 mt-6">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p class="text-sm text-deep-navy-900 font-medium">Secure & Private</p>
                  <p class="text-sm text-deep-navy-800 mt-1">
                    Your information is protected by bank-level encryption and HIPAA compliance standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        {/if}

        {#if form?.error}
          <div class="flex" role="alert" aria-live="polite">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Application Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{form?.error?.message || 'An error occurred while processing your application. Please try again.'}</p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-between">
          {#if currentStep > 1}
            <button
              type="button"
              on:click={prevStep}
              class="btn-secondary-outline"
            >
              Previous
            </button>
          {:else}
            <div></div>
          {/if}

          {#if currentStep < 3}
            <button
              type="button"
              on:click={nextStep}
              disabled={!canProceed}
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          {:else}
            <button
              type="submit"
              disabled={!canProceed || isSubmitting}
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              aria-live="polite"
            >
              {#if isSubmitting}
                Submitting...
              {:else}
                Submit Application
              {/if}
            </button>
          {/if}
        </div>
      </form>


      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-deep-navy-800">
        <p>Your privacy and dignity are our highest priorities.</p>
        <p class="mt-1">All information is protected under HIPAA and 42 CFR Part 2.</p>
      </div>
    </div>
  </main>
</div>
