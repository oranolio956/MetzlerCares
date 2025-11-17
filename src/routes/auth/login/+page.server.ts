import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  login: async ({ request, locals, url }) => {
    try {
      const data = await request.formData()
      const email = data.get('email')?.toString().trim()
      const password = data.get('password')?.toString()
      if (!email || !password) {
        return fail(400, { error: { message: 'Email and password are required.' } })
      }

      const { error } = await locals.supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return fail(401, { error: { message: 'Invalid credentials.' } })
      }

      const redirectTo = url.searchParams.get('redirect') || '/'
      throw redirect(303, redirectTo)
    } catch (err) {
      return fail(500, { error: { message: 'Login failed. Please try again.' } })
    }
  }
}
