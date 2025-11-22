# Deployment Guide

## Overview

Metzler Foundations uses a modern CI/CD pipeline with automated testing, security scanning, and deployment to multiple environments.

## Environments

### Development Environment

- **Purpose**: Local development and testing
- **URL**: `http://localhost:5173`
- **Database**: Local Supabase instance
- **Features**: Hot reload, debug logging, mock data

### Staging Environment

- **Purpose**: Pre-production testing and validation
- **URL**: `https://staging.metzlercares.com`
- **Database**: Staging Supabase instance
- **Features**: Full feature set, production data simulation

### Production Environment

- **Purpose**: Live application serving real users
- **URL**: `https://metzlercares.com`
- **Database**: Production Supabase instance
- **Features**: Full monitoring, error tracking, analytics

## Prerequisites

### System Requirements

- **Node.js**: 20.x LTS
- **npm**: 10.x or higher
- **Git**: 2.30 or higher
- **Docker**: 24.x (for local development)

### Required Accounts

- **GitHub**: Repository access with write permissions
- **Vercel**: Deployment platform account
- **Supabase**: Database and authentication
- **Sanity**: Content management system
- **Stripe**: Payment processing
- **Sentry**: Error monitoring
- **Google Analytics**: Web analytics

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/metzler-foundations.git
cd metzler-foundations
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env.local` file:

```bash
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Sanity (optional)
VITE_SANITY_PROJECT_ID=your-sanity-project-id
VITE_SANITY_DATASET=production

