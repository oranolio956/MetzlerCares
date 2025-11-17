# 🔑 Metzler Cares - Master Deployment Keys & Configuration

**Production URL:** https://metzlercares.com
**Last Updated:** November 17, 2025

## 🔐 AUTHENTICATION TOKENS

### Vercel
```
VERCEL_TOKEN=lWyXyOmTgs4Mqi8CGJGzcXSC
VERCEL_ORG_ID=team_xU4Itm2lF0xkMwMPZdavwP2K
VERCEL_PROJECT_ID=prj_SuLsQJ5X2UnkSjqPLOPSHy8D0FlI
```

### Supabase
```
Database URL: postgresql://postgres:TacoMetzler998!@db.tmbuvfmgjpfppqgeabho.supabase.co:5432/postgres
Project URL: https://tmbuvfmgjpfppqgeabho.supabase.co
API Keys: ✅ CONFIGURED
- VITE_SUPABASE_URL=https://tmbuvfmgjpfppqgeabho.supabase.co
- VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYnV2Zm1nanBmcHBxZ2VhYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg2MjQsImV4cCI6MjA3ODQ0NDYyNH0.SUfAH1UNVwOA916bD7FbUvzX9n7clrnEPd4fB_7lPj0
- SUPABASE_SERVICE_ROLE_KEY=[Available in dashboard if needed]
```

### JWT Security
```
JWT_SECRET=MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only
```

## 📋 GITHUB SECRETS (Repository → Settings → Secrets)

### Required Production Secrets
```
VITE_SUPABASE_URL=https://tmbuvfmgjpfppqgeabho.supabase.co
VITE_SUPABASE_ANON_KEY=[from Supabase API settings]
SUPABASE_URL=https://tmbuvfmgjpfppqgeabho.supabase.co
SUPABASE_ANON_KEY=[from Supabase API settings]
JWT_SECRET=MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only
VERCEL_TOKEN=lWyXyOmTgs4Mqi8CGJGzcXSC
VERCEL_ORG_ID=[get from Vercel dashboard]
VERCEL_PROJECT_ID=[get from Vercel dashboard]
PROD_URL=https://metzlercares.com
```

### Optional Services (Add when ready)
```
VITE_SANITY_PROJECT_ID=[sanity project id]
VITE_SANITY_DATASET=production
VITE_GA_MEASUREMENT_ID=[Google Analytics G-XXXXXXXXXX]
VITE_SENTRY_DSN=[Sentry DSN]
VITE_STRIPE_PUBLISHABLE_KEY=[Stripe publishable key]
OPENAI_API_KEY=[OpenAI API key]
KERAGON_WEBHOOK_URL=[webhook URL]
SLACK_WEBHOOK_URL=[Slack webhook]
```

## 🔗 VERCEL ENVIRONMENT VARIABLES

Add these in Vercel Dashboard → Project Settings → Environment Variables:

### Production Environment
```
VITE_SUPABASE_URL=https://tmbuvfmgjpfppqgeabho.supabase.co
VITE_SUPABASE_ANON_KEY=[anon key]
SUPABASE_URL=https://tmbuvfmgjpfppqgeabho.supabase.co
SUPABASE_ANON_KEY=[anon key]
JWT_SECRET=MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only
VITE_SANITY_PROJECT_ID=[optional]
VITE_SANITY_DATASET=production
VITE_GA_MEASUREMENT_ID=[optional]
VITE_SENTRY_DSN=[optional]
VITE_STRIPE_PUBLISHABLE_KEY=[optional]
```

## 🗄️ DATABASE INFORMATION

### Connection Details
- **Host:** db.tmbuvfmgjpfppqgeabho.supabase.co
- **Port:** 5432
- **Database:** postgres
- **Username:** postgres
- **Password:** TacoMetzler998!
- **SSL:** Required

### Tables to Verify (from supabase-schema.sql)
- [ ] profiles
- [ ] beneficiaries
- [ ] applications
- [ ] sober_living_partners
- [ ] scholarship_payments
- [ ] beneficiary_outcomes
- [ ] consents
- [ ] impact_stories
- [ ] local_resources
- [ ] audit_logs

### Row Level Security Policies
- [ ] Beneficiaries can only access their own data
- [ ] Staff can access assigned beneficiaries
- [ ] Partners can only access their facilities
- [ ] Audit logging enabled for all sensitive operations

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Add all GitHub secrets listed above
- [ ] Add all Vercel environment variables
- [ ] Verify database schema is deployed
- [ ] Test database connection
- [ ] Run build locally: `npm run build`
- [ ] Run tests: `npm run test`

### Deployment Steps
- [ ] Commit all changes: `git add . && git commit -m "Production deployment"`
- [ ] Push to main: `git push origin main`
- [ ] Monitor GitHub Actions for CI/CD
- [ ] Monitor Vercel deployment logs
- [ ] Verify production URL: https://metzlercares.com

### Post-Deployment Verification
- [ ] Site loads at https://metzlercares.com
- [ ] Authentication works
- [ ] Database connections functional
- [ ] All major features operational
- [ ] Run smoke tests: `npm run test:e2e -- --grep "smoke"`

## 🔧 DEVELOPMENT ENVIRONMENT

### Local Development
```bash
# Environment variables for .env.local
VITE_SUPABASE_URL=https://tmbuvfmgjpfppqgeabho.supabase.co
VITE_SUPABASE_ANON_KEY=[anon key]
SUPABASE_URL=https://tmbuvfmgjpfppqgeabho.supabase.co
SUPABASE_ANON_KEY=[anon key]
JWT_SECRET=MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only
```

### Staging Environment (if needed)
- Use separate Supabase project
- Different Vercel deployment target
- Separate environment variables

## 📞 SUPPORT CONTACTS

- **Deployment Issues:** Check GitHub Actions logs
- **Database Issues:** Check Supabase dashboard
- **Build Issues:** Check Vercel deployment logs
- **Application Issues:** Check browser console and server logs

## 🔒 SECURITY NOTES

- Never commit secrets to code
- Rotate JWT secret regularly
- Monitor Supabase access logs
- Keep dependencies updated
- Regular security audits

---

**Status:** Ready for deployment pending Supabase API key retrieval
