import { getHomepageContent } from '$lib/content/homepage'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const locale = locals.locale ?? 'en'
  const content = await getHomepageContent(locale)

  return {
    locale,
    content
  }
}
