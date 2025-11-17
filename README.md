# Metzler Foundations - Recovery Housing Aid Platform

[![CI Pipeline](https://github.com/your-org/metzler-foundations/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/metzler-foundations/actions/workflows/ci.yml)
[![Code Coverage](https://codecov.io/gh/your-org/metzler-foundations/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/metzler-foundations)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![Security Audit](https://img.shields.io/badge/Security-Audited-green)](https://snyk.io/)

A HIPAA-compliant, accessible web platform providing dignified housing scholarships for individuals in recovery from addiction. Built with modern web technologies and following Google engineering standards.

## 🚀 Features

- **HIPAA Compliant**: Full compliance with HIPAA regulations and 42 CFR Part 2
- **Accessibility First**: WCAG 2.1 AA compliant with comprehensive screen reader support
- **Performance Optimized**: Core Web Vitals optimized with lazy loading and caching
- **Mobile Responsive**: Perfect experience across all devices and screen sizes
- **SEO Optimized**: Advanced SEO targeting Colorado recovery services
- **Analytics Integrated**: Google Analytics 4 with Core Web Vitals tracking
- **Error Monitoring**: Sentry integration for comprehensive error tracking
- **Automated Testing**: Unit, integration, and E2E testing with Playwright
- **CI/CD Pipeline**: Automated deployment with quality gates

## 🚀 Quick Deploy

**Prerequisites**: GitHub, Vercel, and Supabase accounts

```bash
# 1. Clone and setup
git clone https://github.com/your-org/metzler-foundations.git
cd metzler-foundations

# 2. Run deployment setup script
./scripts/setup-deployment.ps1

# 3. Follow the deployment guide
# See DEPLOYMENT-GUIDE.md for detailed instructions

# 4. Verify setup
./scripts/verify-deployment.ps1
```

**One-click deployment**: Push to `main` branch to auto-deploy to production!

## 🏗️ Architecture

### Technology Stack

- **Frontend**: SvelteKit 2.0 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **CMS**: Sanity.io for content management
- **Payments**: Stripe integration
- **Analytics**: Google Analytics 4
- **Error Tracking**: Sentry
- **Deployment**: Vercel with automated CI/CD

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   API Gateway   │    │   Databases     │
│                 │    │                 │    │                 │
│ • SvelteKit     │◄──►│ • Supabase      │◄──►│ • PostgreSQL    │
│ • TypeScript    │    │ • Sanity CMS    │    │ • Redis Cache   │
│ • PWA Ready     │    │ • Stripe        │    │ • File Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Monitoring    │    │   CI/CD         │    │   Security      │
│                 │    │                 │    │                 │
│ • Google Analytics│   │ • GitHub Actions│   │ • HIPAA Comp.   │
│ • Core Web Vitals│   │ • Vercel Deploy │   │ • Input Sanit.   │
│ • Error Tracking │   │ • Quality Gates │   │ • Audit Logs     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/metzler-foundations.git
   cd metzler-foundations
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Run quality checks**
   ```bash
   npm run quality
   ```

### Available Scripts

| Command                  | Description                 |
| ------------------------ | --------------------------- |
| `npm run dev`            | Start development server    |
| `npm run build`          | Build for production        |
| `npm run preview`        | Preview production build    |
| `npm run check`          | Type checking               |
| `npm run lint`           | ESLint checking             |
| `npm run lint:fix`       | Auto-fix ESLint issues      |
| `npm run format`         | Format code with Prettier   |
| `npm run test`           | Run unit tests              |
| `npm run test:coverage`  | Run tests with coverage     |
| `npm run test:e2e`       | Run E2E tests               |
| `npm run quality`        | Run all quality checks      |
| `npm run security:audit` | Security vulnerability scan |

## 🧪 Testing

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── utils/         # Test utilities
```

### Running Tests

```bash
# Unit tests
npm run test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Visual testing
npm run test:e2e -- --headed
```

### Test Coverage Requirements

- **Statements**: ≥70%
- **Branches**: ≥70%
- **Functions**: ≥70%
- **Lines**: ≥70%

## 🚀 Deployment

### Environments

- **Development**: Local development environment
- **Staging**: Automated deployment from `develop` branch
- **Production**: Automated deployment from `main` branch

### Deployment Process

1. **Code Review**: All changes require PR review
2. **CI Pipeline**: Automated testing and quality checks
3. **Security Scan**: Automated security vulnerability scanning
4. **Performance Audit**: Lighthouse performance testing
5. **Accessibility Check**: Automated accessibility testing
6. **Manual QA**: Final manual testing before production

### Deployment Commands

```bash
# Deploy to staging
git push origin develop

# Deploy to production
git push origin main
```

## 🔒 Security

### HIPAA Compliance

- **Data Encryption**: All PHI data encrypted at rest and in transit
- **Access Controls**: Role-based access with audit logging
- **Session Management**: Secure session handling with timeouts
- **Input Validation**: Comprehensive input sanitization
- **Security Headers**: OWASP recommended security headers

### Security Features

- CSRF protection
- XSS prevention
- SQL injection prevention
- Rate limiting
- Security headers (CSP, HSTS, etc.)
- Automated security scanning

## 📊 Monitoring & Analytics

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms
- **CLS (Cumulative Layout Shift)**: <0.1

### Error Tracking

- Sentry integration for error monitoring
- Performance monitoring
- User interaction tracking
- Custom error boundaries

### Analytics

- Google Analytics 4 integration
- Conversion tracking
- User journey analysis
- A/B testing framework

## 🛡️ Compliance

### Accessibility

- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast support
- Focus management

### Privacy

- GDPR compliant
- CCPA compliant
- Cookie consent management
- Data retention policies
- User data export/deletion

## 📚 Documentation

### For Developers

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Testing Guide](./docs/testing.md)
- [Deployment Guide](./docs/deployment.md)

### For Users

- [User Guide](./docs/user-guide.md)
- [FAQ](./docs/faq.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **ESLint**: Configured with TypeScript and Svelte support
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks
- **Commit Convention**: Conventional commits

### Pull Request Process

1. **Code Review**: Required for all changes
2. **Testing**: All tests must pass
3. **Documentation**: Update docs for API changes
4. **Security Review**: Security impact assessment
5. **Performance Review**: Performance impact assessment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SvelteKit Team** for the amazing framework
- **Supabase Team** for the database platform
- **Sanity Team** for the CMS platform
- **Vercel Team** for the deployment platform

## 📞 Support

- **Documentation**: [docs.metzlerfoundations.org](https://docs.metzlerfoundations.org)
- **Issues**: [GitHub Issues](https://github.com/your-org/metzler-foundations/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/metzler-foundations/discussions)

---

Built with ❤️ for the recovery community
