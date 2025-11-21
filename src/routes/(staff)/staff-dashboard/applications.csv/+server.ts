import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals }) => {
  const session = await locals.getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })
  const { data: profile } = await locals.supabase.from('profiles').select('role').eq('id', session.user.id).single()
  if (!profile || (profile as any).role !== 'staff') return new Response('Forbidden', { status: 403 })

  const since90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await locals.supabase
    .from('applications')
    .select('id,status,created_at,updated_at,amount_requested')
    .gte('created_at', since90)
    .order('created_at', { ascending: false })

  const rows = (data || []).map((a: any) => [
    a.id,
    a.status,
    a.created_at,
    a.updated_at || '',
    String(a.amount_requested ?? '')
  ])
  const header = ['id', 'status', 'created_at', 'updated_at', 'amount_requested']
  const csv = [header, ...rows].map(r => r.map((c: any) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  return new Response(csv, { headers: { 'Content-Type': 'text/csv' } })
}
