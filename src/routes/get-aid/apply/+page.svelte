<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import WizardForm from '$lib/components/ui/WizardForm.svelte'
  import WizardStep from '$lib/components/ui/WizardStep.svelte'
  import { validateAndSanitizeForm, VALIDATION_RULES, sanitizeInput } from '$lib/utils/validation'
  import { trackAidApplication } from '$lib/utils/analytics'

  export let form

  let formData = {
    eligibilityAccepted: false,
    consentAccepted: false,
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    amountRequested: '',
    preferredStartDate: '',
    specialRequirements: ''
  }

  let isSubmitting = false
  let validationErrors: Record<string, string> = {}

  // Auto-save functionality
  const AUTO_SAVE_KEY = 'metzler-aid-application'

  onMount(() => {
    const savedData = localStorage.getItem(AUTO_SAVE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        formData = { ...formData, ...parsed.data }
      } catch (error) {
        console.warn('Failed to load saved form data:', error)
      }
    }
  })

  $: if (formData) {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({ data: formData, timestamp: new Date().toISOString() }))
  }

  function handleSSNInput(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    let val = input.value.replace(/\D/g, '')
    if (val.length > 9) val = val.slice(0, 9)
    if (val.length > 5) {
      val = val.slice(0, 3) + '-' + val.slice(3, 5) + '-' + val.slice(5)
    } else if (val.length > 3) {
      val = val.slice(0, 3) + '-' + val.slice(3)
    }
    formData.ssn = val
  }

  async function handleSubmit() {
    isSubmitting = true
    trackAidApplication('submitted')
    // In a real SvelteKit form action, we'd submit the form element.
    // Since we're using a custom wizard, we can simulate a form submission or use fetch.
    // For this refactor, we'll create a hidden form and submit it to maintain progressive enhancement compatibility if needed,
    // or just use the existing 'enhance' logic if we wrap the wizard in a form.

    // However, WizardForm dispatches 'submit'. We can trigger the hidden form submission.
    document.getElementById('hidden-submit-btn')?.click()
  }

  $: if (form?.success) {
    localStorage.removeItem(AUTO_SAVE_KEY)
    goto('/get-aid/success')
  }
</script>

