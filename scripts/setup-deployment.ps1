# Metzler Foundations - Deployment Setup Script
# This script helps configure the complete CI/CD pipeline

Write-Host "🚀 Metzler Foundations - Deployment Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`n📋 Checking Prerequisites..." -ForegroundColor Yellow

# Check Node.js
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js not found. Please install Node.js 20.x" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = npm --version
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green

# Check Git
$gitVersion = git --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git not found. Please install Git" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git: $gitVersion" -ForegroundColor Green

Write-Host "`n🔧 Step 1: GitHub Repository Setup" -ForegroundColor Yellow
Write-Host "1. Create a new repository on GitHub called 'metzler-foundations'"
Write-Host "2. Add these secrets to your GitHub repository:"
Write-Host "   - VITE_SUPABASE_URL"
Write-Host "   - VITE_SUPABASE_ANON_KEY"
Write-Host "   - VITE_SANITY_PROJECT_ID"
Write-Host "   - VITE_SANITY_DATASET"
Write-Host "   - VITE_GA_MEASUREMENT_ID"
Write-Host "   - VITE_SENTRY_DSN"
Write-Host "   - VITE_STRIPE_PUBLISHABLE_KEY"
Write-Host "   - VERCEL_TOKEN"
Write-Host "   - VERCEL_ORG_ID"
Write-Host "   - VERCEL_PROJECT_ID"
Write-Host "   - PROD_URL"
Write-Host "   - STAGING_VITE_SUPABASE_URL"
Write-Host "   - STAGING_VITE_SUPABASE_ANON_KEY"
Write-Host "   - SLACK_WEBHOOK_URL"

Write-Host "`n🔧 Step 2: Vercel Setup" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com and sign up/login"
Write-Host "2. Import your GitHub repository"
Write-Host "3. Configure build settings:"
Write-Host "   - Build Command: npm run build"
Write-Host "   - Output Directory: .svelte-kit/vercel/output"
Write-Host "   - Install Command: npm ci"
Write-Host "4. Add environment variables in Vercel dashboard"
Write-Host "5. Configure domain: metzlerfoundations.org"

Write-Host "`n🔧 Step 3: Supabase Setup" -ForegroundColor Yellow
Write-Host "1. Go to https://supabase.com and create a new project"
Write-Host "2. Run the SQL schema: supabase-schema.sql"
Write-Host "3. Enable Row Level Security and apply RLS policies"
Write-Host "4. Create API keys and add to GitHub secrets"
Write-Host "5. Set up authentication providers"

Write-Host "`n🔧 Step 4: Deploy Database Schema" -ForegroundColor Yellow
Write-Host "Run these commands to set up your database:"

# Check if we're in the right directory
if (Test-Path "supabase-schema.sql") {
    Write-Host "✅ Database schema file found" -ForegroundColor Green
} else {
    Write-Host "❌ Database schema file not found" -ForegroundColor Red
}

Write-Host "`n🔧 Step 5: Push to GitHub and Deploy" -ForegroundColor Yellow
Write-Host "1. Initialize git repository (if not already done):"
Write-Host "   git init"
Write-Host "   git add ."
Write-Host "   git commit -m 'Initial commit'"

Write-Host "`n2. Add GitHub remote:"
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/metzler-foundations.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"

Write-Host "`n3. Vercel will automatically deploy on push to main branch"

Write-Host "`n🔧 Step 6: Verify Deployment" -ForegroundColor Yellow
Write-Host "1. Check Vercel dashboard for deployment status"
Write-Host "2. Test the application at your domain"
Write-Host "3. Run smoke tests: npm run test:e2e -- --grep 'smoke'"

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "Your CI/CD pipeline is now configured."
Write-Host "Pushes to main will automatically deploy to production."
Write-Host "Pull requests will trigger automated testing."

# Create environment template
Write-Host "`n📝 Creating environment template..." -ForegroundColor Yellow
$envTemplate = @"
# Metzler Foundations - Environment Variables Template
# Copy this to .env.local for local development

# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Sanity CMS (Optional)
VITE_SANITY_PROJECT_ID=your_sanity_project_id
VITE_SANITY_DATASET=production

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Tracking (Optional)
VITE_SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id

# Payments (Optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# AI Features (Optional)
OPENAI_API_KEY=sk-your_openai_key

# Security (Required for production)
JWT_SECRET=your_super_secure_jwt_secret_here

# Webhooks (Optional)
KERAGON_WEBHOOK_URL=https://your_webhook_url
"@

$envTemplate | Out-File -FilePath ".env.template" -Encoding UTF8
Write-Host "✅ Created .env.template file" -ForegroundColor Green

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Set up your GitHub repository"
Write-Host "2. Configure Vercel deployment"
Write-Host "3. Set up Supabase database"
Write-Host "4. Add all environment variables"
Write-Host "5. Push code and test deployment"
Write-Host "6. Configure custom domain"
