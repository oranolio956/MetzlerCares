<script lang="ts">
  import favicon from '$lib/assets/favicon.svg'
  import '../app.css'
  import { Navigation, Footer } from '$lib'
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

  export let data: any;
  export let children: any = undefined;

  // Make CSRF token available globally
  let csrfToken: string | null = null;

  // Set CSRF token in a way that can be accessed by all components
  if (browser && data?.csrfToken) {
    csrfToken = data.csrfToken;
    // Store in sessionStorage for easy access by forms
    sessionStorage.setItem('csrf-token', csrfToken);
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    name="description"
    content="Colorado recovery housing scholarships. Fast, dignified housing aid for individuals in recovery from addiction. Get approved in minutes, move into certified sober living homes."
  />
  <meta name="theme-color" content="#F5F5DC" />
</svelte:head>

<a href="#main" class="skip-link">Skip to main content</a>

<Navigation />

<main id="main" class="min-h-screen bg-cream text-navy">
  <slot />
</main>

<Footer />

<CMPConsent />
