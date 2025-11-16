import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  const session = await locals.getSession()
  if (!session) {
    throw redirect(302, `/auth/login?redirect=${encodeURIComponent(`/staff/application/${params.id}`)}`)
  }
  const userId = session.user.id
  const { data: profile } = await locals.supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  const role = profile?.role || session.user.user_metadata?.role || session.user.app_metadata?.role
  if (!role || !['admin', 'staff', 'case_manager'].includes(role)) {
    throw redirect(302, '/unauthorized')
  }
  const { data: appData, error: appError } = await locals.supabase
    .from('applications')
    .select(`*,
      beneficiaries (id, full_name, email, created_at),
      sober_living_partners (id, facility_name, contact_person, contact_email, address_street, address_city, address_state)
    `)
    .eq('id', params.id)
    .single()
  if (appError || !appData) {
    throw fail(404, { error: { message: 'Application not found' } })
  }
  const { data: consentData } = await locals.supabase
    .from('consents')
    .select('*')
    .eq('beneficiary_id', appData.beneficiaries?.id)
    .order('granted_at', { ascending: false })
  return { application: appData, beneficiary: appData.beneficiaries, consents: consentData || [], csrfToken: (locals as any).csrfToken }
}

export const actions: Actions = {
  upload: async ({ request, locals, params }) => {
    const session = await locals.getSession()
    if (!session) return fail(401, { error: { message: 'Unauthorized' } })
    const formData = await request.formData()
    const csrf = formData.get('csrf_token')?.toString()
    if (!csrf || csrf !== (locals as any).csrfToken) return fail(403, { error: { message: 'Invalid request token' } })
    const files = formData.getAll('files') as File[]
    if (!files || files.length === 0) return fail(400, { error: { message: 'No files provided' } })
    const uploaded: { name: string; path: string; uploadedAt: string }[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop() || 'dat'
      const fileName = `verification-${params.id}-${Date.now()}.${ext}`
      const filePath = `manual-verifications/${params.id}/${fileName}`
      const { error } = await locals.supabase.storage
        .from('private-verifications')
        .upload(filePath, file)
      if (error) return fail(500, { error: { message: error.message } })
      uploaded.push({ name: file.name, path: filePath, uploadedAt: new Date().toISOString() })
    }
    return { success: true, files: uploaded }
  },
  disburse: async ({ request, locals }) => {
    const session = await locals.getSession()
    if (!session) return fail(401, { error: { message: 'Unauthorized' } })
    const csrfHeader = request.headers.get('x-csrf-token')
    if (!csrfHeader || csrfHeader !== (locals as any).csrfToken) return fail(403, { error: { message: 'Invalid request token' } })
    const body = await request.json()
    const { application_id, amount } = body || {}
    if (!application_id || !amount) return fail(400, { error: { message: 'Invalid payload' } })
    const { data, error } = await locals.supabase.functions.invoke('disburse-scholarship', {
      body: { application_id, amount }
    })
    if (error) return fail(502, { error: { message: error.message } })
    await locals.supabase.from('audit_logs').insert({ 
      action: 'disburse', 
      resource_type: 'applications', 
      resource_id: application_id, 
      user_id: session.user.id,
      changes: { amount, requestId: (locals as any).requestId } 
    })
    return { success: true, data }
  },
  approve: async ({ request, locals, params }) => {
    const session = await locals.getSession()
    if (!session) return fail(401, { error: { message: 'Unauthorized' } })
    const form = await request.formData()
    const csrf = form.get('csrf_token')?.toString()
    if (!csrf || csrf !== (locals as any).csrfToken) return fail(403, { error: { message: 'Invalid request token' } })
    const notes = (form.get('notes')?.toString() || '').trim()
    const { error } = await locals.supabase
      .from('applications')
      .update({
        status: 'approved',
        verification_status: 'manual_override',
        manual_review_notes: notes,
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', params.id)
    if (error) return fail(500, { error: { message: error.message } })
    await locals.supabase.from('audit_logs').insert({ 
      action: 'approve', 
      resource_type: 'applications', 
      resource_id: params.id, 
      user_id: session.user.id,
      changes: { notes, requestId: (locals as any).requestId } 
    })
    return { success: true }
  },
  deny: async ({ locals, params, request }) => {
    const session = await locals.getSession()
    if (!session) return fail(401, { error: { message: 'Unauthorized' } })
    const csrfHeader = request.headers.get('x-csrf-token')
    if (!csrfHeader || csrfHeader !== (locals as any).csrfToken) return fail(403, { error: { message: 'Invalid request token' } })
    const { error } = await locals.supabase
      .from('applications')
      .update({
        status: 'denied',
        verification_status: 'manual_deny',
        manual_review_notes: 'Application denied during manual review',
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', params.id)
    if (error) return fail(500, { error: { message: error.message } })
    await locals.supabase.from('audit_logs').insert({ 
      action: 'deny', 
      resource_type: 'applications', 
      resource_id: params.id, 
      user_id: session.user.id,
      changes: { requestId: (locals as any).requestId } 
    })
    return { success: true }
  }
}