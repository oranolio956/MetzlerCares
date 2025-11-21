import type { Actions, PageServerLoad } from './$types'
import { supabase } from '$lib/utils/supabase'
import { validateAndSanitizeForm, VALIDATION_RULES } from '$lib/utils/validation'
import { trackEvent } from '$lib/utils/analytics'
import { trackCustomError } from '$lib/utils/monitoring'

export const load: PageServerLoad = async ({ url }) => {
  return {
    canonicalUrl: `https://metzlerfoundations.org${url.pathname}`,
    metaTitle: 'Contact Us - Metzler Foundations',
    metaDescription:
      "Get in touch with Metzler Foundations. We're here to help with questions about housing scholarships, recovery support, and partnership opportunities."
  }
}

export const actions: Actions = {
  contact: async ({ request, platform }) => {
    try {
      const formData = await request.formData()

      const contactData = {
        name: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        inquiryType: formData.get('inquiryType')?.toString() || '',
        subject: formData.get('subject')?.toString() || '',
        message: formData.get('message')?.toString() || ''
      }

      // Validate form data
      const validationRules = {
        name: [VALIDATION_RULES.fullName],
        email: [VALIDATION_RULES.email],
        phone: [VALIDATION_RULES.phone],
        inquiryType: [
          {
            required: true,
            custom: (value: string) => {
              const validTypes = ['general', 'application', 'partnership', 'technical', 'billing', 'feedback', 'other']
              return validTypes.includes(value) || 'Please select a valid inquiry type'
            }
          }
        ],
        subject: [
          {
            required: true,
            minLength: 5,
            maxLength: 200
          }
        ],
        message: [
          {
            required: true,
            minLength: 10,
            maxLength: 2000
          }
        ]
      }

      const { isValid, errors, sanitizedData } = validateAndSanitizeForm(contactData, validationRules)

      if (!isValid) {
        return {
          errors,
          values: contactData
        }
      }

      // Store contact inquiry in database
      const { error: dbError } = await supabase.from('contact_inquiries').insert({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone || null,
        inquiry_type: sanitizedData.inquiryType,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        ip_address:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          request.headers.get('x-client-ip') ||
          'unknown',
        user_agent: request.headers.get('user-agent') || null,
        created_at: new Date().toISOString()
      })

      if (dbError) {
        console.error('Database error storing contact inquiry:', dbError)
        trackCustomError('Contact form database error', { error: dbError.message })

        return {
          errors: { general: 'Failed to submit your message. Please try again.' },
          values: contactData
        }
      }

      // Track successful contact form submission
      trackEvent('contact_form_submitted', {
        inquiry_type: sanitizedData.inquiryType,
        has_phone: !!sanitizedData.phone
      })

      // TODO: Send confirmation email to user and notification to support team
      // This would integrate with an email service like SendGrid, Mailgun, etc.

      return {
        success: true,
        message: "Thank you for contacting us! We'll get back to you within 24 hours."
      }
    } catch (error) {
      console.error('Contact form error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      trackCustomError('Contact form submission error', { error: errorMessage })

      return {
        errors: { general: 'An unexpected error occurred. Please try again later.' }
      }
    }
  }
}
