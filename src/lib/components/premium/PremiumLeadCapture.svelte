<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import PremiumCard from './PremiumCard.svelte';
  import PremiumButton from './PremiumButton.svelte';
  import { trackFormInteraction } from '$lib/utils/analytics';

  export let variant: 'assessment' | 'consultation' | 'insurance' | 'download' = 'assessment';
  export let title = '';
  export let subtitle = '';
  export let showProgress = true;
  export let multiStep = true;

  const dispatch = createEventDispatcher();

  let currentStep = 1;
  let totalSteps = 3;
  let isSubmitting = false;
  let showSuccess = false;

  let formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    insurance: '',
    concern: '',
    urgency: '',
    preferredContact: 'phone',
    bestTime: 'morning'
  };

  let errors = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  $: if (!title) {
    switch (variant) {
      case 'assessment':
        title = 'Free Recovery Assessment';
        subtitle = 'Get a personalized treatment recommendation in 2 minutes';
        break;
      case 'consultation':
        title = 'Free Consultation';
        subtitle = 'Speak with a recovery specialist today';
        break;
      case 'insurance':
        title = 'Verify Insurance';
        subtitle = 'Check your coverage in 30 seconds';
        break;
      case 'download':
        title = 'Free Recovery Guide';
        subtitle = 'Download our comprehensive recovery resource';
        break;
    }
  }

  function validateStep(step: number): boolean {
    let isValid = true;
    errors = { firstName: '', lastName: '', email: '', phone: '' };

    if (step === 1) {
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
        isValid = false;
      }
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email';
        isValid = false;
      }
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
        isValid = false;
      }
    }

    return isValid;
  }

  function handleNext() {
    if (multiStep && currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        currentStep++;
        trackFormInteraction(variant, 'start', currentStep);
      }
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  async function handleSubmit() {
    if (!validateStep(currentStep)) return;

    isSubmitting = true;
    trackFormInteraction(variant, 'complete', currentStep);

    // Simulate API call
    setTimeout(() => {
      isSubmitting = false;
      showSuccess = true;
      
      dispatch('submit', { 
        formData, 
        variant,
        timestamp: new Date() 
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        showSuccess = false;
        currentStep = 1;
        formData = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          insurance: '',
          concern: '',
          urgency: '',
          preferredContact: 'phone',
          bestTime: 'morning'
        };
      }, 3000);
    }, 1500);
  }

  function getStepTitle(step: number): string {
    switch (variant) {
      case 'assessment':
        switch (step) {
          case 1: return 'Contact Information';
          case 2: return 'Your Situation';
          case 3: return 'Preferences';
          default: return 'Information';
        }
      case 'consultation':
        switch (step) {
          case 1: return 'Contact Details';
          case 2: return 'Consultation Needs';
          case 3: return 'Schedule';
          default: return 'Details';
        }
      case 'insurance':
        switch (step) {
          case 1: return 'Basic Info';
          case 2: return 'Insurance Details';
          case 3: return 'Verification';
          default: return 'Information';
        }
      default:
        return `Step ${step}`;
    }
  }

  function formatPhoneNumber(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  }

  function handlePhoneInput(event: Event) {
    const target = event.target as HTMLInputElement;
    target.value = formatPhoneNumber(target.value);
    formData.phone = target.value;
  }
</script>

