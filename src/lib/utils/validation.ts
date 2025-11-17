// Comprehensive form validation utilities

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export interface FormField {
  value: any
  rules: ValidationRule[]
  touched?: boolean
}

// Common validation patterns
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  ssn: /^\d{3}-?\d{2}-?\d{4}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  name: /^[a-zA-Z\s'-]+$/,
  address: /^[a-zA-Z0-9\s,'.-]+$/
}

// Validation messages
export const MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  pattern: 'Please enter a valid format',
  ssn: 'Please enter a valid Social Security Number',
  zipCode: 'Please enter a valid ZIP code',
  date: 'Please enter a valid date',
  name: 'Please enter a valid name',
  address: 'Please enter a valid address'
}

/**
 * Validate a single field value against its rules
 */
export function validateField(value: any, rules: ValidationRule[]): ValidationResult {
  for (const rule of rules) {
    // Required check
    if (rule.required && (value === null || value === undefined || value === '')) {
      return {
        isValid: false,
        message: rule.message || MESSAGES.required
      }
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (value === null || value === undefined || value === '')) {
      continue
    }

    // String-specific validations
    if (typeof value === 'string') {
      // Min length
      if (rule.minLength && value.length < rule.minLength) {
        return {
          isValid: false,
          message: rule.message || MESSAGES.minLength(rule.minLength)
        }
      }

      // Max length
      if (rule.maxLength && value.length > rule.maxLength) {
        return {
          isValid: false,
          message: rule.message || MESSAGES.maxLength(rule.maxLength)
        }
      }

      // Pattern matching
      if (rule.pattern && !rule.pattern.test(value)) {
        return {
          isValid: false,
          message: rule.message || MESSAGES.pattern
        }
      }
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value)
      if (result === false) {
        return {
          isValid: false,
          message: rule.message || 'Validation failed'
        }
      }
      if (typeof result === 'string') {
        return {
          isValid: false,
          message: result
        }
      }
    }
  }

  return { isValid: true }
}

/**
 * Validate an entire form object
 */
export function validateForm(fields: Record<string, FormField>): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {}

  for (const [fieldName, field] of Object.entries(fields)) {
    results[fieldName] = validateField(field.value, field.rules)
  }

  return results
}

/**
 * Check if a form is valid
 */
export function isFormValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every(result => result.isValid)
}

/**
 * Get the first error message from validation results
 */
export function getFirstError(results: Record<string, ValidationResult>): string | null {
  for (const result of Object.values(results)) {
    if (!result.isValid && result.message) {
      return result.message
    }
  }
  return null
}

// Specific validation rules for common fields
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: PATTERNS.email,
    message: MESSAGES.email
  },

  phone: {
    required: true,
    pattern: PATTERNS.phone,
    message: MESSAGES.phone
  },

  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: PATTERNS.name,
    message: MESSAGES.name
  },

  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: PATTERNS.name,
    message: MESSAGES.name
  },

  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: PATTERNS.name,
    message: MESSAGES.name
  },

  address: {
    required: true,
    minLength: 5,
    maxLength: 200,
    pattern: PATTERNS.address,
    message: MESSAGES.address
  },

  city: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: PATTERNS.name,
    message: 'Please enter a valid city name'
  },

  state: {
    required: true,
    minLength: 2,
    maxLength: 2,
    pattern: /^[A-Z]{2}$/,
    message: 'Please enter a valid state code'
  },

  zipCode: {
    required: true,
    pattern: PATTERNS.zipCode,
    message: MESSAGES.zipCode
  },

  dateOfBirth: {
    required: true,
    pattern: PATTERNS.date,
    custom: (value: string) => {
      const date = new Date(value)
      const now = new Date()
      const age = now.getFullYear() - date.getFullYear()
      if (age < 18) {
        return 'Must be 18 years or older'
      }
      if (age > 120) {
        return 'Please enter a valid date of birth'
      }
      return true
    },
    message: MESSAGES.date
  },

  ssn: {
    required: true,
    pattern: PATTERNS.ssn,
    message: MESSAGES.ssn
  },

  consent: {
    required: true,
    custom: (value: boolean) => {
      return value === true || 'You must accept the terms and conditions'
    }
  },

  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character'
  },

  confirmPassword: {
    required: true,
    custom: (value: string, formData?: any) => {
      return value === formData?.password || 'Passwords do not match'
    }
  }
}

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Validate and sanitize form data
 */
export function validateAndSanitizeForm(
  formData: Record<string, any>,
  rules: Record<string, ValidationRule[]>
): {
  isValid: boolean
  errors: Record<string, string>
  sanitizedData: Record<string, any>
} {
  const errors: Record<string, string> = {}
  const sanitizedData: Record<string, any> = {}

  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const value = formData[fieldName]
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value

    const validation = validateField(sanitizedValue, fieldRules)

    if (!validation.isValid) {
      errors[fieldName] = validation.message || 'Invalid value'
    }

    sanitizedData[fieldName] = sanitizedValue
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  }
}
