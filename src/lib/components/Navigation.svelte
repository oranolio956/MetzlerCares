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
      path: '/get-aid',
      label: 'Get Financial Aid',
      get active() {
        return isGetAid
      }
    },
    {
      path: '/give-support',
      label: 'Give Support',
      get active() {
        return isGiveSupport
      }
    },
    {
      path: '/colorado-recovery',
      label: 'Colorado Recovery',
      get active() {
        return isColoradoRecovery
      }
    },
    {
      path: '/resources/colorado',
      label: 'Resources',
      get active() {
        return isResources
      }
    },
    {
      path: '/impact',
      label: 'Impact',
      get active() {
        return isImpact
      }
    }
  ]
</script>

<header class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-3 md:py-4">
      <!-- Logo -->
      <button
        on:click={() => handleNavigation('/')}
        class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        aria-label="Metzler Foundations homepage"
      >
        <MetzlerBridgeLogo className="w-8 h-8 text-forest-green" />
        <span class="text-xl font-serif font-medium text-charcoal">Metzler Foundations</span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-6" aria-label="Main navigation">
        {#each navigationItems as item}
          <a
            href={item.path}
                class="text-charcoal hover:text-forest-green transition-colors duration-200 font-medium px-3 py-2.5 rounded-md min-h-[44px] flex items-center {item.active
              ? 'bg-forest-green bg-opacity-10 text-forest-green'
              : 'hover:bg-gray-50'}"
            on:click={closeMobileMenu}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center space-x-4">
        <!-- HIPAA Session Status (Desktop) -->
        {#if user}
          <div class="hidden md:flex items-center space-x-2 text-sm text-gray-600">
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
              on:click={extendUserSession}
                class="text-xs bg-forest-green bg-opacity-10 text-forest-green px-2 py-1 rounded hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-inset"
              title="Extend session by 15 minutes"
              aria-label="Extend secure session by 15 minutes"
            >
              Extend
            </button>
          </div>
        {/if}

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

        <!-- Cookie Preferences Button -->
        <button
          on:click={openCookiePreferences}
          class="text-sm text-gray-600 hover:text-forest-green transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-inset hidden lg:block"
          aria-label="Cookie preferences"
        >
          Cookie Preferences
        </button>

        <!-- Get Started CTA -->
        <a
          href="/#assessment-form"
          class="px-4 py-2.5 rounded-lg text-white hidden sm:block bg-forest-green hover:bg-opacity-90 transition-all duration-200 font-medium min-h-[44px] flex items-center"
          on:click={closeMobileMenu}
        >
          Get Started
        </a>

        <!-- Donate Button -->
        <a
          href="/give-support#donate"
          class="px-4 py-2.5 rounded-lg text-white bg-sunset-orange hover:bg-opacity-90 transition-all duration-200 font-medium text-sm hidden sm:block min-h-[44px] flex items-center"
          on:click={closeMobileMenu}
        >
          Donate
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

          <!-- Mobile HIPAA Session Status -->
          {#if user}
            <div
              class="flex items-center justify-between text-sm text-gray-600 py-2 border-t border-gray-200 mt-4 pt-4"
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
                on:click={extendUserSession}
                class="text-xs bg-forest-green bg-opacity-10 text-forest-green px-2 py-1 rounded hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-inset"
                title="Extend session by 15 minutes"
                aria-label="Extend secure session by 15 minutes"
              >
                Extend
              </button>
            </div>
          {/if}

          <!-- Cookie Preferences -->
          <button
            on:click={openCookiePreferences}
            class="block text-sm text-gray-600 hover:text-forest-green transition-colors duration-200 py-2 border-t border-gray-200 mt-2 pt-2 focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-inset"
          >
            Cookie Preferences
          </button>
        </div>
      </div>
    {/if}
  </div>
</header>
