<script lang="ts">
  import { enhance } from '$app/forms'
  import { trackEvent } from '$lib/utils/analytics'
  import { onMount } from 'svelte'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'
  import WizardForm from '$lib/components/ui/WizardForm.svelte'
  import WizardStep from '$lib/components/ui/WizardStep.svelte'
  import { fly, fade } from 'svelte/transition'

  export let form: any

  let showRegistrationForm = false
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

  const availableAmenities = [
    'Private rooms', 'Shared rooms', 'Kitchen access', 'Laundry facilities',
    'Transportation', 'Meal service', 'Fitness center', 'Counseling services',
    '12-step meetings', 'Recreation room', 'Outdoor space', 'Parking'
  ]

  onMount(() => {
    trackEvent('partners_page_viewed')
  })

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

  async function handleSubmit() {
    isSubmitting = true
    document.getElementById('hidden-partner-submit')?.click()
  }

  $: if (form?.success) {
    submitted = true
    isSubmitting = false
  }
</script>

<svelte:head>
  <title>Partners | Metzler Cares</title>
  <meta name="description" content="Streamlined Referrals. Actionable Data. Better Outcomes. Partner with Metzler Cares to extend your continuum of care." />
</svelte:head>

<div class="min-h-screen bg-tech-primary text-warm-gray font-sans selection:bg-tech-accent selection:text-white pt-20">

  <!-- B2B Hero Section -->
  <section class="relative py-20 overflow-hidden border-b border-gray-800">
    <div class="container mx-auto px-4 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div class="inline-flex items-center px-3 py-1 rounded-full border border-tech-accent/30 bg-tech-accent/10 text-tech-accent text-sm font-medium mb-6">
            For RAEs, Hospitals & Treatment Centers
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Streamlined Referrals. <br/>
            <span class="text-tech-teal">Actionable Data.</span> <br/>
            Better Outcomes.
          </h1>
          <p class="text-xl text-gray-400 mb-8 leading-relaxed">
            Stop sending faxes and hoping for the best. Metzler Cares offers a dedicated Referral Partner Portal that gives your clinical team total visibility into the post-discharge journey.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="/contact" class="px-8 py-4 bg-tech-accent text-white rounded-lg font-bold hover:bg-blue-600 transition-all text-center">
              Schedule Capability Briefing
            </a>
            <button 
              on:click={() => showRegistrationForm = true}
              class="px-8 py-4 bg-transparent border border-gray-600 text-gray-300 rounded-lg font-bold hover:border-white hover:text-white transition-all"
            >
              Join Housing Network
            </button>
          </div>
        </div>
        
        <!-- Portal Visual -->
        <div class="relative">
          <div class="bg-tech-secondary border border-gray-700 rounded-xl shadow-2xl p-1">
            <div class="bg-tech-primary rounded-lg overflow-hidden">
              <div class="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <div class="ml-4 text-xs text-gray-500">partner-portal.metzlercares.com</div>
              </div>
              <div class="p-6">
                <div class="flex justify-between items-center mb-8">
                  <h3 class="text-white font-bold text-lg">Referral Dashboard</h3>
                  <button class="px-3 py-1 bg-tech-accent text-white text-xs rounded">New Referral</button>
                </div>
                <div class="space-y-4">
                  <div class="bg-gray-800/50 p-4 rounded border border-gray-700 flex justify-between items-center">
                    <div>
                      <div class="text-white font-medium">Patient #8832</div>
                      <div class="text-xs text-gray-500">Discharged: 2 days ago</div>
                    </div>
                    <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Engaged</span>
                  </div>
                  <div class="bg-gray-800/50 p-4 rounded border border-gray-700 flex justify-between items-center">
                    <div>
                      <div class="text-white font-medium">Patient #8901</div>
                      <div class="text-xs text-gray-500">Discharged: 5 days ago</div>
                    </div>
                    <span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Check-in Needed</span>
                  </div>
                  <div class="bg-gray-800/50 p-4 rounded border border-gray-700 flex justify-between items-center">
                    <div>
                      <div class="text-white font-medium">Patient #8722</div>
                      <div class="text-xs text-gray-500">Discharged: 12 days ago</div>
                    </div>
                    <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Sober Living Placed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Value Props -->
  <section class="py-24 bg-tech-secondary/30">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 bg-tech-secondary border border-gray-800 rounded-xl hover:border-tech-accent transition-colors group">
          <div class="w-12 h-12 bg-tech-primary rounded-lg flex items-center justify-center mb-6 text-tech-accent group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Instant Digital Intake</h3>
          <p class="text-gray-400">Submit referrals in under 60 seconds via our secure portal. Our automated routing engine matches your patient with the ideal Peer Coach.</p>
        </div>
        <div class="p-8 bg-tech-secondary border border-gray-800 rounded-xl hover:border-tech-accent transition-colors group">
          <div class="w-12 h-12 bg-tech-primary rounded-lg flex items-center justify-center mb-6 text-tech-accent group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Closed-Loop Reporting</h3>
          <p class="text-gray-400">Receive automated weekly digests on your patients' progress. Track attendance, sobriety milestones, and SDOH barrier removal.</p>
        </div>
        <div class="p-8 bg-tech-secondary border border-gray-800 rounded-xl hover:border-tech-accent transition-colors group">
          <div class="w-12 h-12 bg-tech-primary rounded-lg flex items-center justify-center mb-6 text-tech-accent group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Alumni Management</h3>
          <p class="text-gray-400">We manage the community, the events, and the engagement, helping you maintain long-term relationships with your graduates without increasing overhead.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Billing & Compliance -->
  <section class="py-24 bg-tech-primary border-t border-gray-800">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto bg-tech-secondary rounded-2xl p-10 border border-gray-700">
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-white mb-4">Fiscal Integrity & H0038 Expertise</h2>
            <p class="text-gray-400 mb-6">
              We operate as a fully licensed Recovery Support Services Organization (RSSO) in Colorado. We handle the complexities of Medicaid billing so you don't have to.
            </p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <span class="text-gray-300"><strong>H0038 Coding Precision:</strong> Automated 15-minute increment logging.</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <span class="text-gray-300"><strong>Audit Defense:</strong> Every claim backed by timestamps and geolocation.</span>
              </li>
            </ul>
          </div>
          <div class="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-inner">
            <div class="text-center">
              <div class="text-4xl font-bold text-tech-primary mb-2">100%</div>
              <div class="text-sm text-gray-600 font-medium">Audit Compliance Score</div>
              <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                Verified by internal review
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Housing Network Registration Modal/Wizard (Preserved Functionality) -->
  {#if showRegistrationForm}
    <div class="fixed inset-0 z-50 bg-tech-primary overflow-y-auto" transition:fly={{ y: 50, duration: 300 }}>
      <div class="min-h-screen flex flex-col">
        <!-- Wizard Header -->
        <div class="bg-tech-secondary border-b border-gray-700 px-4 py-4 flex justify-between items-center sticky top-0 z-50">
          <div class="flex items-center space-x-2">
            <span class="text-xl font-bold text-white">Housing Network Registration</span>
          </div>
          <button
            on:click={() => (showRegistrationForm = false)}
            class="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 p-4 sm:p-8 flex justify-center">
          {#if submitted}
            <div class="max-w-2xl w-full bg-tech-secondary rounded-2xl shadow-xl p-12 text-center flex flex-col items-center justify-center border border-gray-700" in:fade>
              <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-white mb-4">Application Received!</h2>
              <p class="text-lg text-gray-400 mb-8">
                Thank you for applying to join the Metzler Foundations network. Our team will review your facility details and contact you within 5-7 business days.
              </p>
              <button
                on:click={() => {
                  showRegistrationForm = false
                  submitted = false
                }}
                class="px-8 py-3 bg-tech-accent text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Return to Partners Page
              </button>
            </div>
          {:else}
            <!-- Hidden Form for SvelteKit Action -->
            <form method="POST" action="?/register" use:enhance class="hidden" enctype="multipart/form-data">
              <input type="hidden" name="organizationName" value={formData.organizationName} />
              <input type="hidden" name="contactName" value={formData.contactName} />
              <input type="hidden" name="contactEmail" value={formData.contactEmail} />
              <input type="hidden" name="contactPhone" value={formData.contactPhone} />
              <input type="hidden" name="facilityType" value={formData.facilityType} />
              <input type="hidden" name="capacity" value={formData.capacity} />
              <input type="hidden" name="addressStreet" value={formData.addressStreet} />
              <input type="hidden" name="addressCity" value={formData.addressCity} />
              <input type="hidden" name="addressState" value={formData.addressState} />
              <input type="hidden" name="addressZip" value={formData.addressZip} />
              <input type="hidden" name="website" value={formData.website} />
              <input type="hidden" name="description" value={formData.description} />
              <input type="hidden" name="policies" value={formData.policies} />
              <input type="hidden" name="insuranceInfo" value={formData.insuranceInfo} />
              <input type="hidden" name="licenseNumber" value={formData.licenseNumber} />
              {#each formData.amenities as amenity}
                <input type="hidden" name="amenities" value={amenity} />
              {/each}
              <button type="submit" id="hidden-partner-submit">Submit</button>
            </form>

            <WizardForm
              title="New Partner Registration"
              subtitle="Join our network of verified recovery housing."
              on:submit={handleSubmit}
            >
              <!-- Step 1: Organization Info -->
              <WizardStep title="Organization Details" description="Tell us about your facility and primary contact.">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <label for="org-name" class="block text-sm font-bold text-gray-300 mb-2">Organization Name</label>
                    <input id="org-name" type="text" bind:value={formData.organizationName} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="e.g. Denver Recovery Center" />
                  </div>
                  <div>
                    <label for="contact-name" class="block text-sm font-bold text-gray-300 mb-2">Contact Name</label>
                    <input id="contact-name" type="text" bind:value={formData.contactName} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label for="contact-email" class="block text-sm font-bold text-gray-300 mb-2">Contact Email</label>
                    <input id="contact-email" type="email" bind:value={formData.contactEmail} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label for="contact-phone" class="block text-sm font-bold text-gray-300 mb-2">Phone Number</label>
                    <input id="contact-phone" type="tel" bind:value={formData.contactPhone} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label for="website" class="block text-sm font-bold text-gray-300 mb-2">Website (Optional)</label>
                    <input id="website" type="url" bind:value={formData.website} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="https://..." />
                  </div>
                </div>
              </WizardStep>

              <!-- Step 2: Facility Specs -->
              <WizardStep title="Facility Specifications" description="Help us understand your capacity and services.">
                <div class="space-y-6">
                  <div>
                    <label for="facility-type" class="block text-sm font-bold text-gray-300 mb-2">Facility Type</label>
                    <select id="facility-type" bind:value={formData.facilityType} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent">
                      <option value="">Select type...</option>
                      <option value="sober_living">Sober Living Home</option>
                      <option value="halfway_house">Halfway House</option>
                      <option value="recovery_residence">Recovery Residence</option>
                      <option value="transitional_housing">Transitional Housing</option>
                    </select>
                  </div>
                  <div>
                    <label for="capacity" class="block text-sm font-bold text-gray-300 mb-2">Resident Capacity</label>
                    <input id="capacity" type="number" bind:value={formData.capacity} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="12" />
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-bold text-gray-300 mb-2">Description</label>
                    <textarea id="description" bind:value={formData.description} rows="4" class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent resize-none" placeholder="Describe your program..." />
                  </div>
                </div>
              </WizardStep>

              <!-- Step 3: Location -->
              <WizardStep title="Location" description="Where is your facility located?">
                <div class="space-y-6">
                  <div>
                    <label for="street" class="block text-sm font-bold text-gray-300 mb-2">Street Address</label>
                    <input id="street" type="text" bind:value={formData.addressStreet} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="123 Recovery Way" />
                  </div>
                  <div class="grid grid-cols-2 gap-6">
                    <div>
                      <label for="city" class="block text-sm font-bold text-gray-300 mb-2">City</label>
                      <input id="city" type="text" bind:value={formData.addressCity} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="Denver" />
                    </div>
                    <div>
                      <label for="zip" class="block text-sm font-bold text-gray-300 mb-2">ZIP Code</label>
                      <input id="zip" type="text" bind:value={formData.addressZip} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="80202" />
                    </div>
                  </div>
                  <div>
                    <label for="state" class="block text-sm font-bold text-gray-300 mb-2">State</label>
                    <select id="state" bind:value={formData.addressState} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent">
                      <option value="CO">Colorado</option>
                    </select>
                  </div>
                </div>
              </WizardStep>

              <!-- Step 4: Amenities -->
              <WizardStep title="Amenities" description="What features does your facility offer?">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {#each availableAmenities as amenity}
                    <label class="flex items-center space-x-3 p-4 border border-gray-700 rounded-lg hover:border-tech-accent cursor-pointer transition-all bg-gray-800">
                      <input type="checkbox" checked={formData.amenities.includes(amenity)} on:change={() => toggleAmenity(amenity)} class="w-5 h-5 text-tech-accent rounded focus:ring-tech-accent bg-gray-700 border-gray-600" />
                      <span class="text-gray-300 font-medium">{amenity}</span>
                    </label>
                  {/each}
                </div>
              </WizardStep>

              <!-- Step 5: Verification -->
              <WizardStep title="Verification & Compliance" description="We require proof of licensing to maintain our network quality.">
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="license" class="block text-sm font-bold text-gray-300 mb-2">License Number</label>
                      <input id="license" type="text" bind:value={formData.licenseNumber} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="CO-RLH-12345" />
                    </div>
                    <div>
                      <label for="insurance" class="block text-sm font-bold text-gray-300 mb-2">Insurance Provider</label>
                      <input id="insurance" type="text" bind:value={formData.insuranceInfo} class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent" placeholder="Provider Name" />
                    </div>
                  </div>
                  <div>
                    <label for="policies" class="block text-sm font-bold text-gray-300 mb-2">House Policies</label>
                    <textarea id="policies" bind:value={formData.policies} rows="4" class="form-input-premium w-full bg-gray-800 border-gray-700 text-white focus:border-tech-accent resize-none" placeholder="Curfew, visitation, substance policies..." />
                  </div>
                  <div class="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-tech-accent transition-colors bg-gray-800/50">
                    <svg class="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <label for="file-upload" class="text-gray-400 mb-2 cursor-pointer hover:text-tech-accent block">Upload License & Insurance Documents</label>
                    <p class="text-xs text-gray-500 mb-4">PDF, JPG, PNG (Max 10MB)</p>
                    <input id="file-upload" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" on:change={handleFileUpload} class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tech-accent file:text-white hover:file:bg-blue-600" />
                  </div>
                </div>
              </WizardStep>
            </WizardForm>
          {/if}
        </div>
      </div>
    </div>
  {/if}

</div>
