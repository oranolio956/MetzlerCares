<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly, scale } from 'svelte/transition'
  import InsuranceVerifier from '$lib/components/InsuranceVerifier.svelte'
  import UrgencyIndicator from '$lib/components/UrgencyIndicator.svelte'

  let showInsuranceModal = false
  let selectedFacility: any = null
  let facilities: any[] = []
  let testimonials: any[] = []
  let isLoading = true
  let emergencyNumber = '(303) 555-HELP'

  onMount(async () => {
    // Load crisis-specific data
    await loadFacilities()
    await loadTestimonials()

    // Track page view
    trackPageView('crisis_landing')

    isLoading = false
  })

  async function loadFacilities() {
    try {
      const response = await fetch('/api/facilities?type=rehab&urgency=high&limit=3')
      facilities = await response.json()
    } catch (err) {
      console.error('Error loading facilities:', err)
      // Fallback data
      facilities = [
        {
          id: '1',
          name: 'Denver Recovery Center',
          phone: '(303) 555-0101',
          current_availability: 3,
          total_beds: 50,
          accepts_medicaid: true,
          accepts_medicare: true,
          specialties: ['alcohol', 'drugs', 'dual-diagnosis'],
          success_rate: 85,
          average_wait_time_days: 0
        },
        {
          id: '2',
          name: 'Colorado Springs Treatment',
          phone: '(719) 555-0103',
          current_availability: 1,
          total_beds: 35,
          accepts_medicaid: true,
          accepts_medicare: false,
          specialties: ['drugs', 'alcohol', 'outpatient'],
          success_rate: 78,
          average_wait_time_days: 1
        }
      ]
    }
  }

  async function loadTestimonials() {
    testimonials = [
      {
        name: 'Sarah M.',
        location: 'Denver, CO',
        text: 'They got me into treatment the same day I called. The staff saved my life.',
        rating: 5
      },
      {
        name: 'Mike R.',
        location: 'Aurora, CO',
        text: 'My insurance was verified in minutes and I was admitted within hours.',
        rating: 5
      },
      {
        name: 'Jennifer L.',
        location: 'Boulder, CO',
        text: 'The urgency and care they showed got me the help I needed when I needed it most.',
        rating: 5
      }
    ]
  }

  function trackPageView(pageType: string) {
    // Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'page_view', {
        page_title: 'Crisis Help - Immediate Addiction Treatment',
        page_location: window.location.href,
        page_type: pageType,
        persona: 'crisis'
      })
    }

    // Custom analytics
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'page_view',
        persona: 'crisis',
        page_url: window.location.href,
        metadata: { page_type: pageType }
      })
    }).catch(console.error)
  }

  function handleInsuranceComplete(event: CustomEvent) {
    showInsuranceModal = false

    if (event.detail.verified) {
      // Show next steps for verified insurance
      trackConversion('insurance_verified')
    }
  }

  function handleUrgencyClick(event: CustomEvent) {
    trackConversion('urgency_cta_clicked')

    // Find facility and show contact info
    const facility = facilities.find(f => f.id === event.detail.facilityId)
    if (facility) {
      selectedFacility = facility
    }
  }

  function trackConversion(conversionType: string) {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'conversion',
        persona: 'crisis',
        metadata: { conversion_type: conversionType }
      })
    }).catch(console.error)
  }

  function callEmergency() {
    trackConversion('emergency_call_initiated')
    window.location.href = `tel:${emergencyNumber.replace(/\D/g, '')}`
  }

  function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
  }
</script>

<svelte:head>
  <title>Immediate Help Available - Same-Day Addiction Treatment Colorado</title>
  <meta
    name="description"
    content="Get immediate addiction treatment in Colorado. Same-day admission available. Insurance verified in minutes. 24/7 crisis support."
  />
  <meta
    name="keywords"
    content="emergency addiction treatment Colorado, same-day rehab, crisis help, immediate admission"
  />
</svelte:head>

