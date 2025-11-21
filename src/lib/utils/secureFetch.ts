/**
 * HIPAA-compliant form submission utilities with CSRF protection
 */

/**
 * Enhanced fetch function that automatically includes CSRF token
 */
export async function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Get CSRF token from sessionStorage
  const csrfToken = sessionStorage.getItem('csrf-token')

  // Create enhanced headers
  const headers = new Headers(options.headers || {})

  // Add CSRF token if available
  if (csrfToken) {
    headers.set('x-csrf-token', csrfToken)
  }

  // Add content type for JSON requests
  if (options.body && typeof options.body === 'string' && !headers.has('content-type')) {
    try {
      JSON.parse(options.body) // Test if it's valid JSON
      headers.set('content-type', 'application/json')
    } catch {
      // Not JSON, don't set content-type
    }
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'same-origin' // Include cookies
  })
}

/**
 * Submit form data with CSRF protection
 */
export async function secureFormSubmit(
  url: string,
  formData: FormData | Record<string, any>,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = sessionStorage.getItem('csrf-token')

  let body: FormData | string
  let headers = new Headers(options.headers || {})

  if (formData instanceof FormData) {
    body = formData
    // Add CSRF token to FormData
    if (csrfToken) {
      formData.append('csrf-token', csrfToken)
    }
  } else {
    // Handle JSON data
    const data = { ...formData }
    if (csrfToken) {
      data.csrfToken = csrfToken
    }
    body = JSON.stringify(data)
    headers.set('content-type', 'application/json')
  }

  // Add CSRF token to headers as well
  if (csrfToken) {
    headers.set('x-csrf-token', csrfToken)
  }

  return fetch(url, {
    ...options,
    method: options.method || 'POST',
    headers,
    body,
    credentials: 'same-origin'
  })
}

/**
 * Handle API responses with proper error handling for HIPAA compliance
 */
export async function handleApiResponse<T = any>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Request failed'
    let errorDetails: any = {}

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`
      errorDetails = errorData
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`
    }

    // Log security events for HIPAA compliance
    if (response.status === 403 && errorMessage.includes('CSRF')) {
      console.error('CSRF validation failed:', {
        status: response.status,
        message: errorMessage,
        url: response.url
      })
    }

    throw new Error(errorMessage)
  }

  try {
    return await response.json()
  } catch (error) {
    // If JSON parsing fails, return empty object
    return {} as T
  }
}

/**
 * Track failed requests for HIPAA audit logging
 */
export function trackFailedRequest(url: string, method: string, status: number, error: string): void {
  // Log to console for now - in production this would go to audit system
  console.error('HIPAA Audit: Failed request', {
    timestamp: new Date().toISOString(),
    url,
    method,
    status,
    error,
    userAgent: navigator.userAgent,
    referrer: document.referrer
  })
}

/**
 * Validate form data before submission (basic validation)
 */
export function validateFormData(data: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check for common injection patterns
  const dangerousPatterns = [/<script[^>]*>.*?<\/script>/gi, /javascript:/gi, /on\w+\s*=/gi, /data:text\/html/gi]

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      dangerousPatterns.forEach(pattern => {
        if (pattern.test(value)) {
          errors.push(`Potentially dangerous content detected in field: ${key}`)
        }
      })
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}
