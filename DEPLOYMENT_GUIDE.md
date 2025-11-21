# MetzlerCares Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites
- GitHub account with repository access
- Vercel account (free tier available)
- Environment variables from `env.txt`

### Step 1: Deploy to Vercel

1. **Visit Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose `oranolio956/MetzlerCares`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **SvelteKit** (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.svelte-kit/vercel/output` (auto-configured)

### Step 2: Environment Variables

Add these environment variables in Vercel dashboard:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://tmbuvfmgjpfppqgeabho.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYnV2Zm1nanBmcHBxZ2VhYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg2MjQsImV4cCI6MjA3ODQ0NDYyNH0.SUfAH1UNVwOA916bD7FbUvzX9n7clrnEPd4fB_7lPj0

# Sanity Configuration
VITE_SANITY_PROJECT_ID=qxaj7c29
VITE_SANITY_DATASET=production

# Encryption Keys
VITE_ENCRYPTION_KEY=a71aa4233ba1b7018e74fae98d8e64c590988d0df40b6296511a8d3a7daa8485
ENCRYPTION_KEY=246f970ddfdd2e7f580d7a68d4d02686db7e382d92d84cf18523903536e8e7ce

# JWT Secret
JWT_SECRET=MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only

# Optional: Add when ready
VITE_SENTRY_DSN=https://your-dsn@o123456.ingest.sentry.io/7890123
GOOGLE_SEARCH_CONSOLE_API_KEY=your_api_key
GOOGLE_INDEXING_API_KEY=your_service_account_json
```

### Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete (2-3 minutes)
3. Visit your deployed URL

## 🔧 Configuration Details

### Vercel Configuration (`vercel.json`)
- ✅ Already configured for SvelteKit
- ✅ Security headers included
- ✅ API routes properly configured
- ✅ Build settings optimized

### SvelteKit Adapter (`svelte.config.js`)
- ✅ Vercel adapter configured
- ✅ Node.js 18.x runtime
- ✅ CSP headers for security
- ✅ Prerendering enabled

## 🌐 Custom Domain Setup

### Add Custom Domain
1. Go to Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `metzlercares.com`)
4. Follow DNS configuration instructions

### SSL Certificate
- ✅ Automatic SSL via Let's Encrypt
- ✅ HTTPS redirect enabled
- ✅ Security headers configured

## 📊 Monitoring & Analytics

### Built-in Monitoring
- ✅ Vercel Analytics (automatic)
- ✅ Performance monitoring
- ✅ Error tracking via Sentry (when configured)

### Custom Analytics
- Google Analytics (configure in components)
- Conversion tracking
- User behavior analytics

## 🔒 Security Configuration

### Environment Security
- ✅ Environment variables secured in Vercel
- ✅ No sensitive data in repository
- ✅ API keys properly scoped

### Application Security
- ✅ CSP headers configured
- ✅ HTTPS enforcement
- ✅ XSS protection
- ✅ CSRF protection

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Check build locally
   npm run build
   npm run preview
   ```

2. **Environment Variables Missing**
   - Verify all required vars are set in Vercel
   - Check variable names match exactly

3. **API Routes Not Working**
   - Ensure Supabase connection is configured
   - Check environment variables

4. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies are configured

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [SvelteKit Deployment](https://kit.svelte.dev/docs/adapters)
- [Supabase Integration](https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit)

## 🎯 Post-Deployment Checklist

### Immediate Actions
- [ ] Verify homepage loads correctly
- [ ] Test insurance verification flow
- [ ] Check mobile responsiveness
- [ ] Validate form submissions
- [ ] Test API endpoints

### SEO & Performance
- [ ] Submit sitemap to Google Search Console
- [ ] Configure Google Analytics
- [ ] Run Lighthouse audit
- [ ] Test Core Web Vitals
- [ ] Verify meta tags and structured data

### Monitoring Setup
- [ ] Configure Sentry error tracking
- [ ] Set up uptime monitoring
- [ ] Enable Vercel Analytics
- [ ] Configure conversion tracking

## 📈 Scaling Considerations

### Performance Optimization
- Image optimization (already configured)
- CDN distribution (automatic with Vercel)
- Database connection pooling
- API response caching

### Traffic Scaling
- Vercel Pro for higher limits
- Database scaling via Supabase
- CDN optimization
- Edge function deployment

---

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oranolio956/MetzlerCares)

**Repository**: `https://github.com/oranolio956/MetzlerCares`
**Live Demo**: Will be available after deployment

---

*For technical support, contact the development team or refer to the project documentation.*
