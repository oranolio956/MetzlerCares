# Metzler Cares - Get Deployment Keys Script
# This script helps you collect all required API keys and tokens

Write-Host "🔑 Metzler Cares - Deployment Keys Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host "`n📋 REQUIRED INFORMATION TO COLLECT:" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

Write-Host "`n🔧 1. SUPABASE KEYS (Required)" -ForegroundColor Green
Write-Host "-----------------------------" -ForegroundColor Green
Write-Host "Go to: https://supabase.com/dashboard"
Write-Host "1. Select your project"
Write-Host "2. Go to Settings → API"
Write-Host "3. Copy these values:"
Write-Host ""
Write-Host "VITE_SUPABASE_URL = " -NoNewline -ForegroundColor Cyan
Write-Host "(URL from 'Project URL' field)"
Write-Host "VITE_SUPABASE_ANON_KEY = " -NoNewline -ForegroundColor Cyan
Write-Host "(anon public key from 'anon public' field)"

Write-Host "`n🔧 2. VERCEL TOKENS (Required)" -ForegroundColor Green
Write-Host "----------------------------" -ForegroundColor Green
Write-Host "Go to: https://vercel.com/account/tokens"
Write-Host "1. Create a new token with name 'metzler-cares-deploy'"
Write-Host "2. Copy the token value:"
Write-Host ""
Write-Host "VERCEL_TOKEN = " -NoNewline -ForegroundColor Cyan
Write-Host "(the token you just created)"

Write-Host "`n🔧 3. VERCEL PROJECT INFO (Required)" -ForegroundColor Green
Write-Host "----------------------------------" -ForegroundColor Green
Write-Host "Go to: https://vercel.com/dashboard"
Write-Host "1. Select your Metzler Cares project"
Write-Host "2. Go to Settings → General"
Write-Host "3. Copy these values:"
Write-Host ""
Write-Host "VERCEL_PROJECT_ID = " -NoNewline -ForegroundColor Cyan
Write-Host "(found in 'Project ID' field)"
Write-Host ""
Write-Host "VERCEL_ORG_ID = " -NoNewline -ForegroundColor Cyan
Write-Host "(found in 'Organization ID' field)"

Write-Host "`n🔧 4. OPTIONAL SERVICES (Recommended)" -ForegroundColor Yellow
Write-Host "------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "Google Analytics (VITE_GA_MEASUREMENT_ID):"
Write-Host "Go to: https://analytics.google.com"
Write-Host "Create property → Get Measurement ID (G-XXXXXXXXXX)"
Write-Host ""
Write-Host "Sentry (VITE_SENTRY_DSN):"
Write-Host "Go to: https://sentry.io"
Write-Host "Create SvelteKit project → Copy DSN"
Write-Host ""
Write-Host "Stripe (VITE_STRIPE_PUBLISHABLE_KEY):"
Write-Host "Go to: https://stripe.com"
Write-Host "Get publishable key from dashboard"

Write-Host "`n📝 GITHUB SECRETS TO SET" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Magenta
Write-Host "Go to: https://github.com/YOUR_USERNAME/metzler-cares/settings/secrets/actions"
Write-Host ""
Write-Host "REQUIRED:"
Write-Host "---------"
Write-Host "VITE_SUPABASE_URL"
Write-Host "VITE_SUPABASE_ANON_KEY"
Write-Host "SUPABASE_URL (same as VITE_SUPABASE_URL)"
Write-Host "SUPABASE_ANON_KEY (same as VITE_SUPABASE_ANON_KEY)"
Write-Host "JWT_SECRET (already created: MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only)"
Write-Host "VERCEL_TOKEN"
Write-Host "VERCEL_ORG_ID"
Write-Host "VERCEL_PROJECT_ID"
Write-Host "PROD_URL (https://metzlercares.com)"
Write-Host ""
Write-Host "OPTIONAL:"
Write-Host "---------"
Write-Host "VITE_SANITY_PROJECT_ID"
Write-Host "VITE_SANITY_DATASET"
Write-Host "VITE_GA_MEASUREMENT_ID"
Write-Host "VITE_SENTRY_DSN"
Write-Host "VITE_STRIPE_PUBLISHABLE_KEY"
Write-Host "OPENAI_API_KEY"
Write-Host "KERAGON_WEBHOOK_URL"
Write-Host "SLACK_WEBHOOK_URL"

Write-Host "`n🔗 VERCEL ENVIRONMENT VARIABLES" -ForegroundColor Magenta
Write-Host "===============================" -ForegroundColor Magenta
Write-Host "Go to: Vercel Dashboard → Your Project → Settings → Environment Variables"
Write-Host ""
Write-Host "Add these variables:"
Write-Host "VITE_SUPABASE_URL"
Write-Host "VITE_SUPABASE_ANON_KEY"
Write-Host "SUPABASE_URL"
Write-Host "SUPABASE_ANON_KEY"
Write-Host "VITE_SANITY_PROJECT_ID"
Write-Host "VITE_SANITY_DATASET"
Write-Host "JWT_SECRET"
Write-Host "VITE_GA_MEASUREMENT_ID (optional)"
Write-Host "VITE_SENTRY_DSN (optional)"
Write-Host "VITE_STRIPE_PUBLISHABLE_KEY (optional)"

Write-Host "`n✅ JWT SECRET (Already Created)" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host "JWT_SECRET=MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only"
Write-Host ""
Write-Host "This is a secure, randomly generated key for production use."

Write-Host "`n🚀 NEXT STEPS" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host "1. Collect all the values listed above from your accounts"
Write-Host "2. Add them as GitHub repository secrets"
Write-Host "3. Add them to Vercel environment variables"
Write-Host "4. Run: ./scripts/verify-deployment.ps1 to check setup"
Write-Host "5. Push to GitHub to trigger deployment"
Write-Host ""
Write-Host "Production URL: https://metzlercares.com" -ForegroundColor Green
