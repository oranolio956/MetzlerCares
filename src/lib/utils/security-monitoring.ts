// HIPAA-COMPLIANT SECURITY MONITORING & ALERTING SYSTEM
// Automated threat detection, alerting, and incident response

import { supabase } from './supabase'

// Security monitoring configuration
const MONITORING_CONFIG = {
  // Alert thresholds
  maxFailedLoginsPerHour: 5,
  maxFailedLoginsPerDay: 20,
  maxSuspiciousActivitiesPerHour: 10,
  maxPHIAccessPerHour: 50,

  // Alert severity levels
  SEVERITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  } as const,

  // Monitoring intervals (in minutes)
  checkIntervalMinutes: 5,
  alertCooldownMinutes: 15,

  // Alert channels
  ALERT_CHANNELS: {
    DATABASE: 'database',
    EMAIL: 'email',
    SMS: 'sms',
    WEBHOOK: 'webhook'
  } as const
}

// Security event types
export const SECURITY_EVENTS = {
  // Authentication events
  FAILED_LOGIN: 'failed_login',
  SUCCESSFUL_LOGIN: 'successful_login',
  ACCOUNT_LOCKOUT: 'account_lockout',
  MFA_FAILURE: 'mfa_failure',
  MFA_SUCCESS: 'mfa_success',

  // Access events
  PHI_ACCESS: 'phi_access',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  SESSION_TIMEOUT: 'session_timeout',

  // System events
  ENCRYPTION_FAILURE: 'encryption_failure',
  DATABASE_ERROR: 'database_error',
  API_RATE_LIMIT: 'api_rate_limit',

  // Security incidents
  BRUTE_FORCE_ATTACK: 'brute_force_attack',
  SUSPICIOUS_IP: 'suspicious_ip',
  MALWARE_DETECTED: 'malware_detected',
  DATA_BREACH_ATTEMPT: 'data_breach_attempt'
} as const

// Alert rule definitions
const ALERT_RULES = [
  {
    name: 'Brute Force Protection',
    eventType: SECURITY_EVENTS.FAILED_LOGIN,
    condition: (events: any[]) => events.length >= 5,
    timeWindowMinutes: 15,
    severity: MONITORING_CONFIG.SEVERITY.HIGH,
    description: 'Multiple failed login attempts detected',
    autoResponse: 'lock_account'
  },
  {
    name: 'PHI Access Monitoring',
    eventType: SECURITY_EVENTS.PHI_ACCESS,
    condition: (events: any[]) => events.length >= 25,
    timeWindowMinutes: 60,
    severity: MONITORING_CONFIG.SEVERITY.MEDIUM,
    description: 'High volume of PHI access detected',
    autoResponse: 'alert_admin'
  },
  {
    name: 'Suspicious Activity Alert',
    eventType: SECURITY_EVENTS.SUSPICIOUS_ACTIVITY,
    condition: (events: any[]) => events.length >= 3,
    timeWindowMinutes: 30,
    severity: MONITORING_CONFIG.SEVERITY.MEDIUM,
    description: 'Multiple suspicious activities detected',
    autoResponse: 'flag_account'
  },
  {
    name: 'MFA Bypass Attempt',
    eventType: SECURITY_EVENTS.MFA_FAILURE,
    condition: (events: any[]) => events.length >= 3,
    timeWindowMinutes: 10,
    severity: MONITORING_CONFIG.SEVERITY.CRITICAL,
    description: 'Multiple MFA failures detected',
    autoResponse: 'lock_account'
  }
]

// Security event interface
export interface SecurityEvent {
  id: string
  timestamp: Date
  eventType: string
  userId?: string
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  resourceAccessed?: string
  severity: string
  details: Record<string, any>
  resolved: boolean
  resolution?: string
}

// Alert interface
export interface SecurityAlert {
  id: string
  timestamp: Date
  ruleName: string
  severity: string
  description: string
  events: SecurityEvent[]
  affectedUsers: string[]
  status: 'active' | 'acknowledged' | 'resolved'
  assignedTo?: string
  resolution?: string
}

/**
 * Log a security event
 */
export async function logSecurityEvent(
  eventType: string,
  userId?: string,
  details: Record<string, any> = {},
  severity: string = MONITORING_CONFIG.SEVERITY.LOW
): Promise<void> {
  try {
    // Get client information
    const clientInfo = getClientInfo()

    const eventData = {
      event_type: eventType,
      user_id: userId,
      ip_address: clientInfo.ipAddress,
      user_agent: clientInfo.userAgent,
      session_id: clientInfo.sessionId,
      severity,
      details: JSON.stringify(details),
      timestamp: new Date().toISOString()
    }

    // Store in security_events table
    const { error } = await supabase.from('security_events').insert(eventData)

    if (error) {
      throw error
    }

    // Check for alerts that should be triggered
    await checkAlertRules(eventType, userId, details)
  } catch (error) {
    console.error('Failed to log security event:', error)
    // Don't throw - security logging should not break the application
  }
}

/**
 * Check alert rules and trigger alerts if needed
 */
