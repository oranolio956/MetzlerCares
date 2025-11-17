// API client utilities with error handling, retries, and security

import { browser } from '$app/environment'
import { getCSRFToken, validateCSRFToken, rateLimiter } from './security'

export interface ApiConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
}

export interface ApiResponse<T> {
  data: T
  status: number
  headers: Record<string, string>
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

class ApiClient {
  private config: Required<ApiConfig>

  constructor(config: ApiConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '',
      timeout: config.timeout || 10000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`

    // Rate limiting check
    if (!rateLimiter.isAllowed(endpoint, 10, 60000)) {
      throw new Error('Too many requests. Please try again later.')
    }

    // Add security headers
    const headers = new Headers(options.headers)

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
      const csrfToken = getCSRFToken()
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken)
      }
    }

    // Add user agent and other security headers
    headers.set('X-Requested-With', 'XMLHttpRequest')
    if (browser) {
      headers.set('X-Client-Type', 'web')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Handle different error status codes
        let errorMessage = 'An error occurred'
        let errorCode = 'UNKNOWN_ERROR'

        switch (response.status) {
          case 400:
            errorMessage = 'Invalid request. Please check your input.'
            errorCode = 'BAD_REQUEST'
            break
          case 401:
            errorMessage = 'Authentication required.'
            errorCode = 'UNAUTHORIZED'
            break
          case 403:
            errorMessage = 'Access denied.'
            errorCode = 'FORBIDDEN'
            break
          case 404:
            errorMessage = 'Resource not found.'
            errorCode = 'NOT_FOUND'
            break
          case 429:
            errorMessage = 'Too many requests. Please try again later.'
            errorCode = 'RATE_LIMITED'
            break
          case 500:
            errorMessage = 'Server error. Please try again later.'
            errorCode = 'SERVER_ERROR'
            break
          default:
            errorMessage = `Request failed with status ${response.status}`
        }

        // Try to get error details from response
        let errorDetails
        try {
          const errorData = await response.json()
          errorDetails = errorData
          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (e) {
          // Response is not JSON
        }

        throw {
          message: errorMessage,
          status: response.status,
          code: errorCode,
          details: errorDetails
        } as ApiError
      }

      const data = await response.json()

      return {
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      }
    } catch (error: any) {
      clearTimeout(timeoutId)

      // Handle network errors
      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout. Please try again.',
          status: 408,
          code: 'TIMEOUT'
        } as ApiError
      }

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
          code: 'NETWORK_ERROR'
        } as ApiError
      }

      // If it's already an ApiError, re-throw it
      if (error.status) {
        throw error
      }

      // Retry logic for certain errors
      const shouldRetry =
        retryCount < this.config.retries &&
        (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT' || error.status >= 500)

      if (shouldRetry) {
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * (retryCount + 1)))
        return this.request(endpoint, options, retryCount + 1)
      }

      // Default error
      throw {
        message: 'An unexpected error occurred.',
        status: 0,
        code: 'UNKNOWN_ERROR',
        details: error
      } as ApiError
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    })
  }

  async put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    })
  }

  async patch<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

// Create default API client instance
export const apiClient = new ApiClient({
  baseURL: '/api',
  timeout: 15000,
  retries: 3,
  retryDelay: 1000
})

// Supabase-specific API client
export const supabaseApiClient = new ApiClient({
  timeout: 10000,
  retries: 2
})

// Utility functions for common API operations
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: ApiError) => void
    showErrorToast?: boolean
  } = {}
): Promise<T | null> {
  try {
    const result = await apiCall()
    options.onSuccess?.(result)
    return result
  } catch (error) {
    const apiError = error as ApiError

    if (options.onError) {
      options.onError(apiError)
    } else if (options.showErrorToast && browser) {
      // Show error toast (implement based on your toast system)
      console.error('API Error:', apiError.message)
      alert(`Error: ${apiError.message}`)
    }

    return null
  }
}

// Health check for API endpoints
export async function healthCheck(endpoint: string = '/health'): Promise<boolean> {
  try {
    await apiClient.get(endpoint)
    return true
  } catch (error) {
    return false
  }
}

// Cache utility for API responses
class ApiCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()

  set(key: string, data: any, ttl: number = 300000): void {
    // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

export const apiCache = new ApiCache()

// Cached API wrapper
export async function cachedApiCall<T>(key: string, apiCall: () => Promise<T>, ttl: number = 300000): Promise<T> {
  const cached = apiCache.get(key)
  if (cached) {
    return cached
  }

  const result = await apiCall()
  apiCache.set(key, result, ttl)
  return result
}
