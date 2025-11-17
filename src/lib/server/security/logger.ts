import { createClient } from '@supabase/supabase-js'
import { SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL } from '$env/static/private'

interface SecurityLog {
  id?: string
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'critical'
  category: 'auth' | 'api' | 'upload' | 'security' | 'system'
  message: string
  details?: Record<string, any>
  user_id?: string
  ip_address?: string
  user_agent?: string
  request_id?: string
}

interface SecurityMetrics {
  total_requests: number
  blocked_requests: number
  auth_failures: number
  suspicious_activities: number
  timestamp: string
}

class SecurityLogger {
  private supabase: ReturnType<typeof createClient>
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey) as any
    } else {
      const stub = {
        from: () => ({
          insert: async () => ({ error: null }),
          select: () => ({
            gte: () => ({
              lte: () => ({
                eq: () => ({ order: () => ({ limit: () => ({ data: [], error: null }) }) })
              })
            })
          })
        })
      }
      this.supabase = stub as any
    }
  }
  
  async log(securityLog: SecurityLog): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('security_logs')
        .insert([{
          timestamp: securityLog.timestamp || new Date().toISOString(),
          level: securityLog.level,
          category: securityLog.category,
          message: securityLog.message,
          details: securityLog.details,
          user_id: securityLog.user_id,
          ip_address: securityLog.ip_address,
          user_agent: securityLog.user_agent,
          request_id: securityLog.request_id
        }])
      
      if (error) {
        console.error('Failed to log security event:', error)
      }
    } catch (err) {
      console.error('Security logging error:', err)
    }
  }
  
  async logAuthEvent(params: {
    event: 'login' | 'logout' | 'signup' | 'password_reset' | 'failed_login'
    userId?: string
    ipAddress: string
    userAgent: string
    requestId: string
    details?: Record<string, any>
  }): Promise<void> {
    const level = params.event === 'failed_login' ? 'warn' : 'info'
    const message = `Authentication event: ${params.event}`
    
    await this.log({
      level,
      category: 'auth',
      message,
      user_id: params.userId,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
      request_id: params.requestId,
      details: params.details
    })
  }
  
  async logSecurityEvent(params: {
    type: 'rate_limit_exceeded' | 'csrf_validation_failed' | 'file_upload_blocked' | 'suspicious_activity'
    ipAddress: string
    userAgent: string
    requestId: string
    details?: Record<string, any>
    userId?: string
  }): Promise<void> {
    await this.log({
      level: 'warn',
      category: 'security',
      message: `Security event: ${params.type}`,
      user_id: params.userId,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
      request_id: params.requestId,
      details: params.details
    })
  }
  
  async logError(params: {
    error: Error
    context: string
    ipAddress?: string
    userAgent?: string
    requestId?: string
    userId?: string
  }): Promise<void> {
    await this.log({
      level: 'error',
      category: 'system',
      message: `Error in ${params.context}: ${params.error.message}`,
      details: {
        stack: params.error.stack,
        name: params.error.name
      },
      user_id: params.userId,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
      request_id: params.requestId
    })
  }
  
  async getSecurityMetrics(timeRange: { start: Date; end: Date }): Promise<SecurityMetrics> {
    try {
      const { data, error } = await this.supabase
        .from('security_logs')
        .select('*')
        .gte('timestamp', timeRange.start.toISOString())
        .lte('timestamp', timeRange.end.toISOString())
      
      if (error) {
        throw error
      }
      
      const metrics: SecurityMetrics = {
        total_requests: data.length,
        blocked_requests: data.filter(log => 
          log.level === 'warn' && 
          ['rate_limit_exceeded', 'csrf_validation_failed', 'file_upload_blocked'].includes(log.details?.type)
        ).length,
        auth_failures: data.filter(log => 
          log.category === 'auth' && log.details?.event === 'failed_login'
        ).length,
        suspicious_activities: data.filter(log => 
          log.category === 'security' && log.level === 'warn'
        ).length,
        timestamp: new Date().toISOString()
      }
      
      return metrics
    } catch (err) {
      console.error('Failed to get security metrics:', err)
      return {
        total_requests: 0,
        blocked_requests: 0,
        auth_failures: 0,
        suspicious_activities: 0,
        timestamp: new Date().toISOString()
      }
    }
  }
  
  async getSuspiciousActivities(timeRange: { start: Date; end: Date }) {
    try {
      const { data, error } = await this.supabase
        .from('security_logs')
        .select('*')
        .gte('timestamp', timeRange.start.toISOString())
        .lte('timestamp', timeRange.end.toISOString())
        .eq('category', 'security')
        .eq('level', 'warn')
        .order('timestamp', { ascending: false })
        .limit(100)
      
      if (error) {
        throw error
      }
      
      return data
    } catch (err) {
      console.error('Failed to get suspicious activities:', err)
      return []
    }
  }
}

export const securityLogger = new SecurityLogger(
  VITE_SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY || ''
)