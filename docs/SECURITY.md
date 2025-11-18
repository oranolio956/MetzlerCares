# Security Configuration Guide

## Environment Variables Security

This document outlines the security configuration for Metzler Foundations application.

### Critical Security Requirements

1. **Never commit actual secrets to version control**
   - The `.env` file is already in `.gitignore`
   - Always use `.env.example` as a template
   - Use environment-specific configuration in production

2. **Required Environment Variables**
   
   #### Supabase (Required)
   ```bash
   VITE_SUPABASE_URL=https://your_project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   
   #### Security (Required for production)
   ```bash
   JWT_SECRET=your_32+_character_secure_random_string
   VITE_ENCRYPTION_KEY=your_32_character_encryption_key
   ```
   
   #### Analytics (Recommended)
   ```bash
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io
   ```

3. **Generating Secure Keys**
   
   For JWT_SECRET (minimum 32 characters):
   ```bash
   openssl rand -base64 32
   ```
   
   For VITE_ENCRYPTION_KEY (exactly 32 characters):
   ```bash
   openssl rand -hex 16
   ```

### Production Deployment

1. **Vercel Environment Variables**
   - Add all required variables in Vercel dashboard
   - Use production-specific values
   - Enable encryption at rest

2. **Supabase Security**
   - Enable Row Level Security (RLS) on all tables
   - Configure proper authentication policies
   - Regular security audits

3. **HIPAA Compliance**
   - All PHI data must be encrypted
   - Use VITE_ENCRYPTION_KEY for client-side encryption
   - Implement audit logging for data access

### Development Setup

1. Copy `.env.example` to `.env`
2. Fill in your development values
3. Never use production keys in development
4. Use separate Supabase project for development

### Security Checklist

- [ ] .env file is in .gitignore
- [ ] No hardcoded secrets in code
- [ ] All API keys are rotated regularly
- [ ] Production environment variables are encrypted
- [ ] Access logs are monitored
- [ ] Regular security audits performed
- [ ] HIPAA compliance measures implemented
- [ ] Rate limiting configured
- [ ] CSRF protection enabled
- [ ] Content Security Policy (CSP) configured

### Incident Response

If secrets are exposed:
1. Immediately rotate all affected keys
2. Review access logs for unauthorized usage
3. Update all deployments with new keys
4. Document incident and improvements

### Support

For security-related questions or incident reporting, contact the security team through appropriate channels.