<script lang="ts">
  import { enhance } from '$app/forms'
  import { trackEvent } from '$lib/utils/analytics'
  import { onMount } from 'svelte'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'

  export let form

  let showRegistrationForm = false
  let registrationStep = 1
  let formData = {
    organizationName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    facilityType: '',
    capacity: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    website: '',
    description: '',
    amenities: [] as string[],
    policies: '',
    insuranceInfo: '',
    licenseNumber: '',
    verificationDocuments: [] as File[]
  }

  let isSubmitting = false
  let submitted = false

  // Available amenities
  const availableAmenities = [
    'Private rooms',
    'Shared rooms',
    'Kitchen access',
    'Laundry facilities',
    'Transportation',
    'Meal service',
    'Fitness center',
    'Counseling services',
    '12-step meetings',
    'Recreation room',
    'Outdoor space',
    'Parking'
  ]

  onMount(() => {
    trackEvent('partners_page_viewed')
  })

  $: canProceedToStep2 =
    formData.organizationName && formData.contactName && formData.contactEmail && formData.facilityType
  $: canSubmit =
    registrationStep === 2 &&
    formData.addressStreet &&
    formData.addressCity &&
    formData.addressState &&
    formData.addressZip &&
    formData.capacity

  function nextStep() {
    if (registrationStep < 2) {
      registrationStep++
    }
  }

  function prevStep() {
    if (registrationStep > 1) {
      registrationStep--
    }
  }

  function toggleAmenity(amenity: string) {
    if (formData.amenities.includes(amenity)) {
      formData.amenities = formData.amenities.filter(a => a !== amenity)
    } else {
      formData.amenities = [...formData.amenities, amenity]
    }
  }

  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (files) {
      formData.verificationDocuments = Array.from(files)
    }
  }
</script>

<svelte:head>
  <title>Partner With Us - Metzler Foundations</title>
  <meta
    name="description"
    content="Join our network of verified sober living facilities. Partner with Metzler Foundations to provide housing scholarships for individuals in recovery."
  />
  <meta
    name="keywords"
    content="sober living partner, recovery housing partnership, facility partnership, housing scholarship program"
  />
  <link rel="canonical" href="https://metzlerfoundations.org/partners" />
</svelte:head>

