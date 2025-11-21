// Environment configuration management and validation
import { dev } from '$app/environment'

// Environment schema definition
interface EnvironmentConfig {
  // Supabase
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string

  // Sanity (optional)
  VITE_SANITY_PROJECT_ID?: string
  VITE_SANITY_DATASET?: string

  // Analytics
  VITE_GA_MEASUREMENT_ID?: string

  // Error tracking
  VITE_SENTRY_DSN?: string

  // Stripe (optional)
  VITE_STRIPE_PUBLISHABLE_KEY?: string

  // AI/Machine Learning (optional)
  OPENAI_API_KEY?: string

  // Automation (optional)
  KERAGON_WEBHOOK_URL?: string

  // Security
  JWT_SECRET?: string

  // Environment
  NODE_ENV: 'development' | 'production' | 'test'
}

// Default configuration values
const DEFAULT_CONFIG: Partial<EnvironmentConfig> = {
  NODE_ENV: dev ? 'development' : 'production'
}

// Validation rules for environment variables
const VALIDATION_RULES = {
  VITE_SUPABASE_URL: {
    required: true,
    pattern: /^https:\/\/.+/,
    message: 'Must be a valid HTTPS URL'
  },
  VITE_SUPABASE_ANON_KEY: {
    required: true,
    minLength: 10,
    message: 'Supabase anon key is required'
  },
  VITE_SANITY_PROJECT_ID: {
    required: false,
    pattern: /^[a-z0-9-]+$/,
    message: 'Sanity project ID must be a valid identifier'
  },
  VITE_SANITY_DATASET: {
    required: false,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'Sanity dataset must be a valid identifier'
  },
  VITE_GA_MEASUREMENT_ID: {
    required: false,
    pattern: /^G-[A-Z0-9]+$/,
    message: 'Google Analytics ID must be in format G-XXXXXXXXXX'
  },
  VITE_SENTRY_DSN: {
    required: false,
    pattern: /^https:\/\/[a-f0-9]+\.ingest\.sentry\.io\/[0-9]+$/,
    message: 'Sentry DSN must be a valid URL'
  },
  VITE_STRIPE_PUBLISHABLE_KEY: {
    required: false,
    pattern: /^pk_(test|live)_.*$/,
    message: 'Stripe publishable key must be valid'
  },
  OPENAI_API_KEY: {
    required: false,
    pattern: /^sk-.*$/,
    message: 'OpenAI API key must be valid'
  },
  KERAGON_WEBHOOK_URL: {
    required: false,
    pattern: /^https?:\/\/.+/,
    message: 'Webhook URL must be a valid HTTP/HTTPS URL'
  },
  JWT_SECRET: {
    required: false,
    minLength: 32,
    message: 'JWT secret must be at least 32 characters'
  }
}

// Validate a single environment variable
function validateEnvVar(key: string, value: string | undefined): { valid: boolean; error?: string } {
  const rule = VALIDATION_RULES[key as keyof typeof VALIDATION_RULES]
  if (!rule) {
    return { valid: true }
  } // No validation rule for this variable

  if (rule.required && (!value || value.trim() === '')) {
    return { valid: false, error: `${key} is required` }
  }

  if (!rule.required && (!value || value.trim() === '')) {
    return { valid: true } // Optional and not provided
  }

  // Type-safe property access
  if ('minLength' in rule && rule.minLength && value && value.length < rule.minLength) {
    return { valid: false, error: rule.message }
  }

  if ('pattern' in rule && rule.pattern && value && !rule.pattern.test(value)) {
    return { valid: false, error: rule.message }
  }

  return { valid: true }
}

// Load and validate environment configuration
function loadConfig(): EnvironmentConfig {
  const config: any = { ...DEFAULT_CONFIG }

  // Load all environment variables
  Object.keys(VALIDATION_RULES).forEach(key => {
    const envKey = key.startsWith('VITE_') ? key : key
    config[key] = import.meta.env[envKey] || process.env[envKey]
  })

  // Add NODE_ENV
  config.NODE_ENV = import.meta.env.DEV ? 'development' : 'production'

  // Validate all required variables
  const errors: string[] = []

  Object.entries(VALIDATION_RULES).forEach(([key, rule]) => {
    const validation = validateEnvVar(key, config[key])
    if (!validation.valid) {
      errors.push(validation.error!)
    }
  })

  if (errors.length > 0) {
    const errorMessage = `Environment configuration errors:\n${errors.join('\n')}`
    console.error(errorMessage)

    if (!dev) {
      throw new Error(errorMessage)
    }
  }

  return config as EnvironmentConfig
}

// Cached configuration instance
let configInstance: EnvironmentConfig | null = null

// Get validated configuration
export function getConfig(): EnvironmentConfig {
  if (!configInstance) {
    configInstance = loadConfig()
  }
  return configInstance
}

// Safe configuration access with defaults
export function getConfigValue<T>(key: keyof EnvironmentConfig, defaultValue?: T): string | T | undefined {
  const config = getConfig()
  const value = config[key]

  if (value === undefined || value === '') {
    return defaultValue
  }

  return value
}

// Configuration validation for runtime checks
export function validateRuntimeConfig(): { valid: boolean; errors: string[] } {
  const config = getConfig()
  const errors: string[] = []

  // Runtime-specific validations
  if (config.VITE_SUPABASE_URL && !config.VITE_SUPABASE_URL.startsWith('https://')) {
    errors.push('Supabase URL must use HTTPS in production')
  }

  if (config.NODE_ENV === 'production') {
    if (!config.VITE_GA_MEASUREMENT_ID) {
      console.warn('Google Analytics ID not configured for production')
    }

    if (!config.VITE_SENTRY_DSN) {
      console.warn('Sentry DSN not configured for production')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Environment-specific feature flags
export const FEATURES = {
  analytics: !!getConfigValue('VITE_GA_MEASUREMENT_ID'),
  errorTracking: !!getConfigValue('VITE_SENTRY_DSN'),
  payments: !!getConfigValue('VITE_STRIPE_PUBLISHABLE_KEY'),
  ai: !!getConfigValue('OPENAI_API_KEY'),
  automation: !!getConfigValue('KERAGON_WEBHOOK_URL'),
  cms: !!getConfigValue('VITE_SANITY_PROJECT_ID')
}

// Export typed configuration
export const CONFIG = getConfig()
export default CONFIG
