import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { sanityClient } from '$lib/utils/sanity'

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
  setHeaders({ 'Cache-Control': 'public, max-age=600, s-maxage=3600' })

  // Load MOU content from Sanity on server-side
  const mouContent = sanityClient ? await sanityClient.fetch(`*[_type == "partnershipMou"][0]`) : null

  return { mouContent, csrfToken: (locals as any).csrfToken }
}

export const actions: Actions = {
  apply: async ({ request, locals }) => {
    const form = await request.formData()
    const csrf = form.get('csrf_token')?.toString()
    if (!csrf || csrf !== (locals as any).csrfToken) {
      return fail(403, { error: { message: 'Invalid request token' } })
    }
    const facilityName = (form.get('facilityName')?.toString() || '').trim()
    const contactName = (form.get('contactName')?.toString() || '').trim()
    const contactEmail = (form.get('contactEmail')?.toString() || '').trim().toLowerCase()
    const contactPhone = (form.get('contactPhone')?.toString() || '').trim()
    const addressStreet = (form.get('addressStreet')?.toString() || '').trim()
    const addressCity = (form.get('addressCity')?.toString() || '').trim()
    const addressState = (form.get('addressState')?.toString() || '').trim()
    const addressZip = (form.get('addressZip')?.toString() || '').trim()
    const mouAccepted = !!form.get('mouAccepted')
    const mou = form.get('mou') as File | null
    const insurance = form.get('insurance') as File | null

    if (
      !facilityName ||
      !contactName ||
      !contactEmail ||
      !addressStreet ||
      !addressCity ||
      !addressState ||
      !addressZip
    ) {
      return fail(400, { error: { message: 'All required fields must be provided.' } })
    }
    if (!mouAccepted) {
      return fail(400, { error: { message: 'You must accept the MOU terms to continue.' } })
    }
    if (!mou || !insurance) {
      return fail(400, { error: { message: 'Please upload certification and insurance documents.' } })
    }

    const safeName = facilityName.replace(/\s+/g, '-')
    const mouExt = mou.name.split('.').pop() || 'pdf'
    const insuranceExt = insurance.name.split('.').pop() || 'pdf'
    const mouFileName = `mou-${safeName}-${Date.now()}.${mouExt}`
    const insuranceFileName = `insurance-${safeName}-${Date.now()}.${insuranceExt}`
    const mouPath = `partner-applications/${safeName}/${mouFileName}`
    const insurancePath = `partner-applications/${safeName}/${insuranceFileName}`

    const up1 = await locals.supabase.storage.from('private-verifications').upload(mouPath, mou)
    if (up1.error) return fail(500, { error: { message: up1.error.message } })
    const up2 = await locals.supabase.storage.from('private-verifications').upload(insurancePath, insurance)
    if (up2.error) return fail(500, { error: { message: up2.error.message } })

    const { error } = await locals.supabase.from('sober_living_partners').insert({
      facility_name: facilityName,
      contact_person: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      address_street: addressStreet,
      address_city: addressCity,
      address_state: addressState,
      address_zip: addressZip,
      certification_document_path: mouPath,
      insurance_document_path: insurancePath,
      network_status: 'pending'
    })

    if (error) return fail(500, { error: { message: error.message } })

    throw redirect(303, '/partners')
  }
}
