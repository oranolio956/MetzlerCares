<script lang="ts">
  import favicon from '$lib/assets/favicon.svg'
  import '../app.css'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { page } from '$app/stores'
  import ToastContainer from '$lib/components/ToastContainer.svelte'
  import CMPConsent from '$lib/components/CMPConsent.svelte'
  let mobileOpen = $state(false)
  let { children } = $props()
  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && mobileOpen) mobileOpen = false
  }
  $: if (mobileOpen) {
    setTimeout(() => {
      const el = document.querySelector('#mobile-menu a') as HTMLAnchorElement | null
      el?.focus()
    }, 0)
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Metzler Foundations - Providing dignified housing support for individuals in recovery" />
  <link rel="canonical" href={$page.url.href} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Metzler Foundations" />
  <meta property="og:description" content="Providing dignified housing support for individuals in recovery." />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:image" content="https://metzlerfoundations.org/favicon.svg" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Metzler Foundations" />
  <meta name="twitter:description" content="Providing dignified housing support for individuals in recovery." />
</svelte:head>

<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-sage-600 text-soft-white px-3 py-2 rounded-md">Skip to content</a>
<a href="#primary-nav" class="sr-only focus:not-sr-only focus:absolute focus:top-14 focus:left-2 bg-sage-600 text-soft-white px-3 py-2 rounded-md">Skip to navigation</a>

<header class="bg-soft-white border-b border-deep-navy-200 sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <a href="/" class="flex items-center space-x-2">
        <MetzlerBridgeLogo className="w-8 h-8 text-deep-navy-700" />
        <span class="text-xl font-display font-medium text-deep-navy-900">Metzler Foundations</span>
      </a>

      <button
        class="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-sage-300 text-deep-navy-700 hover:text-deep-navy-900 hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-600"
        aria-controls="mobile-menu"
        aria-expanded={mobileOpen}
        on:click={() => (mobileOpen = !mobileOpen)}
      >
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span class="sr-only">Open menu</span>
      </button>

      <nav id="primary-nav" class="hidden md:flex space-x-6" aria-label="Primary">
        <a href="/get-aid" data-sveltekit-preload-data="hover" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">Get Financial Aid</a>
        <a href="/give-support" data-sveltekit-preload-data="hover" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">Give Support</a>
        <a href="/impact" data-sveltekit-preload-data="hover" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">Impact</a>
      </nav>

      <div class="hidden md:flex items-center space-x-4">
        <a href="/give-support#donate" data-sveltekit-preload-data="hover" class="btn-secondary text-sm">Donate</a>
      </div>
    </div>

    <div id="mobile-menu" class={`${mobileOpen ? 'block' : 'hidden'} md:hidden border-t border-sage-200 py-3`}>
      <nav aria-label="Mobile Primary" class="space-y-2">
        <a href="/get-aid" data-sveltekit-preload-data="hover" class="block px-2 py-2 text-deep-navy-800 hover:text-deep-navy-900">Get Financial Aid</a>
        <a href="/give-support" data-sveltekit-preload-data="hover" class="block px-2 py-2 text-deep-navy-800 hover:text-deep-navy-900">Give Support</a>
        <a href="/impact" data-sveltekit-preload-data="hover" class="block px-2 py-2 text-deep-navy-800 hover:text-deep-navy-900">Impact</a>
        <a href="/give-support#donate" data-sveltekit-preload-data="hover" class="btn-secondary w-full">Donate</a>
      </nav>
    </div>
  </div>
</header>

<svelte:window on:keydown={handleKey} />

<main id="main" class="min-h-screen bg-warm-cream text-deep-navy-900">
  {@render children()}
</main>

  <ToastContainer />
  <CMPConsent />

<footer class="bg-soft-white border-t border-deep-navy-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-deep-navy-800">
    <div class="flex justify-between items-center">
      <p>© Metzler Foundations</p>
      <div class="space-x-4">
        <a href="/partners" data-sveltekit-preload-data="hover" class="underline decoration-sage-600">Partners</a>
        <a href="/resources/colorado" data-sveltekit-preload-data="hover" class="underline decoration-sage-600">Resources</a>
        <a href="/health" data-sveltekit-preload-data="hover" class="underline decoration-sage-600">Status</a>
        <a href="/privacy-policy" data-sveltekit-preload-data="hover" class="underline decoration-sage-600">Privacy</a>
        <a href="/terms-and-conditions" data-sveltekit-preload-data="hover" class="underline decoration-sage-600">Terms</a>
        <button type="button" class="underline decoration-sage-600" on:click={() => window.dispatchEvent(new Event('cmp:open'))}>Cookie Preferences</button>
        <a href="/cookie-policy" data-sveltekit-preload-data="hover" class="underline decoration-sage-600">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>
