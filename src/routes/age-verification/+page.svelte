<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  let birthDate = $state('')
  let isMinor = $state(false)
  let requiresParentalConsent = $state(false)
  let parentalConsentForm = $state({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    relationship: '',
    consentGiven: false,
    verificationMethod: 'email'
  })
  let verificationStep = $state<'age-check' | 'parental-consent' | 'verification-sent' | 'approved'>('age-check')
  let error = $state('')
  let loading = $state(false)

  function calculateAge(birthDate: string): number {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  function handleAgeCheck() {
    error = ''
    
    if (!birthDate) {
      error = 'Please enter your birth date'
      return
    }
    
    const age = calculateAge(birthDate)
    
    if (age < 13) {
      // COPPA compliance - requires parental consent for under 13
      isMinor = true
      requiresParentalConsent = true
      verificationStep = 'parental-consent'
    } else if (age < 18) {
      // Minor but over 13 - may require parental consent depending on jurisdiction
      isMinor = true
      requiresParentalConsent = true
      verificationStep = 'parental-consent'
    } else {
      // Adult - proceed normally
      isMinor = false
      requiresParentalConsent = false
      verificationStep = 'approved'
      
      // Store age verification in localStorage
      localStorage.setItem('age-verified', JSON.stringify({
        verified: true,
        age: age,
        date: new Date().toISOString(),
        requiresParentalConsent: false
      }))
      
      // Redirect after 2 seconds
      setTimeout(() => {
        goto('/')
      }, 2000)
    }
  }

  async function handleParentalConsent() {
    error = ''
    loading = true
    
    // Validate form
    if (!parentalConsentForm.parentName || !parentalConsentForm.parentEmail || !parentalConsentForm.relationship) {
      error = 'Please fill in all required fields'
      loading = false
      return
    }
    
    if (!parentalConsentForm.consentGiven) {
      error = 'Parental consent must be given'
      loading = false
      return
    }
    
    try {
      // Simulate API call for parental consent verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store parental consent information
      localStorage.setItem('parental-consent', JSON.stringify({
        parentName: parentalConsentForm.parentName,
        parentEmail: parentalConsentForm.parentEmail,
        relationship: parentalConsentForm.relationship,
        verificationMethod: parentalConsentForm.verificationMethod,
        consentDate: new Date().toISOString(),
        minorAge: calculateAge(birthDate)
      }))
      
      verificationStep = 'verification-sent'
      
      // In a real implementation, this would send verification email/SMS to parent
      console.log('Parental consent verification sent to:', parentalConsentForm.parentEmail)
      
    } catch (err) {
      error = 'Failed to process parental consent. Please try again.'
    } finally {
      loading = false
    }
  }

  function handleVerificationComplete() {
    // Store final verification
    localStorage.setItem('age-verified', JSON.stringify({
      verified: true,
      age: calculateAge(birthDate),
      date: new Date().toISOString(),
      requiresParentalConsent: true,
      parentalConsentVerified: true
    }))
    
    verificationStep = 'approved'
    
    // Redirect after 2 seconds
    setTimeout(() => {
      goto('/')
    }, 2000)
  }

  onMount(() => {
    // Check if already verified
    const existingVerification = localStorage.getItem('age-verified')
    if (existingVerification) {
      const verification = JSON.parse(existingVerification)
      if (verification.verified) {
        goto('/')
      }
    }
  })
</script>

<svelte:head>
  <title>Age Verification & Parental Consent - Metzler Foundations</title>
  <meta name="description" content="Age verification and parental consent system for minors accessing addiction recovery housing services. COPPA compliant." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-2">Age Verification Required</h1>
        <p class="text-blue-100">To ensure compliance with privacy laws and provide appropriate services</p>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      {#if verificationStep === 'age-check'}
        <div class="space-y-6">
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="text-yellow-800 font-semibold">Privacy Protection Notice</h3>
                <p class="text-yellow-700 text-sm mt-1">
                  We are required by law (COPPA, GDPR, CCPA) to verify your age before providing access to our services. 
                  This helps us protect minors and ensure appropriate privacy safeguards.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">
              Please enter your date of birth *
            </label>
            <input
              type="date"
              id="birthDate"
              bind:value={birthDate}
              max={new Date().toISOString().split('T')[0]}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {#if error}
            <div class="bg-red-50 border border-red-200 rounded-md p-3">
              <p class="text-red-600 text-sm">{error}</p>
            </div>
          {/if}

          <button
            onclick={handleAgeCheck}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
          >
            Continue
          </button>
        </div>

      {:else if verificationStep === 'parental-consent'}
        <div class="space-y-6">
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <h3 class="text-blue-800 font-semibold">Parental Consent Required</h3>
                <p class="text-blue-700 text-sm mt-1">
                  Since you are under 18, we need consent from your parent or legal guardian to continue. 
                  This is required by law to protect your privacy and ensure appropriate services.
                </p>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label for="parentName" class="block text-sm font-medium text-gray-700 mb-2">
                Parent/Legal Guardian Name *
              </label>
              <input
                type="text"
                id="parentName"
                bind:value={parentalConsentForm.parentName}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Smith"
                required
              />
            </div>

            <div>
              <label for="parentEmail" class="block text-sm font-medium text-gray-700 mb-2">
                Parent Email Address *
              </label>
              <input
                type="email"
                id="parentEmail"
                bind:value={parentalConsentForm.parentEmail}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="parent@example.com"
                required
              />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label for="parentPhone" class="block text-sm font-medium text-gray-700 mb-2">
                Parent Phone Number
              </label>
              <input
                type="tel"
                id="parentPhone"
                bind:value={parentalConsentForm.parentPhone}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label for="relationship" class="block text-sm font-medium text-gray-700 mb-2">
                Relationship to You *
              </label>
              <select
                id="relationship"
                bind:value={parentalConsentForm.relationship}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select relationship</option>
                <option value="mother">Mother</option>
                <option value="father">Father</option>
                <option value="legal-guardian">Legal Guardian</option>
                <option value="step-parent">Step Parent</option>
                <option value="grandparent">Grandparent</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label for="verificationMethod" class="block text-sm font-medium text-gray-700 mb-2">
              Verification Method
            </label>
            <select
              id="verificationMethod"
              bind:value={parentalConsentForm.verificationMethod}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="email">Email Verification</option>
              <option value="phone">Phone Verification</option>
              <option value="document">Document Upload</option>
            </select>
          </div>

          <div class="bg-gray-50 p-4 rounded-md">
            <div class="flex items-start">
              <input
                type="checkbox"
                id="consentGiven"
                bind:checked={parentalConsentForm.consentGiven}
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="consentGiven" class="ml-3 text-sm text-gray-700">
                <strong>I confirm that my parent/legal guardian has given consent for me to use this website and its services.</strong>
                They understand that this involves sharing personal information and accessing addiction recovery resources.
              </label>
            </div>
          </div>

          {#if error}
            <div class="bg-red-50 border border-red-200 rounded-md p-3">
              <p class="text-red-600 text-sm">{error}</p>
            </div>
          {/if}

          <div class="flex gap-4">
            <button
              onclick={() => verificationStep = 'age-check'}
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200"
            >
              Back
            </button>
            <button
              onclick={handleParentalConsent}
              disabled={loading}
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
            >
              {loading ? 'Processing...' : 'Send Verification'}
            </button>
          </div>
        </div>

      {:else if verificationStep === 'verification-sent'}
        <div class="space-y-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Verification Sent!</h2>
            <p class="text-gray-600">
              We've sent a verification request to <strong>{parentalConsentForm.parentEmail}</strong>.
              Your parent/legal guardian needs to confirm their consent before you can continue.
            </p>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 text-left">
            <h3 class="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Your parent will receive an email with verification instructions</li>
              <li>• They need to confirm their identity and consent</li>
              <li>• Once verified, you'll be able to access our services</li>
              <li>• This process typically takes 1-2 business days</li>
            </ul>
          </div>

          <button
            onclick={handleVerificationComplete}
            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
          >
            Verification Complete (Demo)
          </button>
        </div>

      {:else if verificationStep === 'approved'}
        <div class="space-y-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Verification Complete!</h2>
            <p class="text-gray-600">
              Thank you for completing the age verification process. You now have access to our services.
            </p>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-md p-4">
            <p class="text-sm text-green-800">
              Redirecting you to the homepage in a moment...
            </p>
          </div>
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <div class="bg-gray-50 px-8 py-4 rounded-b-lg">
      <div class="text-center text-sm text-gray-600">
        <p>This verification helps us comply with COPPA, GDPR, and other privacy protection laws.</p>
        <p class="mt-1">
          <a href="/privacy" class="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a> |
          <a href="/terms" class="text-blue-600 hover:text-blue-800 underline">Terms of Service</a>
        </p>
      </div>
    </div>
  </div>
</div>