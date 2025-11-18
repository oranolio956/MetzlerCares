<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  export let persona: string;
  export let showRealTimeIndicator: boolean = true;
  
  const dispatch = createEventDispatcher();
  
  let step = 1;
  let isVerifying = false;
  let verificationResult: any = null;
  let error = '';
  let progress = 0;
  
  let formData = {
    provider: '',
    memberId: '',
    groupNumber: '',
    dob: '',
    firstName: '',
    lastName: ''
  };
  
  const insuranceProviders = [
    'Medicaid',
    'Medicare', 
    'Aetna',
    'Blue Cross Blue Shield',
    'Cigna',
    'Humana',
    'Kaiser Permanente',
    'UnitedHealthcare',
    'TriCare',
    'Other'
  ];
  
  const steps = [
    'Personal Info',
    'Insurance Details', 
    'Verification'
  ];
  
  onMount(() => {
    // Track insurance verification start
    trackEvent('insurance_verification_start', { persona, step: 1 });
  });
  
  async function handleNext() {
    if (step < 3) {
      step++;
      progress = (step - 1) * 50;
      trackEvent('insurance_verification_step', { persona, step });
    } else {
      await verifyInsurance();
    }
  }
  
  function handleBack() {
    if (step > 1) {
      step--;
      progress = (step - 1) * 50;
    }
  }
  
  async function verifyInsurance() {
    isVerifying = true;
    error = '';
    
    trackEvent('insurance_verification_submit', { persona, provider: formData.provider });
    
    try {
      const response = await fetch('/api/insurance/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: formData.provider,
          memberId: formData.memberId,
          groupNumber: formData.groupNumber,
          dob: formData.dob,
          firstName: formData.firstName,
          lastName: formData.lastName,
          persona
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        verificationResult = result;
        trackEvent('insurance_verification_success', { 
          persona, 
          provider: formData.provider,
          verified: result.verified 
        });
        dispatch('verificationComplete', result);
      } else {
        error = result.error || 'Verification failed. Please try again.';
        trackEvent('insurance_verification_error', { 
          persona, 
          provider: formData.provider,
          error: error 
        });
      }
    } catch (err) {
      error = 'Network error. Please check your connection.';
      trackEvent('insurance_verification_error', { 
        persona, 
        provider: formData.provider,
        error: error 
      });
    } finally {
      isVerifying = false;
    }
  }
  
  function trackEvent(eventType: string, metadata: any) {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventType, {
        'persona': metadata.persona,
        'step': metadata.step,
        'provider': metadata.provider,
        'verified': metadata.verified,
        'error': metadata.error
      });
    }
    
    // Custom analytics endpoint
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        persona: metadata.persona,
        metadata
      })
    }).catch(console.error);
  }
  
  function resetForm() {
    step = 1;
    progress = 0;
    verificationResult = null;
    error = '';
    formData = {
      provider: '',
      memberId: '',
      groupNumber: '',
      dob: '',
      firstName: '',
      lastName: ''
    };
  }
  
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
</script>

