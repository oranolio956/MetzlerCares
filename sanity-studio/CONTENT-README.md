# Metzler Foundations Content Schema

## 📝 Content Strategy Overview

This Sanity Studio is configured for a **Pillar-Cluster Content Model** - a proven SEO strategy where comprehensive "pillar" pages rank for broad keywords, supported by detailed "cluster" pages that drive traffic to the pillar content.

## 📄 Content Types

### 🏛️ Pillar Pages (`pillarPage`)

**Purpose**: Main SEO content hubs that establish authority and rank for primary keywords.

**Key Features**:

- **Hero Section**: Compelling headlines and imagery
- **Rich Content**: Full block editor with headings, images, links
- **SEO Optimization**: Meta descriptions, target keywords
- **Content Relationships**: Links to supporting cluster pages
- **Publishing Control**: Draft/publish workflow

**SEO Strategy**: Create 5-10 comprehensive pillar pages covering your core topics (sober living, recovery housing, etc.)

### 📝 Cluster Pages (`clusterPage`)

**Purpose**: Supporting blog posts that drive traffic to pillar pages.

**Key Features**:

- **Pillar Relationship**: Each post links to a parent pillar page
- **SEO Elements**: Excerpts, meta descriptions, tags
- **Author Attribution**: Links to team members
- **Rich Media**: Featured images with alt text
- **Publishing Workflow**: Draft/publish with timestamps

**SEO Strategy**: Create 10-20 cluster posts per pillar page, each targeting specific long-tail keywords.

### 📊 Impact Metrics (`impactMetric`)

**Purpose**: Public dashboard showing organizational impact and transparency.

**Key Features**:

- **Categorized Metrics**: Housing, Recovery, Community, Financial, Partnerships
- **Display Controls**: Order and active/inactive status
- **Real-time Updates**: Last updated timestamps
- **Public Transparency**: Shows measurable outcomes

**Usage**: Update regularly to demonstrate impact to donors, partners, and beneficiaries.

### 👥 Team Members (`teamMember`)

**Purpose**: About Us page content showcasing your organization's people.

**Key Features**:

- **Professional Profiles**: Photos, bios, contact info
- **Department Organization**: Executive, Case Management, Housing, etc.
- **Display Ordering**: Control appearance on team page
- **Active Status**: Manage current vs. past team members

**Usage**: Keep updated as team changes to maintain credibility and connection.

## 🚀 Content Creation Workflow

### 1. Create Pillar Pages First

```markdown
1. Identify core topics (sober living, recovery support, housing programs)
2. Research target keywords for each pillar
3. Write comprehensive, authoritative content
4. Add hero imagery and compelling headlines
5. Set target keywords for SEO tracking
```

### 2. Create Supporting Cluster Content

```markdown
1. Identify long-tail keywords related to pillar topics
2. Write detailed, helpful content answering specific questions
3. Always link back to the parent pillar page
4. Include internal links to other relevant content
5. Add relevant tags for content discovery
```

### 3. Maintain Impact Dashboard

```markdown
1. Define key metrics that demonstrate impact
2. Set up automated or manual update processes
3. Categorize metrics for dashboard organization
4. Update regularly (monthly/quarterly)
```

### 4. Update Team Information

```markdown
1. Add new team members promptly
2. Update roles and departments as needed
3. Mark inactive members appropriately
4. Keep professional photos current
```

## 🔍 SEO Best Practices

### Pillar Page Optimization

- **Title**: Include primary keyword naturally
- **Meta Description**: Under 160 characters, compelling summary
- **URL Structure**: `/topic-keyword/`
- **Content Depth**: 2000+ words covering topic comprehensively
- **Internal Links**: Link to all related cluster pages

### Cluster Page Optimization

- **Title**: Include long-tail keyword + pillar topic
- **Meta Description**: Use excerpt (under 160 chars)
- **URL Structure**: `/topic-keyword/specific-question/`
- **Content Focus**: Answer specific questions thoroughly
- **Pillar Link**: Always include prominent link to parent pillar

### Image Optimization

- **Alt Text**: Descriptive, include keywords naturally
- **File Names**: descriptive-with-keywords.jpg
- **Sizes**: Optimize for web (under 100KB when possible)
- **Hero Images**: High quality, emotionally compelling

## 📊 Content Performance Tracking

### Key Metrics to Monitor

- **Organic Traffic**: Growth to pillar and cluster pages
- **Keyword Rankings**: Target keyword positions
- **Dwell Time**: Visitor engagement on pages
- **Conversion Rates**: Applications, donations, inquiries
- **Internal Linking**: Cluster-to-pillar page flow

### Content Audit Schedule

- **Monthly**: Review top-performing content
- **Quarterly**: Full content audit and optimization
- **Annually**: Content strategy refresh and gap analysis

## 🛠️ Technical Implementation

### Required Frontend Integration

```typescript
// Example queries for your SvelteKit app
import { sanityClient } from '$lib/utils/sanity'

// Get all published pillar pages
const pillarPages = await sanityClient.fetch(`
  *[_type == "pillarPage" && isPublished == true] | order(publishedAt desc)
`)

// Get cluster pages for a specific pillar
const clusterPages = await sanityClient.fetch(
  `
  *[_type == "clusterPage" && pillarPage._ref == $pillarId && isPublished == true]
`,
  { pillarId }
)

// Get active impact metrics
const impactMetrics = await sanityClient.fetch(`
  *[_type == "impactMetric" && isActive == true] | order(displayOrder asc, category asc)
`)

// Get active team members
const teamMembers = await sanityClient.fetch(`
  *[_type == "teamMember" && isActive == true] | order(displayOrder asc, department asc)
`)
```

## 🎯 Success Metrics

### SEO Goals (6-12 months)

- **Domain Authority**: Increase from baseline
- **Organic Traffic**: 300%+ growth
- **Keyword Rankings**: Top 10 for 80% of target keywords
- **Conversion Rate**: 25% improvement in qualified leads

### Content Goals (Ongoing)

- **Pillar Pages**: 5-10 comprehensive guides
- **Cluster Content**: 50+ supporting articles
- **Fresh Content**: 2-4 new pieces monthly
- **User Engagement**: 3+ minute average session duration

## 📞 Support

For content strategy questions, refer to:

- Google "Pillar Cluster Content Model"
- HubSpot Inbound Marketing Methodology
- Ahrefs SEO Content Guides
- Sanity.io Documentation
