<script lang="ts">
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/utils/supabase'
  import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

  // Reactive navigation state (Svelte 4)
  let isHome = false
  let isSolutions = false
  let isPartners = false
  let isInvestors = false
  let isImpact = false
  let isAbout = false
  let isCareers = false

  $: {
    const pathname = $page.url.pathname
    isHome = pathname === '/'
    isSolutions = pathname.startsWith('/solutions')
    isPartners = pathname.startsWith('/partners')
    isInvestors = pathname.startsWith('/investors')
    isImpact = pathname === '/impact'
    isAbout = pathname === '/about'
    isCareers = pathname === '/careers'
  }

  // Component state
  let user: any = null
  let mobileMenuOpen = false
  let mobileMenuButton: HTMLButtonElement | null = null
  let mobileMenuContainer: HTMLDivElement | null = null

  onMount(() => {
    // Initialize HIPAA-compliant session management
    if (browser) {
      // Listen for authentication state changes
      supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
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

      // Handle Escape key to close mobile menu
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && mobileMenuOpen) {
          closeMobileMenu()
        }
      }

      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  })

  // Navigation helpers
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen
    if (mobileMenuOpen) {
      // Focus management for mobile menu
      setTimeout(() => {
        if (mobileMenuContainer) {
          const firstFocusable = mobileMenuContainer.querySelector(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement
          if (firstFocusable) {
            firstFocusable.focus()
          }
        }
      }, 100)
    }
  }

  function closeMobileMenu() {
    mobileMenuOpen = false
    // Return focus to the menu button
    if (mobileMenuButton) {
      mobileMenuButton.focus()
    }
  }

  function handleNavigation(path: string) {
    closeMobileMenu()
    goto(path)
  }

  // Navigation items configuration - B2B / Tech Focus
  const navigationItems = [
    {
      path: '/solutions',
      label: 'Solutions',
      get active() {
        return isSolutions
      }
    },
    {
      path: '/partners',
      label: 'Partners',
      get active() {
        return isPartners
      }
    },
    {
      path: '/investors',
      label: 'Investors',
      get active() {
        return isInvestors
      }
    },
    {
      path: '/impact',
      label: 'Impact',
      get active() {
        return isImpact
      }
    },
    {
      path: '/about',
      label: 'Governance',
      get active() {
        return isAbout
      }
    }
  ]
</script>

<header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm font-sans">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-3 md:py-4">
      <!-- Logo -->
      <button
        on:click={() => handleNavigation('/')}
        class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        aria-label="Metzler Cares homepage"
      >
        <MetzlerBridgeLogo className="w-8 h-8 text-forest-green" />
        <div class="flex flex-col items-start">
           <span class="text-xl font-bold text-charcoal leading-none">Metzler Cares</span>
           <span class="text-[10px] text-gray-500 uppercase tracking-wider leading-none mt-1">Tech-First Recovery</span>
        </div>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-4 lg:space-x-6" aria-label="Main navigation">
        {#each navigationItems as item}
          <a
            href={item.path}
            class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium px-2 py-2.5 rounded-md min-h-[44px] flex items-center text-sm lg:text-base {item.active
              ? 'bg-forest-green bg-opacity-10 text-forest-green'
              : 'hover:bg-gray-50'}"
            on:click={closeMobileMenu}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center space-x-3">
        <!-- Patient/Individual Path (Secondary) -->
        <a
           href="/get-aid"
           class="hidden lg:block text-sm text-gray-500 hover:text-green-600 font-medium"
        >
           For Patients
        </a>

        <!-- Mobile Menu Button -->
        <button
          bind:this={mobileMenuButton}
          class="md:hidden p-3 rounded-md text-charcoal hover:text-forest-green hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-inset min-h-[44px] min-w-[44px]"
          on:click={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {#if mobileMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>

        <!-- Request Demo CTA -->
        <a
          href="/partners"
          class="px-4 py-2.5 rounded-lg text-white hidden sm:block bg-forest-green hover:bg-opacity-90 transition-all duration-200 font-bold text-sm min-h-[44px] flex items-center shadow-md"
          on:click={closeMobileMenu}
        >
          Request Demo
        </a>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
        on:click={closeMobileMenu}
        role="button"
        tabindex="-1"
        aria-label="Close menu"
      />
      
      <!-- Menu -->
      <div
        bind:this={mobileMenuContainer}
        id="mobile-nav"
        class="md:hidden fixed top-[65px] left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div class="px-4 py-6 space-y-2 max-h-[calc(100vh-65px)] overflow-y-auto">
          {#each navigationItems as item}
            <a
              href={item.path}
              class="block text-charcoal hover:text-forest-green transition-colors duration-200 font-medium py-2 px-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-inset"
              on:click={closeMobileMenu}
            >
              {item.label}
            </a>
          {/each}

          <!-- Mobile Secondary Links -->
          <div class="border-t border-gray-100 mt-4 pt-4 space-y-3">
             <a
               href="/get-aid"
               class="block text-gray-500 font-medium py-2 px-2"
               on:click={closeMobileMenu}
             >
               For Individuals (Get Aid)
             </a>
             <a
               href="/careers"
               class="block text-gray-500 font-medium py-2 px-2"
               on:click={closeMobileMenu}
             >
               Careers
             </a>
             <a
               href="/partners/facility-network"
               class="block text-gray-500 font-medium py-2 px-2"
               on:click={closeMobileMenu}
             >
               Join Facility Network
             </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</header>
