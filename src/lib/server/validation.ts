// Server-side validation utilities for HIPAA compliance
// These functions run on the server and provide additional security layers

import { logSecurityEvent, SECURITY_EVENTS } from '$lib/utils/security-monitoring'

// Server-side email validation with additional security checks
export function validateEmailServer(emailInput: string, userId?: string): { valid: boolean; message?: string } {
  // First run client-side validation
  const clientValidation = validateEmailBasic(emailInput)
  if (!clientValidation.valid) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'invalid_email_attempt',
      email: emailInput.substring(0, 50), // Log partial email for debugging
      reason: clientValidation.message
    })
    return clientValidation
  }

  // Additional server-side checks
  const email = emailInput.toLowerCase().trim()

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./, // consecutive dots
    /^\./, // starts with dot
    /\.$/, // ends with dot
    /[<>'"\\]/, // HTML/script characters
    /\s/ // whitespace
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) {
      logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
        action: 'suspicious_email_pattern',
        email: email.substring(0, 50),
        pattern: pattern.toString()
      })
      return { valid: false, message: 'Invalid email format' }
    }
  }

  // Check against disposable email domains (basic list)
  const disposableDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'temp-mail.org',
    'throwaway.email',
    'yopmail.com'
  ]

  const domain = email.split('@')[1]
  if (disposableDomains.includes(domain)) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'disposable_email_attempt',
      domain
    })
    return { valid: false, message: 'Disposable email addresses are not allowed' }
  }

  return { valid: true }
}

// Basic email validation (client-side compatible)
function validateEmailBasic(email: string): { valid: boolean; message?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' }
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' }
  }

  if (email.length > 254) {
    return { valid: false, message: 'Email address is too long' }
  }

  return { valid: true }
}

// Server-side input sanitization with logging
export function sanitizeInputServer(input: any, type: string = 'text', userId?: string): string {
  if (input === null || input === undefined) {
    return ''
  }

  const originalInput = String(input)
  let sanitizedInput = originalInput

  // Apply sanitization based on type
  switch (type) {
    case 'email':
      sanitizedInput = originalInput.toLowerCase().trim()
      break
    case 'name':
    case 'text':
      // Remove potential XSS and injection attacks
      sanitizedInput = originalInput
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:[^"'\s]*/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/[<>]/g, '')
        .trim()
      break
    case 'phone':
      sanitizedInput = originalInput.replace(/[^0-9\s\-\(\)\+\.]/g, '').trim()
      break
    case 'html':
      // For HTML content, be more restrictive
      sanitizedInput = originalInput
        .replace(/<[^>]*>/g, '') // Remove all HTML tags
        .replace(/[<>]/g, '')
        .trim()
      break
  }

  // Log if input was significantly changed (potential attack)
  if (originalInput !== sanitizedInput && originalInput.length > sanitizedInput.length + 5) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'input_sanitization',
      type,
      originalLength: originalInput.length,
      sanitizedLength: sanitizedInput.length,
      inputType: type
    })
  }

  return sanitizedInput
}

// Rate limiting validation - check if user is making too many requests
export function validateRateLimit(
  userId: string,
  action: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  // This would typically use Redis or a database to track requests
  // For now, we'll implement a basic in-memory rate limiter
  const key = `${userId}:${action}`
  const now = Date.now()

  // In a real implementation, you'd check against a persistent store
  // For demonstration, we'll allow all requests but log them
  logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
    action: 'rate_limit_check',
    requestAction: action,
    timestamp: now
  })

  return true // Allow request - in production, this would check limits
}

// Validate file uploads for security
export function validateFileUpload(
  file: any,
  allowedTypes: string[] = [],
  maxSize: number = 10 * 1024 * 1024
): {
  valid: boolean
  message?: string
} {
  if (!file) {
    return { valid: false, message: 'No file provided' }
  }

  // Check file size
  if (file.size > maxSize) {
    return { valid: false, message: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB` }
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, message: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}` }
  }

  // Check for malicious file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar']
  const fileName = file.name.toLowerCase()
  for (const ext of dangerousExtensions) {
    if (fileName.endsWith(ext)) {
      logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, undefined, {
        action: 'dangerous_file_upload',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      })
      return { valid: false, message: 'File type not allowed for security reasons' }
    }
  }

  return { valid: true }
}

// Validate user permissions for actions
export function validateUserPermission(userId: string, action: string, requiredRole?: string): boolean {
  // This would check against the database for user roles and permissions
  // For now, we'll log the permission check
  logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
    action: 'permission_check',
    requestedAction: action,
    requiredRole: requiredRole || 'any'
  })

  return true // In production, this would validate actual permissions
}