async function checkAlertRules(
  eventType: string,
  userId: string | undefined,
  details: Record<string, any>
): Promise<void> {
  try {
    for (const rule of ALERT_RULES) {
      if (rule.eventType === eventType) {
        // Get recent events matching this rule
        const recentEvents = await getRecentEvents(rule.eventType, rule.timeWindowMinutes, userId)

        // Check if condition is met
        if (rule.condition(recentEvents)) {
          await triggerAlert(rule, recentEvents, userId)
        }
      }
    }
  } catch (error) {
    console.error('Failed to check alert rules:', error)
  }
}

/**
 * Get recent security events
 */
async function getRecentEvents(
  eventType: string,
  timeWindowMinutes: number,
  userId?: string
): Promise<SecurityEvent[]> {
  const since = new Date(Date.now() - timeWindowMinutes * 60 * 1000)

  let query = supabase
    .from('security_events')
    .select('*')
    .eq('event_type', eventType)
    .gte('timestamp', since.toISOString())
    .order('timestamp', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to get recent events:', error)
    return []
  }

  return (data || []).map(event => ({
    id: event.id,
    timestamp: new Date(event.timestamp),
    eventType: event.event_type,
    userId: event.user_id,
    ipAddress: event.ip_address,
    userAgent: event.user_agent,
    sessionId: event.session_id,
    severity: event.severity,
    details: JSON.parse(event.details || '{}'),
    resolved: false
  }))
}

/**
 * Trigger a security alert
 */
async function triggerAlert(rule: any, events: SecurityEvent[], userId?: string): Promise<void> {
  try {
    // Check if similar alert was recently triggered (cooldown)
    const recentAlert = await checkRecentAlert(rule.name, userId)
    if (recentAlert) {
      console.log(`Alert "${rule.name}" recently triggered, skipping cooldown`)
      return
    }

    // Create alert record
    const alertData = {
      rule_name: rule.name,
      severity: rule.severity,
      description: rule.description,
      event_count: events.length,
      affected_users: userId ? [userId] : [],
      status: 'active',
      details: JSON.stringify({
        rule,
        events: events.slice(0, 10), // Store first 10 events
        triggered_at: new Date().toISOString()
      }),
      timestamp: new Date().toISOString()
    }

    const { data, error } = await supabase.from('security_alerts').insert(alertData).select().single()

    if (error) {
      throw error
    }

    // Execute auto-response
    if (rule.autoResponse) {
      await executeAutoResponse(rule.autoResponse, userId, events)
    }

    // Send notifications
    await sendAlertNotifications(data, events)

    console.log(`🚨 Security Alert Triggered: ${rule.name} (${rule.severity})`)
  } catch (error) {
    console.error('Failed to trigger alert:', error)
  }
}

/**
 * Execute automatic response to security alert
 */
async function executeAutoResponse(
  responseType: string,
  userId: string | undefined,
  events: SecurityEvent[]
): Promise<void> {
  try {
    switch (responseType) {
      case 'lock_account':
        if (userId) {
          await lockUserAccount(userId, 'Automatic lock due to security alert')
          console.log(`🔒 Account locked for user ${userId} due to security alert`)
        }
        break

      case 'alert_admin':
        // This would send immediate alerts to administrators
        console.log('📢 Admin alert triggered for security events')
        break

      case 'flag_account':
        if (userId) {
          await flagUserAccount(userId, 'Suspicious activity detected')
          console.log(`🚩 Account flagged for user ${userId}`)
        }
        break

      default:
        console.log(`Unknown auto-response type: ${responseType}`)
    }
  } catch (error) {
    console.error('Failed to execute auto-response:', error)
  }
}

/**
 * Send alert notifications
 */