<div class="insurance-verifier max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
  {#if showRealTimeIndicator}
    <div class="real-time-indicator mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
        <span class="text-sm text-blue-700 font-medium">
          Real-time verification with major insurance providers
        </span>
      </div>
    </div>
  {/if}
  
  {#if !verificationResult}
    <!-- Progress Bar -->
    <div class="mb-6">
      <div class="flex justify-between mb-2">
        {#each steps as stepName, index}
          <div class="text-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300
              {step > index + 1 ? 'bg-green-500 text-white' : step === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}">
              {step > index + 1 ? '✓' : index + 1}
            </div>
            <div class="text-xs mt-1 text-gray-600">{stepName}</div>
          </div>
          {#if index < steps.length - 1}
            <div class="flex-1 h-0.5 bg-gray-200 mt-4 mx-2"></div>
          {/if}
        {/each}
      </div>
      <div class="mt-4 bg-gray-200 rounded-full h-2">
        <div class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: {progress}%"></div>
      </div>
    </div>
    
    <!-- Step 1: Personal Info -->
    {#if step === 1}
      <div in:fade={{ duration: 300 }}>
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                id="firstName"
                bind:value={formData.firstName}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                id="lastName"
                bind:value={formData.lastName}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label for="dob" class="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input
              type="date"
              id="dob"
              bind:value={formData.dob}
              max={new Date().toISOString().split('T')[0]}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Step 2: Insurance Details -->
    {#if step === 2}
      <div in:fade={{ duration: 300 }}>
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Insurance Information</h3>
        <div class="space-y-4">
          <div>
            <label for="provider" class="block text-sm font-medium text-gray-700 mb-1">Insurance Provider *</label>
            <select
              id="provider"
              bind:value={formData.provider}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your insurance provider</option>
              {#each insuranceProviders as provider}
                <option value={provider}>{provider}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="memberId" class="block text-sm font-medium text-gray-700 mb-1">Member ID *</label>
            <input
              type="text"
              id="memberId"
              bind:value={formData.memberId}
              placeholder="Enter your member ID"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label for="groupNumber" class="block text-sm font-medium text-gray-700 mb-1">Group Number (if applicable)</label>
            <input
              type="text"
              id="groupNumber"
              bind:value={formData.groupNumber}
              placeholder="Enter group number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <!-- Trust indicators -->
        <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-green-700">
              Your information is secure and encrypted. Verification takes less than 30 seconds.
            </span>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Step 3: Verification -->
    {#if step === 3}
      <div in:fade={{ duration: 300 }}>
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Verify Your Information</h3>
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-600">Name:</span>
              <span class="ml-2 text-gray-800">{formData.firstName} {formData.lastName}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">DOB:</span>
              <span class="ml-2 text-gray-800">{formData.dob}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Provider:</span>
              <span class="ml-2 text-gray-800">{formData.provider}</span>
            </div>
            <div>
              <span class="font-medium text-gray-600">Member ID:</span>
              <span class="ml-2 text-gray-800">{'*'.repeat(formData.memberId.length - 4)}{formData.memberId.slice(-4)}</span>
            </div>
          </div>
        </div>
        
        {#if error}
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{error}</p>
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-6">
      <button
        on:click={handleBack}
        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors {step === 1 ? 'invisible' : ''}"
      >
        Back
      </button>
      <button
        on:click={handleNext}
        disabled={isVerifying}
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        {#if isVerifying}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying...
        {:else}
          {step === 3 ? 'Verify Insurance' : 'Next'}
        {/if}
      </button>
    </div>
  {:else}
    <!-- Verification Results -->
    <div in:fly={{ duration: 500, y: 20 }}>
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center {verificationResult.verified ? 'bg-green-100' : 'bg-red-100'}">
          <svg class="w-8 h-8 {verificationResult.verified ? 'text-green-600' : 'text-red-600'}" fill="currentColor" viewBox="0 0 20 20">
            {#if verificationResult.verified}
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            {:else}
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            {/if}
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2 {verificationResult.verified ? 'text-green-800' : 'text-red-800'}">
          {verificationResult.verified ? 'Insurance Verified!' : 'Verification Failed'}
        </h3>
        <p class="text-gray-600">
          {verificationResult.verified ? 'Your insurance coverage has been confirmed.' : verificationResult.message}
        </p>
      </div>
      
      {#if verificationResult.verified && verificationResult.coverage}
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 class="font-semibold text-green-800 mb-3">Coverage Details</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-green-700">Coverage Type:</span>
              <p class="text-green-800">{verificationResult.coverage.type}</p>
            </div>
            <div>
              <span class="font-medium text-green-700">Network Status:</span>
              <p class="text-green-800">{verificationResult.coverage.networkStatus}</p>
            </div>
            <div>
              <span class="font-medium text-green-700">Deductible:</span>
              <p class="text-green-800">{formatCurrency(verificationResult.coverage.deductible)}</p>
            </div>
            <div>
              <span class="font-medium text-green-700">Copay:</span>
              <p class="text-green-800">{formatCurrency(verificationResult.coverage.copay)}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 class="font-semibold text-blue-800 mb-2">Next Steps</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• You qualify for treatment coverage</li>
            <li>• Same-day admission may be available</li>
            <li>• Our admissions team will contact you within 30 minutes</li>
          </ul>
        </div>
      {/if}
      
      <div class="flex gap-3">
        <button
          on:click={resetForm}
          class="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Verify Another
        </button>
        {#if verificationResult.verified}
          <button
            on:click={() => dispatch('continueToAdmission')}
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue to Admission
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .insurance-verifier {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>