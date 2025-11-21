// Sanity client configuration for Metzler Foundations

import { createClient } from '@sanity/client'
import { getConfigValue } from './config'

const projectId = getConfigValue('VITE_SANITY_PROJECT_ID') as string | undefined
const dataset = getConfigValue('VITE_SANITY_DATASET', 'production') as string

if (!projectId) {
  console.warn('Sanity project ID not configured. CMS features will be disabled.')
}

export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      useCdn: true, // Use CDN for faster reads, set to false for fresh data
      apiVersion: '2023-05-03' // API version for compatibility
    })
  : null

// Helper functions for common Sanity operations will be added here
// - Content fetching (blog posts, pages)
// - GROQ queries for specific content types
// - Image URL generation
