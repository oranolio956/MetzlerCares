import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const supabaseUrl =
    import.meta.env.PUBLIC_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL ||
    'https://placeholder-project.supabase.co'
  const supabaseKey =
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

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

  const {
    data: { session }
  } = await event.locals.supabase.auth.getSession()
  event.locals.session = session || null
  event.locals.user = session?.user || null
  event.locals.requestId = crypto.randomUUID()
  event.locals.cspNonce = crypto.randomUUID()

  return resolve(event)
}
