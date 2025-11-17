# 🚀 Metzler Foundations - Complete Deployment Guide

## Prerequisites Checklist

- [ ] GitHub Account with repository access
- [ ] Vercel Account (free tier works)
- [ ] Supabase Account (free tier works)
- [ ] Domain: metzlercares.com (production URL)

---

## 1. GitHub Repository Setup

### Create Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New repository"
3. Repository name: `metzler-foundations`
4. Make it **private** for security
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"

### Add Repository Secrets
Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:

#### Required Secrets:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SANITY_PROJECT_ID=your_sanity_project_id
VITE_SANITY_DATASET=production
JWT_SECRET=your_super_secure_jwt_secret_32_chars_min
```

#### Optional Secrets:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
OPENAI_API_KEY=sk-...
KERAGON_WEBHOOK_URL=https://your-webhook-url
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

#### Vercel Secrets:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
PROD_URL=https://metzlercares.com
```

#### Staging Secrets (for staging deployments):
```
STAGING_VITE_SUPABASE_URL=https://staging-project-id.supabase.co
STAGING_VITE_SUPABASE_ANON_KEY=staging_supabase_anon_key
```

---

## 2. Supabase Database Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New project"
3. Project name: `metzler-foundations`
4. Database password: Choose a strong password
5. Region: Choose closest to your users (e.g., West US)

### Database Schema
1. Wait for project creation (5-10 minutes)
2. Go to SQL Editor in Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script

### API Keys
1. Go to Settings → API in Supabase dashboard
2. Copy `Project URL` and `anon public` key
3. Add these to GitHub secrets as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Row Level Security
1. Go to Authentication → Policies in Supabase dashboard
2. The SQL schema includes RLS policies - verify they're active
3. Test RLS by going to Table Editor and checking permissions

---

## 3. Vercel Deployment Setup

### Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account

### Import Project
1. Click "Import Project" in Vercel dashboard
2. Import from GitHub: `your-username/metzler-foundations`
3. Configure project:
   - **Framework Preset**: SvelteKit
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.svelte-kit/vercel/output`
   - **Install Command**: `npm ci`

### Environment Variables
In Vercel project settings → Environment Variables, add:

#### Production Variables:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SANITY_PROJECT_ID=your_sanity_project_id
VITE_SANITY_DATASET=production
JWT_SECRET=your_super_secure_jwt_secret
```

#### Optional Variables:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
OPENAI_API_KEY=sk-...
KERAGON_WEBHOOK_URL=https://your-webhook-url
```

### Custom Domain
1. Go to Project Settings → Domains
2. Add `metzlerfoundations.org`
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## 4. Push Code and Deploy

### Local Setup
```bash
# Clone if not already done
git clone https://github.com/your-username/metzler-foundations.git
cd metzler-foundations

# Install dependencies
npm install

# Copy environment template
cp .env.template .env.local
# Edit .env.local with your values

# Test locally
npm run dev
```

### Deploy
```bash
# Add files and commit
git add .
git commit -m "Initial deployment setup"

# Push to GitHub (triggers automatic deployment)
git push origin main
```

---

## 5. Post-Deployment Verification

### Check Deployment Status
1. **Vercel Dashboard**: Check deployment logs and status
2. **GitHub Actions**: Check CI/CD pipeline status
3. **Domain**: Visit https://metzlerfoundations.org

### Run Tests
```bash
# Run smoke tests
npm run test:e2e -- --grep "smoke"
```

### Database Verification
1. **Supabase Dashboard**: Check if tables were created
2. **RLS Policies**: Test data access permissions
3. **API Keys**: Verify authentication works

### Security Checklist
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Security headers applied (check `vercel.json`)
- [ ] Environment variables not exposed in client
- [ ] RLS policies active
- [ ] Authentication working

---

## 6. Optional Services Setup

### Google Analytics 4
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create property for `metzlerfoundations.org`
3. Get Measurement ID (G-XXXXXXXXXX)
4. Add to environment variables

### Sentry Error Tracking
1. Go to [sentry.io](https://sentry.io)
2. Create SvelteKit project
3. Get DSN and add to environment variables

### Stripe Payments
1. Go to [stripe.com](https://stripe.com)
2. Create account and verify business
3. Get publishable key and add to environment variables

### Sanity CMS (Optional)
1. Go to [sanity.io](https://sanity.io)
2. Create project
3. Get project ID and dataset name
4. Add to environment variables

---

## 7. Troubleshooting

### Common Issues

**Build Fails:**
- Check environment variables are set correctly
- Verify Supabase project is active
- Check Vercel build logs

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check RLS policies aren't blocking access
- Test connection from Supabase dashboard

**Authentication Issues:**
- Verify JWT secret is set
- Check Supabase auth settings
- Test login flow

### Support
- **Vercel**: Check deployment logs in dashboard
- **Supabase**: Check database logs and metrics
- **GitHub**: Check Actions tab for CI/CD status

---

## 8. Maintenance

### Regular Tasks
- Monitor error rates in Sentry
- Check database performance in Supabase
- Review analytics in Google Analytics
- Update dependencies monthly

### Backups
- Supabase handles automatic backups
- Export important data regularly
- Test restore procedures

### Security Updates
- Keep dependencies updated
- Monitor security advisories
- Regular security audits

---

## Environment Variables Summary

### GitHub Secrets (Repository → Settings → Secrets)
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SANITY_PROJECT_ID
VITE_SANITY_DATASET
VITE_GA_MEASUREMENT_ID
VITE_SENTRY_DSN
VITE_STRIPE_PUBLISHABLE_KEY
JWT_SECRET
OPENAI_API_KEY
KERAGON_WEBHOOK_URL
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
PROD_URL
SLACK_WEBHOOK_URL
STAGING_VITE_SUPABASE_URL
STAGING_VITE_SUPABASE_ANON_KEY
```

### Vercel Environment Variables (Project Settings)
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
VITE_SANITY_PROJECT_ID
VITE_SANITY_DATASET
JWT_SECRET
VITE_GA_MEASUREMENT_ID
VITE_SENTRY_DSN
VITE_STRIPE_PUBLISHABLE_KEY
OPENAI_API_KEY
KERAGON_WEBHOOK_URL
```

---

🎉 **Congratulations!** Your Metzler Foundations platform is now deployed and ready to help Colorado communities recover from addiction.
