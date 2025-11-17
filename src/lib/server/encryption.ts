// HIPAA-COMPLIANT SERVER-SIDE ENCRYPTION UTILITIES
// AES-256-GCM encryption for PHI protection

import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto'

/**
 * Configuration for HIPAA-compliant encryption
 */
const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm',
  keyLength: 32, // 256 bits
  ivLength: 16, // 128 bits
  authTagLength: 16 // 128 bits
} as const

/**
 * Gets the encryption key from environment variables
 * HIPAA requires secure key management - this should be stored in a secure vault
 */
export function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY
  if (!keyHex) {
    throw new Error(
      'ENCRYPTION_KEY environment variable not set. HIPAA compliance requires proper encryption key management.'
    )
  }

  // Convert hex string to 32-byte buffer (256 bits)
  const key = Buffer.from(keyHex, 'hex')
  if (key.length !== ENCRYPTION_CONFIG.keyLength) {
    throw new Error(
      `ENCRYPTION_KEY must be exactly ${ENCRYPTION_CONFIG.keyLength * 2} hex characters (${ENCRYPTION_CONFIG.keyLength * 8} bits)`
    )
  }

  return key
}

/**
 * Encrypts PHI data using AES-256-GCM
 * @param plaintext - The PHI data to encrypt
 * @returns Base64 encoded encrypted data with IV and auth tag
 * @throws Error if encryption fails or input is invalid
 */
export function encryptPHI(plaintext: string): string {
  if (!plaintext || plaintext.trim() === '') {
    throw new Error('Cannot encrypt empty or null data')
  }

  if (typeof plaintext !== 'string') {
    throw new Error('PHI data must be a string')
  }

  try {
    const key = getEncryptionKey()
    const iv = randomBytes(ENCRYPTION_CONFIG.ivLength)
    const cipher = createCipheriv(ENCRYPTION_CONFIG.algorithm, key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'base64')
    encrypted += cipher.final('base64')

    const authTag = cipher.getAuthTag()

    // Combine IV, encrypted data, and auth tag for storage
    const combined = Buffer.concat([iv, Buffer.from(encrypted, 'base64'), authTag])

    return combined.toString('base64')
  } catch (error) {
    console.error('PHI encryption failed:', error)
    throw new Error(`PHI encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decrypts PHI data encrypted with encryptPHI
 * @param encryptedData - Base64 encoded encrypted data
 * @returns Decrypted plaintext
 * @throws Error if decryption fails or data is corrupted
 */
export function decryptPHI(encryptedData: string): string {
  if (!encryptedData || encryptedData.trim() === '') {
    throw new Error('Cannot decrypt empty or null data')
  }

  if (typeof encryptedData !== 'string') {
    throw new Error('Encrypted data must be a string')
  }

  try {
    const key = getEncryptionKey()
    const combined = Buffer.from(encryptedData, 'base64')

    // Validate minimum length (IV + Auth Tag + at least 1 byte of data)
    if (combined.length < ENCRYPTION_CONFIG.ivLength + ENCRYPTION_CONFIG.authTagLength + 1) {
      throw new Error('Encrypted data is too short or corrupted')
    }

    // Extract components
    const iv = combined.subarray(0, ENCRYPTION_CONFIG.ivLength)
    const authTag = combined.subarray(combined.length - ENCRYPTION_CONFIG.authTagLength)
    const encrypted = combined.subarray(ENCRYPTION_CONFIG.ivLength, combined.length - ENCRYPTION_CONFIG.authTagLength)

    const decipher = createDecipheriv(ENCRYPTION_CONFIG.algorithm, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString('utf8')
  } catch (error) {
    console.error('PHI decryption failed:', error)
    throw new Error(`PHI decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Encrypts multiple PHI fields in an object
 * @param data - Object containing PHI fields
 * @param phiFields - Array of field names containing PHI
 * @returns Object with PHI fields encrypted
 */
export function encryptPHIFields<T extends Record<string, any>>(data: T, phiFields: (keyof T)[]): T {
  const encrypted = { ...data }

  for (const field of phiFields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encryptPHI(encrypted[field] as string) as any
    }
  }

  return encrypted
}

/**
 * Decrypts multiple PHI fields in an object
 * @param data - Object containing encrypted PHI fields
 * @param phiFields - Array of field names containing PHI
 * @returns Object with PHI fields decrypted
 */
export function decryptPHIFields<T extends Record<string, any>>(data: T, phiFields: (keyof T)[]): T {
  const decrypted = { ...data }

  for (const field of phiFields) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      try {
        decrypted[field] = decryptPHI(decrypted[field] as string) as any
      } catch (error) {
        console.warn(`Failed to decrypt field ${String(field)}:`, error)
        // Keep the encrypted value if decryption fails
      }
    }
  }

  return decrypted
}

/**
 * Creates a deterministic hash for searchable encrypted fields
 * This allows searching encrypted data without decrypting everything
 * @param value - Value to hash
 * @returns Base64 encoded hash
 */
export function createSearchableHash(value: string): string {
  const key = getEncryptionKey()
  // Use a different key derivation for search hashes
  const searchKey = createHash('sha256').update(key).update('search').digest()

  const iv = Buffer.alloc(ENCRYPTION_CONFIG.ivLength, 0) // Zero IV for deterministic encryption
  const cipher = createCipheriv(ENCRYPTION_CONFIG.algorithm, searchKey.subarray(0, ENCRYPTION_CONFIG.keyLength), iv)

  let encrypted = cipher.update(value.toLowerCase(), 'utf8', 'base64')
  encrypted += cipher.final('base64')

  return encrypted
}

/**
 * Validates encryption configuration and performs self-test
 * @returns Validation result with status and message
 */
export function validateEncryptionSetup(): { valid: boolean; message: string } {
  try {
    // Check if key is available and properly formatted
    const key = getEncryptionKey()

    // Test encryption/decryption with multiple test strings
    const testStrings = [
      'Test PHI data',
      'Another test with special chars: !@#$%^&*()',
      'Unicode test: 测试数据',
      `HIPAA_ENCRYPTION_TEST_${Date.now()}`
    ]

    for (const testData of testStrings) {
      const encrypted = encryptPHI(testData)
      const decrypted = decryptPHI(encrypted)

      if (decrypted !== testData) {
        return {
          valid: false,
          message: `Encryption self-test failed for string: "${testData.substring(0, 20)}..."`
        }
      }
    }

    // Test searchable hash functionality
    const hash1 = createSearchableHash('test value')
    const hash2 = createSearchableHash('test value')
    const hash3 = createSearchableHash('different value')

    if (hash1 !== hash2) {
      return { valid: false, message: 'Searchable hash is not deterministic' }
    }

    if (hash1 === hash3) {
      return { valid: false, message: 'Searchable hash collision detected' }
    }

    return { valid: true, message: 'HIPAA-compliant encryption validated successfully' }
  } catch (error) {
    return {
      valid: false,
      message: `Encryption validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Secure random token generation for sessions and temporary access
 * @param length - Token length in characters
 * @returns Secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''

  // Use crypto.randomBytes for cryptographically secure random generation
  const bytes = randomBytes(length)
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length]
  }

  return result
}

/**
 * Secure comparison function (timing-attack resistant)
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns True if strings are equal
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

// HIPAA-required PHI field mappings
export const PHI_FIELDS = {
  beneficiaries: ['full_name', 'phone', 'emergency_contact_name', 'emergency_contact_phone'],
  applications: ['special_requirements'],
  consents: ['purpose', 'recipient_name', 'recipient_purpose', 'information_disclosed'],
  audit_log: ['old_values', 'new_values']
} as const
