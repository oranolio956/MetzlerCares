# MetzlerCares - Conversion-Focused Landing Page System

A comprehensive, conversion-focused landing page system targeting the Colorado rehab/sober living market with gamification and advanced analytics.

## 🎯 Key Features

### Multi-Persona Landing Pages
- **Crisis Landing**: Immediate help with urgency indicators and same-day admission
- **Family Support**: Intervention resources and treatment research tools  
- **Sober Living**: Post-rehab housing search with community features
- **Insurance Focus**: Real-time verification with coverage details

### Advanced Conversion Elements
- ⚡ Real-time insurance verification (30 seconds)
- 🔥 Urgency indicators with bed availability
- 📊 Scarcity messaging with countdown timers
- 🤝 Trust signals and testimonials
- 📱 Mobile-first responsive design

### Gamification System
- 🏆 Achievement badges and progress tracking
- 👥 Recovery buddy matching system
- 📈 Milestone celebrations
- 💰 Referral program with commission tracking
- 🎯 Points and rewards system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/metzlercares.git
   cd metzlercares
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up Supabase database**
   ```bash
   # Run the schema script in your Supabase SQL editor
   cat src/lib/database/schema.sql | pbcopy
   # Paste into Supabase SQL editor and run
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── InsuranceVerifier.svelte
│   │   ├── UrgencyIndicator.svelte
│   │   └── GamifiedDashboard.svelte
│   ├── database/
│   │   └── schema.sql      # Database schema
│   └── utils/              # Utility functions
├── routes/
│   ├── api/                # API endpoints
│   │   ├── insurance/
│   │   ├── analytics/
│   │   └── facilities/
│   ├── crisis/             # Crisis landing page
│   ├── family/             # Family support landing
│   ├── sober-living/       # Sober living landing
│   └── dashboard/          # Gamified dashboard
└── app.html               # HTML template
```

## 🎨 Landing Pages

### Crisis Landing (`/crisis`)
- Emergency banner with 24/7 support
- Real-time bed availability
- Insurance verification widget
- Urgency indicators with scarcity
- Same-day admission focus

### Family Support (`/family`)
- Intervention guidance
- Treatment research tools
- Family therapy resources
- Professional referral network
- Educational content

### Sober Living (`/sober-living`)
- Housing search with filters
- Virtual tours
- Peer compatibility matching
- Recovery community features
- Buddy system integration

## 🔧 API Endpoints

### Insurance Verification
```
POST /api/insurance/verify
{
  provider: string,
  memberId: string,
  groupNumber?: string,
  dob: string,
  firstName: string,
  lastName: string,
  persona: string
}
```

### Analytics Tracking
```
POST /api/analytics/track
{
  event_type: string,
  user_id?: string,
  persona: string,
  page_url?: string,
  metadata?: object
}
```

### Facilities
```
GET /api/facilities?type=rehab&urgency=high&limit=10
GET /api/facilities/[id]/availability
```

## 📊 Analytics & Conversion Tracking

### Events Tracked
- `page_view` - Page visits by persona
- `insurance_verification_start` - Insurance verification initiation
- `insurance_verification_success` - Successful verification
- `urgency_cta_click` - Urgency indicator clicks
- `referral_created` - New referral submissions
- `achievement_unlocked` - Gamification achievements
- `conversion_complete` - Major conversions (admissions)

### Conversion Values
- Insurance verification: 50 points
- Urgency CTA click: 25 points  
- Referral creation: 20 points
- Buddy connection: 15 points
- Achievement unlock: Variable points
- Major conversion: 50+ points

## 🎮 Gamification Features

### Achievement System
- **First Step**: Complete first milestone (10 points)
- **Week Warrior**: 7 days sober (25 points)
- **Month Master**: 30 days sober (50 points)
- **Helper Hero**: 3 successful referrals (30 points)
- **Community Champion**: 5 buddy connections (40 points)

### Progress Tracking
- Recovery milestones with visual progress
- Day counter with streak tracking
- Social sharing of achievements
- Leaderboards (optional)

### Buddy System
- Algorithm-based matching
- Connection strength tracking
- Shared goal setting
- Progress celebration

## 🏗️ Database Schema

### Core Tables
- `users` - User profiles with persona segmentation
- `facilities` - Treatment centers and sober living homes
- `conversion_events` - Analytics and conversion tracking
- `referrals` - Referral program management
- `achievements` - Gamification achievements
- `bed_availability` - Real-time bed tracking

### Key Relationships
- Users → Conversion Events (one-to-many)
- Users → Achievements (many-to-many)
- Users → Referrals (one-to-many)
- Facilities → Bed Availability (one-to-one)

## 🚀 Deployment

### Environment Setup
1. **Supabase Project**: Create new project and run schema
2. **Environment Variables**: Configure production variables
3. **Domain Setup**: Configure custom domain and SSL
4. **Analytics**: Set up Google Analytics and conversion goals

### Build & Deploy
```bash
npm run build
npm run preview  # Test production build
```

### Platform Options
- **Vercel**: One-click deployment with GitHub integration
- **Netlify**: Static site hosting with serverless functions
- **Railway**: Full-stack deployment with database
- **Digital Ocean**: VPS deployment with custom setup

## 🔒 Security Considerations

### Data Protection
- HIPAA-compliant data handling
- Encrypted storage for sensitive information
- Row-level security in Supabase
- API rate limiting and abuse prevention

### Privacy
- Anonymous tracking options
- GDPR compliance features
- Data retention policies
- User consent management

## 📈 Performance Optimization

### Core Web Vitals
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms  
- Cumulative Layout Shift (CLS) < 0.1

### Optimization Strategies
- Image optimization and lazy loading
- Code splitting and tree shaking
- CDN integration for static assets
- Database query optimization
- API response caching

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
- API endpoint testing
- Database connection testing
- Insurance verification flow testing
- Analytics tracking verification

### Performance Tests
- Load testing for high-traffic scenarios
- Database performance under load
- API response time monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- 📧 Email: support@metzlercares.com
- 📞 Phone: (303) 555-HELP
- 💬 Live Chat: Available on website
- 📚 Documentation: [docs.metzlercares.com](https://docs.metzlercares.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Colorado recovery community
- Addiction treatment professionals
- Families affected by addiction
- Open source contributors

---

**MetzlerCares** - *Helping Colorado find recovery, one connection at a time.*