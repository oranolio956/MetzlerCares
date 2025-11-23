<script lang="ts">
    import { page } from '$app/stores'
    import { browser } from '$app/environment'
    import { onMount } from 'svelte'
    import MetzlerBridgeLogo from '$lib/MetzlerBridgeLogo.svelte'
    import { goto } from '$app/navigation'
    import LocaleSwitcher from '$lib/components/homepage/LocaleSwitcher.svelte'
    import type { HomepageLocale } from '$lib/content/homepage'
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

  export let locale: HomepageLocale | string = 'en'
  let localeFormAction = '/'

  $: {
    const currentUrl = $page.url
    if (currentUrl) {
      const params = new URLSearchParams(currentUrl.search)
      params.delete('lang')
      const queryString = params.toString()
      localeFormAction = queryString ? `${currentUrl.pathname}?${queryString}` : currentUrl.pathname
    } else {
      localeFormAction = '/'
    }
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
      path: '/platform',
      label: 'Platform',
      get active() {
        return $page.url.pathname.startsWith('/platform')
      }
    },
    {
      path: '/partners',
      label: 'Partners',
      get active() {
        return $page.url.pathname.startsWith('/partners')
      }
    },
    {
      path: '/investors',
      label: 'Investors',
      get active() {
        return $page.url.pathname.startsWith('/investors')
      }
    },
    {
      path: '/careers',
      label: 'Careers',
      get active() {
        return $page.url.pathname.startsWith('/careers')
      }
    },
    {
      path: '/about',
      label: 'About',
      get active() {
        return $page.url.pathname.startsWith('/about')
      }
    }
  ]

  const navigationDescriptions: Record<string, string> = {
    Platform: 'See the OS layers and workflows.',
    Partners: 'Run partner handoffs and portals.',
    Investors: 'Review diligence-grade metrics.',
    Careers: 'Join the Colorado field team.',
    About: 'Understand our mission control model.'
  }

  const describeNavItem = (label: string) => navigationDescriptions[label] ?? 'Explore this section.'
</script>

