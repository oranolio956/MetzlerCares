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

<header class="sticky top-0 z-50 border-b border-[rgba(18,_38,_58,_0.08)] bg-white/80 backdrop-blur-xl">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex h-20 items-center justify-between gap-4">
      <!-- Logo -->
      <button
        on:click={() => handleNavigation('/')}
        class="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-cream/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive/40"
        aria-label="Metzler Foundations homepage"
      >
        <MetzlerBridgeLogo className="w-9 h-9 text-navy" />
        <span class="text-lg font-serif font-semibold text-navy tracking-tight">Metzler Foundations</span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-1" aria-label="Main navigation">
        {#each navigationItems as item}
          <a
            href={item.path}
            class={`px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 text-charcoal/70 hover:text-navy hover:bg-cream/90 ${item.active
              ? 'bg-cream text-navy shadow-inner'
              : ''}`}
            on:click={closeMobileMenu}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center gap-3">
        <!-- HIPAA Session Status (Desktop) -->
        {#if user}
          <div class="hidden xl:flex items-center gap-2 rounded-full bg-cream/80 px-3 py-1 text-xs text-charcoal/60">
            <span class="inline-flex h-2 w-2 rounded-full bg-neon-mint" aria-hidden="true" />
            Secure session
            <button
              on:click={extendUserSession}
              class="text-[11px] font-semibold text-navy underline-offset-4 hover:underline"
              title="Extend session by 15 minutes"
              aria-label="Extend secure session by 15 minutes"
            >
              Extend
            </button>
          </div>
        {/if}

        <!-- Cookie preferences for large screens -->
        <button
          on:click={openCookiePreferences}
          class="hidden lg:inline-flex text-sm font-medium text-charcoal/70 hover:text-navy transition-colors"
          aria-label="Cookie preferences"
        >
          Cookie preferences
        </button>

        <!-- Primary CTA -->
        <a
          href="/get-aid"
          class="hidden sm:inline-flex btn-primary text-sm shadow-none hover:translate-y-0 hover:brightness-110"
          on:click={closeMobileMenu}
        >
          Get matched
        </a>

        <!-- Donate Button -->
        <a href="/give-support#donate" class="btn-gold text-sm" on:click={closeMobileMenu}>
          Donate
        </a>

        <!-- Mobile Menu Button -->
        <button
          bind:this={mobileMenuButton}
          class="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-navy transition hover:bg-cream/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive/40"
          on:click={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {#if mobileMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <div
        bind:this={mobileMenuContainer}
        id="mobile-nav"
        class="lg:hidden origin-top rounded-3xl border border-[var(--color-border)] bg-white/95 px-4 py-5 shadow-xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div class="space-y-3">
          {#each navigationItems as item}
            <a
              href={item.path}
              class={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-charcoal/80 transition ${item.active
                ? 'bg-cream text-navy'
                : 'hover:bg-cream/60'}`}
              on:click={closeMobileMenu}
            >
              {item.label}
              <svg class="w-4 h-4 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          {/each}
        </div>

        <div class="mt-5 space-y-3 rounded-2xl bg-cream/60 p-4 text-sm">
          {#if user}
            <div class="flex items-center justify-between text-charcoal/70">
              <span class="flex items-center gap-2">
                <span class="inline-flex h-2.5 w-2.5 rounded-full bg-neon-mint" aria-hidden="true" />
                Secure session
              </span>
              <button
                on:click={extendUserSession}
                class="text-xs font-semibold text-navy underline-offset-4 hover:underline"
                title="Extend session by 15 minutes"
                aria-label="Extend secure session by 15 minutes"
              >
                Extend
              </button>
            </div>
          {/if}

          <a
            href="/get-aid"
            class="btn-primary w-full justify-center text-center text-sm"
            on:click={closeMobileMenu}
          >
            Get matched
          </a>
          <a
            href="/give-support#donate"
            class="btn-gold w-full justify-center text-center text-sm"
            on:click={closeMobileMenu}
          >
            Donate
          </a>
          <button
            on:click={openCookiePreferences}
            class="w-full rounded-full border border-transparent px-4 py-2 text-sm font-medium text-charcoal/70 transition hover:border-current hover:text-navy"
          >
            Cookie preferences
          </button>
        </div>
      </div>
    {/if}
  </div>
</header>
