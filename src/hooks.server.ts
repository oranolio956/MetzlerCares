import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const handle: Handle = async ({ event, resolve }) => {
  const supabaseUrl = PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  const supabaseKey = PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl,
    supabaseKey,
    event
  })

  event.locals.getSession = async () => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession()
    return session
  }

  const { data: { session } } = await event.locals.supabase.auth.getSession()
  event.locals.session = session || null
  event.locals.user = session?.user || null
  event.locals.requestId = crypto.randomUUID()
  event.locals.cspNonce = crypto.randomUUID()

  return resolve(event)
}
