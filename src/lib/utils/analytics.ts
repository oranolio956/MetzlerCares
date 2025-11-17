// Google Analytics 4 and Core Web Vitals tracking
import { browser } from '$app/environment'
import { getConfigValue, FEATURES } from './config'

// Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = getConfigValue('VITE_GA_MEASUREMENT_ID')

// Initialize Google Analytics
export function initGoogleAnalytics(): void {
  if (!browser || !GA_MEASUREMENT_ID || !FEATURES.analytics) {
    return
  }

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // Initialize gtag
  ;(window as any).dataLayer = (window as any).dataLayer || []
  ;(window as any).gtag = function () {
    ;(window as any).dataLayer.push(arguments)
  }
  ;(window as any).gtag('js', new Date())
  ;(window as any).gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false // We'll send manually for SPA
  })

  // Send initial page view
  trackPageView()
}

// Track page views for SPA
export function trackPageView(url?: string): void {
  if (!browser || !(window as any).gtag) {
    return
  }

  const pageUrl = url || window.location.pathname + window.location.search

  ;(window as any).gtag('config', GA_MEASUREMENT_ID, {
    page_path: pageUrl
  })
}

// Track custom events
export function trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
  if (!browser || !(window as any).gtag) return
  ;(window as any).gtag('event', eventName, {
    ...parameters,
    timestamp: Date.now()
  })
}

// Track user interactions
export function trackUserAction(action: string, category: string, label?: string, value?: number): void {
  trackEvent('user_action', {
    action,
    category,
    label,
    value
  })
}

// Track form interactions
export function trackFormInteraction(
  formName: string,
  action: 'start' | 'complete' | 'abandon' | 'error',
  step?: number
): void {
  trackEvent('form_interaction', {
    form_name: formName,
    action,
    step
  })
}

// Track application process
export function trackApplicationProgress(step: string, applicationId?: string): void {
  trackEvent('application_progress', {
    step,
    application_id: applicationId
  })
}

// Core Web Vitals tracking
export function initCoreWebVitals(): void {
  if (!browser) {
    return
  }

  // Track Largest Contentful Paint (LCP)
  new PerformanceObserver(list => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]

    trackEvent('web_vitals', {
      name: 'LCP',
      value: Math.round(lastEntry.startTime),
      event_category: 'Web Vitals'
    })
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // Track First Input Delay (FID)
  new PerformanceObserver(list => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      trackEvent('web_vitals', {
        name: 'FID',
        value: Math.round(entry.processingStart - entry.startTime),
        event_category: 'Web Vitals'
      })
    })
  }).observe({ entryTypes: ['first-input'] })

  // Track Cumulative Layout Shift (CLS)
  let clsValue = 0
  new PerformanceObserver(list => {
    const entries = list.getEntries()
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
      }
    })
  }).observe({ entryTypes: ['layout-shift'] })

  // Report CLS on page unload
  window.addEventListener('beforeunload', () => {
    trackEvent('web_vitals', {
      name: 'CLS',
      value: Math.round(clsValue * 1000),
      event_category: 'Web Vitals'
    })
  })
}

// Track errors
export function trackError(error: Error, context?: Record<string, any>): void {
  trackEvent('exception', {
    description: error.message,
    fatal: false,
    ...context
  })
}

// Track user engagement
export function trackEngagement(type: 'scroll' | 'time' | 'click', value: number, element?: string): void {
  trackEvent('user_engagement', {
    engagement_type: type,
    value,
    element
  })
}

// Initialize scroll tracking
export function initScrollTracking(): void {
  if (!browser) {
    return
  }

  let maxScroll = 0
  const trackScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)

    if (scrollPercentage > maxScroll && scrollPercentage % 25 === 0) {
      maxScroll = scrollPercentage
      trackEngagement('scroll', scrollPercentage)
    }
  }

  window.addEventListener('scroll', trackScroll, { passive: true })
}

// Initialize time tracking
export function initTimeTracking(): void {
  if (!browser) {
    return
  }

  const startTime = Date.now()

  const trackTime = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    trackEngagement('time', timeSpent)
  }

  // Track time every 30 seconds
  setInterval(trackTime, 30000)

  // Track on page unload
  window.addEventListener('beforeunload', trackTime)
}
