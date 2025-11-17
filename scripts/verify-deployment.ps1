# Metzler Foundations - Deployment Verification Script

Write-Host "🔍 Metzler Foundations - Deployment Verification" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$checksPassed = 0
$totalChecks = 0

function Test-Check {
    param(
        [string]$Name,
        [scriptblock]$Test,
        [string]$Description
    )

    $script:totalChecks++
    Write-Host "`n$Name" -ForegroundColor Yellow
    Write-Host "$Description" -ForegroundColor Gray

    try {
        $result = & $Test
        if ($result) {
            Write-Host "✅ PASSED" -ForegroundColor Green
            $script:checksPassed++
        } else {
            Write-Host "❌ FAILED" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Check 1: Environment Variables
Test-Check "Environment Variables" {
    $requiredVars = @('VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY')
    $missing = @()

    foreach ($var in $requiredVars) {
        if (-not [Environment]::GetEnvironmentVariable($var)) {
            $missing += $var
        }
    }

    if ($missing.Count -eq 0) {
        return $true
    } else {
        Write-Host "Missing: $($missing -join ', ')" -ForegroundColor Red
        return $false
    }
} "Checking for required environment variables"

# Check 2: Node.js and npm
Test-Check "Node.js Setup" {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Node.js: $nodeVersion" -ForegroundColor Gray
        Write-Host "npm: $npmVersion" -ForegroundColor Gray
        return $true
    }
    return $false
} "Verifying Node.js and npm installation"

# Check 3: Dependencies
Test-Check "Dependencies" {
    if (Test-Path "package.json") {
        Write-Host "package.json found" -ForegroundColor Gray
        return $true
    }
    return $false
} "Checking if package.json exists"

# Check 4: Build Configuration
Test-Check "Build Configuration" {
    $configFiles = @('vite.config.ts', 'svelte.config.js', 'vercel.json')

    foreach ($file in $configFiles) {
        if (-not (Test-Path $file)) {
            Write-Host "Missing: $file" -ForegroundColor Red
            return $false
        }
    }

    Write-Host "All config files present" -ForegroundColor Gray
    return $true
} "Verifying build configuration files"

# Check 5: Git Repository
Test-Check "Git Repository" {
    $gitStatus = git status 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git repository initialized" -ForegroundColor Gray
        return $true
    }
    return $false
} "Checking if Git repository is initialized"

# Check 6: Supabase Connection
Test-Check "Supabase Connection" {
    $supabaseUrl = [Environment]::GetEnvironmentVariable('VITE_SUPABASE_URL')
    if ($supabaseUrl -and $supabaseUrl -match '^https://.+\.supabase\.co$') {
        Write-Host "Valid Supabase URL format" -ForegroundColor Gray
        return $true
    } else {
        Write-Host "Invalid Supabase URL" -ForegroundColor Red
        return $false
    }
} "Verifying Supabase URL format"

# Check 7: Vercel Configuration
Test-Check "Vercel Configuration" {
    if (Test-Path "vercel.json") {
        $vercelConfig = Get-Content "vercel.json" -Raw | ConvertFrom-Json
        if ($vercelConfig.framework -eq "sveltekit") {
            Write-Host "Vercel config looks good" -ForegroundColor Gray
            return $true
        }
    }
    return $false
} "Checking Vercel configuration"

# Check 8: GitHub Actions
Test-Check "GitHub Actions" {
    $workflowFiles = @('.github/workflows/ci.yml', '.github/workflows/deploy.yml')
    foreach ($file in $workflowFiles) {
        if (-not (Test-Path $file)) {
            Write-Host "Missing: $file" -ForegroundColor Red
            return $false
        }
    }
    Write-Host "GitHub Actions workflows present" -ForegroundColor Gray
    return $true
} "Verifying GitHub Actions configuration"

# Summary
Write-Host "`n📊 Verification Summary" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Passed: $checksPassed / $totalChecks" -ForegroundColor $(if ($checksPassed -eq $totalChecks) { "Green" } else { "Yellow" })

if ($checksPassed -eq $totalChecks) {
    Write-Host "`n🎉 All checks passed! Ready for deployment." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some checks failed. Please address the issues above." -ForegroundColor Yellow
}

# Next steps
Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Set up your GitHub repository and add secrets"
Write-Host "2. Configure Supabase database"
Write-Host "3. Set up Vercel deployment"
Write-Host "4. Push code and deploy"
Write-Host "5. Run: ./scripts/setup-deployment.ps1 for detailed instructions"
