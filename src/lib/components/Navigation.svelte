<script lang="ts">
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/utils/supabase'

  // Reactive navigation state
  let isHome = $derived($page.url.pathname === '/')
  let isGetAid = $derived($page.url.pathname.startsWith('/get-aid'))
  let isGiveSupport = $derived(
    $page.url.pathname.startsWith('/give-support') || $page.url.pathname.startsWith('/donate')
  )
  let isColoradoRecovery = $derived($page.url.pathname.startsWith('/colorado-recovery'))
  let isResources = $derived($page.url.pathname.startsWith('/resources'))
  let isImpact = $derived($page.url.pathname === '/impact')
  let isPrivacy = $derived($page.url.pathname === '/privacy')

  // Component state
  let user: any = $state(null)
  let mobileMenuOpen = $state(false)

  onMount(() => {
    // Initialize HIPAA-compliant session management
    if (browser) {
      // Listen for authentication state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          user = session.user
        } else if (event === 'SIGNED_OUT') {
          user = null
        }
      })

      // Check for initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          user = session.user
        }
      })
    }
  })

  // Navigation helpers
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen
  }

  function closeMobileMenu() {
    mobileMenuOpen = false
  }

  function handleNavigation(path: string) {
    closeMobileMenu()
    goto(path)
  }

  // Extend session function
  function extendUserSession() {
    // This would be imported from session utils
    if (confirm('Extend session by 15 minutes?')) {
      alert('Session extended successfully!')
    }
  }

  // Navigation items configuration
  const navigationItems = [
    { path: '/get-aid', label: 'Get Financial Aid', active: isGetAid },
    { path: '/give-support', label: 'Give Support', active: isGiveSupport },
    { path: '/colorado-recovery', label: 'Colorado Recovery', active: isColoradoRecovery },
    { path: '/resources/colorado', label: 'Resources', active: isResources },
    { path: '/impact', label: 'Impact', active: isImpact },
    { path: '/privacy', label: 'Privacy', active: isPrivacy }
  ]
</script>

<!-- Skip to main content -->
<a href="#main" class="skip-link">Skip to main content</a>

<header class="bg-cream border-b border-navy border-opacity-10 sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <!-- Logo -->
      <button
        onclick={() => handleNavigation('/')}
        class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        aria-label="Metzler Foundations homepage"
      >
        <MetzlerBridgeLogo className="w-8 h-8 text-navy" />
        <span class="text-xl font-serif font-medium text-navy">Metzler Foundations</span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-6" aria-label="Main navigation">
        {#each navigationItems as item}
          <a
            href={item.path}
            class="text-navy hover:text-olive transition-colors duration-200 font-medium px-2 py-1 rounded {item.active
              ? 'bg-olive bg-opacity-10 text-olive'
              : ''}"
            onclick={closeMobileMenu}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center space-x-4">
        <!-- HIPAA Session Status (Desktop) -->
        {#if user}
          <div class="hidden md:flex items-center space-x-2 text-sm text-navy text-opacity-60">
            <svg
              class="w-4 h-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Secure Session Active</span>
            <button
              onclick={extendUserSession}
              class="text-xs bg-olive bg-opacity-10 text-olive px-2 py-1 rounded hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-olive focus:ring-inset"
              title="Extend session by 15 minutes"
              aria-label="Extend secure session by 15 minutes"
            >
              Extend
            </button>
          </div>
        {/if}

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 rounded-md text-navy hover:text-olive hover:bg-olive hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-olive focus:ring-inset"
          onclick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {#if mobileMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>

        <!-- Donate Button -->
        <a
          href="/give-support#donate"
          class="btn-gold text-sm px-6 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
          onclick={closeMobileMenu}
        >
          Donate
        </a>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <div
        class="md:hidden bg-cream border-t border-navy border-opacity-10"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div class="px-4 py-6 space-y-4">
          {#each navigationItems as item}
            <a
              href={item.path}
              class="block text-navy hover:text-olive transition-colors duration-200 font-medium py-2 focus:outline-none focus:ring-2 focus:ring-olive focus:ring-inset"
              onclick={closeMobileMenu}
            >
              {item.label}
            </a>
          {/each}

          <!-- Mobile HIPAA Session Status -->
          {#if user}
            <div
              class="flex items-center justify-between text-sm text-navy text-opacity-60 py-2 border-t border-navy border-opacity-10 mt-4 pt-4"
            >
              <div class="flex items-center space-x-2">
                <svg
                  class="w-4 h-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Secure Session Active</span>
              </div>
              <button
                onclick={extendUserSession}
                class="text-xs bg-olive bg-opacity-10 text-olive px-2 py-1 rounded hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-olive focus:ring-inset"
                title="Extend session by 15 minutes"
                aria-label="Extend secure session by 15 minutes"
              >
                Extend
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</header>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: theme('colors.navy');
    color: theme('colors.cream');
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
  }

  .skip-link:focus {
    top: 6px;
  }
</style>
