<script lang="ts">
  import favicon from '$lib/assets/favicon.svg'
  import '../app.css'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { page } from '$app/stores'
  import ToastContainer from '$lib/components/ToastContainer.svelte'
  import CMPConsent from '$lib/components/CMPConsent.svelte'
  let mobileOpen = $state(false)
  let { children } = $props()
  
  function toggleMobileMenu() {
    mobileOpen = !mobileOpen
  }
  
  function closeMobileMenu() {
    mobileOpen = false
  }
  
  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && mobileOpen) mobileOpen = false
  }
  
  $effect(() => {
    if (mobileOpen) {
      setTimeout(() => {
        const el = document.querySelector('#mobile-menu a') as HTMLAnchorElement | null
        el?.focus()
      }, 0)
    }
  })
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Metzler Foundations - Providing dignified housing support for individuals in recovery" />
  <link rel="canonical" href={$page.url.href} />
  <link rel="alternate" hreflang="en" href={$page.url.href} />
  <link rel="preconnect" href="https://cdn.sanity.io" crossorigin="anonymous" />
  <link rel="dns-prefetch" href="https://cdn.sanity.io" />
  <link rel="preconnect" href="https://donorbox.org" crossorigin="anonymous" />
  <link rel="dns-prefetch" href="https://donorbox.org" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Metzler Foundations" />
  <meta property="og:description" content="Providing dignified housing support for individuals in recovery." />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:image" content="https://metzlerfoundations.org/favicon.svg" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Metzler Foundations" />
  <meta name="twitter:description" content="Providing dignified housing support for individuals in recovery." />
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Metzler Foundations',
      url: ($page && $page.url ? $page.url.origin : 'https://metzlerfoundations.org')
    })}
  </script>
</svelte:head>

<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-sage-600 text-soft-white px-3 py-2 rounded-md">Skip to content</a>
<a href="#primary-nav" class="sr-only focus:not-sr-only focus:absolute focus:top-14 focus:left-2 bg-sage-600 text-soft-white px-3 py-2 rounded-md">Skip to navigation</a>

<header class="bg-soft-white border-b border-deep-navy-200 sticky top-0 z-50 pointer-events-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <a href="/" class="flex items-center space-x-2">
        <MetzlerBridgeLogo class="w-8 h-8 text-deep-navy-700" />
        <span class="text-xl font-display font-medium text-deep-navy-900">Metzler Foundations</span>
      </a>

      <button
        class="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-sage-300 text-deep-navy-700 hover:text-deep-navy-900 hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-600 transition-colors duration-200"
        aria-controls="mobile-menu"
        aria-expanded={mobileOpen}
        onclick={toggleMobileMenu}
        type="button"
      >
        {#if mobileOpen}
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">Close menu</span>
        {:else}
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="sr-only">Open menu</span>
        {/if}
      </button>

      <nav id="primary-nav" class="hidden md:flex space-x-6" aria-label="Primary">
        <a href="/get-aid" data-sveltekit-preload-data="hover" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">Get Financial Aid</a>
        <a href="/give-support" data-sveltekit-preload-data="hover" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">Give Support</a>
        <a href="/impact" data-sveltekit-preload-data="hover" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">Impact</a>
        <a href="/blog" data-sveltekit-preload-data="hover" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">Blog</a>
        <a href="/seo-dashboard" data-sveltekit-preload-data="hover" class="text-deep-navy-700 hover:text-deep-navy-900 transition-colors duration-200 font-medium">SEO Dashboard</a>
      </nav>

      <div class="hidden md:flex items-center space-x-4">
        <a href="/give-support#donate" data-sveltekit-preload-data="hover" class="btn-secondary text-sm">Donate</a>
      </div>
    </div>

    <div id="mobile-menu" class={`${mobileOpen ? 'block' : 'hidden'} md:hidden border-t border-sage-200 py-3 bg-white/95 backdrop-blur-sm absolute left-0 right-0 top-full z-50 shadow-lg`}> 
      <nav aria-label="Mobile Primary" class="space-y-1">
        <a href="/get-aid" data-sveltekit-preload-data="hover" class="block px-4 py-3 text-deep-navy-800 hover:text-deep-navy-900 hover:bg-sage-50 rounded-md transition-colors duration-200" onclick={closeMobileMenu}>Get Financial Aid</a>
        <a href="/give-support" data-sveltekit-preload-data="hover" class="block px-4 py-3 text-deep-navy-800 hover:text-deep-navy-900 hover:bg-sage-50 rounded-md transition-colors duration-200" onclick={closeMobileMenu}>Give Support</a>
        <a href="/impact" data-sveltekit-preload-data="hover" class="block px-4 py-3 text-deep-navy-800 hover:text-deep-navy-900 hover:bg-sage-50 rounded-md transition-colors duration-200" onclick={closeMobileMenu}>Impact</a>
        <a href="/blog" data-sveltekit-preload-data="hover" class="block px-4 py-3 text-deep-navy-800 hover:text-deep-navy-900 hover:bg-sage-50 rounded-md transition-colors duration-200" onclick={closeMobileMenu}>Blog</a>
        <a href="/seo-dashboard" data-sveltekit-preload-data="hover" class="block px-4 py-3 text-deep-navy-800 hover:text-deep-navy-900 hover:bg-sage-50 rounded-md transition-colors duration-200" onclick={closeMobileMenu}>SEO Dashboard</a>
        <a href="/give-support#donate" data-sveltekit-preload-data="hover" class="btn-secondary w-full mt-2" onclick={closeMobileMenu}>Donate</a>
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-deep-navy-800">
    <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <p class="text-center md:text-left">© Metzler Foundations</p>
      <div class="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
        <a href="/partners" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Partners</a>
        <a href="/resources/colorado" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Resources</a>
        <a href="/scholarships" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Scholarships</a>
        <a href="/faq/sober-living" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Sober Living FAQ</a>
        <a href="/guides/sober-living-colorado" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Guide: Sober Living</a>
        <a href="/guides/consumer-protection" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Guide: Consumer Protection</a>
        <a href="/blog" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Blog</a>
        <a href="/health" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Status</a>
        <a href="/privacy-policy" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Privacy</a>
        <a href="/terms-and-conditions" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Terms</a>
        <button type="button" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors" onclick={() => window.dispatchEvent(new Event('cmp:open'))}>Cookie Preferences</button>
        <a href="/cookie-policy" data-sveltekit-preload-data="hover" class="underline decoration-sage-600 hover:text-deep-navy-900 transition-colors">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>
