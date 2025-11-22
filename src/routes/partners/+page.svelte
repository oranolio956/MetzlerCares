<script lang="ts">
  import { enhance } from '$app/forms'
  import { trackEvent } from '$lib/utils/analytics'
  import { onMount } from 'svelte'
  import { LoadingSpinner, ErrorMessage, SuccessMessage } from '$lib'
  import WizardForm from '$lib/components/ui/WizardForm.svelte'
  import WizardStep from '$lib/components/ui/WizardStep.svelte'
  import { fly, fade } from 'svelte/transition'
  import gsap from 'gsap'
  import RecoveryBackground from '$lib/components/RecoveryBackground.svelte'

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
    
    gsap.from('.partner-hero', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    })
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

<RecoveryBackground />

<div class="min-h-screen bg-recovery-paper/90 text-recovery-slate font-body pt-24 px-6">

  <!-- Hero Section: The Soil -->
  <section class="partner-hero max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
    <div>
      <span class="font-hand text-3xl text-recovery-moss block mb-4">For RAEs, Hospitals & Treatment Centers</span>
      <h1 class="font-heading text-5xl md:text-6xl font-bold text-recovery-moss mb-8 leading-tight">
        Rooted in <span class="italic text-recovery-clay">Trust</span>.
      </h1>
      <p class="text-xl text-recovery-slate/80 mb-8 leading-relaxed">
        Stop sending faxes and hoping for the best. Join the mycelium network—a connected, living system that supports patient journeys from discharge to stability.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <button 
          on:click={() => showRegistrationForm = true}
          class="px-8 py-4 bg-recovery-moss text-white rounded-full font-bold hover:bg-recovery-clay transition-all shadow-forest hover:shadow-sunset"
        >
          Join the Network
        </button>
        <a href="/contact" class="px-8 py-4 bg-transparent border-2 border-recovery-moss text-recovery-moss rounded-full font-bold hover:bg-recovery-moss hover:text-white transition-all text-center">
          Schedule Briefing
        </a>
      </div>
    </div>
    
    <!-- Visual: Network Map -->
    <div class="relative hidden lg:block">
       <div class="w-full aspect-square rounded-full bg-recovery-moss/5 border border-recovery-moss/10 relative animate-pulse-slow">
          <!-- Abstract Nodes -->
          <div class="absolute top-1/4 left-1/4 w-4 h-4 bg-recovery-clay rounded-full shadow-lg"></div>
          <div class="absolute bottom-1/3 right-1/4 w-6 h-6 bg-recovery-moss rounded-full shadow-lg"></div>
          <div class="absolute top-1/2 left-1/2 w-8 h-8 bg-recovery-sun rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2"></div>
          
          <!-- Connecting Lines (CSS) -->
          <div class="absolute inset-0 border border-recovery-moss/20 rounded-full scale-75"></div>
          <div class="absolute inset-0 border border-recovery-moss/10 rounded-full scale-50"></div>
          
          <div class="absolute bottom-10 right-10 bg-white p-6 rounded-2xl shadow-forest max-w-xs rotate-3">
             <h3 class="font-bold text-recovery-moss mb-1">Referral Dashboard</h3>
             <div class="flex items-center gap-2 mb-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-xs text-recovery-slate/70">Patient #8832 Placed</span>
             </div>
             <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span class="text-xs text-recovery-slate/70">Patient #8901 Intake</span>
             </div>
          </div>
       </div>
    </div>
  </section>

  <!-- Features: The Nutrients -->
  <section class="py-24">
    <div class="container mx-auto max-w-6xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- Feature 1 -->
        <div class="bg-white rounded-[2rem] p-8 border border-recovery-moss/10 shadow-sm hover:shadow-forest transition-all group">
           <div class="w-14 h-14 bg-recovery-moss/10 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
             ⚡
           </div>
           <h3 class="font-heading text-2xl font-bold text-recovery-moss mb-3">Instant Intake</h3>
           <p class="text-recovery-slate/70 leading-relaxed">Submit referrals in seconds. Our automated routing engine matches patients like roots finding water.</p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white rounded-[2rem] p-8 border border-recovery-moss/10 shadow-sm hover:shadow-forest transition-all group">
           <div class="w-14 h-14 bg-recovery-moss/10 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
             🔄
           </div>
           <h3 class="font-heading text-2xl font-bold text-recovery-moss mb-3">Closed Loop</h3>
           <p class="text-recovery-slate/70 leading-relaxed">Automated reporting on patient progress. Track attendance and milestones without chasing updates.</p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white rounded-[2rem] p-8 border border-recovery-moss/10 shadow-sm hover:shadow-forest transition-all group">
           <div class="w-14 h-14 bg-recovery-moss/10 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
             🤝
           </div>
           <h3 class="font-heading text-2xl font-bold text-recovery-moss mb-3">Alumni Care</h3>
           <p class="text-recovery-slate/70 leading-relaxed">We maintain the community forest, ensuring long-term engagement for your graduates.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Registration Wizard (Overlay) -->
  {#if showRegistrationForm}
    <div class="fixed inset-0 z-50 bg-recovery-slate/80 backdrop-blur-sm overflow-y-auto" transition:fade>
      <div class="min-h-screen flex flex-col items-center justify-center p-4">
        
        <div class="bg-recovery-paper w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative">
           <!-- Close Button -->
           <button 
             on:click={() => showRegistrationForm = false}
             class="absolute top-4 right-4 p-2 hover:bg-recovery-moss/10 rounded-full text-recovery-moss z-50"
           >
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>

           <div class="p-8 md:p-12">
             {#if submitted}
                <div class="text-center py-12">
                   <div class="text-6xl mb-6">🌱</div>
                   <h2 class="font-heading text-4xl font-bold text-recovery-moss mb-4">Application Planted!</h2>
                   <p class="text-xl text-recovery-slate/70 mb-8 max-w-lg mx-auto">
                     Thank you for joining the network. We will review your details and reach out to help you grow.
                   </p>
                   <button
                      on:click={() => {
                        showRegistrationForm = false
                        submitted = false
                      }}
                      class="px-8 py-3 bg-recovery-moss text-white rounded-full font-bold hover:bg-recovery-clay transition-colors"
                    >
                      Return to Forest
                    </button>
                </div>
             {:else}
                <h2 class="font-heading text-3xl font-bold text-recovery-moss mb-8">Join the Housing Network</h2>
                
                <!-- Hidden Form -->
                <form method="POST" action="?/register" use:enhance class="hidden" enctype="multipart/form-data">
                    <!-- (Hidden inputs same as before) -->
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

                <!-- Wizard Content (Custom styling injected via class or styled wrappers if WizardForm allows, assuming standard input styles for now) -->
                <!-- Since WizardForm/Step are components, I'll assume they render slots. I'll style the inputs here. -->
                
                <WizardForm
                  title=""
                  subtitle=""
                  on:submit={handleSubmit}
                >
                    <!-- Step 1 -->
                    <WizardStep title="Organization Details" description="">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div class="md:col-span-2 space-y-2">
                                <label class="font-bold text-recovery-moss">Organization Name</label>
                                <input type="text" bind:value={formData.organizationName} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" placeholder="e.g. Denver Recovery Center" />
                             </div>
                             <div class="space-y-2">
                                <label class="font-bold text-recovery-moss">Contact Name</label>
                                <input type="text" bind:value={formData.contactName} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                             </div>
                             <div class="space-y-2">
                                <label class="font-bold text-recovery-moss">Contact Email</label>
                                <input type="email" bind:value={formData.contactEmail} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                             </div>
                             <div class="space-y-2">
                                <label class="font-bold text-recovery-moss">Phone Number</label>
                                <input type="tel" bind:value={formData.contactPhone} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                             </div>
                             <div class="space-y-2">
                                <label class="font-bold text-recovery-moss">Website</label>
                                <input type="url" bind:value={formData.website} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                             </div>
                        </div>
                    </WizardStep>
                    
                    <!-- Step 2: Facility -->
                     <WizardStep title="Facility Specs" description="">
                        <div class="space-y-6">
                            <div class="space-y-2">
                                <label class="font-bold text-recovery-moss">Facility Type</label>
                                <select bind:value={formData.facilityType} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss">
                                    <option value="">Select type...</option>
                                    <option value="sober_living">Sober Living Home</option>
                                    <option value="halfway_house">Halfway House</option>
                                    <option value="recovery_residence">Recovery Residence</option>
                                </select>
                            </div>
                             <div class="space-y-2">
                                <label class="font-bold text-recovery-moss">Resident Capacity</label>
                                <input type="number" bind:value={formData.capacity} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                            </div>
                             <div class="space-y-2">
                                <label class="font-bold text-recovery-moss">Description</label>
                                <textarea bind:value={formData.description} rows="4" class="w-full border-2 border-recovery-moss/20 bg-transparent rounded-xl p-4 focus:outline-none focus:border-recovery-moss resize-none"></textarea>
                            </div>
                        </div>
                    </WizardStep>

                    <!-- Step 3: Location -->
                    <WizardStep title="Location" description="">
                         <div class="space-y-6">
                            <div class="space-y-2">
                                <label class="font-bold text-recovery-moss">Street Address</label>
                                <input type="text" bind:value={formData.addressStreet} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="font-bold text-recovery-moss">City</label>
                                    <input type="text" bind:value={formData.addressCity} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                                </div>
                                <div class="space-y-2">
                                    <label class="font-bold text-recovery-moss">ZIP Code</label>
                                    <input type="text" bind:value={formData.addressZip} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                                </div>
                            </div>
                         </div>
                    </WizardStep>
                    
                    <!-- Step 4: Amenities -->
                    <WizardStep title="Amenities" description="">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {#each availableAmenities as amenity}
                              <label class="flex items-center space-x-3 p-4 border border-recovery-moss/20 rounded-xl cursor-pointer hover:bg-recovery-moss/5 transition-colors">
                                 <input type="checkbox" checked={formData.amenities.includes(amenity)} on:change={() => toggleAmenity(amenity)} class="w-5 h-5 text-recovery-moss rounded focus:ring-recovery-moss border-recovery-moss/30" />
                                 <span class="text-recovery-slate font-medium">{amenity}</span>
                              </label>
                           {/each}
                        </div>
                    </WizardStep>

                    <!-- Step 5: Verification -->
                    <WizardStep title="Verification" description="">
                         <div class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="font-bold text-recovery-moss">License Number</label>
                                    <input type="text" bind:value={formData.licenseNumber} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                                </div>
                                <div class="space-y-2">
                                    <label class="font-bold text-recovery-moss">Insurance Provider</label>
                                    <input type="text" bind:value={formData.insuranceInfo} class="w-full border-b-2 border-recovery-moss/20 bg-transparent py-2 focus:outline-none focus:border-recovery-moss" />
                                </div>
                            </div>
                            <div class="border-2 border-dashed border-recovery-moss/30 rounded-2xl p-8 text-center hover:bg-recovery-moss/5 transition-colors">
                                <label for="file-upload" class="font-bold text-recovery-moss cursor-pointer block mb-2">Upload License & Insurance</label>
                                <p class="text-sm text-recovery-slate/50 mb-4">PDF, JPG, PNG (Max 10MB)</p>
                                <input id="file-upload" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" on:change={handleFileUpload} class="block w-full text-sm text-recovery-slate file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-recovery-moss file:text-white hover:file:bg-recovery-clay cursor-pointer" />
                            </div>
                         </div>
                    </WizardStep>

                </WizardForm>
             {/if}
           </div>
        </div>
      </div>
    </div>
  {/if}

</div>
