import { fail, redirect } from '@sveltejs/kit'
import { supabase } from '$lib/utils/supabase'
import type { Actions } from './$types'

export const actions: Actions = {
  apply: async ({ request, locals }) => {
    try {
      const formData = await request.formData()

      // Extract form data
      const full_name = formData.get('full_name')?.toString().trim()
      const email = formData.get('email')?.toString().trim().toLowerCase()
      const phone = formData.get('phone')?.toString().trim()
      const consent_accepted = formData.get('consent_accepted') === 'on'

      // Validate required fields
      if (!full_name || !email || !phone) {
        return fail(400, {
          error: { message: 'All fields are required.' }
        })
      }

      if (!consent_accepted) {
        return fail(400, {
          error: { message: 'You must accept the consent agreement to continue.' }
        })
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return fail(400, {
          error: { message: 'Please enter a valid email address.' }
        })
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        return fail(400, {
          error: { message: 'Please enter a valid phone number.' }
        })
      }

      // Check if user is authenticated (optional - for additional security)
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser()

      if (authError || !user) {
        return fail(401, {
          error: { message: 'Authentication required. Please sign in to continue.' }
        })
      }

      // Check if beneficiary already exists for this user
      const { data: existingBeneficiary, error: checkError } = await supabase
        .from('beneficiaries')
        .select('id')
        .eq('id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Error checking existing beneficiary:', checkError)
        return fail(500, {
          error: { message: 'An error occurred while processing your application.' }
        })
      }

      if (existingBeneficiary) {
        return fail(400, {
          error: { message: 'An application already exists for this account.' }
        })
      }

      // Use Supabase service role for secure backend operations
      // This bypasses RLS for administrative operations
      const supabaseAdmin = supabase

      // Step 1: Create beneficiary record
      const { data: beneficiaryData, error: beneficiaryError } = await supabaseAdmin
        .from('beneficiaries')
        .insert({
          id: user.id,
          full_name,
          email,
          phone: cleanPhone,
          created_by: user.id,
          updated_by: user.id
        })
        .select('id')
        .single()

      if (beneficiaryError) {
        console.error('Error creating beneficiary:', beneficiaryError)
        return fail(500, {
          error: { message: 'Failed to create beneficiary record. Please try again.' }
        })
      }

      // Step 2: Create consent record immediately after beneficiary creation
      const { data: consentData, error: consentError } = await supabaseAdmin
        .from('consents')
        .insert({
          beneficiary_id: beneficiaryData.id,
          consent_type: 'TREATMENT_PAYMENT_OPERATIONS',
          status: 'active',
          purpose: 'Coordination of sober living placement and treatment services',
          recipient_name: 'Metzler Foundations and authorized treatment partners',
          recipient_purpose: 'Housing placement, treatment coordination, and support services',
          information_disclosed: 'Basic contact information, housing eligibility, and treatment progress',
          granted_at: new Date().toISOString(),
          expires_at: null, // No expiration for TPO consent (can be revoked)
          granted_by: user.id // In production, this might be an admin/staff user
        })
        .select('id')
        .single()

      if (consentError) {
        console.error('Error creating consent:', consentError)
        // If consent creation fails, we should clean up the beneficiary record
        await supabaseAdmin.from('beneficiaries').delete().eq('id', beneficiaryData.id)

        return fail(500, {
          error: { message: 'Failed to create consent record. Please try again.' }
        })
      }

      // Log successful application creation (for compliance)
      console.log(`New beneficiary application created: ${beneficiaryData.id} with consent ${consentData.id}`)

      // Success! Redirect to success page
      return {
        success: true,
        beneficiaryId: beneficiaryData.id,
        consentId: consentData.id
      }
    } catch (error) {
      console.error('Unexpected error in application submission:', error)
      return fail(500, {
        error: { message: 'An unexpected error occurred. Please try again or contact support.' }
      })
    }
  }
}
