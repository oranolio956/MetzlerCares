import { json } from '@sveltejs/kit'
import { createClient } from '@supabase/supabase-js'
import { validateSecureInput } from '$lib/utils/hipaaValidation'
import { logSecurityEvent } from '$lib/server/security/logger'

// Load environment variables directly
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('CRITICAL: Supabase environment variables not configured')
}

export async function POST({ request, cookies }) {
  try {
    // Use anon key for auth operations
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const { email, password } = await request.json()

    // Enhanced HIPAA-compliant input validation
    const emailValidation = validateSecureInput(email, 'email')
    if (!emailValidation.isValid) {
      logSecurityEvent('INVALID_LOGIN_ATTEMPT', {
        reason: 'email_validation_failed',
        field: 'email',
        severity: 'medium'
      })
      return json(
        {
          success: false,
          error: emailValidation.message || 'Invalid email format'
        },
        { status: 400 }
      )
    }

    const passwordValidation = validateSecureInput(password, 'password')
    if (!passwordValidation.isValid) {
      logSecurityEvent('INVALID_LOGIN_ATTEMPT', {
        reason: 'password_validation_failed',
        field: 'password',
        severity: 'medium'
      })
      return json(
        {
          success: false,
          error: passwordValidation.message || 'Invalid password format'
        },
        { status: 400 }
      )
    }

    // Basic presence validation
    if (!email || !password) {
      return json(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      )
    }

    // Attempt to sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      return json(
        {
          success: false,
          error: 'Invalid credentials'
        },
        { status: 401 }
      )
    }

    // Get user profile with role information
    const { data: profile, error: profileError } = await supabase
      .from('tenant_users')
      .select(
        `
        *,
        tenants!inner(name, id)
      `
      )
      .eq('user_id', authData.user.id)
      .single()

    if (profileError || !profile) {
      return json(
        {
          success: false,
          error: 'User profile not found'
        },
        { status: 404 }
      )
    }

    // Create session cookie
    const sessionToken = authData.session?.access_token

    // Set secure HTTP-only cookie
    if (sessionToken)
      cookies.set('sb-session', sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      action: 'USER_LOGIN',
      resource_type: 'auth',
      resource_id: authData.user.id,
      user_id: authData.user.id,
      tenant_id: profile.tenant_id,
      changes: {
        email: email,
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      }
    })

    return json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        tenant_id: profile.tenant_id,
        tenant_name: profile.tenants.name
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return json(
      {
        success: false,
        error: 'An error occurred during login'
      },
      { status: 500 }
    )
  }
}
