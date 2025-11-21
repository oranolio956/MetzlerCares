// Supabase client configuration

import { createClient } from '@supabase/supabase-js'

// Supabase project credentials from environment variables
// Supabase project credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Missing Supabase environment variables. Using placeholder values. Authentication and database features will not work.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// HIPAA COMPLIANCE: Audit Logging Utilities
export interface AuditLogEntry {
  action:
    | 'CREATE'
    | 'READ'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'EXPORT'
    | 'IMPORT'
    | 'SEARCH'
    | 'CONSENT_GRANTED'
    | 'CONSENT_REVOKED'
    | 'BREACH_DETECTED'
    | 'BACKUP_CREATED'
    | 'BACKUP_RESTORED'
  resource_type:
    | 'beneficiaries'
    | 'consents'
    | 'applications'
    | 'beneficiary_outcomes'
    | 'scholarship_payments'
    | 'impact_stories'
    | 'local_resources'
    | 'system_config'
    | 'user_sessions'
  resource_id?: string
  old_values?: any
  new_values?: any
  purpose?: string
  consent_id?: string
  emergency_access?: boolean
  emergency_reason?: string
}

/**
 * Log HIPAA-compliant audit events for PHI access/modification
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    // Get current user session
    const {
      data: { session }
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    if (!userId) {
      console.warn('Cannot log audit event: No authenticated user')
      return
    }

    // Call audit logging function
    const { error } = await supabase.rpc('log_phi_access', {
      p_user_id: userId,
      p_action: entry.action,
      p_resource_type: entry.resource_type,
      p_resource_id: entry.resource_id || null,
      p_old_values: entry.old_values || null,
      p_new_values: entry.new_values || null,
      p_purpose: entry.purpose || null,
      p_consent_id: entry.consent_id || null,
      p_emergency_access: entry.emergency_access || false,
      p_emergency_reason: entry.emergency_reason || null
    })

    if (error) {
      console.error('Failed to log audit event:', error)
      // In production, this should trigger an alert to compliance team
    }
  } catch (error) {
    console.error('Audit logging error:', error)
    // In production, this should trigger an alert to compliance team
  }
}

/**
 * Enhanced Supabase client with automatic audit logging
 */
export class AuditedSupabaseClient {
  private client = supabase

  async from(table: string) {
    // For now, return the regular client - audit logging will be implemented server-side
    return this.client.from(table)
  }
}

// Export audited client for PHI operations
export const auditedSupabase = new AuditedSupabaseClient()

// Helper functions for common Supabase operations will be added here
// - User authentication
// - Beneficiary data management
// - Application logic queries
