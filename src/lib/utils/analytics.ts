// Analytics utility functions
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window === 'undefined') return

  // Google Analytics 4
  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', eventName, eventData)
  }

  // Custom analytics tracking
  if (typeof (window as any).dataLayer !== 'undefined') {
    ;(window as any).dataLayer.push({
      event: eventName,
      ...eventData
    })
  }

  // Console log for development
  if (import.meta.env.DEV) {
    console.log('Analytics Event:', eventName, eventData)
  }
}

export function trackPageView(path: string) {
  trackEvent('page_view', { path })
}

export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent('form_submission', {
    form_name: formName,
    success
  })
}

export function trackFormInteraction(
  formName: string,
  action: 'focus' | 'input' | 'submit' | 'error' | 'start' | 'complete',
  metadata?: Record<string, any>
) {
  trackEvent('form_interaction', {
    form_name: formName,
    action,
    ...metadata
  })
}

export function trackButtonClick(buttonName: string, location?: string) {
  trackEvent('button_click', {
    button_name: buttonName,
    location
  })
}

export function trackDonation(amount: number, type: 'one-time' | 'recurring') {
  trackEvent('donation', {
    amount,
    type
  })
}

export function trackAidApplication(step: string) {
  trackEvent('aid_application', {
    step
  })
}

export function trackError(error: Error, context?: Record<string, any>) {
  trackEvent('error', {
    error_message: error.message,
    error_name: error.name,
    error_stack: error.stack,
    ...context
  })
}

// Initialize Google Analytics
export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return

  const gaId = import.meta.env.VITE_GA_ID || 'G-XXXXXXXXXX'

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  // Initialize gtag
  ;(window as any).dataLayer = (window as any).dataLayer || []
  function gtag(...args: any[]) {
    ;(window as any).dataLayer.push(args)
  }
  ;(window as any).gtag = gtag
  gtag('js', new Date())
  gtag('config', gaId, {
    page_path: window.location.pathname
  })
}

// Initialize Core Web Vitals tracking
export function initCoreWebVitals() {
  if (typeof window === 'undefined') return

  // Track Largest Contentful Paint (LCP)
  new PerformanceObserver(entryList => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1] as any
    trackEvent('web_vital', {
      name: 'LCP',
      value: lastEntry.renderTime || lastEntry.loadTime,
      id: lastEntry.id
    })
  }).observe({ entryTypes: ['largest-contentful-paint'] })

  // Track First Input Delay (FID)
  new PerformanceObserver(entryList => {
    const entries = entryList.getEntries()
    entries.forEach((entry: any) => {
      trackEvent('web_vital', {
        name: 'FID',
        value: entry.processingStart - entry.startTime,
        id: entry.name
      })
    })
  }).observe({ entryTypes: ['first-input'] })

  // Track Cumulative Layout Shift (CLS)
  let clsValue = 0
  new PerformanceObserver(entryList => {
    const entries = entryList.getEntries()
    entries.forEach((entry: any) => {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value
      }
    })
    trackEvent('web_vital', {
      name: 'CLS',
      value: clsValue
    })
  }).observe({ entryTypes: ['layout-shift'] })
}

// Initialize scroll tracking
export function initScrollTracking() {
  if (typeof window === 'undefined') return

  let maxScroll = 0
  const scrollThresholds = [25, 50, 75, 90, 100]

  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    )

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent

      // Track milestone scroll depths
      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && maxScroll < threshold + 5) {
          trackEvent('scroll_depth', {
            depth: threshold,
            page: window.location.pathname
          })
        }
      })
    }
  })
}

// Initialize time on page tracking
export function initTimeTracking() {
  if (typeof window === 'undefined') return

  const startTime = Date.now()
  const timeThresholds = [30, 60, 120, 300] // seconds

  const interval = setInterval(() => {
    const timeOnPage = Math.floor((Date.now() - startTime) / 1000)

    timeThresholds.forEach(threshold => {
      if (timeOnPage === threshold) {
        trackEvent('time_on_page', {
          seconds: threshold,
          page: window.location.pathname
        })
      }
    })
  }, 1000)

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(interval)
    const totalTime = Math.floor((Date.now() - startTime) / 1000)
    trackEvent('page_exit', {
      time_on_page: totalTime,
      page: window.location.pathname
    })
  })
}
