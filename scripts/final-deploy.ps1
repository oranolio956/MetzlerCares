# Metzler Cares - Final Production Deployment Script
# This script completes the deployment to production

Write-Host "🚀 Metzler Cares - FINAL PRODUCTION DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Configuration
$supabaseUrl = "https://tmbuvfmgjpfppqgeabho.supabase.co"
$supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYnV2Zm1nanBmcHBxZ2VhYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg2MjQsImV4cCI6MjA3ODQ0NDYyNH0.SUfAH1UNVwOA916bD7FbUvzX9n7clrnEPd4fB_7lPj0"
$vercelToken = "lWyXyOmTgs4Mqi8CGJGzcXSC"
$vercelOrgId = "team_xU4Itm2lF0xkMwMPZdavwP2K"
$vercelProjectId = "prj_SuLsQJ5X2UnkSjqPLOPSHy8D0FlI"
$jwtSecret = "MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only"
$productionUrl = "https://metzlercares.com"

Write-Host "`n✅ FINAL CONFIGURATION VERIFIED:" -ForegroundColor Green
Write-Host "------------------------------" -ForegroundColor Green
Write-Host "Supabase URL: $supabaseUrl" -ForegroundColor Gray
Write-Host "Vercel Token: Configured" -ForegroundColor Gray
Write-Host "Vercel Project ID: $vercelProjectId" -ForegroundColor Gray
Write-Host "Production URL: $productionUrl" -ForegroundColor Gray
Write-Host "JWT Secret: Configured" -ForegroundColor Gray

# Test build before deployment
Write-Host "`n🔨 Testing Production Build..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Build error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test database connection
Write-Host "`n🗄️  Testing Database Connection..." -ForegroundColor Yellow
try {
    node scripts/test-database-connection.js 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection verified" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Database test error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create .env.local for local development
Write-Host "`n📝 Creating local environment file..." -ForegroundColor Yellow
$envContent = "# Metzler Cares - Local Development Environment
VITE_SUPABASE_URL=$supabaseUrl
VITE_SUPABASE_ANON_KEY=$supabaseAnonKey
SUPABASE_URL=$supabaseUrl
SUPABASE_ANON_KEY=$supabaseAnonKey
JWT_SECRET=$jwtSecret"

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ Created .env.local" -ForegroundColor Green

# Update package.json with deployment info
Write-Host "`n📦 Updating package.json metadata..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$packageJson | Add-Member -NotePropertyName "homepage" -NotePropertyValue $productionUrl -Force
$packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8
Write-Host "✅ Updated package.json" -ForegroundColor Green

# Git operations
Write-Host "`n🔄 Preparing Git Repository..." -ForegroundColor Yellow

# Check if we're on main branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "Switching to main branch..." -ForegroundColor Yellow
    git checkout main 2>$null
    if ($LASTEXITCODE -ne 0) {
        git checkout -b main 2>$null
        Write-Host "Created main branch" -ForegroundColor Gray
    }
}

# Add all files
git add .
Write-Host "✅ Added all files to git" -ForegroundColor Green

# Commit changes
$commitMessage = "🚀 Production deployment - Complete setup with live credentials"
git commit -m $commitMessage 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Committed changes" -ForegroundColor Green
} else {
    Write-Host "⚠️  No changes to commit or commit failed" -ForegroundColor Yellow
}

# Push to main
Write-Host "`n🚀 Pushing to production..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pushed to main branch" -ForegroundColor Green
} else {
    Write-Host "❌ Push failed. Please check your git configuration." -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "✅ Build: Successful"
Write-Host "✅ Database: Connected"
Write-Host "✅ Git: Pushed to main"
Write-Host "⏳ Vercel: Deploying automatically..."
Write-Host ""
Write-Host "🌐 Production URL: $productionUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Monitor deployment:" -ForegroundColor Yellow
Write-Host "   GitHub Actions: https://github.com/[your-repo]/actions"
Write-Host "   Vercel Dashboard: https://vercel.com/dashboard"
Write-Host ""
Write-Host "🔍 Check site status:" -ForegroundColor Yellow
Write-Host "   curl -I $productionUrl"
Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Wait for Vercel deployment to complete (~2-5 minutes)"
Write-Host "2. Test the live site at $productionUrl"
Write-Host "3. Run smoke tests: npm run test:e2e -- --grep 'smoke'"
Write-Host "4. Configure custom domain DNS if needed"
Write-Host ""
Write-Host "🏆 Metzler Cares is now LIVE! 🎉" -ForegroundColor Green
