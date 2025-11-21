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
