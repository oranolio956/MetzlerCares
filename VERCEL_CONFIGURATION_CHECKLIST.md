# Vercel Configuration Checklist - URGENT FIXES NEEDED

## 🚨 CRITICAL ISSUES FOUND

### Placeholder Values That Must Be Replaced

#### 1. Stripe Configuration

**Current**: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder`
**Status**: ❌ PLACEHOLDER - NEEDS REAL KEY
**Action**:

1. Log into Stripe Dashboard
2. Go to Developers → API Keys
3. Copy your publishable key (starts with `pk_live_` for production)
4. Update in Vercel environment variables

#### 2. OpenAI Configuration

**Current**: `OPENAI_API_KEY=sk-placeholder`
**Status**: ❌ PLACEHOLDER - NEEDS REAL KEY
**Action**:

1. Sign up at OpenAI
2. Generate API key at platform.openai.com
3. Add billing information
4. Update in Vercel environment variables

#### 3. Keragon Webhook

**Current**: `KERAGON_WEBHOOK_URL=https://placeholder`
**Status**: ❌ PLACEHOLDER - NEEDS REAL URL
**Action**:

1. Set up Keragon account
2. Create webhook endpoint
3. Get webhook URL
4. Update in Vercel environment variables

#### 4. Google APIs (Missing Configuration)

**Current**: Missing from environment
**Status**: ❌ NOT CONFIGURED
**Action**:

1. Set up Google Cloud Console
2. Create service account for Indexing API
3. Enable Search Console API
4. Download service account JSON
5. Add to Vercel environment variables

### Missing Environment Variables to Add

```bash
# Google APIs
GOOGLE_INDEXING_API_KEY=your-service-account-key.json
GOOGLE_SEARCH_CONSOLE_API_KEY=your-api-key
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Production Environment
NODE_ENV=production
PUBLIC_SITE_URL=https://yourdomain.com
```

## 🔧 Vercel Dashboard Configuration Steps

### 1. Environment Variables Setup

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these production variables:

```bash
# Required for Production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-jwt-secret

# Replace with real values
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_real_key
OPENAI_API_KEY=sk-your-real-openai-key
KERAGON_WEBHOOK_URL=https://your-real-keragon-webhook.com
```

### 2. Build Configuration Verification

**Current vercel.json status**: ✅ PROPERLY CONFIGURED

- Build command: `npm run build`
- Output directory: `.svelte-kit/vercel/output`
- Framework: `sveltekit`
- Security headers: ✅ Properly configured
- API timeout: 10 seconds (appropriate)

### 3. Domain Configuration

**Action Required**:

1. Add custom domain in Vercel Dashboard → Settings → Domains
2. Configure DNS records:
   - A record: `76.76.19.61`
   - CNAME: `cname.vercel-dns.com`
3. Set up SSL certificates (automatic)

### 4. GitHub Integration

**Current status**: ✅ CONFIGURED

- Auto-deploy on main branch pushes
- Manual deployment trigger available
- Environment secrets properly referenced

## 🚨 Production Deployment Checklist

### Before Deploying

- [ ] Replace all placeholder API keys with real values
- [ ] Configure custom domain
- [ ] Set up Google Analytics
- [ ] Configure Sentry for error tracking
- [ ] Test insurance verification API
- [ ] Verify HIPAA compliance headers
- [ ] Check all environment variables

### After Deploying

- [ ] Test all API endpoints
- [ ] Verify insurance verification works
- [ ] Check page load speeds
- [ ] Test mobile responsiveness
- [ ] Verify schema markup
- [ ] Check Google Search Console
- [ ] Monitor for 404 errors

## 🔍 Critical Files to Verify

### Environment Configuration

- [ ] `.env` - All variables set correctly
- [ ] `.env.example` - Updated with required variables
- [ ] GitHub Actions secrets - All production secrets added

### API Routes

- [ ] Insurance verification API - Mock data vs real integration
- [ ] Analytics tracking - Data collection working
- [ ] Facility search - Database queries optimized

### Security Configuration

- [ ] CSP headers in svelte.config.js
- [ ] HIPAA compliance headers in hooks.server.ts
- [ ] Rate limiting configuration
- [ ] JWT secret strength

## 🚀 Immediate Action Required

1. **Replace Placeholder Keys** (Priority 1)

   - Stripe publishable key
   - OpenAI API key
   - Keragon webhook URL

2. **Configure Missing Services** (Priority 2)

   - Google Analytics
   - Sentry error tracking
   - Email/SMS configuration

3. **Domain Setup** (Priority 3)

   - Add custom domain
   - Configure DNS
   - Set up SSL

4. **Production Testing** (Priority 4)
   - Deploy to staging first
   - Test all functionality
   - Monitor performance

Your Vercel configuration is solid for the framework, but you have critical placeholder values that will break functionality in production. Fix these immediately before deploying.
