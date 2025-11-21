import { error } from '@sveltejs/kit'
import { seoGenerator } from '$lib/utils/colorado-seo-generator'
import { COLORADO_LOCATIONS, SEO_TEMPLATES, generateLocationContent } from '$lib/utils/colorado-seo-data'

// Dynamic routes - prerender will be handled by Vercel ISR (Incremental Static Regeneration)
// Vercel will cache these pages and regenerate on-demand

export async function load({ params }) {
  const { city, treatment } = params

  // Find the location matching the city param
  const location = COLORADO_LOCATIONS.find(loc => loc.city.toLowerCase().replace(/\s+/g, '-') === city.toLowerCase())

  if (!location) {
    throw error(404, 'City not found')
  }

  // Find the matching template by checking generated slugs
  let matchedTemplateType: string | null = null

  for (const [type, template] of Object.entries(SEO_TEMPLATES)) {
    const generatedTemplate = generateLocationContent(template, location)
    if (generatedTemplate.slug === treatment) {
      matchedTemplateType = type
      break
    }
  }

  if (!matchedTemplateType) {
    // Fallback: try to match by simple keyword if slug match fails (for cleaner URLs)
    if (treatment === 'sober-living') matchedTemplateType = 'city_sober_living'
    else if (treatment === 'treatment-centers') matchedTemplateType = 'city_treatment_centers'
    else if (treatment === 'detox') matchedTemplateType = 'city_detox'
    else if (treatment === 'outpatient') matchedTemplateType = 'city_outpatient'
    else if (treatment === 'aftercare') matchedTemplateType = 'city_aftercare'
    else {
      throw error(404, 'Treatment service not found')
    }
  }

  try {
    const content = seoGenerator.generateCityContent(location, matchedTemplateType)
    return {
      seoContent: content,
      location,
      templateType: matchedTemplateType
    }
  } catch (e) {
    console.error('Error generating SEO content:', e)
    throw error(500, 'Error generating content')
  }
}