<div class="w-full max-w-2xl mx-auto">
  <PremiumCard
    variant="highlighted"
    glow={true}
    class="p-8"
  >
    {#if showSuccess}
      <div 
        class="text-center py-8"
        transition:fade={{ duration: 600 }}
      >
        <div class="text-6xl mb-4">✅</div>
        <h3 class="text-2xl font-bold text-forest-green mb-2">Thank You!</h3>
        <p class="text-mountain-blue mb-6">
          {#if variant === 'assessment'}
            Your assessment has been submitted. A recovery specialist will contact you within 24 hours with your personalized treatment recommendation.
          {:else if variant === 'consultation'}
            Your consultation request has been received. Our team will contact you within 2 hours to schedule your free consultation.
          {:else if variant === 'insurance'}
            Your insurance information has been submitted. We'll verify your coverage and contact you within 1 hour with your benefits summary.
          {:else if variant === 'download'}
            Your download link has been sent to your email. Check your inbox for the recovery guide.
          {/if}
        </p>
        <div class="bg-forest-green/5 rounded-lg p-4 text-sm text-forest-green">
          <strong>What happens next:</strong>
          <ul class="text-left mt-2 space-y-1">
            <li>• You'll receive a confirmation email</li>
            <li>• Our team will review your information</li>
            <li>• We'll contact you within the specified timeframe</li>
            <li>• All information is confidential and HIPAA-protected</li>
          </ul>
        </div>
      </div>
    {:else}
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="font-primary text-2xl md:text-3xl font-bold text-forest-green mb-3">
          {title}
        </h2>
        <p class="text-lg text-mountain-blue">{subtitle}</p>
        
        {#if showProgress && multiStep}
          <div class="mt-6">
            <div class="flex items-center justify-center space-x-2 mb-2">
              {#each Array(totalSteps) as _, i}
                <div 
                  class={`w-3 h-3 rounded-full transition-all duration-300 ${i < currentStep ? 'bg-forest-green' : 'bg-forest-green/20'}`}
                ></div>
              {/each}
            </div>
            <p class="text-sm text-mountain-blue">
              Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
            </p>
          </div>
        {/if}
      </div>

      <!-- Form Content -->
      <form on:submit|preventDefault={handleSubmit}>
        <div 
          class="space-y-6"
          transition:slide={{ duration: 300, axis: 'x' }}
        >
          <!-- Step 1: Contact Information -->
          {#if currentStep === 1}
            <div class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-forest-green mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    bind:value={formData.firstName}
                    class="w-full px-4 py-3 border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your first name"
                    required
                    disabled={isSubmitting}
                  />
                  {#if errors.firstName}
                    <p class="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  {/if}
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-forest-green mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    bind:value={formData.lastName}
                    class="w-full px-4 py-3 border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter your last name"
                    required
                    disabled={isSubmitting}
                  />
                  {#if errors.lastName}
                    <p class="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  {/if}
                </div>
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-forest-green mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  bind:value={formData.email}
                  class="w-full px-4 py-3 border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                />
                {#if errors.email}
                  <p class="text-red-500 text-sm mt-1">{errors.email}</p>
                {/if}
              </div>
              
              <div>
                <label for="phone" class="block text-sm font-medium text-forest-green mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  on:input={handlePhoneInput}
                  class="w-full px-4 py-3 border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  placeholder="(555) 123-4567"
                  required
                  disabled={isSubmitting}
                />
                {#if errors.phone}
                  <p class="text-red-500 text-sm mt-1">{errors.phone}</p>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Step 2: Additional Information -->
          {#if currentStep === 2 && multiStep}
            <div class="space-y-6">
              {#if variant === 'assessment'}
                <div>
                  <label for="concern" class="block text-sm font-medium text-forest-green mb-2">
                    Primary Concern
                  </label>
                  <select
                    id="concern"
                    bind:value={formData.concern}
                    class="w-full px-4 py-3 border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    disabled={isSubmitting}
                  >
                    <option value="">Select your primary concern</option>
                    <option value="alcohol">Alcohol Use</option>
                    <option value="substance">Substance Use</option>
                    <option value="mental-health">Mental Health</option>
                    <option value="dual-diagnosis">Dual Diagnosis</option>
                    <option value="family">Family Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label for="urgency" class="block text-sm font-medium text-forest-green mb-2">
                    How urgent is your need for treatment?
                  </label>
                  <div class="space-y-2">
                    {#each [
                      { value: 'immediate', label: 'Immediate - Within 24 hours' },
                      { value: 'week', label: 'This week' },
                      { value: 'month', label: 'This month' },
                      { value: 'exploring', label: 'Just exploring options' }
                    ] as option}
                      <label class="flex items-center space-x-3 p-3 rounded-lg bg-forest-green/5 hover:bg-forest-green/10 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="urgency"
                          value={option.value}
                          bind:group={formData.urgency}
                          class="text-forest-green focus:ring-mountain-blue"
                          disabled={isSubmitting}
                        />
                        <span class="text-forest-green">{option.label}</span>
                      </label>
                    {/each}
                  </div>
                </div>
              {:else if variant === 'consultation'}
                <div>
                  <label for="concern" class="block text-sm font-medium text-forest-green mb-2">
                    What would you like to discuss?
                  </label>
                  <textarea
                    id="concern"
                    bind:value={formData.concern}
                    rows={4}
                    class="w-full px-4 py-3 border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Please share any questions or concerns you'd like to discuss during your consultation..."
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              {:else if variant === 'insurance'}
                <div>
                  <label for="insurance" class="block text-sm font-medium text-forest-green mb-2">
                    Insurance Provider
                  </label>
                  <select
                    id="insurance"
                    bind:value={formData.insurance}
                    class="w-full px-4 py-3 border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    disabled={isSubmitting}
                  >
                    <option value="">Select your insurance provider</option>
                    <option value="aetna">Aetna</option>
                    <option value="anthem">Anthem</option>
                    <option value="blue-cross">Blue Cross Blue Shield</option>
                    <option value="cigna">Cigna</option>
                    <option value="humana">Humana</option>
                    <option value="kaiser">Kaiser Permanente</option>
                    <option value="united">United Healthcare</option>
                    <option value="medicaid">Medicaid</option>
                    <option value="medicare">Medicare</option>
                    <option value="other">Other</option>
                    <option value="none">No Insurance</option>
                  </select>
                </div>
              {/if}
            </div>
          {/if}

          <!-- Step 3: Preferences -->
          {#if currentStep === 3 && multiStep}
            <div class="space-y-6">
              <fieldset>
                <legend class="block text-sm font-medium text-forest-green mb-2">
                  Preferred Contact Method
                </legend>
                <div class="grid grid-cols-2 gap-3">
                  {#each [
                    { value: 'phone', label: '📞 Phone Call' },
                    { value: 'text', label: '💬 Text Message' },
                    { value: 'email', label: '📧 Email' }
                  ] as option}
                    <label class="flex items-center justify-center space-x-2 p-3 rounded-lg bg-forest-green/5 hover:bg-forest-green/10 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="preferredContact"
                        value={option.value}
                        bind:group={formData.preferredContact}
                        class="text-forest-green focus:ring-mountain-blue"
                        disabled={isSubmitting}
                      />
                      <span class="text-forest-green text-sm">{option.label}</span>
                    </label>
                  {/each}
                </div>
              </fieldset>
              
              <div>
                <label for="bestTime" class="block text-sm font-medium text-forest-green mb-2">
                  Best Time to Contact
                </label>
                <select
                  id="bestTime"
                  bind:value={formData.bestTime}
                  class="w-full px-4 py-3 border border-forest-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-blue/50 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  disabled={isSubmitting}
                >
                  <option value="morning">Morning (8am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 5pm)</option>
                  <option value="evening">Evening (5pm - 8pm)</option>
                  <option value="anytime">Anytime</option>
                </select>
              </div>

              <!-- Privacy Notice -->
              <div class="bg-forest-green/5 rounded-lg p-4 text-sm text-forest-green">
                <p class="font-medium mb-2">Your Privacy Matters</p>
                <p>
                  Your information is confidential and protected by HIPAA. We'll never share your details without your consent.
                </p>
              </div>
            </div>
          {/if}
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-8">
          <div>
            {#if multiStep && currentStep > 1}
              <PremiumButton
                variant="ghost"
                on:click={handleBack}
                disabled={isSubmitting}
              >
                ← Back
              </PremiumButton>
            {/if}
          </div>
          
          <div class="min-w-[120px]">
            <PremiumButton
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              on:click={handleNext}
            >
              {#if isSubmitting}
                <span class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              {:else if multiStep && currentStep < totalSteps}
                Continue →
              {:else}
                Submit Request
              {/if}
            </PremiumButton>
          </div>
        </div>
      </form>

      <!-- Additional Trust Signals -->
      <div class="mt-8 pt-6 border-t border-forest-green/10">
        <div class="flex flex-wrap justify-center items-center gap-6 text-sm text-mountain-blue">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Secure & Confidential</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>HIPAA Compliant</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No Obligation</span>
          </div>
        </div>
      </div>
    {/if}
  </PremiumCard>
</div>