import type { Actions, PageServerLoad } from './$types'
import { supabase } from '$lib/utils/supabase'
import { validateAndSanitizeForm, VALIDATION_RULES } from '$lib/utils/validation'
import { trackEvent } from '$lib/utils/analytics'
import { trackCustomError } from '$lib/utils/monitoring'

export const load: PageServerLoad = async () => {
  return {
    metaTitle: 'Reset Password - Metzler Foundations',
    metaDescription: 'Reset your password to access your Metzler Foundations account.'
  }
}

export const actions: Actions = {
  reset: async ({ request, url }) => {
    let formData: FormData | undefined;
    
    try {
      formData = await request.formData()

      const resetData = {
        email: formData.get('email')?.toString() || ''
      }

      // Validate email
      const { isValid, errors, sanitizedData } = validateAndSanitizeForm(resetData, { email: [VALIDATION_RULES.email] })

      if (!isValid) {
        return {
          errors,
          data: resetData
        }
      }

      // Check if user exists (don't reveal if email exists for security)
      // Note: We cannot check if user exists for security reasons, so we always attempt to send reset email
      trackEvent('password_reset_requested', {
        email_provided: true
      })

      // Always attempt to send reset email (Supabase handles non-existent users gracefully)
      const resetUrl = `${url.origin}/auth/reset-password`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(sanitizedData.email, {
        redirectTo: resetUrl,
        captchaToken: undefined // Add if using captcha
      })

      if (resetError) {
        console.error('Password reset error:', resetError)
        trackCustomError('Password reset email failed', { error: resetError.message })
        // Still return success for security
      }

      return {
        success: true,
        message: "If an account with that email exists, we've sent you password reset instructions."
      }
    } catch (error) {
      console.error('Password reset error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      trackCustomError('Password reset server error', { error: errorMessage })

      return {
        errors: { general: 'An unexpected error occurred. Please try again.' },
        data: { email: formData?.get('email')?.toString() || '' }
      }
    }
  }
}
