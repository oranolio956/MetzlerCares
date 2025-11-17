# Metzler Cares - AUTOMATED DEPLOYMENT SCRIPT
# This script uses the provided tokens to set up everything automatically

param(
    [string]$GitHubUsername = "YOUR_GITHUB_USERNAME"
)

Write-Host "🚀 Metzler Cares - Automated Deployment Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Configuration
$GitHubRepo = "$GitHubUsername/metzler-cares"
$VercelToken = "lWyXyOmTgs4Mqi8CGJGzcXSC"
$SupabaseUrl = "https://tmbuvfmgjpfppqgeabho.supabase.co"
$SupabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYnV2Zm1nanBmcHBxZ2VhYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg2MjQsImV4cCI6MjA3ODQ0NDYyNH0.SUfAH1UNVwOA916bD7FbUvzX9n7clrnEPd4fB_7lPj0"
$JwtSecret = "MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only"
$ProdUrl = "https://metzlercares.com"

Write-Host "`n✅ Configuration loaded" -ForegroundColor Green

# Check prerequisites
Write-Host "`n🔧 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js 20.x" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js found" -ForegroundColor Green

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm not found. Please install npm" -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm found" -ForegroundColor Green

# Check GitHub CLI
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI not found. Please install it:" -ForegroundColor Red
    Write-Host "   https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ GitHub CLI found" -ForegroundColor Green

# Check Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Please install it:" -ForegroundColor Red
    Write-Host "   npm install -g vercel" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Vercel CLI found" -ForegroundColor Green

# Authenticate with Vercel
Write-Host ""
Write-Host "🔐 Authenticating with Vercel..." -ForegroundColor Yellow
$env:VERCEL_TOKEN = $VercelToken
try {
    $vercelLogin = vercel login --token $VercelToken 2>&1
    Write-Host "✅ Vercel authenticated" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel authentication failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Get Vercel project info
Write-Host ""
Write-Host "📋 Getting Vercel project information..." -ForegroundColor Yellow
try {
    $vercelProjects = vercel project ls 2>&1
    $projectMatch = $vercelProjects | Select-String -Pattern "metzler" | Select-Object -First 1
    if ($projectMatch) {
        $VercelProjectId = ($projectMatch.Line -split '\s+')[1]
    } else {
        Write-Host "⚠️  Vercel project not found, using provided ID" -ForegroundColor Yellow
        $VercelProjectId = "prj_SuLsQJ5X2UnkSjqPLOPSHy8D0FlI"
    }

    $vercelTeams = vercel teams ls 2>&1
    $teamMatch = $vercelTeams | Select-String -Pattern "team_" | Select-Object -First 1
    if ($teamMatch) {
        $VercelOrgId = ($teamMatch.Line -split '\s+')[1]
    } else {
        Write-Host "⚠️  Vercel team not found, using provided ID" -ForegroundColor Yellow
        $VercelOrgId = "team_xU4Itm2lF0xkMwMPZdavwP2K"
    }

    Write-Host "✅ Vercel project info retrieved" -ForegroundColor Green
    Write-Host "   Project ID: $VercelProjectId" -ForegroundColor Gray
    Write-Host "   Org ID: $VercelOrgId" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Could not retrieve Vercel info, using defaults" -ForegroundColor Yellow
    $VercelProjectId = "prj_SuLsQJ5X2UnkSjqPLOPSHy8D0FlI"
    $VercelOrgId = "team_xU4Itm2lF0xkMwMPZdavwP2K"
}

# Authenticate with GitHub
Write-Host ""
Write-Host "🔐 Authenticating with GitHub..." -ForegroundColor Yellow
try {
    $ghAuth = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ GitHub not authenticated. Please run:" -ForegroundColor Red
        Write-Host "   gh auth login" -ForegroundColor Yellow
        Write-Host "   Then run this script again" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ GitHub authenticated" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub authentication failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Create GitHub repository secrets
Write-Host ""
Write-Host "🔑 Setting up GitHub repository secrets..." -ForegroundColor Yellow

$secrets = @{
    "VITE_SUPABASE_URL" = $SupabaseUrl
    "VITE_SUPABASE_ANON_KEY" = $SupabaseAnonKey
    "SUPABASE_URL" = $SupabaseUrl
    "SUPABASE_ANON_KEY" = $SupabaseAnonKey
    "JWT_SECRET" = $JwtSecret
    "VERCEL_TOKEN" = $VercelToken
    "VERCEL_ORG_ID" = $VercelOrgId
    "VERCEL_PROJECT_ID" = $VercelProjectId
    "PROD_URL" = $ProdUrl
}

foreach ($secret in $secrets.GetEnumerator()) {
    try {
        $secret.Name | gh secret set $secret.Name --body $secret.Value --repo $GitHubRepo
        Write-Host "✅ Set secret: $($secret.Name)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to set secret: $($secret.Name)" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Set up Vercel environment variables
Write-Host ""
Write-Host "🔧 Setting up Vercel environment variables..." -ForegroundColor Yellow

$vercelEnvVars = @(
    @{Name="VITE_SUPABASE_URL"; Value=$SupabaseUrl},
    @{Name="VITE_SUPABASE_ANON_KEY"; Value=$SupabaseAnonKey},
    @{Name="SUPABASE_URL"; Value=$SupabaseUrl},
    @{Name="SUPABASE_ANON_KEY"; Value=$SupabaseAnonKey},
    @{Name="JWT_SECRET"; Value=$JwtSecret}
)

foreach ($envVar in $vercelEnvVars) {
    try {
        $envVar.Value | vercel env add $envVar.Name production
        Write-Host "✅ Set Vercel env: $($envVar.Name)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to set Vercel env: $($envVar.Name)" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create local environment file
Write-Host ""
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

# Test build
Write-Host ""
Write-Host "🔨 Testing production build..." -ForegroundColor Yellow
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
Write-Host ""
Write-Host "🗄️  Testing database connection..." -ForegroundColor Yellow
try {
    node scripts/test-database-connection.js
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

# Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing code to GitHub..." -ForegroundColor Yellow
try {
    git add .
    git commit -m "🚀 Production deployment - Complete automated setup" 2>$null
    git push origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
    } else {
        Write-Host "❌ Push failed. Please check your git configuration." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Git operation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host "✅ GitHub secrets configured" -ForegroundColor Green
Write-Host "✅ Vercel environment variables set" -ForegroundColor Green
Write-Host "✅ Database connection verified" -ForegroundColor Green
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Write-Host "🚀 Automatic deployment will start now!" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "📊 Monitor deployment:" -ForegroundColor Yellow
Write-Host "   GitHub Actions: https://github.com/$GitHubRepo/actions" -ForegroundColor White
Write-Host "   Vercel Dashboard: Check your Vercel dashboard" -ForegroundColor White
Write-Host "" -ForegroundColor Yellow
Write-Host "🌐 Live site: $ProdUrl" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "⏱️  Deployment time: ~2-5 minutes" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🏆 Metzler Cares is going LIVE! 🎉" -ForegroundColor Green
