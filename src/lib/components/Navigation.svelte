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
  $: {
    const pathname = $page.url.pathname
    isHome = pathname === '/'
  }

  // Component state
  let user: any = null
  let mobileMenuOpen = false
  let mobileMenuButton: HTMLButtonElement | null = null
  let mobileMenuContainer: HTMLDivElement | null = null

  onMount(() => {
    if (browser) {
      supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          user = session.user
        } else if (event === 'SIGNED_OUT') {
          user = null
        }
      })

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          user = session.user
        }
      })

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

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen
    if (mobileMenuOpen) {
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

  function extendUserSession() {
    if (confirm('Extend session by 15 minutes?')) {
      alert('Session extended successfully!')
    }
  }

  const navigationItems = [
    {
      path: '/platform',
      label: 'Platform',
      get active() {
        return $page.url.pathname.startsWith('/platform')
      }
    },
    {
      path: '/impact',
      label: 'Impact',
      get active() {
        return $page.url.pathname.startsWith('/impact')
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
      path: '/about',
      label: 'About',
      get active() {
        return $page.url.pathname.startsWith('/about')
      }
    }
  ]
</script>

<header class="bg-recovery-paper/95 border-b border-recovery-moss/10 sticky top-0 z-40 backdrop-blur-md shadow-sm transition-all duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-3 md:py-4">
      <!-- Logo -->
      <button
        on:click={() => handleNavigation('/')}
        class="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        aria-label="Metzler Cares homepage"
      >
        <MetzlerBridgeLogo className="w-8 h-8 text-recovery-moss" />
        <span class="text-xl font-heading font-bold text-recovery-moss">Metzler Cares</span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-1 lg:space-x-2" aria-label="Main navigation">
        {#each navigationItems as item}
          <a
            href={item.path}
            class="text-recovery-slate font-body font-medium px-4 py-2 rounded-full transition-all duration-200 hover:text-recovery-moss hover:bg-recovery-moss/5 {item.active ? 'bg-recovery-moss/10 text-recovery-moss font-bold' : ''}"
            on:click={closeMobileMenu}
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="flex items-center space-x-4">
        <!-- HIPAA Session Status (Desktop) -->
        {#if user}
          <div class="hidden md:flex items-center space-x-2 text-sm text-recovery-slate/70">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="font-hand">Secure Session</span>
          </div>
        {/if}

        <!-- Mobile Menu Button -->
        <button
          bind:this={mobileMenuButton}
          class="md:hidden p-2 rounded-full text-recovery-moss hover:bg-recovery-moss/10 transition-colors"
          on:click={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
           <!-- Hamburger / Close Icon -->
           <div class="w-6 h-5 relative flex flex-col justify-between">
              <span class="w-full h-0.5 bg-current transition-all {mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}"></span>
              <span class="w-full h-0.5 bg-current transition-all {mobileMenuOpen ? 'opacity-0' : ''}"></span>
              <span class="w-full h-0.5 bg-current transition-all {mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}"></span>
           </div>
        </button>

        <!-- Request Demo CTA -->
        <a
          href="/contact"
          class="hidden sm:flex px-6 py-2.5 bg-recovery-moss text-white rounded-full font-heading font-bold hover:bg-recovery-clay transition-all shadow-forest hover:shadow-sunset"
          on:click={closeMobileMenu}
        >
          Request Demo
        </a>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <div
        class="fixed inset-0 bg-recovery-slate/50 z-30 md:hidden backdrop-blur-sm"
        on:click={closeMobileMenu}
        role="button"
        tabindex="-1"
        aria-label="Close menu"
      />
      
      <div
        bind:this={mobileMenuContainer}
        class="md:hidden fixed top-[65px] left-0 right-0 bg-recovery-paper border-b border-recovery-moss/10 shadow-xl z-40 rounded-b-2xl overflow-hidden"
      >
        <div class="px-6 py-8 space-y-4">
          {#each navigationItems as item}
            <a
              href={item.path}
              class="block text-2xl font-heading font-bold text-recovery-moss hover:text-recovery-clay transition-colors py-2"
              on:click={closeMobileMenu}
            >
              {item.label}
            </a>
          {/each}
          
          <div class="border-t border-recovery-moss/10 pt-6 mt-6">
             <a href="/contact" class="block w-full text-center py-4 bg-recovery-moss text-white rounded-xl font-bold font-heading shadow-forest" on:click={closeMobileMenu}>
                Request Demo
             </a>
             <a href="/partner-portal" class="block w-full text-center py-4 mt-4 text-recovery-moss border border-recovery-moss/30 rounded-xl font-bold font-heading" on:click={closeMobileMenu}>
                Partner Portal
             </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</header>
