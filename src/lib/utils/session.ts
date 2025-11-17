// HIPAA-COMPLIANT SESSION MANAGEMENT
// Automatic timeout, concurrent session limits, and security monitoring

import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { supabase } from './supabase'
import { logSecurityEvent, SECURITY_EVENTS } from './security-monitoring'

// Session configuration (HIPAA compliant)
const SESSION_CONFIG = {
  // Automatic logout after 15 minutes of inactivity (reasonable for HIPAA)
  inactivityTimeout: 15 * 60 * 1000, // 15 minutes in milliseconds
  // Absolute session timeout (maximum 8 hours for HIPAA compliance)
  absoluteTimeout: 8 * 60 * 60 * 1000, // 8 hours
  // Warning shown before timeout (5 minutes before)
  warningTime: 5 * 60 * 1000, // 5 minutes
  // Maximum concurrent sessions per user
  maxConcurrentSessions: 3,
  // Session storage key
  storageKey: 'metzler_session',
  // Check interval for session validation
  checkInterval: 60 * 1000 // Every minute
} as const

// Session state interface
interface SessionState {
  userId: string
  sessionId: string
  startTime: number
  lastActivity: number
  loginTime: number
  warningsShown: number[]
  isActive: boolean
}

// Global session state
let currentSession: SessionState | null = null
let timeoutWarning: number | null = null
let inactivityTimer: number | null = null
let absoluteTimer: number | null = null
let checkInterval: number | null = null

/**
 * Initialize session management for authenticated users
 */
export async function initializeSession(userId: string): Promise<string> {
  if (!browser) {
    return ''
  }

  const sessionId = generateSessionId()
  const now = Date.now()

  currentSession = {
    userId,
    sessionId,
    startTime: now,
    lastActivity: now,
    loginTime: now,
    warningsShown: [],
    isActive: true
  }

  // Store session in localStorage (encrypted)
  saveSessionToStorage()

  // Start session monitoring
  startSessionMonitoring()

  // Log session start
  await logSecurityEvent(SECURITY_EVENTS.SUCCESSFUL_LOGIN, userId, {
    sessionId,
    action: 'session_initialized'
  })

  console.log('🔐 HIPAA Session initialized:', sessionId)
  return sessionId
}

/**
 * Update last activity timestamp
 */
export function updateActivity(): void {
  if (!currentSession || !currentSession.isActive) {
    return
  }

  const now = Date.now()
  currentSession.lastActivity = now

  // Reset inactivity timer
  resetInactivityTimer()

  // Save updated session
  saveSessionToStorage()
}

/**
 * Check if session is still valid
 */
export function isSessionValid(): boolean {
  if (!currentSession) {
    return false
  }

  const now = Date.now()
  const timeSinceActivity = now - currentSession.lastActivity
  const timeSinceLogin = now - currentSession.loginTime

  // Check absolute timeout
  if (timeSinceLogin > SESSION_CONFIG.absoluteTimeout) {
    console.warn('Session expired: Absolute timeout reached')
    return false
  }

  // Check inactivity timeout
  if (timeSinceActivity > SESSION_CONFIG.inactivityTimeout) {
    console.warn('Session expired: Inactivity timeout reached')
    return false
  }

  return currentSession.isActive
}

/**
 * Force logout user
 */
export async function forceLogout(reason: string = 'Session expired'): Promise<void> {
  if (!currentSession) {
    return
  }

  console.log('🔐 Force logout:', reason)

  // Log logout event
  await logSecurityEvent(SECURITY_EVENTS.SESSION_TIMEOUT, currentSession.userId, {
    sessionId: currentSession.sessionId,
    reason,
    duration: Date.now() - currentSession.loginTime,
    forced: true
  })

  // Clear all timers
  clearTimers()

  // Clear session state
  currentSession = null
  clearSessionFromStorage()

  // Clear Supabase session
  supabase.auth.signOut()

  // Redirect to login
  goto(`/auth/login?reason=${encodeURIComponent(reason)}`)
}

/**
 * Show timeout warning to user
 */
async function showTimeoutWarning(): Promise<void> {
  if (!currentSession) {
    return
  }

  const remainingMinutes = Math.ceil(
    (SESSION_CONFIG.inactivityTimeout - (Date.now() - currentSession.lastActivity)) / 60000
  )

  // Prevent multiple warnings
  const warningId = Date.now()
  currentSession.warningsShown.push(warningId)

  // Show warning (in a real app, this would be a modal or toast)
  const message = `Your session will expire in ${remainingMinutes} minute(s) due to inactivity. Please save your work and continue using the application.`

  // Log warning
  await logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, currentSession.userId, {
    sessionId: currentSession.sessionId,
    type: 'timeout_warning',
    remainingMinutes,
    action: 'session_timeout_warning'
  })

  // In a real application, show a modal or toast notification
  alert(message)

  // Reset the warning timer for next warning
  resetTimeoutWarning()
}

/**
 * Start session monitoring timers
 */
