import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/utils/logger'

export const load: PageServerLoad = async ({ locals }) => {
  return { csrfToken: (locals as any).csrfToken }
}

export const actions: Actions = {
  apply: async ({ request, locals }) => {
    try {
      const formData = await request.formData();
      const csrf = formData.get('csrf_token')?.toString()
      if (!csrf || csrf !== (locals as any).csrfToken) {
        return fail(403, { error: { message: 'Invalid request token' } })
      }

      // Extract form data
      const eligibilityAccepted = formData.get('eligibility_accepted') === 'true' || formData.get('eligibility_accepted') === 'on';
      const consentAccepted = formData.get('consent_accepted') === 'true' || formData.get('consent_accepted') === 'on';
      const fullName = formData.get('full_name')?.toString().trim();
      const dateOfBirth = formData.get('date_of_birth')?.toString();
      const ssn = formData.get('ssn')?.toString().replace(/\D/g, ''); // Remove formatting

      // Validate required fields
      if (!eligibilityAccepted) {
        return fail(400, {
          error: { message: 'You must accept the eligibility criteria to continue.' }
        });
      }

      if (!consentAccepted) {
        return fail(400, {
          error: { message: 'You must accept the consent agreement to continue.' }
        });
      }

      if (!fullName || !dateOfBirth || !ssn || ssn.length !== 9) {
        return fail(400, {
          error: { message: 'All fields are required and must be valid.' }
        });
      }

      // Validate date of birth (must be 18+)
      const dob = new Date(dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 18) {
        return fail(400, {
          error: { message: 'You must be at least 18 years old to apply.' }
        });
      }

      // Check if user is authenticated via server session
      const session = await locals.getSession();
      const user = session?.user;
      if (!user) {
        return fail(401, {
          error: { message: 'Authentication required. Please sign in to continue.' }
        });
      }

      // Check if beneficiary already exists
      const { data: existingBeneficiary, error: checkError } = await locals.supabase
        .from('beneficiaries')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing beneficiary:', checkError);
        return fail(500, {
          error: { message: 'An error occurred while processing your application.' }
        });
      }

      if (existingBeneficiary) {
        return fail(400, {
          error: { message: 'An application already exists for this account.' }
        });
      }

      // Automated verification via secure Edge Function (no data persisted)
      const { data: verifyData, error: verifyError } = await locals.supabase.functions.invoke(
        'automated-verification',
        {
          body: { ssn, full_name: fullName, date_of_birth: dateOfBirth },
          headers: { 'Content-Type': 'application/json' }
        }
      )

      if (verifyError) {
        logger.error('apply_verification', { requestId: (locals as any).requestId, message: 'provider_error', error: verifyError })
        console.error('Verification error:', verifyError)
        return fail(502, { error: { message: 'Verification service unavailable. Please try again shortly.' } })
      }

      const isEligible = !!verifyData?.eligible
      logger.info('apply_verification', { requestId: (locals as any).requestId, eligible: isEligible })

      if (!isEligible) {
        return fail(400, {
          error: { message: 'Based on our automated verification, you do not currently meet our income eligibility criteria. We encourage you to explore other local resources.' }
        });
      }

      // Use Supabase service role for secure backend operations
      const supabaseAdmin = locals.supabase;

      // Step 1: Create beneficiary record
      const { data: beneficiaryData, error: beneficiaryError } = await supabaseAdmin
        .from('beneficiaries')
        .insert({
          id: user.id,
          full_name: fullName,
          created_by: user.id,
          updated_by: user.id
          // Note: We do NOT store SSN or DOB for privacy reasons
        })
        .select('id')
        .single();

      if (beneficiaryError) {
        console.error('Error creating beneficiary:', beneficiaryError);
        return fail(500, {
          error: { message: 'Failed to create beneficiary record. Please try again.' }
        });
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
        .single();

      if (consentError) {
        console.error('Error creating consent:', consentError);
        // Clean up beneficiary record if consent creation fails
        await supabaseAdmin
          .from('beneficiaries')
          .delete()
          .eq('id', beneficiaryData.id);

        return fail(500, {
          error: { message: 'Failed to create consent record. Please try again.' }
        });
      }

      // Log successful application creation
      

      // Trigger HIPAA-compliant Keragon automation workflow (no PII)
      try {
        const { env } = await import('$env/dynamic/private');
        const token = env.INTAKE_WORKFLOW_TOKEN;
        const { error: triggerError } = await locals.supabase.functions.invoke(
          'trigger-intake-workflow',
          {
            body: { beneficiary_id: beneficiaryData.id },
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          }
        );
        if (triggerError) {
          console.error('Failed to trigger Keragon workflow:', triggerError);
        }
      } catch (keragonError) {
        console.error('Error triggering Keragon workflow:', keragonError);
        // Don't fail the application - automation can be triggered manually if needed
      }

      // Success! Redirect to success page
      return {
        success: true,
        beneficiaryId: beneficiaryData.id,
        consentId: consentData.id
      };

    } catch (error) {
      console.error('Unexpected error in application submission:', error);
      return fail(500, {
        error: { message: 'An unexpected error occurred. Please try again or contact support.' }
      });
    }
  }
};

// Removed simulation; verification handled in Edge Function
