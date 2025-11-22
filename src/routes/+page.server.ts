import type { PageServerLoad } from './$types'
import { getHomepageContent } from '$lib/content/homepage'

export const load: PageServerLoad = async ({ locals }) => {
  const locale = (locals as { locale?: string })?.locale ?? 'en'
  return getHomepageContent(locale)
}
