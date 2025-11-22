// Test endpoint for Google Indexing API
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { googleIndexingAPI } from '$lib/utils/google-indexing-api-fixed'

export const GET: RequestHandler = async () => {
  try {
    // Test connection
    const connectionTest = await googleIndexingAPI.testConnection()
    const status = googleIndexingAPI.getStatus()

    // Test with a sample URL (won't actually submit if not configured)
    const testUrl = 'https://metzlercares.com/co/denver/sober-living'
    const testResult = await googleIndexingAPI.submitUrl(testUrl)

    return json(
      {
        success: connectionTest.success,
        connection: connectionTest,
        status,
        testSubmission: {
          url: testUrl,
          result: testResult
        },
        instructions: {
          setup: [
            '1. Create a Google Cloud Project',
            '2. Enable the Indexing API',
            '3. Create a Service Account',
            '4. Download the service account JSON key',
            '5. Add the service account email to Google Search Console',
            '6. Set GOOGLE_SERVICE_ACCOUNT_KEY (base64 encoded JSON) or GOOGLE_SERVICE_ACCOUNT_PATH environment variable'
          ],
          environmentVariables: {
            GOOGLE_SERVICE_ACCOUNT_KEY: 'Base64 encoded service account JSON (recommended for Vercel)',
            GOOGLE_SERVICE_ACCOUNT_PATH: 'Path to service account JSON file (for local development)',
            GOOGLE_APPLICATION_CREDENTIALS: 'Alternative path variable (standard Google env var)'
          }
        }
      },
      {
        status: connectionTest.success ? 200 : 503
      }
    )
  } catch (error: any) {
    return json(
      {
        success: false,
        error: error.message,
        status: googleIndexingAPI.getStatus()
      },
      { status: 500 }
    )
  }
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { url, type } = await request.json()

    if (!url) {
      return json({ success: false, error: 'URL is required' }, { status: 400 })
    }

    const result = await googleIndexingAPI.submitUrl(url, type || 'URL_UPDATED')

    return json(
      {
        success: result.success,
        result,
        status: googleIndexingAPI.getStatus()
      },
      {
        status: result.success ? 200 : 500
      }
    )
  } catch (error: any) {
    return json(
      {
        success: false,
        error: error.message,
        status: googleIndexingAPI.getStatus()
      },
      { status: 500 }
    )
  }
}
