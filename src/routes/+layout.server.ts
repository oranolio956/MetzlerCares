import type { LayoutServerLoad } from './$types'
import { getCSRFToken, refreshCSRFToken } from '$lib/utils/csrf'

/**
 * Server-side layout load function that provides CSRF token to all pages
 * This ensures every page has access to a valid CSRF token for form submissions
 */
export const load: LayoutServerLoad = async event => {
  // Get or create CSRF token
  let csrfToken = getCSRFToken(event)

  if (!csrfToken) {
    csrfToken = refreshCSRFToken(event)
  }

  return {
    csrfToken,
    // Add other server-side data that should be available globally
    user: event.locals.user || null,
    session: event.locals.session || null,
    locale: event.locals.locale || 'en'
  }
}
