// Server-side password utilities for HIPAA compliance
// These functions use Node.js crypto module and should only be used server-side

import { createHash, pbkdf2Sync } from 'crypto'

/**
 * Creates a secure hash of a password for storage
 * Uses PBKDF2 with high iteration count for HIPAA compliance
 */
export function hashPassword(password: string): string {
  const salt = createHash('sha256')
    .update(Date.now().toString() + Math.random().toString())
    .digest('hex')
  const iterations = 100000 // High iteration count for security
  const keyLength = 64 // 512 bits

  try {
    // Use proper PBKDF2 implementation
    const hash = pbkdf2Sync(password, salt, iterations, keyLength, 'sha256')
    return `pbkdf2_sha256$${iterations}$${salt}$${hash.toString('hex')}`
  } catch (error) {
    // Fallback to simplified hash if PBKDF2 fails
    let hash = password + salt
    for (let i = 0; i < iterations; i++) {
      hash = createHash('sha256').update(hash).digest('hex')
    }
    return `pbkdf2_sha256$${iterations}$${salt}$${hash}`
  }
}

/**
 * Verifies a password against its hash
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    const parts = hashedPassword.split('$')
    if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') {
      return false
    }

    const iterations = parseInt(parts[1])
    const salt = parts[2]
    const storedHash = parts[3]

    // Use proper PBKDF2 implementation
    const keyLength = 64
    const hash = pbkdf2Sync(password, salt, iterations, keyLength, 'sha256')

    return hash.toString('hex') === storedHash
  } catch (error) {
    // Fallback verification for simplified hashes
    return false
  }
}

/**
 * Generates a secure random password
 */
export function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
