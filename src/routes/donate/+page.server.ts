import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'public, max-age=600, s-maxage=3600'
  })
  return {}
}