# Analytics (optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Tracking (optional)
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Payments (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# AI Features (optional)
OPENAI_API_KEY=sk-...

# Webhooks (optional)
KERAGON_WEBHOOK_URL=https://your-webhook-url

# Security
JWT_SECRET=your-secure-jwt-secret
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Run Tests

```bash
npm run test
npm run test:e2e
```

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline consists of multiple stages:

#### 1. Code Quality Checks

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting validation
- **TypeScript**: Type checking
- **Security Audit**: Dependency vulnerability scanning

#### 2. Unit Testing

- **Vitest**: Unit test execution
- **Coverage**: Test coverage reporting (>70% required)
- **Performance**: Bundle size analysis

#### 3. Integration Testing

- **E2E Tests**: Playwright-based end-to-end testing
- **API Tests**: Backend API validation
- **Database Tests**: Data integrity checks

#### 4. Security Scanning

- **Snyk**: Dependency vulnerability scanning
- **CodeQL**: Static application security testing
- **Container Scanning**: Docker image security

#### 5. Performance Testing

- **Lighthouse**: Web performance auditing
- **Core Web Vitals**: Real user monitoring
- **Load Testing**: Application scalability testing

#### 6. Accessibility Testing

- **Pa11y**: Automated accessibility auditing
- **WCAG Compliance**: Standards adherence checking

### Quality Gates

| Stage         | Criteria                | Action      |
| ------------- | ----------------------- | ----------- |
| Code Quality  | All linting passes      | Block merge |
| Unit Tests    | >70% coverage           | Block merge |
| E2E Tests     | All tests pass          | Block merge |
| Security      | No high/critical issues | Block merge |
| Performance   | Lighthouse >85          | Warning     |
| Accessibility | WCAG AA compliance      | Warning     |

## Deployment Process

### Automatic Deployment

#### Staging Deployment

- **Trigger**: Push to `develop` branch
- **Environment**: Staging
- **Process**:
  1. Run full CI pipeline
  2. Deploy to Vercel staging
  3. Run smoke tests
  4. Notify team via Slack

#### Production Deployment

- **Trigger**: Push to `main` branch
- **Environment**: Production
- **Process**:
  1. Run full CI pipeline
  2. Manual approval required
  3. Deploy to Vercel production
  4. Run comprehensive tests
  5. Health check validation
  6. Notify stakeholders

### Manual Deployment

#### Emergency Deployment

```bash
# Create emergency branch
git checkout -b emergency/fix-critical-issue

# Make necessary changes
# ...

# Push and create PR
git push origin emergency/fix-critical-issue

# After approval, merge to main
```

#### Rollback Procedure

```bash
# Identify problematic deployment
# Check Vercel deployment history

# Rollback to previous version
vercel rollback

# Verify rollback success
curl -I https://metzlercares.com

# Notify team and monitor
```

## Configuration Management

### Environment Variables

#### Required Variables

| Variable                      | Environment | Description            |
| ----------------------------- | ----------- | ---------------------- |
| `VITE_SUPABASE_URL`           | All         | Supabase project URL   |
| `VITE_SUPABASE_ANON_KEY`      | All         | Supabase anonymous key |
| `VITE_SANITY_PROJECT_ID`      | Prod        | Sanity project ID      |
| `VITE_GA_MEASUREMENT_ID`      | Prod        | Google Analytics ID    |
| `VITE_SENTRY_DSN`             | Prod        | Sentry DSN             |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Prod        | Stripe publishable key |

#### Optional Variables

| Variable              | Default     | Description                    |
| --------------------- | ----------- | ------------------------------ |
| `NODE_ENV`            | development | Application environment        |
| `VITE_SANITY_DATASET` | production  | Sanity dataset                 |
| `OPENAI_API_KEY`      | -           | OpenAI API key for AI features |
| `KERAGON_WEBHOOK_URL` | -           | Webhook URL for automation     |

### Secrets Management

Secrets are managed through:

1. **GitHub Secrets**: For CI/CD pipeline
2. **Vercel Environment Variables**: For deployment
3. **Supabase Secrets**: For database functions

## Monitoring and Observability

### Application Monitoring

#### Real-time Metrics

- **Response Times**: API endpoint performance
- **Error Rates**: Application error tracking
- **User Sessions**: Active session monitoring
- **Conversion Rates**: Application success metrics

#### Health Checks

- **API Health**: `/api/health` endpoint
- **Database Health**: Connection and query performance
- **External Services**: Supabase, Sanity, Stripe connectivity

### Alerting

#### Critical Alerts

- Application downtime
- Database connectivity issues
- Security breaches
- Payment processing failures

#### Warning Alerts

- High error rates (>5%)
- Slow response times (>5s)
- Low disk space (<10%)
- Certificate expiration (<30 days)

### Logging

#### Log Levels

- **ERROR**: Application errors and failures
- **WARN**: Potentially harmful situations
- **INFO**: General information and milestones
- **DEBUG**: Detailed debugging information

#### Log Aggregation

- **Sentry**: Error tracking and aggregation
- **Vercel Analytics**: Request and performance logs
- **Supabase**: Database operation logs

## Backup and Recovery

### Data Backup

#### Automated Backups

- **Database**: Daily automated backups via Supabase
- **Files**: S3 replication and versioning
- **Configuration**: Infrastructure as code versioning

#### Manual Backups

```bash
# Database backup
pg_dump $DATABASE_URL > backup.sql

# File backup
aws s3 sync s3://production-bucket s3://backup-bucket --delete
```

### Disaster Recovery

#### Recovery Time Objectives (RTO)

- **Critical Services**: <1 hour
- **Application**: <4 hours
- **Data**: <24 hours

#### Recovery Point Objectives (RPO)

- **Transactional Data**: <5 minutes
- **User Data**: <1 hour
- **Static Assets**: <24 hours

### Business Continuity

#### Failover Strategy

1. **Load Balancer**: Automatic traffic routing
2. **Database**: Read replica promotion
3. **CDN**: Global content delivery
4. **Application**: Blue-green deployments

## Security Deployment

### Pre-deployment Security Checks

#### Automated Security Scanning

```bash
# Dependency vulnerabilities
npm audit --audit-level=high

# Container security
docker scan metzler-foundations:latest

# Static analysis
snyk code test
```

#### Manual Security Review

- Code review for security vulnerabilities
- Configuration review
- Access control validation
- Encryption verification

### Runtime Security

#### Web Application Firewall (WAF)

- SQL injection prevention
- XSS attack blocking
- Rate limiting
- Bot detection

#### Network Security

- HTTPS enforcement
- Certificate management
- DDoS protection
- IP allowlisting

## Performance Optimization

### Build Optimization

#### Bundle Analysis

```bash
npm run bundle:analyze
```

#### Optimization Targets

- **Bundle Size**: <500KB gzipped
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **Lighthouse Score**: >90

### CDN Configuration

#### Asset Optimization

- Image optimization and WebP conversion
- Font subsetting and preloading
- JavaScript/CSS minification
- Gzip/Brotli compression

#### Cache Strategy

- Static assets: 1 year cache
- API responses: 5 minutes cache
- HTML pages: No cache (for dynamic content)

## Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Check build logs
npm run build 2>&1 | tee build.log

# Debug specific issues
DEBUG=vite:* npm run build
```

#### Environment Issues

```bash
# Validate environment variables
node -e "console.log(Object.keys(process.env).filter(k => k.startsWith('VITE_')))";

# Test configuration
npm run type-check
```

#### Performance Issues

```bash
# Lighthouse audit
npx lighthouse https://metzlercares.com --output html

# Bundle analyzer
npm run bundle:analyze
```

### Emergency Procedures

#### Service Outage

1. Check Vercel status page
2. Review error logs in Sentry
3. Check database connectivity
4. Implement rollback if necessary
5. Communicate with stakeholders

#### Security Incident

1. Isolate affected systems
2. Preserve evidence for investigation
3. Notify relevant authorities if required
4. Implement fixes and patches
5. Conduct post-mortem analysis

## Support and Contact

- **Deployment Issues**: devops@metzlercares.com
- **Security Issues**: security@metzlercares.com
- **Emergency**: +1-555-DEPLOY (337-569)
