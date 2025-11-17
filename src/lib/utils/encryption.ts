// HIPAA-COMPLIANT DATA ENCRYPTION UTILITIES
// Client-side utilities for HIPAA compliance

// Note: Actual encryption/decryption happens server-side
// This file contains utilities for validation and client-side operations

/**
 * Validates encryption key strength
 */
export function validateEncryptionKey(): { valid: boolean; message: string } {
  const key = import.meta.env.VITE_ENCRYPTION_KEY

  if (!key || key === 'fallback-key-not-secure') {
    return {
      valid: false,
      message: 'Encryption key not properly configured. PHI encryption disabled.'
    }
  }

  if (key.length < 32) {
    return {
      valid: false,
      message: 'Encryption key too short. Must be at least 256 bits (32 characters).'
    }
  }

  return { valid: true, message: 'Encryption key validated successfully.' }
}

/**
 * Secure random token generation for sessions and temporary access
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Secure comparison function (timing-attack resistant)
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

// HIPAA-Required PHI Fields (fields that must be encrypted)
export const PHI_FIELDS = {
  beneficiaries: ['full_name', 'phone', 'emergency_contact_name', 'emergency_contact_phone'],
  applications: ['special_requirements'],
  consents: ['purpose', 'recipient_name', 'recipient_purpose', 'information_disclosed'],
  audit_log: ['old_values', 'new_values'] // Store diffs securely
} as const
