<script lang="ts">
  import favicon from '$lib/assets/favicon.svg'
  import '../app.css'
  import { Navigation, Footer } from '$lib'
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { initializeSession, updateActivity } from '$lib/utils/session'
  import { supabase } from '$lib/utils/supabase'
  import {
    initGoogleAnalytics,
    initCoreWebVitals,
    initScrollTracking,
    initTimeTracking,
    trackPageView
  } from '$lib/utils/analytics'
  import { initMonitoring } from '$lib/utils/monitoring'
  import CMPConsent from '$lib/components/CMPConsent.svelte'
  import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

  export let data: any
  // export let children: any = undefined; // Removed unused export

  // Make CSRF token available globally
  let csrfToken: string | null = null

  // Set CSRF token in a way that can be accessed by all components
  if (browser && data?.csrfToken) {
    csrfToken = data.csrfToken
    // Store in sessionStorage for easy access by forms
    if (csrfToken) {
      sessionStorage.setItem('csrf-token', csrfToken)
    }
  }

  onMount(() => {
    // Initialize HIPAA-compliant session management
    if (browser) {
      // Listen for authentication state changes
      supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Initialize HIPAA session management
          initializeSession(session.user.id)
          console.log('🔐 HIPAA Session initialized for user:', session.user.id)
        } else if (event === 'SIGNED_OUT') {
          console.log('🔐 HIPAA Session ended')
        }
      })

      // Track user activity for session management
      let activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

      activityEvents.forEach(eventType => {
        document.addEventListener(
          eventType,
          () => {
            updateActivity()
          },
          { passive: true }
        )
      })

      // Check for initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          initializeSession(session.user.id)
        }
      })

      // Initialize analytics and monitoring
      initGoogleAnalytics()
      initCoreWebVitals()
      initScrollTracking()
      initTimeTracking()
      initMonitoring()

      // Track page views on route changes
      page.subscribe(currentPage => {
        if (currentPage.url) {
          trackPageView(currentPage.url.pathname + currentPage.url.search)
        }
      })
    }
  })
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="description"
    content="The Operating System for Sustainable Recovery. Metzler Cares combines certified peer coaching with AI-driven engagement technology."
  />
  <meta name="theme-color" content="#0F172A" />
  <meta property="og:image" content="{$page.url.origin}/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="{$page.url.origin}/og-image.png" />
</svelte:head>

<a href="#main" class="skip-link">Skip to main content</a>

<Navigation />

<Breadcrumbs />

<main id="main" class="min-h-screen bg-tech-primary text-warm-gray">
  <slot />
</main>

<Footer />

<CMPConsent />

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #3B82F6; /* tech-accent */
    color: #ffffff;
    padding: 8px 12px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
    font-weight: 600;
  }

  .skip-link:focus {
    top: 6px;
  }
</style>
