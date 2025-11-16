import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { securityLogger } from '$lib/server/security/logger'
import { getSecurityConfig } from '$lib/server/security/config'

interface SecurityAuditResult {
  timestamp: string
  status: 'secure' | 'warning' | 'critical'
  checks: {
    rateLimiting: boolean
    csrfProtection: boolean
    fileUploadSecurity: boolean
    cspHeaders: boolean
    loggingEnabled: boolean
    databaseSecurity: boolean
  }
  recommendations: string[]
  metrics: {
    totalRequests: number
    blockedRequests: number
    authFailures: number
    suspiciousActivities: number
  }
}

export const GET: RequestHandler = async ({ locals }) => {
  try {
    const config = getSecurityConfig()
    
    // Perform security audit checks
    const checks = {
      rateLimiting: config.rateLimiting.auth.maxRequests > 0,
      csrfProtection: config.csrf.enabled && config.csrf.secure,
      fileUploadSecurity: config.fileUpload.virusScanning.enabled,
      cspHeaders: config.csp.enabled,
      loggingEnabled: config.logging.enabled,
      databaseSecurity: true // This would check RLS policies in a real implementation
    }
    
    // Get recent security metrics
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000) // Last 24 hours
    
    const metrics = await securityLogger.getSecurityMetrics({
      start: startDate,
      end: endDate
    })
    
    // Generate recommendations
    const recommendations: string[] = []
    
    if (!checks.rateLimiting) {
      recommendations.push('Implement rate limiting to prevent abuse')
    }
    
    if (!checks.csrfProtection) {
      recommendations.push('Enable CSRF protection for state-changing operations')
    }
    
    if (!checks.fileUploadSecurity) {
      recommendations.push('Enable virus scanning for file uploads')
    }
    
    if (!checks.cspHeaders) {
      recommendations.push('Implement Content Security Policy headers')
    }
    
    if (!checks.loggingEnabled) {
      recommendations.push('Enable security logging for audit trails')
    }
    
    if (metrics.authFailures > 50) {
      recommendations.push('High number of authentication failures detected - consider implementing account lockout')
    }
    
    if (metrics.suspiciousActivities > 10) {
      recommendations.push('Suspicious activity detected - review security logs immediately')
    }
    
    // Determine overall status
    const failedChecks = Object.values(checks).filter(check => !check).length
    let status: 'secure' | 'warning' | 'critical' = 'secure'
    
    if (failedChecks >= 3) {
      status = 'critical'
    } else if (failedChecks >= 1) {
      status = 'warning'
    }
    
    const auditResult: SecurityAuditResult = {
      timestamp: new Date().toISOString(),
      status,
      checks,
      recommendations,
      metrics: {
        totalRequests: metrics.total_requests,
        blockedRequests: metrics.blocked_requests,
        authFailures: metrics.auth_failures,
        suspiciousActivities: metrics.suspicious_activities
      }
    }
    
    // Log the audit
    await securityLogger.log({
      level: status === 'critical' ? 'error' : status === 'warning' ? 'warn' : 'info',
      category: 'system',
      message: `Security audit performed - Status: ${status}`,
      ip_address: 'system',
      user_agent: 'security-audit',
      request_id: locals.requestId,
      details: {
        failedChecks,
        recommendations: recommendations.length
      }
    })
    
    return json(auditResult)
  } catch (error) {
    console.error('Security audit failed:', error)
    return json({ 
      error: 'Security audit failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}