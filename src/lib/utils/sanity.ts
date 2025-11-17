// Sanity client configuration for Metzler Foundations

import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'qxaj7c29',
  dataset: 'production',
  useCdn: true, // Use CDN for faster reads, set to false for fresh data
  apiVersion: '2023-05-03' // API version for compatibility
})

// Helper functions for common Sanity operations will be added here
// - Content fetching (blog posts, pages)
// - GROQ queries for specific content types
// - Image URL generation
