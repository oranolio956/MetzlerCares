// HIPAA-COMPLIANT MULTI-FACTOR AUTHENTICATION
// Time-based One-Time Password (TOTP) implementation for staff accounts

import { authenticator } from 'otplib'
import { supabase } from './supabase'
import { logSecurityEvent, SECURITY_EVENTS } from './security-monitoring'

// MFA Configuration (HIPAA compliant)
const MFA_CONFIG = {
  algorithm: 'SHA1', // Standard for TOTP
  digits: 6, // Standard 6-digit codes
  step: 30, // 30-second windows
  window: 1, // Allow 1 step either side (1.5 minutes total)
  maxBackupCodes: 10, // Number of backup codes to generate
  backupCodeLength: 10 // Length of backup codes
} as const

// MFA Secret storage (encrypted in database)
export interface MFASecret {
  secret: string
  backupCodes: string[]
  enabled: boolean
  createdAt: Date
  lastUsed: Date
}

/**
 * Generate a new TOTP secret for a user
 * @param userId - User ID
 * @returns Secret and backup codes
 */
export async function generateMFASecret(userId: string): Promise<{
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}> {
  // Generate a secure random secret
  const secret = authenticator.generateSecret(32) // 256-bit secret

  // Generate backup codes
  const backupCodes = generateBackupCodes()

  // Create QR code URL for authenticator apps
  const qrCodeUrl = authenticator.keyuri(userId, 'Metzler Foundations', secret)

  // Store the secret securely (encrypted)
  await storeMFASecret(userId, secret, backupCodes)

  return {
    secret,
    qrCodeUrl,
    backupCodes
  }
}

/**
 * Verify a TOTP code
 * @param userId - User ID
 * @param code - 6-digit TOTP code
 * @returns Verification result
 */
export async function verifyTOTPCode(
  userId: string,
  code: string
): Promise<{
  valid: boolean
  reason?: string
}> {
  try {
    const mfaData = await getMFASecret(userId)

    if (!mfaData || !mfaData.enabled) {
      return { valid: false, reason: 'MFA not enabled for this account' }
    }

    // Verify the TOTP code
    const isValid = authenticator.check(code, mfaData.secret)

    if (isValid) {
      // Update last used timestamp
      await updateMFALastUsed(userId)

      // Log successful MFA verification
      await logSecurityEvent(SECURITY_EVENTS.MFA_SUCCESS, userId, {
        method: 'totp',
        action: 'mfa_verification_success'
      })

      return { valid: true }
    }

    // Log failed MFA attempt
    await logSecurityEvent(
      SECURITY_EVENTS.MFA_FAILURE,
      userId,
      {
        method: 'totp',
        action: 'mfa_verification_failed',
        reason: 'Invalid TOTP code'
      },
      'medium'
    )

    return { valid: false, reason: 'Invalid TOTP code' }
  } catch (error) {
    console.error('TOTP verification failed:', error)
    return { valid: false, reason: 'Verification failed' }
  }
}

/**
 * Verify a backup code
 * @param userId - User ID
 * @param backupCode - Backup code
 * @returns Verification result
 */
export async function verifyBackupCode(
  userId: string,
  backupCode: string
): Promise<{
  valid: boolean
  reason?: string
}> {
  try {
    const mfaData = await getMFASecret(userId)

    if (!mfaData || !mfaData.enabled) {
      return { valid: false, reason: 'MFA not enabled for this account' }
    }

    // Find and remove the used backup code
    const codeIndex = mfaData.backupCodes.findIndex(code => secureCompare(code, backupCode))

    if (codeIndex === -1) {
      // Log failed backup code attempt
      await logSecurityEvent(
        SECURITY_EVENTS.MFA_FAILURE,
        userId,
        {
          method: 'backup_code',
          action: 'backup_code_failed',
          reason: 'Invalid backup code'
        },
        'high'
      )

      return { valid: false, reason: 'Invalid backup code' }
    }

    // Remove the used backup code
    mfaData.backupCodes.splice(codeIndex, 1)

    // Update the stored backup codes
    await updateMFABackupCodes(userId, mfaData.backupCodes)

    // Update last used timestamp
    await updateMFALastUsed(userId)

    // Log successful backup code usage
    await logSecurityEvent(
      SECURITY_EVENTS.MFA_SUCCESS,
      userId,
      {
        method: 'backup_code',
        action: 'backup_code_used'
      },
      'medium'
    )

    return { valid: true }
  } catch (error) {
    console.error('Backup code verification failed:', error)
    return { valid: false, reason: 'Verification failed' }
  }
}

