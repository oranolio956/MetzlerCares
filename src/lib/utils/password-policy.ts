// HIPAA-COMPLIANT PASSWORD POLICIES
// Strong password requirements and expiration management
// Client-side validation only - server-side hashing in password-utils.ts

import { logSecurityEvent, SECURITY_EVENTS } from './security-monitoring'

// Password policy configuration (HIPAA compliant)
export const PASSWORD_POLICY = {
  minLength: 12, // HIPAA requires strong passwords
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  maxConsecutiveChars: 3, // Prevent 'aaaaa' type patterns
  expirationDays: 90, // NIST recommends 90 days, HIPAA allows up to 1 year
  historyCount: 10, // Remember last 10 passwords
  lockoutAttempts: 5, // Lock account after 5 failed attempts
  lockoutDurationMinutes: 30, // Lock for 30 minutes
  minAgeMinutes: 1 // Minimum time before password can be changed again
} as const

// Common weak passwords to reject
const COMMON_PASSWORDS = new Set([
  'password',
  'password123',
  '123456',
  '123456789',
  'qwerty',
  'abc123',
  'password1',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  '1234567890',
  'password123',
  'qwerty123',
  'admin123',
  'root',
  'user',
  'guest',
  'test',
  'test123',
  'demo',
  'example',
  'sample',
  'login'
])

/**
 * Validates password strength according to HIPAA requirements
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  score: number
  issues: string[]
  suggestions: string[]
} {
  const issues: string[] = []
  const suggestions: string[] = []
  let score = 0

  // Length check
  if (password.length < PASSWORD_POLICY.minLength) {
    issues.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`)
  } else if (password.length >= PASSWORD_POLICY.minLength) {
    score += 20
  }

  if (password.length > PASSWORD_POLICY.maxLength) {
    issues.push(`Password must be no more than ${PASSWORD_POLICY.maxLength} characters long`)
  }

  // Character requirements
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    issues.push('Password must contain at least one uppercase letter')
    suggestions.push('Add uppercase letters (A-Z)')
  } else {
    score += 15
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    issues.push('Password must contain at least one lowercase letter')
    suggestions.push('Add lowercase letters (a-z)')
  } else {
    score += 15
  }

  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    issues.push('Password must contain at least one number')
    suggestions.push('Add numbers (0-9)')
  } else {
    score += 15
  }

  if (PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push('Password must contain at least one special character')
    suggestions.push('Add special characters (!@#$%^&*...)')
  } else {
    score += 15
  }

  // Check for common passwords
  if (PASSWORD_POLICY.preventCommonPasswords && COMMON_PASSWORDS.has(password.toLowerCase())) {
    issues.push('This password is too common and easily guessed')
    suggestions.push('Avoid common passwords like "password123" or "qwerty"')
    score = Math.max(0, score - 30)
  }

  // Check for consecutive characters
  if (hasConsecutiveChars(password)) {
    issues.push('Password contains too many consecutive identical characters')
    suggestions.push('Avoid repeating the same character more than 3 times in a row')
    score = Math.max(0, score - 10)
  }

  // Check for sequential patterns
  if (hasSequentialPattern(password)) {
    issues.push('Password contains predictable sequential patterns')
    suggestions.push('Avoid patterns like "abc123" or "qwerty"')
    score = Math.max(0, score - 10)
  }

  // Length bonus
  if (password.length >= 16) {
    score += 10
  }

  // Variety bonus
  const charTypes = [/[a-z]/, /[A-Z]/, /\d/, /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/].filter(regex =>
    regex.test(password)
  ).length

  score += charTypes * 5

  return {
    valid: issues.length === 0,
    score: Math.min(100, Math.max(0, score)),
    issues,
    suggestions
  }
}

/**
 * Checks if password contains too many consecutive identical characters
 */
function hasConsecutiveChars(password: string): boolean {
  for (let i = 0; i < password.length - PASSWORD_POLICY.maxConsecutiveChars; i++) {
    const char = password[i]
    let count = 1

    for (let j = i + 1; j < password.length && j < i + PASSWORD_POLICY.maxConsecutiveChars + 1; j++) {
      if (password[j] === char) {
        count++
      } else {
        break
      }
    }

    if (count > PASSWORD_POLICY.maxConsecutiveChars) {
      return true
    }
  }

  return false
}

/**
 * Checks for sequential patterns (abc, 123, qwerty, etc.)
 */
function hasSequentialPattern(password: string): boolean {
  const lowerPassword = password.toLowerCase()

  // Check for alphabetical sequences
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < alphabet.length - 3; i++) {
    if (lowerPassword.includes(alphabet.slice(i, i + 4))) {
      return true
    }
  }

  // Check for reverse alphabetical sequences
  const reverseAlphabet = 'zyxwvutsrqponmlkjihgfedcba'
  for (let i = 0; i < reverseAlphabet.length - 3; i++) {
    if (lowerPassword.includes(reverseAlphabet.slice(i, i + 4))) {
      return true
    }
  }

  // Check for numeric sequences
  for (let i = 0; i <= 6; i++) {
    const sequence = `${i}${i + 1}${i + 2}${i + 3}`
    if (lowerPassword.includes(sequence)) {
      return true
    }
  }

  // Check for keyboard patterns
  const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn']
  for (const pattern of keyboardPatterns) {
    if (lowerPassword.includes(pattern)) {
      return true
    }
  }

  return false
}

/**
 * Checks if a password has expired based on policy
 */
export function isPasswordExpired(lastChanged: Date, currentDate: Date = new Date()): boolean {
  const daysSinceChange = Math.floor((currentDate.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24))
  return daysSinceChange > PASSWORD_POLICY.expirationDays
}

/**
 * Calculates days until password expires
 */
export function daysUntilExpiration(lastChanged: Date, currentDate: Date = new Date()): number {
  const daysSinceChange = Math.floor((currentDate.getTime() - lastChanged.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, PASSWORD_POLICY.expirationDays - daysSinceChange)
}

/**
 * Generates password policy description for display
 */
export function getPasswordPolicyDescription(): string {
  return `Passwords must be ${PASSWORD_POLICY.minLength}-${PASSWORD_POLICY.maxLength} characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character. Passwords expire after ${PASSWORD_POLICY.expirationDays} days and cannot be reused from the last ${PASSWORD_POLICY.historyCount} passwords.`
}

/**
 * Gets password strength indicator text
 */
export function getPasswordStrengthText(score: number): string {
  if (score < 30) {
    return 'Very Weak'
  }
  if (score < 50) {
    return 'Weak'
  }
  if (score < 70) {
    return 'Fair'
  }
  if (score < 90) {
    return 'Good'
  }
  return 'Strong'
}

/**
 * Gets password strength color class
 */
export function getPasswordStrengthColor(score: number): string {
  if (score < 30) {
    return 'text-red-600'
  }
  if (score < 50) {
    return 'text-orange-600'
  }
  if (score < 70) {
    return 'text-yellow-600'
  }
  if (score < 90) {
    return 'text-blue-600'
  }
  return 'text-green-600'
}
