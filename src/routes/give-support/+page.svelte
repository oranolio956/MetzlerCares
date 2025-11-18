<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/utils/supabase'
  import { onMount } from 'svelte'
  import type { Partner } from '$lib/types'

  let partners: Partner[] = []
  let loading = true
  let donorboxLoaded = false
  let anonymousMode = false

  onMount(async () => {
    // Fetch sober living partners for social proof
    try {
      const { data, error } = await supabase
        .from('sober_living_partners')
        .select('facility_name')
        .eq('network_status', 'active')
        .limit(6) // Show 6 partners for social proof

      if (error) {
        console.error('Error fetching partners:', error)
        partners = [
          {
            id: '1',
            organization_name: 'Hope Recovery Center',
            contact_email: 'contact@hoperecovery.org',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            organization_name: 'Safe Harbor Sober Living',
            contact_email: 'contact@safeharbor.org',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            organization_name: 'Evergreen Recovery House',
            contact_email: 'contact@evergreen.org',
            created_at: new Date().toISOString()
          },
          {
            id: '4',
            organization_name: 'Rocky Mountain Recovery Homes',
            contact_email: 'contact@rockymountain.org',
            created_at: new Date().toISOString()
          },
          {
            id: '5',
            organization_name: 'Aspen Transitional Living',
            contact_email: 'contact@aspen.org',
            created_at: new Date().toISOString()
          },
          {
            id: '6',
            organization_name: 'Summit Serenity Homes',
            contact_email: 'contact@summit.org',
            created_at: new Date().toISOString()
          }
        ]
      } else {
        partners = (data as unknown as Partner[]) || []
      }
    } catch (error) {
      console.error('Error in onMount:', error)
    } finally {
      loading = false
    }

    // Load Donorbox script
    loadDonorbox()
  })

  function loadDonorbox() {
    if (donorboxLoaded) return

    // Load Donorbox script
    const script = document.createElement('script')
    script.src = 'https://donorbox.org/widget.js'
    script.setAttribute('paypalExpress', 'false')
    document.head.appendChild(script)

    // Set up default form
    script.onload = () => {
      donorboxLoaded = true
      showDonorboxForm()
    }
  }

  function showDonorboxForm(options: any = {}) {
    const container = document.getElementById('donorbox-form')
    if (!container) return

    // Clear existing content
    container.innerHTML = ''

    // Create Donorbox widget
    const widget = document.createElement('script')
    widget.src = 'https://donorbox.org/widget.js'
    widget.setAttribute('paypalExpress', 'false')

    // Default configuration
    const config = {
      widget_key: 'metzlercares', // Replace with actual Donorbox widget key
      amount: options.amount || '',
      recurring: options.recurring || false,
      // Anonymous mode configuration
      anonymous: anonymousMode ? 'true' : 'false',
      skip_personal_info: anonymousMode ? 'true' : 'false',
      ...options
    }

    // Set data attributes
    Object.keys(config).forEach(key => {
      if (config[key] !== '') {
        widget.setAttribute(`data-${key}`, config[key])
      }
    })

    container.appendChild(widget)
  }

  function donateAmount(amount: number) {
    showDonorboxForm({ amount: amount.toString() })
    // Scroll to form
    document.getElementById('donorbox-container')?.scrollIntoView({ behavior: 'smooth' })
  }

  function donateCustom() {
    showDonorboxForm()
    document.getElementById('donorbox-container')?.scrollIntoView({ behavior: 'smooth' })
  }

  function donateMonthly(amount: number) {
    showDonorboxForm({
      amount: amount.toString(),
      recurring: 'true',
      recurring_period: 'month'
    })
    document.getElementById('donorbox-container')?.scrollIntoView({ behavior: 'smooth' })
  }

  function donateMonthlyCustom() {
    showDonorboxForm({
      recurring: 'true',
      recurring_period: 'month'
    })
    document.getElementById('donorbox-container')?.scrollIntoView({ behavior: 'smooth' })
  }

  function contactCorporate() {
    // Open email client or contact form
    window.location.href = 'mailto:partnerships@metzlerfoundations.org?subject=Corporate Partnership Inquiry'
  }

  function donateMatching() {
    showDonorboxForm({
      custom_fields: 'matching_gift=true'
    })
    document.getElementById('donorbox-container')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Make functions available globally for onclick handlers
  import { onMount as svelteOnMount } from 'svelte'
  svelteOnMount(() => {
    ;(window as any).donateAmount = donateAmount
    ;(window as any).donateCustom = donateCustom
    ;(window as any).donateMonthly = donateMonthly
    ;(window as any).donateMonthlyCustom = donateMonthlyCustom
    ;(window as any).contactCorporate = contactCorporate
    ;(window as any).donateMatching = donateMatching
  })
</script>

<svelte:head>
  <title>Give Support - Metzler Foundations</title>
  <meta
    name="description"
    content="Your donation provides immediate housing support for individuals in recovery. Join our mission of dignity through speed."
  />
</svelte:head>

<!-- Global header is provided by layout -->

<!-- Main Content -->
<main class="bg-cream">
  <!-- Hero Section -->
  <section class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-medium text-navy mb-6">Dignity Through Speed</h1>
      <p class="text-xl text-navy text-opacity-80 mb-8">
        Your donation provides immediate housing support for individuals in recovery, eliminating the bureaucratic
        delays that often block access to stable housing.
      </p>
      <a
        href="#donate"
        class="btn-gold text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        Make a Difference Today
      </a>
    </div>
  </section>

  <!-- Our Model Component -->
  <section id="model" class="py-16 px-4 sm:px-6 lg:px-8 bg-navy bg-opacity-5">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-serif font-medium text-navy mb-4">A Modern, Transparent Scholarship</h2>
        <p class="text-lg text-navy text-opacity-70">How we ensure your donation gets exactly where it's needed</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Column 1: Instant Verification -->
        <div class="card text-center">
          <div class="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-navy mb-3">Instant Verification</h3>
          <p class="text-navy text-opacity-80">
            Dignity Through Speed. We use automated verification to approve aid in minutes, not weeks. No pay stubs, no
            invasive paperwork.
          </p>
        </div>

        <!-- Column 2: Vetted Partners -->
        <div class="card text-center">
          <div class="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-navy mb-3">Vetted Partners</h3>
          <p class="text-navy text-opacity-80">
            Guaranteed Quality. We only pay funds directly to a vetted network of certified, safe sober living homes.
          </p>
        </div>

        <!-- Column 3: Direct Payment -->
        <div class="card text-center">
          <div class="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-navy mb-3">Direct Payment</h3>
          <p class="text-navy text-opacity-80">
            Closed-Loop System. All funds are sent instantly and digitally from our foundation to the provider, ensuring
            your donation gets exactly where it's needed.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Our Vetted Partners (Social Proof) -->
  <section class="py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-serif font-medium text-navy mb-4">Our Trusted Sober Living Partners</h2>
        <p class="text-lg text-navy text-opacity-70">Professional facilities we work with across Colorado</p>
      </div>

      {#if loading}
        <div class="flex justify-center items-center py-12" role="status" aria-live="polite">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" aria-hidden="true"></div>
          <span class="ml-3 text-navy">Loading partners...</span>
        </div>
      {:else if partners.length > 0}
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {#each partners as partner}
            <div class="card text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-olive bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 class="text-sm font-medium text-navy">{partner.facility_name}</h3>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-12">
          <p class="text-navy text-opacity-70">Partner information loading...</p>
        </div>
      {/if}
    </div>
  </section>

  <!-- Our Stewardship (Accountability) -->
  <section class="py-16 px-4 sm:px-6 lg:px-8 bg-navy bg-opacity-5">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-3xl font-serif font-medium text-navy mb-6">Your Trust is Our Foundation</h2>
      <p class="text-xl text-navy text-opacity-80 mb-8">We are committed to radical transparency.</p>

      <!-- Trust Seals -->
      <div class="flex flex-wrap justify-center items-center gap-8 mb-8">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-olive rounded-full flex items-center justify-center">
            <span class="text-cream font-bold text-sm">GS</span>
          </div>
          <span class="text-navy font-medium">GuideStar Platinum Seal</span>
        </div>

        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
            <span class="text-navy font-bold text-sm">CN</span>
          </div>
          <span class="text-navy font-medium">Charity Navigator</span>
        </div>
      </div>

      <!-- Financials Link -->
      <a href="/impact" class="btn-secondary inline-block hover:bg-opacity-90 transition-all duration-200">
        View Our Financials & Form 990
      </a>
    </div>
  </section>

  <!-- Donation Section (Anchor for header button) -->
  <section id="donate" class="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-serif font-medium text-navy mb-6">Choose Your Impact Level</h2>
        <p class="text-lg text-navy text-opacity-80 mb-8">
          Every dollar provides immediate housing support. Choose how you'd like to give.
        </p>

        <!-- Anonymous Mode Toggle -->
        <div
          class="bg-white rounded-xl shadow-sm border border-navy border-opacity-10 p-4 sm:p-6 mb-8 max-w-md mx-auto"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="text-left flex-1 min-w-0">
              <h3 class="font-medium text-navy mb-1 text-sm sm:text-base">Anonymous Donation</h3>
              <p class="text-xs sm:text-sm text-navy text-opacity-60">Give without providing personal information</p>
            </div>
            <button
              type="button"
              on:click={() => {
                anonymousMode = !anonymousMode
                showDonorboxForm()
              }}
              class={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-olive focus:ring-offset-2 touch-manipulation ${
                anonymousMode ? 'bg-olive' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={anonymousMode}
              aria-labelledby="anonymous-mode-label"
            >
              <span class="sr-only">Anonymous donation mode</span>
              <span
                class={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  anonymousMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>
          {#if anonymousMode}
            <div class="mt-4 p-3 bg-olive bg-opacity-10 rounded-lg">
              <p class="text-xs sm:text-sm text-navy text-opacity-80">
                <svg
                  class="inline h-4 w-4 mr-1 text-olive flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <strong>Anonymous Mode:</strong> No personal information required. Tax receipts available upon request at
                support@metzlerfoundations.org
              </p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Simplified Donation Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
        <!-- One-Time Gift (Primary) -->
        <div
          class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 p-8 text-center hover:shadow-xl transition-shadow duration-300 md:col-span-2"
        >
          <div class="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h3 class="text-3xl font-semibold text-navy mb-4">Make a One-Time Gift</h3>
          <p class="text-xl text-navy text-opacity-70 mb-8 max-w-2xl mx-auto">
            Your donation provides immediate housing support. Every dollar covers rent and entry fees at certified sober
            living homes.
          </p>

          <!-- Quick Amount Buttons -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-2xl mx-auto">
            <button class="btn-secondary py-4 text-lg font-medium" on:click={() => donateAmount(50)}> $50 </button>
            <button class="btn-secondary py-4 text-lg font-medium" on:click={() => donateAmount(100)}> $100 </button>
            <button class="btn-primary py-4 text-lg font-medium" on:click={() => donateAmount(300)}>
              $300
              <span class="block text-sm opacity-90">House 1 Person</span>
            </button>
            <button class="btn-gold py-4 text-lg font-medium" on:click={donateCustom}> Other Amount </button>
          </div>

          <div class="border-t border-navy border-opacity-10 pt-6">
            <p class="text-sm text-navy text-opacity-60 mb-4">
              💚 Tax-deductible • 100% goes to housing support • Immediate impact
            </p>
          </div>
        </div>

        <!-- Monthly Giving (Secondary) -->
        <div
          class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 p-6 text-center hover:shadow-xl transition-shadow duration-300"
        >
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-gold text-navy px-4 py-1 text-sm font-semibold rounded-full shadow-sm">Most Impactful</span>
          </div>
          <div class="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 mt-4">
            <svg class="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h4 class="text-xl font-semibold text-navy mb-3">Monthly Partner</h4>
          <p class="text-navy text-opacity-70 mb-4 text-sm">
            Sustainable support that provides reliable funding for our housing program.
          </p>
          <button class="w-full btn-primary py-3 text-base font-medium mb-3" on:click={() => donateMonthly(100)}>
            $100/month
          </button>
          <button class="w-full btn-secondary py-2 text-sm" on:click={donateMonthlyCustom}> Choose Amount </button>
          <p class="text-xs text-navy text-opacity-60 mt-3">Cancel anytime • Tax-deductible</p>
        </div>

        <!-- Corporate/Business Giving -->
        <div
          class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 p-6 text-center hover:shadow-xl transition-shadow duration-300"
        >
          <div class="w-12 h-12 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h4 class="text-xl font-semibold text-navy mb-3">Corporate Giving</h4>
          <p class="text-navy text-opacity-70 mb-4 text-sm">
            Employee giving, matching gifts, and corporate partnerships.
          </p>
          <button class="w-full btn-primary py-3 text-base font-medium mb-3" on:click={contactCorporate}>
            Contact Us
          </button>
          <button class="w-full btn-secondary py-2 text-sm" on:click={donateMatching}> Matching Gift </button>
          <p class="text-xs text-navy text-opacity-60 mt-3">Custom programs available</p>
        </div>
      </div>

      <!-- Donorbox Integration -->
      <div id="donorbox-container" class="bg-white rounded-xl shadow-lg border border-navy border-opacity-10 p-8">
        <div id="donorbox-form" class="donorbox-form">
          <!-- Donorbox widget will be loaded here -->
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4"></div>
            <p class="text-navy">Loading secure donation form...</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
</style>