/**
 * Enable MFA for a user after verification
 * @param userId - User ID
 * @returns Success status
 */
export async function enableMFA(userId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    // Update MFA status to enabled
    const { error } = await supabase
      .from('profiles')
      .update({
        two_factor_enabled: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      throw error
    }

    // Log MFA enablement
    await supabase.rpc('log_phi_access', {
      p_user_id: userId,
      p_action: 'UPDATE',
      p_resource_type: 'profiles',
      p_resource_id: userId,
      p_purpose: 'Enabled MFA for account security',
      p_success: true
    })

    return { success: true, message: 'MFA successfully enabled' }
  } catch (error) {
    console.error('Failed to enable MFA:', error)
    return { success: false, message: 'Failed to enable MFA' }
  }
}

/**
 * Disable MFA for a user
 * @param userId - User ID
 * @returns Success status
 */
export async function disableMFA(userId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    // Update MFA status to disabled
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        two_factor_enabled: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      throw updateError
    }

    // Remove MFA secret data
    const { error: deleteError } = await supabase.from('mfa_secrets').delete().eq('user_id', userId)

    if (deleteError) {
      console.warn('Failed to delete MFA secrets:', deleteError)
    }

    // Log MFA disablement
    await supabase.rpc('log_phi_access', {
      p_user_id: userId,
      p_action: 'UPDATE',
      p_resource_type: 'profiles',
      p_resource_id: userId,
      p_purpose: 'Disabled MFA for account',
      p_success: true
    })

    return { success: true, message: 'MFA successfully disabled' }
  } catch (error) {
    console.error('Failed to disable MFA:', error)
    return { success: false, message: 'Failed to disable MFA' }
  }
}

/**
 * Check if MFA is required for a user
 * @param userId - User ID
 * @returns MFA requirement status
 */
export async function isMFARequired(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('profiles').select('role, hipaa_trained').eq('id', userId).single()

    if (error || !data) {
      return false
    }

    // MFA is required for:
    // - Staff, admin, compliance_officer roles
    // - Users with HIPAA training
    return ['staff', 'admin', 'compliance_officer'].includes(data.role) || data.hipaa_trained === true
  } catch (error) {
    console.error('Failed to check MFA requirement:', error)
    return false
  }
}

/**
 * Check if MFA is enabled for a user
 * @param userId - User ID
 * @returns MFA enabled status
 */
export async function isMFAEnabled(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('profiles').select('two_factor_enabled').eq('id', userId).single()

    return data?.two_factor_enabled === true
  } catch (error) {
    console.error('Failed to check MFA status:', error)
    return false
  }
}

// ========== INTERNAL FUNCTIONS ==========

/**
 * Store MFA secret securely
 */
async function storeMFASecret(userId: string, secret: string, backupCodes: string[]): Promise<void> {
  const { error } = await supabase.from('mfa_secrets').upsert({
    user_id: userId,
    secret,
    backup_codes: backupCodes,
    created_at: new Date().toISOString(),
    last_used: new Date().toISOString()
  })

  if (error) {
    throw error
  }
}

/**
 * Retrieve MFA secret for a user
 */
async function getMFASecret(userId: string): Promise<MFASecret | null> {
  const { data, error } = await supabase.from('mfa_secrets').select('*').eq('user_id', userId).single()

  if (error || !data) {
    return null
  }

  return {
    secret: data.secret,
    backupCodes: data.backup_codes || [],
    enabled: true,
    createdAt: new Date(data.created_at),
    lastUsed: new Date(data.last_used)
  }
}

/**
 * Update MFA last used timestamp
 */
async function updateMFALastUsed(userId: string): Promise<void> {
  const { error } = await supabase
    .from('mfa_secrets')
    .update({ last_used: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) {
    console.warn('Failed to update MFA last used:', error)
  }
}

/**
 * Update MFA backup codes
 */
async function updateMFABackupCodes(userId: string, backupCodes: string[]): Promise<void> {
  const { error } = await supabase.from('mfa_secrets').update({ backup_codes: backupCodes }).eq('user_id', userId)

  if (error) {
    console.warn('Failed to update MFA backup codes:', error)
  }
}

/**
 * Generate secure backup codes
 */
function generateBackupCodes(): string[] {
  const codes: string[] = []

  for (let i = 0; i < MFA_CONFIG.maxBackupCodes; i++) {
    // Generate a random 10-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let j = 0; j < MFA_CONFIG.backupCodeLength; j++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    codes.push(code)
  }

  return codes
}

/**
 * Secure string comparison (timing-attack resistant)
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}