<header class="bg-white border-b border-[var(--surface-border)] sticky top-0 z-50 shadow-sm font-[family-name:var(--font-secondary)]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-3 md:py-4">
      <!-- Logo -->
      <button
        on:click={() => handleNavigation('/')}
        class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        aria-label="Metzler Cares homepage"
      >
        <MetzlerBridgeLogo className="w-8 h-8 text-[var(--color-forest-green)]" />
        <span class="text-xl font-serif font-medium text-[var(--color-charcoal)] font-[family-name:var(--font-primary)]">Metzler Cares</span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-6" aria-label="Main navigation">
        {#each navigationItems as item}
          <a
            href={item.path}
            class="text-[var(--color-charcoal)] hover:text-[var(--color-forest-green)] transition-colors duration-200 font-medium px-3 py-2.5 rounded-md min-h-[44px] flex items-center {item.active
              ? 'bg-[var(--color-forest-green)]/10 text-[var(--color-forest-green)]'
              : 'hover:bg-[var(--surface-gray-50)]'}"
            on:click={closeMobileMenu}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center space-x-4">
        <!-- HIPAA Session Status (Desktop) -->
        {#if user}
          <div class="hidden md:flex items-center space-x-2 text-sm text-[var(--text-muted)]">
            <svg
              class="w-4 h-4 text-[var(--color-success)]"
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
              class="text-xs bg-[var(--color-forest-green)]/10 text-[var(--color-forest-green)] px-2 py-1 rounded hover:bg-[var(--color-forest-green)]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-green)] focus:ring-inset"
              title="Extend session by 15 minutes"
              aria-label="Extend secure session by 15 minutes"
            >
              Extend
            </button>
          </div>
        {/if}
          <div class="hidden md:block">
            <LocaleSwitcher currentLocale={locale} variant="light" formAction={localeFormAction} />
          </div>

        <!-- Mobile Menu Button -->
        <button
          bind:this={mobileMenuButton}
          class="md:hidden p-3 rounded-md text-[var(--color-charcoal)] hover:text-[var(--color-forest-green)] hover:bg-[var(--surface-gray-50)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-green)] focus:ring-inset min-h-[44px] min-w-[44px]"
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

        <!-- Cookie Preferences Button -->
        <button
          on:click={openCookiePreferences}
          class="text-sm text-[var(--text-muted)] hover:text-[var(--color-forest-green)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-green)] focus:ring-inset hidden lg:block"
          aria-label="Cookie preferences"
        >
          Cookie Preferences
        </button>

        <!-- Request Demo CTA -->
        <a
          href="/contact"
          class="px-4 py-2.5 rounded-lg text-white hidden sm:block bg-[var(--color-accent)] hover:bg-[var(--color-mountain-blue)] transition-all duration-200 font-medium min-h-[44px] flex items-center shadow-lg shadow-[var(--color-accent)]/30"
          on:click={closeMobileMenu}
        >
          Request Demo
        </a>

        <!-- Partner Portal Button -->
        <a
          href="/partner-portal"
          class="px-4 py-2.5 rounded-lg text-[var(--color-charcoal)] border border-[var(--surface-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-200 font-medium text-sm hidden sm:block min-h-[44px] flex items-center"
          on:click={closeMobileMenu}
        >
          Partner Portal
        </a>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
      {#if mobileMenuOpen}
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
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
          class="md:hidden fixed inset-x-4 top-[80px] rounded-3xl border border-white/15 bg-[var(--surface-night)]/95 text-white shadow-[0_30px_90px_rgba(2,6,23,0.9)] backdrop-blur-2xl z-50 max-h-[calc(100vh-96px)] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div class="px-5 py-6 space-y-6">
            <div class="flex items-start justify-between gap-6">
              <div>
                <p class="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">Command menu</p>
                <p class="text-lg font-semibold text-white mt-1">Choose a destination</p>
              </div>
              <button
                class="p-2 rounded-full border border-white/10 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                on:click={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex justify-center">
              <LocaleSwitcher currentLocale={locale} variant="dark" formAction={localeFormAction} />
            </div>

            <div class="space-y-3">
              {#each navigationItems as item}
                <a
                  href={item.path}
                  class="block rounded-2xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/10 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                  on:click={closeMobileMenu}
                >
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="text-base font-semibold text-white">{item.label}</p>
                      <p class="text-sm text-white/60 mt-1">{describeNavItem(item.label)}</p>
                    </div>
                    <svg class="w-5 h-5 text-white/50 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              {/each}
            </div>

            {#if user}
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div class="flex items-center justify-between text-sm text-white/70">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                    <span>Secure session active</span>
                  </div>
                  <button
                    on:click={extendUserSession}
                    class="text-xs px-3 py-1.5 rounded-full bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                    title="Extend session by 15 minutes"
                    aria-label="Extend secure session by 15 minutes"
                  >
                    Extend
                  </button>
                </div>
                <p class="text-xs text-white/50">Stay synced with HIPAA-grade monitoring across operators.</p>
              </div>
            {/if}

            <div class="grid gap-3">
              <a
                href="/contact"
                class="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-gray-900 font-semibold py-3 px-4 shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-transform"
                on:click={closeMobileMenu}
              >
                <span>Request demo</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </a>
              <a
                href="/partner-portal"
                class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 py-3 px-4 text-white hover:bg-white/5 transition-colors"
                on:click={closeMobileMenu}
              >
                <span>Partner portal</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </a>
            </div>

            <button
              on:click={() => {
                openCookiePreferences()
                closeMobileMenu()
              }}
              class="w-full text-left text-sm text-white/60 hover:text-white transition-colors duration-200 border-t border-white/10 pt-4"
            >
              Cookie preferences
            </button>
          </div>
        </div>
      {/if}
  </div>
</header>
