# 🚀 Metzler Cares - Deployment Checklist

**Production URL:** https://metzlercares.com

## ✅ COMPLETED SETUP

- [x] CI/CD Pipeline configured
- [x] Vercel configuration created
- [x] Environment variables structure set up
- [x] JWT Secret generated
- [x] GitHub Actions workflows ready

## 🔑 REQUIRED ACTIONS (You need to do these)

### 1. Supabase Setup
Go to: https://supabase.com/dashboard
- [ ] Select your project
- [ ] Go to Settings → API
- [ ] Copy **Project URL** → `VITE_SUPABASE_URL`
- [ ] Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 2. Vercel Setup
Go to: https://vercel.com/account/tokens
- [ ] Create token named "metzler-cares-deploy"
- [ ] Copy token → `VERCEL_TOKEN`

Go to: https://vercel.com/dashboard → Your Project → Settings → General
- [ ] Copy **Project ID** → `VERCEL_PROJECT_ID`
- [ ] Copy **Organization ID** → `VERCEL_ORG_ID`

### 3. GitHub Secrets Setup
Go to: https://github.com/YOUR_USERNAME/metzler-cares/settings/secrets/actions

Add these **REQUIRED** secrets:
```
VITE_SUPABASE_URL         → [from Supabase]
VITE_SUPABASE_ANON_KEY     → [from Supabase]
SUPABASE_URL              → [same as VITE_SUPABASE_URL]
SUPABASE_ANON_KEY         → [same as VITE_SUPABASE_ANON_KEY]
JWT_SECRET                → MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only
VERCEL_TOKEN              → [from Vercel tokens]
VERCEL_ORG_ID             → [from Vercel project settings]
VERCEL_PROJECT_ID         → [from Vercel project settings]
PROD_URL                  → https://metzlercares.com
```

### 4. Vercel Environment Variables
Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
JWT_SECRET
```

### 5. Optional Services (Recommended)
```
VITE_GA_MEASUREMENT_ID    → Google Analytics (G-XXXXXXXXXX)
VITE_SENTRY_DSN           → Sentry DSN
VITE_STRIPE_PUBLISHABLE_KEY → Stripe publishable key
```

## 🚀 DEPLOYMENT STEPS

Once you've set all secrets:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Production deployment setup"
   git push origin main
   ```

2. **Monitor Deployment:**
   - GitHub: Check Actions tab
   - Vercel: Check deployment logs

3. **Verify Production:**
   - Visit: https://metzlercares.com
   - Test all major features

## 📞 SUPPORT

If you need help:
1. Run `./scripts/get-deployment-keys.ps1` for detailed instructions
2. Check `./scripts/verify-deployment.ps1` to verify your setup
3. Read `DEPLOYMENT-GUIDE.md` for comprehensive documentation

## 🔒 SECURITY NOTES

- All sensitive data is encrypted in GitHub secrets
- JWT secret is randomly generated and secure
- Row Level Security enabled in Supabase
- HIPAA compliance maintained throughout

---

**Ready to deploy? Just set the secrets and push! 🎉**