<div class="min-h-screen bg-cream text-navy">
  <!-- Hero Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy via-olive to-gold bg-opacity-5">
    <div class="max-w-6xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-navy mb-6">Partner With Us</h1>
      <p class="text-xl text-navy text-opacity-80 mb-8 max-w-3xl mx-auto">
        Join our network of verified sober living facilities and help provide dignified housing for individuals in
        recovery. Together, we're building a future where stable housing is a right in recovery, not a privilege.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button on:click={() => (showRegistrationForm = true)} class="btn-primary"> Become a Partner </button>
        <a href="#benefits" class="btn-secondary"> Learn More </a>
      </div>
    </div>
  </section>

  {#if showRegistrationForm}
    <!-- Registration Form Modal/Full Page -->
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="p-6 border-b border-navy border-opacity-10">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-serif font-medium text-navy">Partner Registration</h2>
            <button
              on:click={() => {
                showRegistrationForm = false
                registrationStep = 1
              }}
              class="text-navy text-opacity-60 hover:text-navy transition-colors"
              aria-label="Close partner registration"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex items-center space-x-2">
              <div class="flex-1 bg-navy bg-opacity-10 rounded-full h-2">
                <div
                  class="bg-olive h-2 rounded-full transition-all duration-300"
                  style="width: {registrationStep === 1 ? '50%' : '100%'}"
                ></div>
              </div>
            </div>
            <div class="flex justify-between text-sm text-navy text-opacity-60 mt-2">
              <span class={registrationStep >= 1 ? 'text-olive font-medium' : ''}>Facility Info</span>
              <span class={registrationStep >= 2 ? 'text-olive font-medium' : ''}>Verification</span>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          {#if submitted}
            <!-- Success State -->
            <SuccessMessage
              title="Registration Submitted!"
              message="Thank you for your interest in partnering with Metzler Foundations. We'll review your application and get back to you within 5-7 business days."
              icon="check"
            />

            <div class="mt-6 text-center">
              <button
                on:click={() => {
                  showRegistrationForm = false
                  submitted = false
                  registrationStep = 1
                }}
                class="btn-primary"
              >
                Close
              </button>
            </div>
          {:else}
            <form
              method="POST"
              action="?/register"
              use:enhance={() => {
                isSubmitting = true
                return async ({ update }) => {
                  await update()
                  isSubmitting = false
                }
              }}
              class="space-y-6"
            >
              <!-- Step 1: Basic Information -->
              {#if registrationStep === 1}
                <div>
                  <h3 class="text-lg font-semibold text-navy mb-4">Step 1: Facility Information</h3>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Organization Name -->
                    <div class="md:col-span-2">
                      <label for="organizationName" class="form-label">Organization/Facility Name *</label>
                      <input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        bind:value={formData.organizationName}
                        class="form-input"
                        placeholder="Denver Recovery Center"
                        required
                      />
                    </div>

                    <!-- Contact Name -->
                    <div>
                      <label for="contactName" class="form-label">Primary Contact Name *</label>
                      <input
                        id="contactName"
                        name="contactName"
                        type="text"
                        bind:value={formData.contactName}
                        class="form-input"
                        placeholder="Jane Smith"
                        required
                      />
                    </div>

                    <!-- Contact Email -->
                    <div>
                      <label for="contactEmail" class="form-label">Contact Email *</label>
                      <input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        bind:value={formData.contactEmail}
                        class="form-input"
                        placeholder="jane@denverrecovery.org"
                        required
                      />
                    </div>

                    <!-- Contact Phone -->
                    <div>
                      <label for="contactPhone" class="form-label">Contact Phone</label>
                      <input
                        id="contactPhone"
                        name="contactPhone"
                        type="tel"
                        bind:value={formData.contactPhone}
                        class="form-input"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <!-- Facility Type -->
                    <div>
                      <label for="facilityType" class="form-label">Facility Type *</label>
                      <select
                        id="facilityType"
                        name="facilityType"
                        bind:value={formData.facilityType}
                        class="form-input"
                        required
                      >
                        <option value="">Select facility type</option>
                        <option value="sober_living">Sober Living Home</option>
                        <option value="halfway_house">Halfway House</option>
                        <option value="recovery_residence">Recovery Residence</option>
                        <option value="transitional_housing">Transitional Housing</option>
                      </select>
                    </div>

                    <!-- Capacity -->
                    <div>
                      <label for="capacity" class="form-label">Resident Capacity</label>
                      <input
                        id="capacity"
                        name="capacity"
                        type="number"
                        min="1"
                        max="50"
                        bind:value={formData.capacity}
                        class="form-input"
                        placeholder="12"
                      />
                    </div>
                  </div>

                  <!-- Website -->
                  <div class="mt-6">
                    <label for="website" class="form-label">Website (optional)</label>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      bind:value={formData.website}
                      class="form-input"
                      placeholder="https://denverrecovery.org"
                    />
                  </div>

                  <!-- Description -->
                  <div class="mt-6">
                    <label for="description" class="form-label">Facility Description</label>
                    <textarea
                      id="description"
                      name="description"
                      bind:value={formData.description}
                      class="form-input resize-none"
                      rows="4"
                      placeholder="Describe your facility, programs, and what makes it unique..."
                    ></textarea>
                  </div>

                  <!-- Amenities -->
                  <div class="mt-6">
                    <p class="form-label mb-3" id="amenities-label">Available Amenities</p>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3" role="group" aria-labelledby="amenities-label">
                      {#each availableAmenities as amenity}
                        <label class="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            on:change={() => toggleAmenity(amenity)}
                            class="rounded border-navy border-opacity-30 text-olive focus:ring-olive"
                          />
                          <span class="text-sm text-navy">{amenity}</span>
                        </label>
                      {/each}
                    </div>
                  </div>
                </div>

                <!-- Step 2: Address & Verification -->
              {:else if registrationStep === 2}
                <div>
                  <h3 class="text-lg font-semibold text-navy mb-4">Step 2: Address & Verification</h3>

                  <!-- Address -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="md:col-span-2">
                      <label for="addressStreet" class="form-label">Street Address *</label>
                      <input
                        id="addressStreet"
                        name="addressStreet"
                        type="text"
                        bind:value={formData.addressStreet}
                        class="form-input"
                        placeholder="123 Recovery Way"
                        required
                      />
                    </div>

                    <div>
                      <label for="addressCity" class="form-label">City *</label>
                      <input
                        id="addressCity"
                        name="addressCity"
                        type="text"
                        bind:value={formData.addressCity}
                        class="form-input"
                        placeholder="Denver"
                        required
                      />
                    </div>

                    <div>
                      <label for="addressState" class="form-label">State *</label>
                      <select
                        id="addressState"
                        name="addressState"
                        bind:value={formData.addressState}
                        class="form-input"
                        required
                      >
                        <option value="">Select state</option>
                        <option value="CO">Colorado</option>
                        <!-- Add other states as needed -->
                      </select>
                    </div>

                    <div>
                      <label for="addressZip" class="form-label">ZIP Code *</label>
                      <input
                        id="addressZip"
                        name="addressZip"
                        type="text"
                        pattern="[0-9]{5}"
                        bind:value={formData.addressZip}
                        class="form-input"
                        placeholder="80202"
                        required
                      />
                    </div>
                  </div>

                  <!-- Verification Documents -->
                  <div class="mb-6">
                    <p class="form-label mb-3" id="documents-label">Verification Documents</p>
                    <p class="text-sm text-navy text-opacity-70 mb-3">
                      Please upload proof of licensing, insurance, and any other relevant certifications. Accepted
                      formats: PDF, DOC, DOCX, JPG, PNG (max 10MB each)
                    </p>

                    <div class="border-2 border-dashed border-navy border-opacity-20 rounded-lg p-6 text-center">
                      <svg
                        class="w-12 h-12 text-navy text-opacity-40 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>

                      <div class="mb-4">
                        <label for="file-upload" class="cursor-pointer">
                          <span class="text-olive hover:text-navy font-medium">Choose files</span>
                          <span class="text-navy text-opacity-60"> or drag and drop</span>
                          <input
                            id="file-upload"
                            name="verificationDocuments"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            class="hidden"
                            on:change={handleFileUpload}
                          />
                        </label>
                      </div>

                      {#if formData.verificationDocuments.length > 0}
                        <div class="text-left">
                          <p class="text-sm font-medium text-navy mb-2">Selected files:</p>
                          <ul class="text-sm text-navy text-opacity-70 space-y-1">
                            {#each formData.verificationDocuments as file}
                              <li>• {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)</li>
                            {/each}
                          </ul>
                        </div>
                      {/if}
                    </div>
                  </div>

                  <!-- Additional Information -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- License Number -->
                    <div>
                      <label for="licenseNumber" class="form-label">License Number</label>
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        bind:value={formData.licenseNumber}
                        class="form-input"
                        placeholder="CO-RLH-12345"
                      />
                    </div>

                    <!-- Insurance Info -->
                    <div>
                      <label for="insuranceInfo" class="form-label">Insurance Provider</label>
                      <input
                        id="insuranceInfo"
                        name="insuranceInfo"
                        type="text"
                        bind:value={formData.insuranceInfo}
                        class="form-input"
                        placeholder="ABC Insurance"
                      />
                    </div>
                  </div>

                  <!-- Policies -->
                  <div class="mt-6">
                    <label for="policies" class="form-label">House Policies & Rules</label>
                    <textarea
                      id="policies"
                      name="policies"
                      bind:value={formData.policies}
                      class="form-input resize-none"
                      rows="4"
                      placeholder="Describe your house rules, curfew policies, substance use policies, etc..."
                    ></textarea>
                  </div>
                </div>
              {/if}

              <!-- Form Errors -->
              {#if form?.error}
                <div>
                  <ErrorMessage title="Registration Error" message={form.error.message} />
                </div>
              {/if}

              <!-- Navigation Buttons -->
              <div class="flex justify-between pt-6 border-t border-navy border-opacity-10">
                {#if registrationStep > 1}
                  <button type="button" on:click={prevStep} class="btn-secondary"> Previous </button>
                {:else}
                  <div></div>
                {/if}

                {#if registrationStep < 2}
                  <button
                    type="button"
                    on:click={nextStep}
                    disabled={!canProceedToStep2}
                    class="btn-primary disabled:opacity-50"
                  >
                    Next Step
                  </button>
                {:else}
                  <button type="submit" disabled={isSubmitting || !canSubmit} class="btn-primary disabled:opacity-50">
                    {#if isSubmitting}
                      <div class="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="sm" color="white" />
                        <span>Submitting...</span>
                      </div>
                    {:else}
                      Submit Application
                    {/if}
                  </button>
                {/if}
              </div>
            </form>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <!-- Partner Benefits Section -->
    <section id="benefits" class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-serif font-medium text-navy mb-6">Why Partner With Us?</h2>
          <p class="text-xl text-navy text-opacity-80 max-w-3xl mx-auto">
            Join a network of verified facilities committed to providing dignified housing solutions for individuals in
            recovery.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <!-- Benefit 1 -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-12 h-12 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-3">Guaranteed Payments</h3>
            <p class="text-navy text-opacity-70">
              Direct payment to your facility ensures financial stability and removes barriers for residents who can't
              pay upfront.
            </p>
          </div>

          <!-- Benefit 2 -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-12 h-12 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-3">Verified Residents</h3>
            <p class="text-navy text-opacity-70">
              Pre-screened residents with verified recovery commitment reduce risk and ensure better outcomes for your
              facility.
            </p>
          </div>

          <!-- Benefit 3 -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-12 h-12 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-3">Streamlined Process</h3>
            <p class="text-navy text-opacity-70">
              Automated application processing means faster placement and reduced administrative burden for your team.
            </p>
          </div>

          <!-- Benefit 4 -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-12 h-12 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-3">Community Support</h3>
            <p class="text-navy text-opacity-70">
              Join a network of like-minded facilities sharing best practices and supporting each other's success.
            </p>
          </div>

          <!-- Benefit 5 -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-12 h-12 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-3">Legal Compliance</h3>
            <p class="text-navy text-opacity-70">
              Access to legal support and stay current with housing regulations and recovery industry standards.
            </p>
          </div>

          <!-- Benefit 6 -->
          <div class="bg-white rounded-lg shadow-sm border border-navy border-opacity-10 p-6">
            <div class="w-12 h-12 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy mb-3">Growth Opportunity</h3>
            <p class="text-navy text-opacity-70">
              Increase occupancy rates and reach residents who might not otherwise find your facility through
              traditional channels.
            </p>
          </div>
        </div>

        <!-- Requirements Section -->
        <div class="bg-white rounded-xl shadow-sm border border-navy border-opacity-10 p-8 lg:p-12 mb-16">
          <h2 class="text-3xl font-serif font-medium text-navy mb-8 text-center">Partnership Requirements</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold text-navy mb-4">Facility Standards</h3>
              <ul class="space-y-3">
                <li class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-navy text-opacity-80">Valid business license and certifications</span>
                </li>
                <li class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-navy text-opacity-80">Safe, habitable living conditions</span>
                </li>
                <li class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-navy text-opacity-80">Structured recovery-focused programs</span>
                </li>
                <li class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-navy text-opacity-80">Professional staff and support services</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-navy mb-4">Program Commitment</h3>
              <ul class="space-y-3">
                <li class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-navy text-opacity-80">Commitment to resident recovery success</span>
                </li>
                <li class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-navy text-opacity-80">Transparent reporting and communication</span>
                </li>
                <li class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-navy text-opacity-80">Participation in quality improvement programs</span>
                </li>
                <li class="flex items-start space-x-3">
                  <svg
                    class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-navy text-opacity-80">Compliance with all applicable regulations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center">
          <h2 class="text-3xl font-serif font-medium text-navy mb-6">Ready to Make a Difference?</h2>
          <p class="text-xl text-navy text-opacity-80 mb-8 max-w-2xl mx-auto">
            Join our network of partners working together to create housing stability in recovery. Your facility can be
            part of the solution.
          </p>

          <button on:click={() => (showRegistrationForm = true)} class="btn-primary text-xl px-8 py-4">
            Apply to Become a Partner
          </button>
        </div>
      </div>
    </section>
  {/if}
</div>
