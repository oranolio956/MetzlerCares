<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { validateAndSanitizeForm, VALIDATION_RULES, sanitizeInput } from '$lib/utils/validation'

  export let form

  let currentStep = 1
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
  let errorAlert: HTMLElement
  let validationErrors: Record<string, string> = {}

  // Auto-save functionality
  let autoSaveTimer: ReturnType<typeof setTimeout>
  let lastSaved = ''
  const AUTO_SAVE_KEY = 'metzler-aid-application'

  // Load saved data on mount
  onMount(() => {
    const savedData = localStorage.getItem(AUTO_SAVE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        formData = { ...formData, ...parsed.data }
        currentStep = parsed.step || 1
        lastSaved = parsed.timestamp || ''
      } catch (error) {
        console.warn('Failed to load saved form data:', error)
      }
    }
  })

  // Auto-save function
  function autoSave() {
    const saveData = {
      data: formData,
      step: currentStep,
      timestamp: new Date().toLocaleString()
    }
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData))
    lastSaved = saveData.timestamp
  }

  // Client-side validation function
  function validateCurrentStep(): boolean {
    validationErrors = {}

    if (currentStep === 1) {
      // Step 1: All Application Information
      // Personal Information
      if (!formData.fullName.trim()) {
        validationErrors.fullName = 'Full name is required'
      } else {
        const { isValid, errors } = validateAndSanitizeForm(
          { fullName: formData.fullName },
          { fullName: [VALIDATION_RULES.fullName] }
        )
        if (!isValid && errors.fullName) {
          validationErrors.fullName = errors.fullName
        }
      }

      if (!formData.email.trim()) {
        validationErrors.email = 'Email is required'
      } else {
        const { isValid, errors } = validateAndSanitizeForm(
          { email: formData.email },
          { email: [VALIDATION_RULES.email] }
        )
        if (!isValid && errors.email) {
          validationErrors.email = errors.email
        }
      }

      if (!formData.phone.trim()) {
        validationErrors.phone = 'Phone number is required'
      } else {
        const { isValid, errors } = validateAndSanitizeForm(
          { phone: formData.phone },
          { phone: [VALIDATION_RULES.phone] }
        )
        if (!isValid && errors.phone) {
          validationErrors.phone = errors.phone
        }
      }

      if (!formData.dateOfBirth) {
        validationErrors.dateOfBirth = 'Date of birth is required'
      } else {
        const dob = new Date(formData.dateOfBirth)
        const age = new Date().getFullYear() - dob.getFullYear()
        if (age < 18) {
          validationErrors.dateOfBirth = 'You must be at least 18 years old'
        }
      }

      if (!formData.ssn.trim()) {
        validationErrors.ssn = 'Social Security Number is required'
      } else if (formData.ssn.replace(/\D/g, '').length !== 9) {
        validationErrors.ssn = 'Please enter a valid 9-digit Social Security Number'
      }

      // Application Details
      if (!formData.amountRequested.trim()) {
        validationErrors.amountRequested = 'Requested amount is required'
      } else {
        const amount = parseFloat(formData.amountRequested)
        if (isNaN(amount) || amount < 100 || amount > 1000) {
          validationErrors.amountRequested = 'Amount must be between $100 and $1000'
        }
      }

      if (formData.specialRequirements && formData.specialRequirements.length > 1000) {
        validationErrors.specialRequirements = 'Special requirements must be less than 1000 characters'
      }
    } else if (currentStep === 2) {
      // Step 2: Consent and Eligibility
      if (!formData.eligibilityAccepted) {
        validationErrors.eligibilityAccepted = 'You must accept the eligibility criteria'
      }

      if (!formData.consentAccepted) {
        validationErrors.consentAccepted = 'You must accept the privacy consent'
      }
    }

    return Object.keys(validationErrors).length === 0
  }

  // Handle form submission with validation
  function handleSubmit(event: Event) {
    event.preventDefault()

    if (!validateCurrentStep()) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0]
      const errorElement = document.getElementById(firstErrorField)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        errorElement.focus()
      }
      return
    }

    // Sanitize form data before submission
    const sanitizedData = {
      ...formData,
      fullName: sanitizeInput(formData.fullName),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      specialRequirements: sanitizeInput(formData.specialRequirements)
    }

    // Update form data with sanitized values
    formData = sanitizedData

    // Continue with normal form submission
    isSubmitting = true
  }

  // Debounced auto-save
  function scheduleAutoSave() {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = setTimeout(autoSave, 1000) // Save after 1 second of inactivity
  }

  // Reactive auto-save on form data changes
  $: if (formData || currentStep) {
    scheduleAutoSave()
  }

  // Clear saved data and reset submitting state on successful submission
  $: if ($page.status === 200 && $page.url.pathname === '/get-aid/success') {
    localStorage.removeItem(AUTO_SAVE_KEY)
    isSubmitting = false
  }

  // Reset submitting state on form errors and focus on error
  $: if (form?.error) {
    isSubmitting = false
    // Focus management for error alerts
    setTimeout(() => {
      if (errorAlert) {
        errorAlert.focus()
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  // Form validation (old - keeping for compatibility)
  // $: isStep1Valid = formData.eligibilityAccepted;
  // $: isStep2Valid = formData.consentAccepted;

  // Enhanced validation for step 3 with specific error messages
  $: nameError =
    formData.fullName.trim().length < 2
      ? 'Full name is required - please enter your complete legal name as it appears on official documents'
      : formData.fullName.trim().length > 0 && formData.fullName.trim().length < 2
        ? 'Please enter at least 2 characters for your name'
        : ''
  $: dobError = !formData.dateOfBirth
    ? 'Date of birth is required - please select your birth date using the date picker'
    : ''
  $: ssnError =
    formData.ssn.replace(/-/g, '').length === 0
      ? 'Social Security Number is required for income verification'
      : formData.ssn.replace(/-/g, '').length > 0 && formData.ssn.replace(/-/g, '').length !== 9
        ? 'Please enter a complete 9-digit Social Security Number (format: XXX-XX-XXXX)'
        : ''
  // Step validation based on new structure
  $: isStep1Valid = validateCurrentStep() && currentStep === 1
  $: isStep2Valid = formData.eligibilityAccepted && formData.consentAccepted
  $: canProceed = currentStep === 1 ? isStep1Valid : currentStep === 2 ? isStep2Valid : true // Step 3 is always valid for submission

  function nextStep() {
    if (canProceed && currentStep < 3) {
      currentStep++
      // Focus management for accessibility
      setTimeout(() => {
        const stepHeading = document.querySelector('h2[id="application-form-title"]') as HTMLElement
        if (stepHeading) {
          stepHeading.focus()
          stepHeading.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--
      // Focus management for accessibility
      setTimeout(() => {
        const stepHeading = document.querySelector('h2[id="application-form-title"]') as HTMLElement
        if (stepHeading) {
          stepHeading.focus()
          stepHeading.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  // Format SSN input
  function formatSSN(value: string) {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/)
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`
    }
    return cleaned
  }

  // Handle SSN input formatting
  function handleSSNInput(event: Event) {
    const input = event.currentTarget as HTMLInputElement
    formData.ssn = formatSSN(input.value || '')
  }

  $: if (form?.success) {
    goto('/get-aid/success')
  }
</script>

<svelte:head>
  <title>Apply for Aid - Metzler Foundations</title>
  <meta
    name="description"
    content="Apply for housing scholarships. Dignified, fast, and confidential assistance for individuals in recovery."
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
  <main class="py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Enhanced Progress Indicator -->
      <div class="mb-8">
        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between text-sm text-navy text-opacity-60 mb-2">
            <span>Application Progress</span>
            <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-olive h-2 rounded-full transition-all duration-300 ease-out"
              style="width: {Math.round((currentStep / 3) * 100)}%"
            ></div>
          </div>
        </div>

        <!-- Step Indicators -->
        <div class="flex items-center justify-center space-x-2 mb-6">
          <div class="flex items-center">
            <div
              class={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                currentStep >= 1 ? 'bg-navy text-cream shadow-md' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {#if currentStep > 1}
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              {:else}
                1
              {/if}
            </div>
            <div class="ml-3 text-left">
              <div class={`text-sm font-medium ${currentStep >= 1 ? 'text-navy' : 'text-gray-500'}`}>
                Application Details
              </div>
              <div class="text-xs text-navy text-opacity-60">Personal & housing info</div>
            </div>
          </div>

          <div class={`w-8 h-0.5 transition-colors duration-200 ${currentStep >= 2 ? 'bg-navy' : 'bg-gray-200'}`}></div>

          <div class="flex items-center">
            <div
              class={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                currentStep >= 2 ? 'bg-navy text-cream shadow-md' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {#if currentStep > 2}
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              {:else}
                2
              {/if}
            </div>
            <div class="ml-3 text-left">
              <div class={`text-sm font-medium ${currentStep >= 2 ? 'text-navy' : 'text-gray-500'}`}>Legal Consent</div>
              <div class="text-xs text-navy text-opacity-60">Review privacy terms</div>
            </div>
          </div>

          <div class={`w-8 h-0.5 transition-colors duration-200 ${currentStep >= 3 ? 'bg-navy' : 'bg-gray-200'}`}></div>

          <div class="flex items-center">
            <div
              class={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                currentStep >= 3 ? 'bg-navy text-cream shadow-md' : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </div>
            <div class="ml-3 text-left">
              <div class={`text-sm font-medium ${currentStep >= 3 ? 'text-navy' : 'text-gray-500'}`}>
                Review & Submit
              </div>
              <div class="text-xs text-navy text-opacity-60">Final verification</div>
            </div>
          </div>
        </div>

        <!-- Current Step Description -->
        <div class="text-center mb-4">
          <h2 class="text-lg font-medium text-navy mb-1">
            {#if currentStep === 1}
              Step 1: Confirm Eligibility
            {:else if currentStep === 2}
              Step 2: Review Consent Agreement
            {:else}
              Step 3: Complete Verification
            {/if}
          </h2>
          <p class="text-sm text-navy text-opacity-70">
            {#if currentStep === 1}
              Tell us about your situation to ensure we can help
            {:else if currentStep === 2}
              Understand how we protect your privacy and data
            {:else}
              Provide verification details for instant processing
            {/if}
          </p>
        </div>

        <!-- Auto-save Status -->
        {#if lastSaved}
          <div class="text-center text-sm text-navy text-opacity-60 bg-olive bg-opacity-10 rounded-lg py-2 px-4">
            <svg class="inline h-4 w-4 mr-1 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Progress saved automatically - Last saved: {lastSaved}
          </div>
        {/if}
      </div>

      <!-- Form -->
      <form
        method="POST"
        action="?/apply"
        class="bg-white shadow-md rounded-lg p-8"
        role="main"
        aria-labelledby="application-form-title"
      >
        {#if currentStep === 1}
          <!-- Step 1: Eligibility Check -->
          <div class="space-y-6">
            <h2 id="application-form-title" class="text-2xl font-medium text-navy mb-6 text-center">
              Your Application Details
            </h2>

            <div class="bg-navy bg-opacity-5 rounded-lg p-6 mb-6">
              <h3 class="font-medium text-navy mb-3">Our scholarships are for individuals in Colorado who are:</h3>
              <ul class="space-y-2 text-navy text-opacity-80">
                <li>• Transitioning from a treatment facility</li>
                <li>• At immediate risk of houselessness</li>
                <li>• Seeking entry into a certified sober living home</li>
              </ul>
            </div>

            <div class="border border-navy border-opacity-20 rounded-lg p-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="eligibility"
                    bind:checked={formData.eligibilityAccepted}
                    type="checkbox"
                    class="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
                    required
                    aria-describedby="eligibility-description"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="eligibility" class="font-medium text-navy">
                    I understand and meet these initial eligibility criteria
                  </label>
                  <p id="eligibility-description" class="text-navy text-opacity-60 mt-1">
                    Our scholarships are one-time only and cannot be combined with other rental assistance programs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        {:else if currentStep === 2}
          <!-- Step 2: Legal Consent -->
          <div class="space-y-6">
            <h2 class="text-2xl font-medium text-navy mb-6 text-center">Your Privacy is Our Priority</h2>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 000 16zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    Because we handle Protected Health Information (PHI) and Substance Use Disorder (SUD) records, we
                    are bound by federal law (42 CFR Part 2) and the Colorado Privacy Act (CPA).
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-navy mb-4">Consent Agreement</h3>

              <div class="text-sm text-navy text-opacity-80 space-y-3 mb-6">
                <p>
                  I consent to allow Metzler Foundations to use my information to verify my eligibility for social
                  service programs and to coordinate my scholarship payment with a sober living provider.
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
                    class="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
                    required
                    aria-describedby="consent-description"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="consent" class="font-medium text-navy">
                    I have read and understand the consent agreement above
                  </label>
                  <p id="consent-description" class="text-navy text-opacity-60 mt-1">
                    This consent is required to process your scholarship application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        {:else if currentStep === 3}
          <!-- Step 3: Automated Verification -->
          <div class="space-y-6">
            <h2 class="text-2xl font-medium text-navy mb-6 text-center">Review & Submit Application</h2>

            <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">
                    <strong>Dignity Through Speed:</strong> No pay stubs or paperwork required. We use secure, automated
                    verification services to respect your privacy.
                  </p>
                </div>
              </div>
            </div>

            <!-- Hidden form fields -->
            <input type="hidden" name="eligibility_accepted" value={formData.eligibilityAccepted} />
            <input type="hidden" name="consent_accepted" value={formData.consentAccepted} />

            <!-- Full Name -->
            <div>
              <label for="full_name" class="block text-sm font-medium text-navy mb-1"> Full Legal Name * </label>
              <input
                type="text"
                id="fullName"
                name="full_name"
                bind:value={formData.fullName}
                required
                class={`form-input ${validationErrors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your full legal name"
                aria-required="true"
                aria-invalid={validationErrors.fullName ? 'true' : 'false'}
                aria-describedby={validationErrors.fullName ? 'fullName-error' : undefined}
              />
              {#if validationErrors.fullName}
                <p id="fullName-error" class="mt-1 text-sm text-red-600" role="alert">{validationErrors.fullName}</p>
              {/if}
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-navy mb-1"> Email Address * </label>
              <input
                type="email"
                id="email"
                name="email"
                bind:value={formData.email}
                required
                class={`form-input ${validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="your.email@example.com"
                autocomplete="email"
                aria-required="true"
                aria-invalid={validationErrors.email ? 'true' : 'false'}
                aria-describedby={validationErrors.email ? 'email-error' : undefined}
              />
              {#if validationErrors.email}
                <p id="email-error" class="mt-1 text-sm text-red-600" role="alert">{validationErrors.email}</p>
              {/if}
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-navy mb-1"> Phone Number * </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                bind:value={formData.phone}
                required
                class={`form-input ${validationErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="(555) 123-4567"
                autocomplete="tel"
                inputmode="tel"
                aria-required="true"
                aria-invalid={validationErrors.phone ? 'true' : 'false'}
                aria-describedby={validationErrors.phone ? 'phone-error' : undefined}
              />
              {#if validationErrors.phone}
                <p id="phone-error" class="mt-1 text-sm text-red-600" role="alert">{validationErrors.phone}</p>
              {/if}
            </div>

            <!-- Date of Birth -->
            <div>
              <label for="date_of_birth" class="block text-sm font-medium text-navy mb-1"> Date of Birth * </label>
              <input
                type="date"
                id="dateOfBirth"
                name="date_of_birth"
                bind:value={formData.dateOfBirth}
                required
                class={`form-input ${validationErrors.dateOfBirth ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                aria-required="true"
                aria-invalid={validationErrors.dateOfBirth ? 'true' : 'false'}
                aria-describedby={validationErrors.dateOfBirth ? 'dateOfBirth-error' : 'dob-help'}
                placeholder="MM/DD/YYYY"
              />
              <p id="dob-help" class="mt-1 text-xs text-navy text-opacity-60">
                Must be 18+ years old for housing assistance
              </p>
              {#if validationErrors.dateOfBirth}
                <p id="dateOfBirth-error" class="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.dateOfBirth}
                </p>
              {/if}
            </div>

            <!-- SSN -->
            <div>
              <label for="ssn" class="block text-sm font-medium text-navy mb-1"> Social Security Number * </label>
              <input
                type="text"
                id="ssn"
                name="ssn"
                bind:value={formData.ssn}
                on:input={handleSSNInput}
                maxlength="11"
                required
                class={`form-input ${validationErrors.ssn ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="XXX-XX-XXXX"
                inputmode="numeric"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                aria-required="true"
                aria-invalid={validationErrors.ssn ? 'true' : 'false'}
                aria-describedby={validationErrors.ssn ? 'ssn-error ssn-description' : 'ssn-description'}
              />
              {#if validationErrors.ssn}
                <p id="ssn-error" class="mt-1 text-sm text-red-600" role="alert">{validationErrors.ssn}</p>
              {/if}
              <p id="ssn-description" class="text-xs text-navy text-opacity-60 mt-2">
                <strong>We use this ONLY</strong> to securely and instantly check your income eligibility with an automated
                verification service like The Work Number. Your SSN is encrypted, never stored, and never shared.
              </p>
            </div>

            <!-- Amount Requested -->
            <div>
              <label for="amountRequested" class="block text-sm font-medium text-navy mb-1">
                Scholarship Amount Requested *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-navy text-opacity-50 text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amountRequested"
                  name="amount_requested"
                  bind:value={formData.amountRequested}
                  required
                  min="1"
                  max="10000"
                  class={`form-input pl-8 ${validationErrors.amountRequested ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="300"
                  aria-required="true"
                  aria-invalid={validationErrors.amountRequested ? 'true' : 'false'}
                  aria-describedby={validationErrors.amountRequested ? 'amountRequested-error' : 'amount-help'}
                />
              </div>
              <p id="amount-help" class="mt-1 text-xs text-navy text-opacity-60">
                Standard amount is $300 (one month's housing). Maximum $10,000.
              </p>
              {#if validationErrors.amountRequested}
                <p id="amountRequested-error" class="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.amountRequested}
                </p>
              {/if}
            </div>

            <!-- Preferred Start Date -->
            <div>
              <label for="preferredStartDate" class="block text-sm font-medium text-navy mb-1">
                Preferred Start Date
              </label>
              <input
                type="date"
                id="preferredStartDate"
                name="preferred_start_date"
                bind:value={formData.preferredStartDate}
                class="form-input"
                min={new Date().toISOString().split('T')[0]}
                placeholder="Select preferred move-in date"
              />
              <p class="mt-1 text-xs text-navy text-opacity-60">
                When would you like to start your housing? (optional)
              </p>
            </div>

            <!-- Special Requirements -->
            <div>
              <label for="specialRequirements" class="block text-sm font-medium text-navy mb-1">
                Special Requirements or Notes
              </label>
              <textarea
                id="specialRequirements"
                name="special_requirements"
                bind:value={formData.specialRequirements}
                rows="4"
                class={`form-input ${validationErrors.specialRequirements ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Any special housing needs, accessibility requirements, or additional information..."
                maxlength="1000"
                aria-invalid={validationErrors.specialRequirements ? 'true' : 'false'}
                aria-describedby={validationErrors.specialRequirements ? 'specialRequirements-error' : undefined}
              ></textarea>
              <p class="mt-1 text-xs text-navy text-opacity-60">
                {formData.specialRequirements?.length || 0}/1000 characters
              </p>
              {#if validationErrors.specialRequirements}
                <p id="specialRequirements-error" class="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.specialRequirements}
                </p>
              {/if}
            </div>

            <div class="bg-navy bg-opacity-5 rounded-lg p-4 mt-6">
              <div class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-olive mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <div>
                  <p class="text-sm text-navy font-medium">Secure & Private</p>
                  <p class="text-sm text-navy text-opacity-70 mt-1">
                    Your information is protected by bank-level encryption and HIPAA compliance standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        {/if}

        {#if form?.error}
          <div
            class="flex bg-red-50 border border-red-200 rounded-lg p-4"
            role="alert"
            aria-live="assertive"
            tabindex="-1"
            bind:this={errorAlert}
          >
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Application Submission Failed</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>
                  {form?.error?.message ||
                    'We encountered an issue processing your application. Please check your information and try again.'}
                </p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Navigation Buttons -->
        <div class="mt-8 flex justify-between" role="group" aria-label="Form navigation">
          {#if currentStep > 1}
            <button
              type="button"
              on:click={prevStep}
              class="px-4 py-2 text-sm font-medium text-navy bg-white border border-navy border-opacity-20 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-navy focus:ring-offset-2"
              aria-label="Go to previous step"
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
              class="px-6 py-2 text-sm font-medium text-cream bg-navy border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-navy focus:ring-offset-2"
              aria-label="Go to next step"
            >
              Next Step
            </button>
          {:else}
            <button
              type="submit"
              disabled={!canProceed || isSubmitting}
              on:click={handleSubmit}
              class="px-6 py-2 text-sm font-medium text-cream bg-navy border border-transparent rounded-md shadow-sm hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-navy focus:ring-offset-2 flex items-center justify-center min-w-[140px]"
              aria-live="polite"
              aria-label={isSubmitting ? 'Submitting your application...' : 'Submit your application'}
            >
              {#if isSubmitting}
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-cream" fill="none" viewBox="0 0 24 24">
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
      <div class="mt-8 text-center text-sm text-navy text-opacity-60">
        <p>Your privacy and dignity are our highest priorities.</p>
        <p class="mt-1">All information is protected under HIPAA and 42 CFR Part 2.</p>
      </div>
    </div>
  </main>
</div>
