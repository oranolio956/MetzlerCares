// Error tracking and performance monitoring
import { browser } from '$app/environment'
import { trackError } from './analytics'
import { getConfigValue, FEATURES } from './config'

// Sentry configuration
const SENTRY_DSN = getConfigValue('VITE_SENTRY_DSN')

// Initialize Sentry
export function initErrorTracking(): void {
  if (!browser || !SENTRY_DSN || !FEATURES.errorTracking) {
    return
  }

  // Load Sentry script
  const script = document.createElement('script')
  script.src = 'https://browser.sentry-cdn.com/7.0.0/bundle.min.js'
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)

  script.onload = () => {
    ;(window as any).Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.DEV ? 'development' : 'production',
      tracesSampleRate: 0.1, // 10% of transactions
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      integrations: [new (window as any).Sentry.BrowserTracing(), new (window as any).Sentry.Replay()],
      beforeSend(event: any) {
        // Sanitize sensitive data
        return sanitizeEvent(event)
      }
    })
  }
}

// Sanitize sensitive data from error events
function sanitizeEvent(event: any): any {
  if (event.exception) {
    event.exception.values?.forEach((exception: any) => {
      if (exception.stacktrace?.frames) {
        exception.stacktrace.frames.forEach((frame: any) => {
          // Remove sensitive information from stack traces
          if (frame.filename?.includes('auth') || frame.filename?.includes('password')) {
            frame.filename = '[REDACTED]'
          }
        })
      }
    })
  }

  // Remove sensitive user data
  if (event.user) {
    delete event.user.email
    delete event.user.ip_address
  }

  return event
}

// Track custom errors
export function trackCustomError(
  error: Error | string,
  context?: Record<string, any>,
  level: 'error' | 'warning' | 'info' = 'error'
): void {
  const errorObj = typeof error === 'string' ? new Error(error) : error

  // Send to Google Analytics
  trackError(errorObj, context)

  // Send to Sentry if available
  if (browser && (window as any).Sentry) {
    ;(window as any).Sentry.captureException(errorObj, {
      level,
      tags: context?.tags,
      extra: context
    })
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Tracked error:', errorObj, context)
  }
}

// Track performance metrics
export function trackPerformance(name: string, value: number, unit: 'ms' | 's' | 'bytes' = 'ms'): void {
  if (!browser) {
    return
  }

  // Use Performance API
  if ('performance' in window && 'mark' in window.performance) {
    try {
      performance.mark(name)
    } catch (e) {
      // Mark already exists
    }
  }

  // Send to analytics
  ;(window as any).gtag?.('event', 'performance', {
    name,
    value,
    unit,
    event_category: 'Performance'
  })

  // Send to Sentry
  if ((window as any).Sentry) {
    ;(window as any).Sentry.metrics.increment(`performance.${name}`, value)
  }
}

// Monitor API calls
export function monitorApiCall(
  url: string,
  method: string,
  startTime: number,
  endTime: number,
  status: number,
  error?: Error
): void {
  const duration = endTime - startTime

  if (error) {
    trackCustomError(error, {
      url,
      method,
      duration,
      status
    })
  }

  trackPerformance(`api_${method}_${url.split('/').pop()}`, duration)

  // Log slow requests
  if (duration > 3000) {
    trackCustomError(
      `Slow API call: ${method} ${url} (${duration}ms)`,
      {
        url,
        method,
        duration,
        status
      },
      'warning'
    )
  }
}

// Monitor user interactions
export function monitorUserInteraction(element: string, action: string, timeToAction: number): void {
  trackPerformance(`interaction_${element}_${action}`, timeToAction)

  if (timeToAction > 5000) {
    trackCustomError(
      `Slow user interaction: ${element} ${action}`,
      {
        element,
        action,
        timeToAction
      },
      'warning'
    )
  }
}

// Health check monitoring
export function reportHealthStatus(
  component: string,
  status: 'healthy' | 'degraded' | 'unhealthy',
  details?: Record<string, any>
): void {
  if ((window as any).Sentry) {
    ;(window as any).Sentry.metrics.set(`health.${component}`, status === 'healthy' ? 1 : 0)
  }

  if (status !== 'healthy') {
    trackCustomError(
      `Health check failed: ${component}`,
      {
        component,
        status,
        ...details
      },
      status === 'degraded' ? 'warning' : 'error'
    )
  }
}

// Resource monitoring
export function monitorResources(): void {
  if (!browser) {
    return
  }

  // Monitor memory usage
  if ('memory' in performance) {
    const memInfo = (performance as any).memory
    const usedPercent = Math.round((memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100)

    if (usedPercent > 80) {
      trackCustomError(
        `High memory usage: ${usedPercent}%`,
        {
          used: memInfo.usedJSHeapSize,
          total: memInfo.totalJSHeapSize,
          limit: memInfo.jsHeapSizeLimit
        },
        'warning'
      )
    }
  }

  // Monitor network connectivity
  window.addEventListener('online', () => {
    reportHealthStatus('network', 'healthy')
  })

  window.addEventListener('offline', () => {
    reportHealthStatus('network', 'unhealthy')
  })
}

// Initialize all monitoring
export function initMonitoring(): void {
  if (!browser) {
    return
  }

  initErrorTracking()

  // Monitor resources periodically
  setInterval(monitorResources, 60000) // Every minute

  // Report initial health status
  reportHealthStatus('app', 'healthy', {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  })
}
