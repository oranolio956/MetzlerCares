# Metzler Cares - Simple Automated Deployment
param([string]$GitHubUsername = "oranolio956")

Write-Host "🚀 Metzler Cares - Automated Deployment Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Configuration
$GitHubRepo = "$GitHubUsername/metzler-cares"
$VercelToken = "lWyXyOmTgs4Mqi8CGJGzcXSC"
$SupabaseUrl = "https://tmbuvfmgjpfppqgeabho.supabase.co"
$SupabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYnV2Zm1nanBmcHBxZ2VhYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg2MjQsImV4cCI6MjA3ODQ0NDYyNH0.SUfAH1UNVwOA916bD7FbUvzX9n7clrnEPd4fB_7lPj0"
$JwtSecret = "MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only"
$ProdUrl = "https://metzlercares.com"
$VercelOrgId = "team_xU4Itm2lF0xkMwMPZdavwP2K"
$VercelProjectId = "prj_SuLsQJ5X2UnkSjqPLOPSHy8D0FlI"

Write-Host "✅ Configuration loaded" -ForegroundColor Green

# Test build first
Write-Host "🔨 Testing production build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green

# Test database connection
Write-Host "🗄️ Testing database connection..." -ForegroundColor Yellow
node scripts/test-database-connection.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database test failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database connection verified" -ForegroundColor Green

# Create local environment file
Write-Host "📝 Creating local environment file..." -ForegroundColor Yellow
$envContent = @"
# Metzler Cares - Production Environment
VITE_SUPABASE_URL=$SupabaseUrl
VITE_SUPABASE_ANON_KEY=$SupabaseAnonKey
SUPABASE_URL=$SupabaseUrl
SUPABASE_ANON_KEY=$SupabaseAnonKey
JWT_SECRET=$JwtSecret
"@
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ Local environment file created" -ForegroundColor Green

# Push to GitHub
Write-Host "🚀 Pushing code to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "🚀 Production deployment - Complete automated setup" 2>$null
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 DEPLOYMENT INITIATED!" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host "✅ Database verified" -ForegroundColor Green
Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 GitHub Actions will now:" -ForegroundColor Cyan
Write-Host "   1. Run automated tests" -ForegroundColor White
Write-Host "   2. Deploy to Vercel" -ForegroundColor White
Write-Host "   3. Make site live at $ProdUrl" -ForegroundColor White
Write-Host ""
Write-Host "📊 Monitor progress:" -ForegroundColor Yellow
Write-Host "   GitHub Actions: https://github.com/$GitHubRepo/actions" -ForegroundColor White
Write-Host "   Vercel Dashboard: Check your Vercel account" -ForegroundColor White
Write-Host ""
Write-Host "⏱️ Expected completion: 3-5 minutes" -ForegroundColor White
Write-Host ""
Write-Host "🏆 Metzler Cares is GOING LIVE! 🎉" -ForegroundColor Green
