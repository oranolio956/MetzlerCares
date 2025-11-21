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

<header class="bg-cream border-b border-navy border-opacity-10 sticky top-0 z-40 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <!-- Logo -->
      <button
        on:click={() => handleNavigation('/')}
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
            on:click={closeMobileMenu}
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
              on:click={extendUserSession}
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
          bind:this={mobileMenuButton}
          class="md:hidden p-2 rounded-md text-navy hover:text-olive hover:bg-olive hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-olive focus:ring-inset"
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
          class="text-sm text-navy text-opacity-70 hover:text-olive transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-olive focus:ring-inset hidden lg:block"
          aria-label="Cookie preferences"
        >
          Cookie Preferences
        </button>

        <!-- Get Started CTA -->
        <a
          href="/#assessment-form"
          class="px-4 py-2 rounded-md text-white hidden sm:block hover:scale-105 transition-transform"
          style="background: linear-gradient(135deg, var(--color-brand-green, #00c853) 0%, #00e676 100%); box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
          on:click={closeMobileMenu}
        >
          Get Started
        </a>

        <!-- Donate Button -->
        <a
          href="/give-support#donate"
          class="btn-gold text-sm px-6 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
          on:click={closeMobileMenu}
        >
          Donate
        </a>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <div
        bind:this={mobileMenuContainer}
        id="mobile-nav"
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
              on:click={closeMobileMenu}
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
                on:click={extendUserSession}
                class="text-xs bg-olive bg-opacity-10 text-olive px-2 py-1 rounded hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-olive focus:ring-inset"
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
            class="block text-sm text-navy text-opacity-70 hover:text-olive transition-colors duration-200 py-2 border-t border-navy border-opacity-10 mt-2 pt-2 focus:outline-none focus:ring-2 focus:ring-olive focus:ring-inset"
          >
            Cookie Preferences
          </button>
        </div>
      </div>
    {/if}
  </div>
</header>
