# Metzler Cares - Colorado Recovery Services SEO System

Advanced SEO rapid-ranking system for Colorado recovery services, sober living, and treatment centers.

## 🚀 Features

- **Google Indexing API Integration** - Rapid content discovery
- **Content Velocity Optimization** - Real-time freshness signals
- **Advanced Internal Linking** - Authority transfer architecture
- **Colorado-Wide Coverage** - 20+ cities with recovery services
- **Real-time Monitoring Dashboard** - Performance tracking

## 📋 Prerequisites

- Node.js 18+ 
- Vercel account (free)
- Google Cloud account (for Indexing API)

## 🛠️ Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/metzlercares)

### Manual Deployment

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔧 Configuration

### Google Indexing API Setup (Optional)

1. Create Google Cloud Project
2. Enable Indexing API
3. Create service account
4. Add to Vercel environment variables:

```
GOOGLE_INDEXING_API_KEY=your-service-account-key.json
SITE_URL=https://yourdomain.com
```

## 📊 Usage

### Access Dashboard
- Visit `/seo-dashboard` to monitor SEO performance
- View content velocity scores
- Track indexing status
- Monitor internal linking

### API Endpoints

#### Trigger Rapid Indexing
```bash
POST /api/seo/rapid-index
{
  "cities": ["Denver", "Colorado Springs"],
  "serviceType": "sober_living",
  "priority": "high"
}
```

#### Get Velocity Report
```bash
GET /api/seo/rapid-index?city=Denver&timeframe=7d
```

#### Bulk Content Update
```bash
PUT /api/seo/rapid-index
{
  "cities": ["Denver", "Aurora"],
  "serviceTypes": ["sober_living", "treatment_centers"]
}
```

## 🎯 Colorado Cities Covered

- Denver, Colorado Springs, Aurora, Fort Collins
- Lakewood, Thornton, Westminster, Arvada
- Pueblo, Boulder, Greeley, Longmont
- And 10+ more cities across Colorado

## 📈 SEO Features

### Technical SEO
- Schema markup for LocalBusiness, MedicalOrganization
- Dynamic sitemap generation
- Core Web Vitals optimization
- Mobile-first responsive design

### Content Strategy
- Programmatic SEO for 100+ location pages
- Long-form content (2,000+ words per page)
- FAQ sections with structured data
- Internal linking architecture

### Rapid Ranking
- Google Indexing API integration
- Content velocity optimization
- Real-time freshness signals
- Social signal generation

## 🔍 Monitoring

### Dashboard Metrics
- Content velocity scores
- Indexing priority tracking
- Internal link analysis
- Performance recommendations

### Reports
- Top performing URLs
- Velocity trends
- Content suggestions
- Optimization recommendations

## 🚨 Important Notes

### Without Google API
- System works in simulation mode
- Content generation works normally
- Dashboard shows mock data
- Pages still get indexed through sitemaps

### With Google API
- Rapid indexing (2-6 hours vs 2-14 days)
- Real-time indexing status
- Priority content submission
- Enhanced velocity tracking

## 📞 Support

For questions about deployment or configuration, check the dashboard at `/seo-dashboard` for real-time system status.
