export interface SecurityConfig {
  rateLimiting: {
    auth: {
      windowMs: number
      maxRequests: number
    }
    api: {
      windowMs: number
      maxRequests: number
    }
    upload: {
      windowMs: number
      maxRequests: number
    }
  }
  
  fileUpload: {
    maxFileSize: number
    allowedMimeTypes: string[]
    virusScanning: {
      enabled: boolean
      timeout: number
    }
  }
  
  csrf: {
    tokenLength: number
    cookieName: string
    headerName: string
    secure: boolean
    sameSite: 'strict' | 'lax' | 'none'
    maxAge: number
  }
  
  csp: {
    enabled: boolean
    reportOnly: boolean
    directives: Record<string, string[]>
  }
  
  logging: {
    enabled: boolean
    level: 'debug' | 'info' | 'warn' | 'error'
    includeStackTrace: boolean
    maxLogAge: number
  }
  
  alerts: {
    emailNotifications: boolean
    webhookUrl?: string
    thresholds: {
      rateLimitExceeded: number
      authFailures: number
      suspiciousActivity: number
    }
  }
}

export const securityConfig: SecurityConfig = {
  rateLimiting: {
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5
    },
    api: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100
    },
    upload: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10
    }
  },
  
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ],
    virusScanning: {
      enabled: true,
      timeout: 30000 // 30 seconds
    }
  },
  
  csrf: {
    tokenLength: 32,
    cookieName: 'csrf_token',
    headerName: 'X-CSRF-Token',
    secure: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  csp: {
    enabled: true,
    reportOnly: false,
    directives: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'https:', 'data:', 'blob:'],
      'script-src': ["'self'", "'nonce-${nonce}'", 'https://donorbox.org', 'https://www.google-analytics.com'],
      'style-src': ["'self'", "'nonce-${nonce}'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https://*.supabase.co', 'https://cdn.sanity.io', 'https://donorbox.org'],
      'frame-src': ['https://donorbox.org'],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': []
    }
  },
  
  logging: {
    enabled: true,
    level: 'info',
    includeStackTrace: true,
    maxLogAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  
  alerts: {
    emailNotifications: true,
    thresholds: {
      rateLimitExceeded: 10,
      authFailures: 20,
      suspiciousActivity: 5
    }
  }
}

// Environment-specific overrides
if (import.meta.env.DEV) {
  // Development overrides
  securityConfig.rateLimiting.auth.maxRequests = 20
  securityConfig.rateLimiting.api.maxRequests = 200
  securityConfig.csp.reportOnly = true
  securityConfig.logging.level = 'debug'
}

if (import.meta.env.PROD) {
  // Production-specific settings
  securityConfig.csp.reportOnly = false
  securityConfig.csrf.secure = true
  securityConfig.alerts.emailNotifications = true
}

export function getSecurityConfig(): SecurityConfig {
  return { ...securityConfig }
}

export function updateSecurityConfig(updates: Partial<SecurityConfig>): SecurityConfig {
  Object.assign(securityConfig, updates)
  return { ...securityConfig }
}