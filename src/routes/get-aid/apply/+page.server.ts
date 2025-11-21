import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { encryptPHI, validateEncryptionSetup } from '$lib/server/encryption'
import { logSecurityEvent, SECURITY_EVENTS } from '$lib/utils/security-monitoring'
import { validateApplicationServer, validateRateLimit } from '$lib/server/validation'

export const actions: Actions = {
  apply: async ({ request, locals }) => {
    try {
      const formData = await request.formData()

      // Check rate limiting
      const sessionData = await locals.getSession()
      const userId = sessionData?.user?.id
      if (userId && !validateRateLimit(userId, 'application_submit', 3, 3600000)) {
        // 3 applications per hour
        logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, userId, {
          action: 'rate_limit_exceeded',
          limit: '3 applications per hour'
        })
        return fail(429, {
          error: { message: 'Too many applications submitted. Please wait before submitting another application.' }
        })
      }

      // Extract form data
      const formDataObj = {
        eligibilityAccepted:
          formData.get('eligibility_accepted') === 'true' || formData.get('eligibility_accepted') === 'on',
        consentAccepted: formData.get('consent_accepted') === 'true' || formData.get('consent_accepted') === 'on',
        fullName: formData.get('full_name')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        phone: formData.get('phone')?.toString().trim(),
        amountRequested: parseFloat(formData.get('amount_requested')?.toString() || '0'),
        specialRequirements: formData.get('special_requirements')?.toString().trim()
      }

      // Server-side validation and sanitization
      const validation = validateApplicationServer(formDataObj, userId)
      if (!validation.valid) {
        return fail(400, {
          error: { message: Object.values(validation.errors)[0] || 'Validation failed' }
        })
      }

      // Extract additional fields for legacy processing
      const dateOfBirth = formData.get('date_of_birth')?.toString()
      const ssn = formData.get('ssn')?.toString().replace(/\D/g, '') // Remove formatting

      // Validate date of birth (must be 18+)
      if (dateOfBirth) {
        const dob = new Date(dateOfBirth)
        const age = new Date().getFullYear() - dob.getFullYear()
        if (age < 18) {
          return fail(400, {
            error: { message: 'You must be at least 18 years old to apply.' }
          })
        }
      }

      if (!ssn || ssn.length !== 9) {
        return fail(400, {
          error: { message: 'Valid Social Security Number is required.' }
        })
      }

      // Check if user is authenticated via server session
      const user = sessionData?.user
      if (!user) {
        return fail(401, {
          error: { message: 'Authentication required. Please sign in to continue.' }
        })
      }

      // Check if beneficiary already exists
      const { data: existingBeneficiary, error: checkError } = await locals.supabase
        .from('beneficiaries')
        .select('id')
        .eq('id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
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

      // TODO: Implement automated verification API call
      // This would call a service like The Work Number or similar
      // For now, we'll simulate the verification process
      const isEligible = await simulateAutomatedVerification(ssn, validation.sanitizedData.fullName, dateOfBirth || '')

      if (!isEligible) {
        return fail(400, {
          error: {
            message:
              'Based on our automated verification, you do not currently meet our income eligibility criteria. We encourage you to explore other local resources.'
          }
        })
      }

      // Use Supabase service role for secure backend operations
      const supabaseAdmin = locals.supabase

      // Step 1: Encrypt PHI fields before storage using sanitized data
      const encryptedFullName = await encryptPHI(validation.sanitizedData.fullName)

      // Step 2: Create beneficiary record with encrypted PHI
      const { data: beneficiaryData, error: beneficiaryError } = await supabaseAdmin
        .from('beneficiaries')
        .insert({
          id: user.id,
          full_name: encryptedFullName, // Encrypted PHI
          email: validation.sanitizedData.email,
          phone: validation.sanitizedData.phone,
          created_by: user.id,
          updated_by: user.id
          // Note: We do NOT store SSN or DOB for privacy reasons (data minimization)
        })
        .select('id')
        .single()

      if (beneficiaryError) {
        console.error('Error creating beneficiary:', beneficiaryError)
        return fail(500, {
          error: { message: 'Failed to create beneficiary record. Please try again.' }
        })
      }

      // Step 2: Create consent record
      const { data: consentData, error: consentError } = await supabaseAdmin
        .from('consents')
        .insert({
          beneficiary_id: beneficiaryData.id,
          consent_type: 'TREATMENT_PAYMENT_OPERATIONS',
          status: 'active',
          purpose: 'Coordination of sober living placement and scholarship payment',
          recipient_name: 'Metzler Foundations and approved sober living partners',
          recipient_purpose: 'Housing assistance and program coordination',
          information_disclosed: 'Eligibility verification and placement coordination',
          granted_at: new Date().toISOString(),
          expires_at: null, // TPO consent doesn't expire but can be revoked
          granted_by: user.id
        })
        .select('id')
        .single()

      if (consentError) {
        console.error('Error creating consent:', consentError)
        // Clean up beneficiary record if consent creation fails
        await supabaseAdmin.from('beneficiaries').delete().eq('id', beneficiaryData.id)

        return fail(500, {
          error: { message: 'Failed to create consent record. Please try again.' }
        })
      }

      // Step 4: Create application record
      const { data: applicationData, error: applicationError } = await supabaseAdmin
        .from('applications')
        .insert({
          beneficiary_id: beneficiaryData.id,
          partner_id: '550e8400-e29b-41d4-a716-446655440000', // Placeholder - would be selected from form
          status: 'submitted',
          application_date: new Date().toISOString(),
          preferred_start_date: formData.get('preferred_start_date')?.toString(),
          special_requirements: validation.sanitizedData.specialRequirements,
          consent_id: consentData.id,
          amount_requested: validation.sanitizedData.amountRequested,
          created_by: user.id,
          updated_by: user.id
        })
        .select('id')
        .single()

      if (applicationError) {
        console.error('Error creating application:', applicationError)
        // Clean up previous records
        await supabaseAdmin.from('consents').delete().eq('id', consentData.id)
        await supabaseAdmin.from('beneficiaries').delete().eq('id', beneficiaryData.id)

        return fail(500, {
          error: { message: 'Failed to create application record. Please try again.' }
        })
      }

      // Log successful application creation
      await logSecurityEvent(SECURITY_EVENTS.PHI_ACCESS, user.id, {
        action: 'application_created',
        resource_type: 'application',
        resource_id: applicationData.id,
        phi_fields_accessed: ['full_name', 'phone', 'special_requirements'],
        purpose: 'Creating financial aid application',
        beneficiary_id: beneficiaryData.id,
        consent_id: consentData.id
      })

      // Trigger HIPAA-compliant Keragon automation workflow (no PII)
      try {
        // Use dynamic import or process.env for optional secrets
        // This prevents build failures if the secret is missing in some environments
        const INTAKE_WORKFLOW_TOKEN = process.env.INTAKE_WORKFLOW_TOKEN || ''

        const { error: triggerError } = await locals.supabase.functions.invoke('trigger-intake-workflow', {
          body: { beneficiary_id: beneficiaryData.id },
          headers: {
            'Content-Type': 'application/json',
            ...(INTAKE_WORKFLOW_TOKEN ? { Authorization: `Bearer ${INTAKE_WORKFLOW_TOKEN}` } : {})
          }
        })
        if (triggerError) {
          console.error('Failed to trigger Keragon workflow:', triggerError)
        }
      } catch (keragonError) {
        console.error('Error triggering Keragon workflow:', keragonError)
        // Don't fail the application - automation can be triggered manually if needed
      }

      // Log PHI access event for security monitoring
      await logSecurityEvent(SECURITY_EVENTS.PHI_ACCESS, user.id, {
        action: 'application_submission',
        resource_type: 'beneficiary_application',
        phi_fields_accessed: ['full_name', 'phone', 'emergency_contact_info', 'special_requirements'],
        purpose: 'Processing financial aid application with PHI',
        beneficiary_id: beneficiaryData.id,
        consent_id: consentData.id
      })

      // Success! Redirect to success page
      return {
        success: true,
        beneficiaryId: beneficiaryData.id,
        consentId: consentData.id,
        applicationId: applicationData.id
      }
    } catch (error) {
      console.error('Unexpected error in application submission:', error)
      return fail(500, {
        error: { message: 'An unexpected error occurred. Please try again or contact support.' }
      })
    }
  }
}

// Simulated automated verification function
// In production, this would call a real API like The Work Number
async function simulateAutomatedVerification(ssn: string, fullName: string, dateOfBirth: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // For demo purposes, approve 80% of applications
  // In production, this would validate against actual income data
  const approvalRate = 0.8
  const isApproved = Math.random() < approvalRate

  return isApproved
}