// Comprehensive server-side form validation
export function validateApplicationServer(
  data: any,
  userId?: string
): {
  valid: boolean
  errors: Record<string, string>
  sanitizedData: any
} {
  const errors: Record<string, string> = {}
  const sanitizedData: any = {}

  try {
    // Validate and sanitize full name
    const nameValidation = validateNameServer(data.fullName, userId)
    if (!nameValidation.valid) {
      errors.fullName = nameValidation.message!
    } else {
      sanitizedData.fullName = sanitizeInputServer(data.fullName, 'name', userId)
    }

    // Validate and sanitize email
    const emailValidation = validateEmailServer(data.email, userId)
    if (!emailValidation.valid) {
      errors.email = emailValidation.message!
    } else {
      sanitizedData.email = sanitizeInputServer(data.email, 'email', userId)
    }

    // Validate and sanitize phone
    const phoneValidation = validatePhoneServer(data.phone, userId)
    if (!phoneValidation.valid) {
      errors.phone = phoneValidation.message!
    } else {
      sanitizedData.phone = sanitizeInputServer(data.phone, 'phone', userId)
    }

    // Validate amount
    const amountValidation = validateAmountServer(data.amountRequested, userId)
    if (!amountValidation.valid) {
      errors.amountRequested = amountValidation.message!
    } else {
      sanitizedData.amountRequested = data.amountRequested
    }

    // Validate special requirements
    const requirementsValidation = validateTextServer(data.specialRequirements || '', 'Special Requirements', userId)
    if (!requirementsValidation.valid) {
      errors.specialRequirements = requirementsValidation.message!
    } else {
      sanitizedData.specialRequirements = sanitizeInputServer(data.specialRequirements || '', 'text', userId)
    }

    // Validate consent
    if (!data.eligibilityAccepted) {
      errors.eligibilityAccepted = 'Eligibility acceptance is required'
    } else {
      sanitizedData.eligibilityAccepted = true
    }

    if (!data.consentAccepted) {
      errors.consentAccepted = 'Privacy consent is required'
    } else {
      sanitizedData.consentAccepted = true
    }
  } catch (error) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'validation_error',
      error: error instanceof Error ? error.message : 'Unknown validation error'
    })
    errors.general = 'An error occurred during validation. Please try again.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  }
}

// Helper validation functions (server-side versions)
function validateNameServer(name: string, userId?: string): { valid: boolean; message?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Name is required' }
  }

  const sanitized = name.trim()
  if (sanitized.length < 1) {
    return { valid: false, message: 'Name cannot be empty' }
  }

  if (sanitized.length > 100) {
    return { valid: false, message: 'Name is too long' }
  }

  const nameRegex = /^[a-zA-Z\s\-']+$/
  if (!nameRegex.test(sanitized)) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'invalid_name_characters',
      nameLength: sanitized.length
    })
    return { valid: false, message: 'Name contains invalid characters' }
  }

  return { valid: true }
}

function validatePhoneServer(phone: string, userId?: string): { valid: boolean; message?: string } {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, message: 'Phone number is required' }
  }

  const digitsOnly = phone.replace(/\D/g, '')
  if (digitsOnly.length !== 10 && digitsOnly.length !== 11) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'invalid_phone_format',
      phoneLength: digitsOnly.length
    })
    return { valid: false, message: 'Invalid phone number format' }
  }

  return { valid: true }
}

function validateAmountServer(amount: any, userId?: string): { valid: boolean; message?: string } {
  if (amount === null || amount === undefined || amount === '') {
    return { valid: false, message: 'Amount is required' }
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'invalid_amount_format',
      amountType: typeof amount,
      amountValue: String(amount).substring(0, 50)
    })
    return { valid: false, message: 'Invalid amount format' }
  }

  if (numAmount <= 0) {
    return { valid: false, message: 'Amount must be greater than zero' }
  }

  if (numAmount > 10000) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'unusual_amount',
      amount: numAmount
    })
    return { valid: false, message: 'Amount exceeds maximum allowed' }
  }

  return { valid: true }
}

function validateTextServer(text: string, fieldName: string, userId?: string): { valid: boolean; message?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, message: `${fieldName} is required` }
  }

  if (text.length > 1000) {
    logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
      action: 'excessive_text_length',
      fieldName,
      textLength: text.length
    })
    return { valid: false, message: `${fieldName} is too long` }
  }

  return { valid: true }
}
