<script lang="ts">
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  let donorboxLoaded = false
  let anonymousMode = false

  onMount(() => {
    loadDonorbox()
  })

  function loadDonorbox() {
    if (donorboxLoaded) return

    const script = document.createElement('script')
    script.src = 'https://donorbox.org/widget.js'
    script.setAttribute('paypalExpress', 'false')
    document.head.appendChild(script)

    script.onload = () => {
      donorboxLoaded = true
      initializeDonorbox()
    }
  }

  function initializeDonorbox() {
    // Initialize Donorbox with anonymous mode support
    const donorboxWidget = (window as any).DonorboxWidget
    if (donorboxWidget) {
      const config = {
        anonymous: anonymousMode ? 'true' : 'false',
        skip_personal_info: anonymousMode ? 'true' : 'false'
      }
      donorboxWidget.initialize(config)
    }
  }
</script>

<svelte:head>
  <title>Donate Now - Metzler Foundations</title>
  <meta
    name="description"
    content="Make a secure donation to provide immediate housing support for individuals in recovery. Every dollar helps."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://metzlercares.com/donate" />
  <meta property="og:title" content="Donate Now - Metzler Foundations" />
  <meta
    property="og:description"
    content="Make a secure donation to provide immediate housing support for individuals in recovery. Every dollar helps."
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Donate Now - Metzler Foundations" />
  <link rel="canonical" href="https://metzlercares.com/donate" />
</svelte:head>

<div class="min-h-screen bg-white text-charcoal">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <button on:click={() => goto('/')} class="flex items-center space-x-2">
          <MetzlerBridgeLogo className="w-8 h-8 text-forest-green" />
          <span class="text-xl font-medium text-charcoal">Metzler Foundations</span>
        </button>
        <a href="/give-support" class="btn-secondary text-sm px-4 py-2"> Back to Options </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-charcoal mb-4">Complete Your Donation</h1>
      <p class="text-gray-600 mb-8">
        Your support provides immediate housing assistance. All donations are tax-deductible.
      </p>

      <!-- Anonymous Mode Toggle -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 max-w-md mx-auto">
        <div class="flex items-center justify-between">
          <div class="text-left">
            <h3 class="font-medium text-charcoal mb-1">Anonymous Donation</h3>
            <p class="text-sm text-gray-600">Give without providing personal information</p>
          </div>
          <button
            type="button"
            on:click={() => {
              anonymousMode = !anonymousMode
              initializeDonorbox()
            }}
            class={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-offset-2 ${
              anonymousMode ? 'bg-forest-green' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={anonymousMode}
          >
            <span class="sr-only">Anonymous donation mode</span>
            <span
              class={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                anonymousMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        {#if anonymousMode}
          <div class="mt-4 p-3 bg-forest-green bg-opacity-10 rounded-lg">
            <p class="text-sm text-gray-600">
              <svg class="inline h-4 w-4 mr-1 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <strong>Anonymous Mode:</strong> No personal information required. Tax receipts available upon request at support@metzlerfoundations.org
            </p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Donation Form Container -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      {#if !donorboxLoaded}
        <div class="text-center py-12" role="status" aria-live="polite" aria-label="Loading donation form">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green mx-auto mb-4" aria-hidden="true" />
          <p class="text-charcoal text-lg">Loading secure donation form...</p>
          <p class="text-gray-600 mt-2">Please wait while we prepare your secure payment form.</p>
        </div>
      {:else}
        <div class="donorbox-form-container">
          <!-- Donorbox widget will be inserted here -->
          <!-- Donorbox widget will be inserted here -->
          <script src="https://donorbox.org/widget.js"></script>
          <iframe
            src="https://donorbox.org/embed/metzlercares"
            name="donorbox"
            frameborder="0"
            scrolling="no"
            width="100%"
            height="900px"
            style="max-width: 500px; min-width: 310px; max-height:none!important"
            title="Donorbox Donation Form"
          />
        </div>
      {/if}
    </div>

    <!-- Trust Signals -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <svg class="w-8 h-8 text-forest-green mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 class="font-medium text-charcoal mb-2">Secure & Encrypted</h3>
        <p class="text-sm text-gray-600">Bank-level SSL encryption protects your information</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <svg class="w-8 h-8 text-forest-green mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="font-medium text-charcoal mb-2">Tax Deductible</h3>
        <p class="text-sm text-gray-600">Receive a tax receipt for your donation</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <svg class="w-8 h-8 text-forest-green mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h3 class="font-medium text-charcoal mb-2">Immediate Impact</h3>
        <p class="text-sm text-gray-600">Funds are distributed within 24-48 hours</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 text-center">
      <p class="text-sm text-gray-600">
        Questions about your donation?
        <a href="mailto:support@metzlerfoundations.org" class="text-forest-green hover:text-charcoal ml-1">
          Contact our support team
        </a>
      </p>
      <p class="text-sm text-gray-600 mt-2">
        Metzler Foundations is a 501(c)(3) nonprofit organization. EIN: XX-XXXXXXX
      </p>
    </div>
  </main>
</div>

<style>
  .donorbox-form-container iframe {
    border: none;
    width: 100%;
    min-height: 600px;
  }
</style>
