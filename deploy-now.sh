#!/bin/bash

# Metzler Cares - AUTOMATED DEPLOYMENT SCRIPT
# This script uses the provided tokens to set up everything automatically

set -e

echo "🚀 Metzler Cares - Automated Deployment Setup"
echo "============================================="

# Configuration
GITHUB_REPO="YOUR_GITHUB_USERNAME/metzler-cares"
VERCEL_TOKEN="lWyXyOmTgs4Mqi8CGJGzcXSC"
SUPABASE_URL="https://tmbuvfmgjpfppqgeabho.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYnV2Zm1nanBmcHBxZ2VhYmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4Njg2MjQsImV4cCI6MjA3ODQ0NDYyNH0.SUfAH1UNVwOA916bD7FbUvzX9n7clrnEPd4fB_7lPj0"
JWT_SECRET="MetzlerCares-JWT-Secret-2024-256bit-secure-random-generated-key-for-production-use-only"
PROD_URL="https://metzlercares.com"

echo "✅ Configuration loaded"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

echo "✅ CLI tools verified"

# Authenticate with Vercel
echo "🔐 Authenticating with Vercel..."
export VERCEL_TOKEN="$VERCEL_TOKEN"
vercel login --token "$VERCEL_TOKEN"

# Get Vercel project info
echo "📋 Getting Vercel project information..."
VERCEL_PROJECT_ID=$(vercel project ls | grep "metzler" | awk '{print $2}' || echo "")
VERCEL_ORG_ID=$(vercel teams ls | head -n 1 | awk '{print $2}' || echo "team_xU4Itm2lF0xkMwMPZdavwP2K")

if [ -z "$VERCEL_PROJECT_ID" ]; then
    echo "⚠️  Vercel project not found, will create it during deployment"
    VERCEL_PROJECT_ID="prj_SuLsQJ5X2UnkSjqPLOPSHy8D0FlI"
fi

echo "✅ Vercel authenticated"
echo "   Project ID: $VERCEL_PROJECT_ID"
echo "   Org ID: $VERCEL_ORG_ID"

# Authenticate with GitHub
echo "🔐 Authenticating with GitHub..."
gh auth login --with-token <<< "$GITHUB_TOKEN" 2>/dev/null || {
    echo "⚠️  GitHub token not provided. Please run:"
    echo "   gh auth login"
    echo "   Then run this script again"
    exit 1
}

# Create GitHub repository secrets
echo "🔑 Setting up GitHub repository secrets..."

gh secret set VITE_SUPABASE_URL --body "$SUPABASE_URL" --repo "$GITHUB_REPO"
gh secret set VITE_SUPABASE_ANON_KEY --body "$SUPABASE_ANON_KEY" --repo "$GITHUB_REPO"
gh secret set SUPABASE_URL --body "$SUPABASE_URL" --repo "$GITHUB_REPO"
gh secret set SUPABASE_ANON_KEY --body "$SUPABASE_ANON_KEY" --repo "$GITHUB_REPO"
gh secret set JWT_SECRET --body "$JWT_SECRET" --repo "$GITHUB_REPO"
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" --repo "$GITHUB_REPO"
gh secret set VERCEL_ORG_ID --body "$VERCEL_ORG_ID" --repo "$GITHUB_REPO"
gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID" --repo "$GITHUB_REPO"
gh secret set PROD_URL --body "$PROD_URL" --repo "$GITHUB_REPO"

echo "✅ GitHub secrets configured"

# Set up Vercel environment variables
echo "🔧 Setting up Vercel environment variables..."

vercel env add VITE_SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add VITE_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
vercel env add SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
vercel env add JWT_SECRET production <<< "$JWT_SECRET"

echo "✅ Vercel environment variables configured"

# Create local environment file
echo "📝 Creating local environment file..."
cat > .env.local << EOF
# Metzler Cares - Production Environment
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
JWT_SECRET=$JWT_SECRET
EOF

echo "✅ Local environment file created"

# Test build
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Test database connection
echo "🗄️  Testing database connection..."
node scripts/test-database-connection.js

if [ $? -eq 0 ]; then
    echo "✅ Database connection verified"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing code to GitHub..."
git add .
git commit -m "🚀 Production deployment - Complete automated setup" || echo "No changes to commit"
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub"
else
    echo "❌ Push failed. Please check your git configuration."
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo "✅ GitHub secrets configured"
echo "✅ Vercel environment variables set"
echo "✅ Database connection verified"
echo "✅ Build successful"
echo "✅ Code pushed to GitHub"
echo ""
echo "🚀 Automatic deployment will start now!"
echo ""
echo "📊 Monitor deployment:"
echo "   GitHub Actions: https://github.com/$GITHUB_REPO/actions"
echo "   Vercel Dashboard: Check your Vercel dashboard"
echo ""
echo "🌐 Live site: $PROD_URL"
echo ""
echo "⏱️  Deployment time: ~2-5 minutes"
echo ""
echo "🏆 Metzler Cares is going LIVE! 🎉"
