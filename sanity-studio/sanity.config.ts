import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'metzler-foundations',
  title: 'Metzler Foundations',

  projectId: 'qxaj7c29', // Metzler Foundations Sanity project
  dataset: 'production',

  // Auth token for API access (optional, for CORS and preview)
  token: process.env.SANITY_AUTH_TOKEN,

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
})
