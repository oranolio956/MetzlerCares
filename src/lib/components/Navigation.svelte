<script lang="ts">
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import LocaleSwitcher from '$lib/components/homepage/LocaleSwitcher.svelte'
  import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/utils/supabase'
  import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

  // Reactive navigation state (Svelte 4)
  let isHome = false
  let isGetAid = false
  let isGiveSupport = false
  let isColoradoRecovery = false
  let isResources = false
  let isImpact = false
  let isPrivacy = false
  $: {
    const pathname = $page.url.pathname
    isHome = pathname === '/'
    isGetAid = pathname.startsWith('/get-aid')
    isGiveSupport = pathname.startsWith('/give-support') || pathname.startsWith('/donate')
    isColoradoRecovery = pathname.startsWith('/colorado-recovery')
    isResources = pathname.startsWith('/resources')
    isImpact = pathname === '/impact'
    isPrivacy = pathname === '/privacy'
  }

  // Component state
  let user: any = null
  let mobileMenuOpen = false
  let mobileMenuButton: HTMLButtonElement | null = null
  let mobileMenuContainer: HTMLDivElement | null = null
  
  export let locale: string = 'en'

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
    } else {
      // Return focus on close (via toggle)
      if (mobileMenuButton) {
        mobileMenuButton.focus()
      }
    }
  }

  function closeMobileMenu() {
    if (mobileMenuOpen) {
      mobileMenuOpen = false
      // Return focus to the menu button
      if (mobileMenuButton) {
        mobileMenuButton.focus()
      }
    }
  }

  function handleNavigation(path: string) {
    closeMobileMenu()
    goto(path)
  }

  function openCookiePreferences() {
    window.dispatchEvent(new CustomEvent('cmp:open'))
  }

  // Extend session function
  function extendUserSession() {
    // This would be imported from session utils
    if (confirm('Extend session by 15 minutes?')) {
      alert('Session extended successfully!')
    }
  }

  // Navigation items configuration - use getter functions for reactive values
  const navigationItems = [
    {
      path: '/housing',
      label: 'Housing',
      get active() {
        return $page.url.pathname.startsWith('/housing')
      }
    },
    {
      path: '/approach',
      label: 'Our Approach',
      get active() {
        return $page.url.pathname.startsWith('/approach')
      }
    },
    {
      path: '/about',
      label: 'About Us',
      get active() {
        return $page.url.pathname.startsWith('/about')
      }
    }
  ]
</script>

<header class="bg-sage-50/90 backdrop-blur-md border-b border-sage-200 sticky top-0 z-50 font-sans transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <!-- Logo -->
      <button
        on:click={() => handleNavigation('/')}
        class="flex items-center space-x-3 hover:opacity-90 transition-opacity group"
        aria-label="Metzler Cares homepage"
      >
        <MetzlerBridgeLogo className="w-9 h-9 text-sage-600 group-hover:text-sage-700 transition-colors" />
        <span class="text-2xl font-serif font-bold text-navy-800 tracking-tight">Metzler Cares</span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-8" aria-label="Main navigation">
        {#each navigationItems as item}
          <a
            href={item.path}
            class="text-navy-600 hover:text-sage-700 font-medium px-1 py-2 text-sm tracking-wide transition-colors duration-200 border-b-2 border-transparent hover:border-sage-300 {item.active
              ? 'text-sage-800 border-sage-500'
              : ''}"
            on:click={closeMobileMenu}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center space-x-3">
        <!-- Locale Switcher -->
        <div class="mr-1 hidden sm:block">
          <LocaleSwitcher currentLocale={locale} variant="light" />
        </div>

        <!-- For Providers (Ghost Button) -->
        <a
          href="/partner-portal"
          class="hidden md:inline-flex px-4 py-2 text-sm font-medium text-navy-600 bg-transparent hover:bg-sage-100 rounded-full transition-colors duration-200"
          on:click={closeMobileMenu}
        >
          For Providers
        </a>

        <!-- Get Help (Primary Sage Button) -->
        <a
          href="/get-aid"
          class="px-5 py-2.5 rounded-full text-white text-sm font-semibold bg-sage-500 hover:bg-sage-600 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          on:click={closeMobileMenu}
        >
          Get Help
        </a>

        <!-- Mobile Menu Button -->
        <button
          bind:this={mobileMenuButton}
          class="md:hidden p-2 rounded-md text-navy-700 hover:bg-sage-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-400"
          on:click={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-navy-900/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        on:click={closeMobileMenu}
        on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
        role="button"
        tabindex="-1"
        aria-hidden="true"
        aria-label="Close menu overlay"
      />

      <!-- Menu -->
      <div
        bind:this={mobileMenuContainer}
        id="mobile-nav"
        class="md:hidden fixed top-[72px] left-0 right-0 bg-white border-b border-sage-200 shadow-xl z-50 transform transition-transform duration-300 ease-out max-h-[calc(100vh-72px)] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div class="px-4 py-6 space-y-1 bg-sage-50/50">
          {#each navigationItems as item}
            <a
              href={item.path}
              class="block text-navy-700 hover:text-sage-800 hover:bg-sage-100 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              on:click={closeMobileMenu}
            >
              {item.label}
            </a>
          {/each}
          
          <div class="my-2 border-t border-sage-200"></div>

          <a
            href="/partner-portal"
            class="block text-navy-600 hover:text-sage-700 hover:bg-sage-100 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            on:click={closeMobileMenu}
          >
            For Providers
          </a>

          <div class="pt-4 pb-2">
             <a
              href="/get-aid"
              class="block w-full text-center px-4 py-3 rounded-full text-white bg-sage-500 hover:bg-sage-600 font-semibold shadow-md transition-all duration-200"
              on:click={closeMobileMenu}
            >
              Get Help
            </a>
          </div>
          
          <!-- Mobile Locale Switcher -->
          <div class="pt-2 flex justify-center">
             <LocaleSwitcher currentLocale={locale} variant="light" />
          </div>
        </div>
      </div>
    {/if}
  </div>
</header>