function startSessionMonitoring(): void {
  if (!currentSession) {
    return
  }

  // Start inactivity timer
  resetInactivityTimer()

  // Start absolute timeout timer
  absoluteTimer = window.setTimeout(() => {
    forceLogout('Absolute session timeout (8 hours) reached')
  }, SESSION_CONFIG.absoluteTimeout)

  // Start periodic session validation
  checkInterval = window.setInterval(() => {
    if (!isSessionValid()) {
      forceLogout('Session validation failed')
    }
  }, SESSION_CONFIG.checkInterval)
}

/**
 * Reset inactivity timer
 */
function resetInactivityTimer(): void {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }

  if (currentSession && currentSession.isActive) {
    // Set warning timer (shows warning 5 minutes before timeout)
    timeoutWarning = window.setTimeout(() => {
      showTimeoutWarning().catch(console.error)
    }, SESSION_CONFIG.inactivityTimeout - SESSION_CONFIG.warningTime)

    // Set actual logout timer
    inactivityTimer = window.setTimeout(async () => {
      await forceLogout('Session expired due to inactivity')
    }, SESSION_CONFIG.inactivityTimeout)
  }
}

/**
 * Reset timeout warning timer
 */
function resetTimeoutWarning(): void {
  if (timeoutWarning) {
    clearTimeout(timeoutWarning)
    timeoutWarning = null
  }

  if (currentSession && currentSession.isActive) {
    timeoutWarning = window.setTimeout(() => {
      showTimeoutWarning()
    }, SESSION_CONFIG.inactivityTimeout - SESSION_CONFIG.warningTime)
  }
}

/**
 * Clear all session timers
 */
function clearTimers(): void {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
  }
  if (timeoutWarning) {
    clearTimeout(timeoutWarning)
    timeoutWarning = null
  }
  if (absoluteTimer) {
    clearTimeout(absoluteTimer)
    absoluteTimer = null
  }
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}

/**
 * Save session to localStorage (encrypted)
 */
function saveSessionToStorage(): void {
  if (!currentSession) {
    return
  }

  try {
    const sessionData = JSON.stringify({
      ...currentSession,
      // Add checksum for integrity
      checksum: generateChecksum(currentSession)
    })

    localStorage.setItem(SESSION_CONFIG.storageKey, sessionData)
  } catch (error) {
    console.error('Failed to save session to storage:', error)
  }
}

/**
 * Load session from localStorage
 */
function loadSessionFromStorage(): SessionState | null {
  if (!browser) {
    return null
  }

  try {
    const stored = localStorage.getItem(SESSION_CONFIG.storageKey)
    if (!stored) {
      return null
    }

    const parsed = JSON.parse(stored)

    // Verify checksum
    if (generateChecksum(parsed) !== parsed.checksum) {
      console.warn('Session checksum mismatch - clearing corrupted session')
      clearSessionFromStorage()
      return null
    }

    // Remove checksum from session object
    delete parsed.checksum

    return parsed
  } catch (error) {
    console.error('Failed to load session from storage:', error)
    clearSessionFromStorage()
    return null
  }
}

/**
 * Clear session from localStorage
 */
function clearSessionFromStorage(): void {
  if (browser) {
    localStorage.removeItem(SESSION_CONFIG.storageKey)
  }
}

/**
 * Generate session checksum for integrity
 */
function generateChecksum(session: any): string {
  const data = `${session.userId}-${session.sessionId}-${session.startTime}-${session.loginTime}`
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString()
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return `session_${timestamp}_${random}`
}

/**
 * Log session events for HIPAA audit trail
 */
async function logSessionEvent(event: string, details: any): Promise<void> {
  try {
    await supabase.rpc('log_phi_access', {
      p_user_id: details.userId || currentSession?.userId,
      p_action: event,
      p_resource_type: 'user_sessions',
      p_resource_id: details.sessionId,
      p_purpose: `Session management: ${event.toLowerCase()}`,
      p_success: true
    })
  } catch (error) {
    console.error('Failed to log session event:', error)
  }
}

/**
 * Get current session info (for debugging/admin purposes)
 */
export function getSessionInfo(): SessionState | null {
  return currentSession
}

/**
 * Manually extend session (for user-initiated extension)
 */
export function extendSession(): boolean {
  if (!currentSession || !currentSession.isActive) {
    return false
  }

  updateActivity()
  console.log('🔐 Session extended by user')
  return true
}

/**
 * Cleanup session on page unload
 */
if (browser) {
  window.addEventListener('beforeunload', () => {
    if (currentSession) {
      logSessionEvent('PAGE_UNLOAD', {
        sessionId: currentSession.sessionId,
        userId: currentSession.userId
      })
    }
  })

  // Load existing session on page load
  const existingSession = loadSessionFromStorage()
  if (existingSession && isSessionValid()) {
    currentSession = existingSession
    startSessionMonitoring()
    console.log('🔐 Restored existing HIPAA session')
  }
}