<svelte:head>
  <title>Apply for Aid - Metzler Foundations</title>
  <meta
    name="description"
    content="Apply for housing scholarships in Colorado. Fast, dignified assistance for individuals transitioning from treatment to sober living."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/get-aid/apply" />
  <meta property="og:title" content="Apply for Aid - Metzler Foundations" />
  <meta
    property="og:description"
    content="Apply for housing scholarships in Colorado. Fast, dignified assistance for individuals transitioning from treatment to sober living."
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Apply for Aid - Metzler Foundations" />
  <link rel="canonical" href="https://metzlercares.com/get-aid/apply" />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal flex flex-col">
  <!-- Header -->
  <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/get-aid')} class="flex items-center space-x-2 group">
          <MetzlerBridgeLogo className="w-8 h-8 text-forest-green group-hover:text-forest-green transition-colors" />
          <span class="text-xl font-bold text-charcoal">Metzler Foundations</span>
        </button>
        <a href="/give-support" class="text-sm font-medium text-charcoal hover:text-forest-green transition-colors">
          Give Support
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white">
    <!-- Hidden Form for SvelteKit Action -->
    <form method="POST" action="?/apply" use:enhance class="hidden">
      <input type="hidden" name="eligibility_accepted" value={formData.eligibilityAccepted} />
      <input type="hidden" name="consent_accepted" value={formData.consentAccepted} />
      <input type="hidden" name="full_name" value={formData.fullName} />
      <input type="hidden" name="email" value={formData.email} />
      <input type="hidden" name="phone" value={formData.phone} />
      <input type="hidden" name="date_of_birth" value={formData.dateOfBirth} />
      <input type="hidden" name="ssn" value={formData.ssn} />
      <input type="hidden" name="amount_requested" value={formData.amountRequested} />
      <input type="hidden" name="preferred_start_date" value={formData.preferredStartDate} />
      <input type="hidden" name="special_requirements" value={formData.specialRequirements} />
      <button type="submit" id="hidden-submit-btn">Submit</button>
    </form>

    <WizardForm
      title="Housing Scholarship Application"
      subtitle="Secure, dignified, and fast assistance."
      on:submit={handleSubmit}
    >
      <!-- Step 1: Eligibility -->
      <WizardStep
        title="Let's check your eligibility"
        description="Our scholarships are designed for specific needs. Please confirm the following:"
      >
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-forest-green mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Transitioning from a treatment facility
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-forest-green mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              At immediate risk of houselessness
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-forest-green mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Seeking entry into a certified sober living home
            </li>
          </ul>

          <div class="pt-4 border-t border-gray-100">
            <label class="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                bind:checked={formData.eligibilityAccepted}
                class="w-6 h-6 text-forest-green rounded border-gray-300 focus:ring-forest-green focus:ring-2 transition-colors"
              />
              <span class="text-lg font-medium text-charcoal group-hover:text-forest-green transition-colors">
                I meet these eligibility criteria
              </span>
            </label>
          </div>
        </div>
      </WizardStep>

      <!-- Step 2: Personal Info -->
      <WizardStep
        title="Tell us about yourself"
        description="We need your legal name and date of birth for verification."
      >
        <div class="space-y-6">
          <div>
            <label for="full-name" class="block text-sm font-bold text-charcoal mb-2">Full Legal Name <span class="text-red-500" aria-label="required">*</span></label>
            <input
              id="full-name"
              type="text"
              bind:value={formData.fullName}
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-all text-lg min-h-[44px]"
              placeholder="e.g. James Metzler"
              aria-required="true"
              aria-invalid={validationErrors.fullName ? 'true' : 'false'}
              aria-describedby={validationErrors.fullName ? 'full-name-error' : undefined}
            />
            {#if validationErrors.fullName}
              <p id="full-name-error" class="mt-1 text-sm text-red-600" role="alert">{validationErrors.fullName}</p>
            {/if}
          </div>
          <div>
            <label for="dob" class="block text-sm font-bold text-charcoal mb-2">Date of Birth <span class="text-red-500" aria-label="required">*</span></label>
            <input
              id="dob"
              type="date"
              bind:value={formData.dateOfBirth}
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-all text-lg"
            />
            <p class="text-sm text-gray-500 mt-2">You must be 18+ years old to apply.</p>
          </div>
        </div>
      </WizardStep>

      <!-- Step 3: Contact Info -->
      <WizardStep
        title="How can we reach you?"
        description="We'll use this to send you updates about your application status."
      >
        <div class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-bold text-charcoal mb-2">Email Address <span class="text-red-500" aria-label="required">*</span></label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-all text-lg min-h-[44px]"
              placeholder="name@example.com"
              aria-required="true"
              aria-invalid={validationErrors.email ? 'true' : 'false'}
              aria-describedby={validationErrors.email ? 'email-error' : undefined}
            />
            {#if validationErrors.email}
              <p id="email-error" class="mt-1 text-sm text-red-600" role="alert">{validationErrors.email}</p>
            {/if}
          </div>
          <div>
            <label for="phone" class="block text-sm font-bold text-charcoal mb-2">Phone Number <span class="text-red-500" aria-label="required">*</span></label>
            <input
              id="phone"
              type="tel"
              bind:value={formData.phone}
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-all text-lg min-h-[44px]"
              placeholder="(555) 123-4567"
              aria-required="true"
              aria-invalid={validationErrors.phone ? 'true' : 'false'}
              aria-describedby={validationErrors.phone ? 'phone-error' : undefined}
            />
            {#if validationErrors.phone}
              <p id="phone-error" class="mt-1 text-sm text-red-600" role="alert">{validationErrors.phone}</p>
            {/if}
          </div>
        </div>
      </WizardStep>

      <!-- Step 4: Housing Needs -->
      <WizardStep title="Housing Details" description="Let us know what kind of support you need.">
        <div class="space-y-6">
          <div>
            <label for="amount" class="block text-sm font-bold text-charcoal mb-2">Amount Requested ($) <span class="text-red-500" aria-label="required">*</span></label>
            <div class="relative">
              <span class="absolute left-4 top-3.5 text-gray-500 text-lg">$</span>
              <input
                id="amount"
                type="number"
                bind:value={formData.amountRequested}
                class="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent transition-all text-lg"
                placeholder="300"
                min="100"
                max="1000"
              />
            </div>
            <p class="text-sm text-gray-500 mt-2">Standard grant is $300. Max $1,000.</p>
          </div>

          <div>
            <label for="start-date" class="block text-sm font-bold text-charcoal mb-2">Preferred Start Date</label>
            <input
              id="start-date"
              type="date"
              bind:value={formData.preferredStartDate}
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-all text-lg"
            />
          </div>

          <div>
            <label for="special-reqs" class="block text-sm font-bold text-charcoal mb-2"
              >Special Requirements (Optional)</label
            >
            <textarea
              id="special-reqs"
              bind:value={formData.specialRequirements}
              rows="3"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent transition-all text-lg resize-none"
              placeholder="Any accessibility needs or specific location requests?"
            />
          </div>
        </div>
      </WizardStep>

      <!-- Step 5: Verification -->
      <WizardStep
        title="Secure Verification"
        description="We use bank-level encryption to verify your eligibility instantly."
      >
        <div class="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-blue-600 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div>
              <h4 class="font-bold text-blue-900">Why do we need this?</h4>
              <p class="text-blue-800 text-sm mt-1">
                We use your SSN to perform a soft inquiry for income verification. This does <strong>not</strong> affect
                your credit score and your data is never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label for="ssn" class="block text-sm font-bold text-charcoal mb-2">Social Security Number <span class="text-red-500" aria-label="required">*</span></label>
          <input
            id="ssn"
            type="text"
            value={formData.ssn}
            on:input={handleSSNInput}
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-navy focus:border-transparent transition-all text-lg tracking-widest font-mono"
            placeholder="XXX-XX-XXXX"
            maxlength="11"
          />
        </div>
      </WizardStep>

      <!-- Step 6: Consent -->
      <WizardStep title="Final Consent" description="Please review our privacy terms before submitting.">
        <div
          class="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 max-h-60 overflow-y-auto text-sm text-gray-600 space-y-3"
        >
          <p>
            I consent to allow Metzler Foundations to use my information to verify my eligibility for social service
            programs and to coordinate my scholarship payment with a sober living provider.
          </p>
          <p><strong>This includes:</strong></p>
          <ul class="list-disc pl-5 space-y-1">
            <li>Automated income verification</li>
            <li>Coordination with approved facilities</li>
            <li>Program evaluation activities</li>
          </ul>
          <p>My data is protected by HIPAA and 42 CFR Part 2.</p>
        </div>

        <label
          class="flex items-center space-x-3 cursor-pointer group p-4 bg-white border border-gray-200 rounded-lg hover:border-forest-green transition-all"
        >
          <input
            type="checkbox"
            bind:checked={formData.consentAccepted}
            class="w-6 h-6 text-forest-green rounded border-gray-300 focus:ring-forest-green focus:ring-2 transition-colors"
            aria-required="true"
          />
          <span class="text-lg font-medium text-charcoal"> I agree to the terms and consent to verification <span class="text-red-500" aria-label="required">*</span></span>
        </label>
      </WizardStep>
    </WizardForm>
  </main>
</div>
