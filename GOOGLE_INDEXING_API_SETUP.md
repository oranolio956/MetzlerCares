# Google Indexing API Setup Guide

## Overview
The Google Indexing API allows you to notify Google immediately when content is added, updated, or deleted on your website. This enables rapid indexing similar to how major sites achieve fast ranking.

## Prerequisites
1. A Google Cloud Project
2. Access to Google Search Console
3. Ownership/verification of the website domain

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 2. Enable Indexing API
1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Indexing API"
3. Click **Enable**

### 3. Create Service Account
1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name it (e.g., "indexing-api-service")
4. Click **Create and Continue**
5. Skip role assignment (not needed)
6. Click **Done**

### 4. Generate Service Account Key
1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** format
5. Download the JSON file (keep it secure!)

### 5. Add Service Account to Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (website)
3. Go to **Settings** > **Users and permissions**
4. Click **Add user**
5. Enter the service account email (found in the JSON file as `client_email`)
6. Set permission to **Owner** or **Full** (required for Indexing API)
7. Click **Add**

### 6. Configure Environment Variables

#### Option A: Base64 Encoded (Recommended for Vercel/Production)
```bash
# Encode the service account JSON file
cat service-account.json | base64

# Add to your .env file
GOOGLE_SERVICE_ACCOUNT_KEY=<base64_encoded_json>
```

#### Option B: File Path (For Local Development)
```bash
# Add to your .env file
GOOGLE_SERVICE_ACCOUNT_PATH=./service-account.json

# Or use standard Google env var
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### 7. Test the API

#### Via API Endpoint
```bash
# Test connection
curl https://metzlercares.com/api/seo/test-indexing

# Submit a URL
curl -X POST https://metzlercares.com/api/seo/test-indexing \
  -H "Content-Type: application/json" \
  -d '{"url": "https://metzlercares.com/co/denver/sober-living"}'
```

#### Via Code
```typescript
import { googleIndexingAPI } from '$lib/utils/google-indexing-api-fixed'

// Test connection
const status = await googleIndexingAPI.testConnection()
console.log(status)

// Submit URL
const result = await googleIndexingAPI.submitUrl('https://metzlercares.com/co/denver/sober-living')
console.log(result)
```

## Verification

### Check API Status
Visit: `https://metzlercares.com/api/seo/test-indexing`

Expected response when configured:
```json
{
  "success": true,
  "connection": {
    "success": true,
    "message": "Google Indexing API is properly configured and authenticated"
  },
  "status": {
    "initialized": true,
    "configured": true
  }
}
```

### Check Search Console
1. Go to Google Search Console
2. Navigate to **URL Inspection**
3. Enter a URL you submitted
4. Click **Request Indexing** (if available)
5. Check indexing status

## Troubleshooting

### Error: "Google Indexing API not initialized"
- **Cause**: Service account credentials not found
- **Solution**: Set `GOOGLE_SERVICE_ACCOUNT_KEY` or `GOOGLE_SERVICE_ACCOUNT_PATH`

### Error: "UNAUTHORIZED" or "FORBIDDEN"
- **Cause**: Service account not added to Search Console or wrong permissions
- **Solution**: Add service account email to Search Console with Owner/Full permissions

### Error: "RATE_LIMIT_EXCEEDED"
- **Cause**: Exceeded 200 requests per 100 seconds limit
- **Solution**: Add delays between requests (already implemented in code)

### API Returns Success But URLs Not Indexed
- **Cause**: Indexing API only notifies Google; actual indexing depends on content quality
- **Solution**: Ensure content is high-quality, unique, and follows Google guidelines

## Rate Limits
- **200 requests per 100 seconds** per project
- The implementation includes automatic rate limiting with delays

## Best Practices
1. Only submit URLs that are publicly accessible
2. Submit URLs immediately after publishing/updating content
3. Don't submit the same URL repeatedly
4. Focus on high-priority pages (homepage, major city pages, new content)
5. Monitor API usage in Google Cloud Console

## Security Notes
- **Never commit** service account JSON files to git
- Use environment variables for credentials
- Rotate service account keys periodically
- Limit service account permissions to only what's needed

## Integration Points

The Google Indexing API is automatically called from:
- `src/lib/utils/colorado-seo-generator.ts` - When generating new city pages
- `src/routes/co/[city]/+page.server.ts` - When city pages are loaded
- `src/routes/api/seo/rapid-index/+server.ts` - Via rapid indexing endpoint
- `src/lib/utils/colorado-content-velocity.ts` - For high-velocity content

## Support
- [Google Indexing API Documentation](https://developers.google.com/search/apis/indexing-api/v3/using-api)
- [Service Account Setup](https://cloud.google.com/iam/docs/service-accounts)
- [Search Console Help](https://support.google.com/webmasters)