async function sendAlertNotifications(alert: any, events: SecurityEvent[]): Promise<void> {
  try {
    // In a production system, this would:
    // 1. Send email alerts to security team
    // 2. Send SMS alerts for critical issues
    // 3. Trigger webhook notifications
    // 4. Create tickets in incident management systems

    // For now, log the alert
    console.log(`🚨 SECURITY ALERT: ${alert.rule_name}`)
    console.log(`Severity: ${alert.severity}`)
    console.log(`Description: ${alert.description}`)
    console.log(`Events: ${events.length}`)
    console.log(`Affected Users: ${alert.affected_users?.join(', ') || 'N/A'}`)

    // Store notification record
    await supabase.from('alert_notifications').insert({
      alert_id: alert.id,
      notification_type: 'system_log',
      message: `Security Alert: ${alert.rule_name} - ${alert.description}`,
      sent_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send alert notifications:', error)
  }
}

/**
 * Check if similar alert was recently triggered
 */
async function checkRecentAlert(ruleName: string, userId?: string): Promise<boolean> {
  const since = new Date(Date.now() - MONITORING_CONFIG.alertCooldownMinutes * 60 * 1000)

  let query = supabase
    .from('security_alerts')
    .select('id')
    .eq('rule_name', ruleName)
    .gte('timestamp', since.toISOString())
    .limit(1)

  if (userId) {
    query = query.contains('affected_users', [userId])
  }

  const { data, error } = await query
  return !error && data && data.length > 0
}

/**
 * Lock user account due to security alert
 */
async function lockUserAccount(userId: string, reason: string): Promise<void> {
  const lockUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

  const { error } = await supabase
    .from('profiles')
    .update({
      locked_until: lockUntil.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    throw error
  }
}

/**
 * Flag user account for suspicious activity
 */
async function flagUserAccount(userId: string, reason: string): Promise<void> {
  // This could set a flag in the user profile for additional monitoring
  // For now, we'll just log it
  await logSecurityEvent(
    SECURITY_EVENTS.SUSPICIOUS_ACTIVITY,
    userId,
    { action: 'account_flagged', reason },
    MONITORING_CONFIG.SEVERITY.MEDIUM
  )
}

/**
 * Get security monitoring dashboard data
 */
export async function getSecurityDashboard(): Promise<{
  recentEvents: SecurityEvent[]
  activeAlerts: SecurityAlert[]
  securityMetrics: Record<string, number>
  complianceStatus: Record<string, any>
}> {
  try {
    // Get recent security events (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const { data: eventsData, error: eventsError } = await supabase
      .from('security_events')
      .select('*')
      .gte('timestamp', yesterday.toISOString())
      .order('timestamp', { ascending: false })
      .limit(100)

    // Get active alerts
    const { data: alertsData, error: alertsError } = await supabase
      .from('security_alerts')
      .select('*')
      .eq('status', 'active')
      .order('timestamp', { ascending: false })
      .limit(20)

    // Calculate security metrics
    const metrics = await calculateSecurityMetrics()

    // Get compliance status
    const compliance = await getComplianceStatus()

    const recentEvents: SecurityEvent[] = (eventsData || []).map(event => ({
      id: event.id,
      timestamp: new Date(event.timestamp),
      eventType: event.event_type,
      userId: event.user_id,
      ipAddress: event.ip_address,
      userAgent: event.user_agent,
      sessionId: event.session_id,
      severity: event.severity,
      details: JSON.parse(event.details || '{}'),
      resolved: false
    }))

    const activeAlerts: SecurityAlert[] = (alertsData || []).map(alert => ({
      id: alert.id,
      timestamp: new Date(alert.timestamp),
      ruleName: alert.rule_name,
      severity: alert.severity,
      description: alert.description,
      events: [], // Would need to fetch separately
      affectedUsers: alert.affected_users || [],
      status: alert.status,
      resolution: alert.resolution
    }))

    return {
      recentEvents,
      activeAlerts,
      securityMetrics: metrics,
      complianceStatus: compliance
    }
  } catch (error) {
    console.error('Failed to get security dashboard:', error)
    return {
      recentEvents: [],
      activeAlerts: [],
      securityMetrics: {},
      complianceStatus: {}
    }
  }
}

/**
 * Calculate security metrics
 */
async function calculateSecurityMetrics(): Promise<Record<string, number>> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)

  try {
    // Count events by type
    const { data, error } = await supabase
      .from('security_events')
      .select('event_type, severity')
      .gte('timestamp', yesterday.toISOString())

    if (error || !data) {
      return {}
    }

    const metrics: Record<string, number> = {}

    data.forEach(event => {
      // Count by event type
      metrics[event.event_type] = (metrics[event.event_type] || 0) + 1

      // Count by severity
      const severityKey = `severity_${event.severity}`
      metrics[severityKey] = (metrics[severityKey] || 0) + 1
    })

    // Add calculated metrics
    metrics.total_events_24h = data.length
    metrics.failed_logins_24h = metrics[SECURITY_EVENTS.FAILED_LOGIN] || 0
    metrics.phi_access_24h = metrics[SECURITY_EVENTS.PHI_ACCESS] || 0

    return metrics
  } catch (error) {
    console.error('Failed to calculate security metrics:', error)
    return {}
  }
}

/**
 * Get compliance status
 */
async function getComplianceStatus(): Promise<Record<string, any>> {
  try {
    // Check various compliance indicators
    const compliance = {
      mfa_enabled_users: 0,
      total_users: 0,
      hipaa_trained_users: 0,
      recent_audits: 0,
      last_backup: null,
      alerts_unresolved: 0
    }

    // Get user counts
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('two_factor_enabled, hipaa_trained')

    if (!usersError && users) {
      compliance.total_users = users.length
      compliance.mfa_enabled_users = users.filter(u => u.two_factor_enabled).length
      compliance.hipaa_trained_users = users.filter(u => u.hipaa_trained).length
    }

    // Get unresolved alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('security_alerts')
      .select('id')
      .eq('status', 'active')

    if (!alertsError && alerts) {
      compliance.alerts_unresolved = alerts.length
    }

    return compliance
  } catch (error) {
    console.error('Failed to get compliance status:', error)
    return {}
  }
}

/**
 * Get client information for security logging
 */
function getClientInfo(): { ipAddress?: string; userAgent?: string; sessionId?: string } {
  // In a real application, this would get the actual client information
  // For now, return placeholder data
  return {
    ipAddress: '127.0.0.1', // Would be obtained from request headers
    userAgent: navigator?.userAgent || 'Unknown',
    sessionId: `session_${Date.now()}` // Would be obtained from session storage
  }
}

// Types are already exported above