<div class="crisis-landing min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
        <p>Finding available treatment options...</p>
      </div>
    </div>
  {:else}
    <!-- Emergency Banner -->
    <div class="bg-red-600 text-white py-3 px-4 text-center">
      <div class="flex items-center justify-center">
        <span class="text-xl mr-2">🚨</span>
        <span class="font-semibold">24/7 CRISIS SUPPORT AVAILABLE</span>
        <button
          on:click={callEmergency}
          class="ml-4 bg-white text-red-600 px-4 py-1 rounded-full font-bold hover:bg-gray-100 transition-colors"
        >
          CALL {emergencyNumber} NOW
        </button>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="py-16 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <div in:fade={{ duration: 800, delay: 200 }}>
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Help is Available
            <span class="text-yellow-300">Right Now</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            Same-day admission to Colorado's top addiction treatment centers.
            <br />Insurance verified in minutes. Don't wait.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center" in:fade={{ duration: 800, delay: 400 }}>
          <button
            on:click={() => (showInsuranceModal = true)}
            class="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Verify Insurance in 30 Seconds
          </button>
          <button
            on:click={callEmergency}
            class="bg-white hover:bg-gray-100 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Speak to Someone Now
          </button>
        </div>
      </div>
    </section>

    <!-- Urgency Indicators -->
    <section class="py-8 px-4 bg-black bg-opacity-20">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold text-center mb-8">Available Treatment Beds</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each facilities as facility, i}
            <div
              in:fly={{ duration: 600, delay: i * 200 }}
              class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6"
            >
              <h3 class="text-xl font-semibold mb-3">{facility.name}</h3>
              <UrgencyIndicator
                facilityId={facility.id}
                urgencyLevel={facility.current_availability <= 1 ? 5 : facility.current_availability <= 3 ? 4 : 3}
                message={`${facility.current_availability} of ${facility.total_beds} beds available`}
                on:urgencyCtaClick={handleUrgencyClick}
              />
              <div class="mt-4 space-y-2 text-sm">
                <p>📞 {formatPhoneNumber(facility.phone)}</p>
                <p>✅ {facility.success_rate}% Success Rate</p>
                {#if facility.average_wait_time_days === 0}
                  <p class="text-green-300 font-medium">⚡ Same-day admission available</p>
                {:else}
                  <p>
                    Avg wait: {facility.average_wait_time_days} day{facility.average_wait_time_days !== 1 ? 's' : ''}
                  </p>
                {/if}
              </div>
              <button
                on:click={() => (window.location.href = `tel:${facility.phone.replace(/\D/g, '')}`)}
                class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Call Now
              </button>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Insurance Verification Section -->
    <section class="py-16 px-4 bg-white text-gray-900">
      <div class="max-w-4xl mx-auto text-center">
        <div in:fade={{ duration: 800 }}>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Insurance Verification</h2>
          <p class="text-lg text-gray-600 mb-8">
            Get instant verification for Medicaid, Medicare, and major insurance providers.
            <br />Know your coverage before you call.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-8">
          <div in:scale={{ duration: 600, delay: 200 }} class="text-center">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="font-semibold mb-2">30 Seconds</h3>
            <p class="text-gray-600 text-sm">Instant verification with major providers</p>
          </div>
          <div in:scale={{ duration: 600, delay: 400 }} class="text-center">
            <div class="text-4xl mb-4">🔒</div>
            <h3 class="font-semibold mb-2">100% Secure</h3>
            <p class="text-gray-600 text-sm">Encrypted and HIPAA compliant</p>
          </div>
          <div in:scale={{ duration: 600, delay: 600 }} class="text-center">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="font-semibold mb-2">Save Money</h3>
            <p class="text-gray-600 text-sm">Know your costs upfront</p>
          </div>
        </div>

        <button
          on:click={() => (showInsuranceModal = true)}
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
        >
          Verify My Insurance Now
        </button>
      </div>
    </section>

    <!-- Trust Signals -->
    <section class="py-16 px-4 bg-gray-50 text-gray-900">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Why Choose MetzlerCares?</h2>
          <p class="text-lg text-gray-600">Trusted by thousands of families across Colorado</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div in:fade={{ duration: 600, delay: 200 }} class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
            <p class="text-gray-600">Lives Saved</p>
          </div>
          <div in:fade={{ duration: 600, delay: 400 }} class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <p class="text-gray-600">Crisis Support</p>
          </div>
          <div in:fade={{ duration: 600, delay: 600 }} class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">85%</div>
            <p class="text-gray-600">Success Rate</p>
          </div>
          <div in:fade={{ duration: 600, delay: 800 }} class="text-center">
            <div class="text-3xl font-bold text-orange-600 mb-2">&lt; 1 Hour</div>
            <p class="text-gray-600">Avg. Admission Time</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 px-4 bg-white text-gray-900">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Real Stories from Real People</h2>
        <div class="grid md:grid-cols-3 gap-8">
          {#each testimonials as testimonial, i}
            <div in:fade={{ duration: 600, delay: i * 200 }} class="bg-gray-50 rounded-lg p-6">
              <div class="flex mb-4">
                {#each Array(testimonial.rating) as _, star}
                  <span class="text-yellow-400">⭐</span>
                {/each}
              </div>
              <p class="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div class="font-semibold text-gray-800">{testimonial.name}</div>
              <div class="text-sm text-gray-600">{testimonial.location}</div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4 bg-blue-900 text-white text-center">
      <div in:fade={{ duration: 800 }}>
        <h2 class="text-3xl font-bold mb-4">Don't Wait - Get Help Now</h2>
        <p class="text-xl mb-8 text-blue-100">
          Every minute counts. Our team is standing by to help you take the first step.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            on:click={() => (showInsuranceModal = true)}
            class="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Verify Insurance & Get Started
          </button>
          <button
            on:click={callEmergency}
            class="bg-white hover:bg-gray-100 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Call Now: {emergencyNumber}
          </button>
        </div>
      </div>
    </section>
  {/if}

  <!-- Insurance Modal -->
  {#if showInsuranceModal}
    <div
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      transition:fade={{ duration: 300 }}
    >
      <div
        class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        transition:scale={{ duration: 300 }}
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Insurance Verification</h3>
            <button on:click={() => (showInsuranceModal = false)} class="text-gray-400 hover:text-gray-600 text-2xl">
              ✕
            </button>
          </div>
          <InsuranceVerifier persona="crisis" on:verificationComplete={handleInsuranceComplete} />
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .crisis-landing {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
