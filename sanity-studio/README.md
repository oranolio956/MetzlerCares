# Metzler Foundations Sanity Studio

This is the Sanity Studio for managing public-facing content for the Metzler Foundations website using a **Pillar-Cluster Content Model** for maximum SEO impact.

## 🚀 Quick Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure your Sanity project**:
   - Get your project ID from [sanity.io](https://sanity.io)
   - Update `sanity.config.ts` with your project ID and dataset

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📄 Content Architecture

### Core Content Types

- **🏛️ Pillar Pages**: Main SEO content hubs (comprehensive guides)
- **📝 Cluster Pages**: Supporting blog posts (detailed articles)
- **📊 Impact Metrics**: Public dashboard (transparency metrics)
- **👥 Team Members**: About us page (staff profiles)

### SEO Strategy

- **Pillar-Cluster Model**: Broad pillar pages rank for primary keywords, cluster pages target long-tail keywords
- **Internal Linking**: Strong linking structure from cluster content to pillar pages
- **Content Depth**: Comprehensive coverage of sober living and recovery topics

## 📋 Content Creation Workflow

1. **Create Pillar Pages First**: Establish authority on core topics
2. **Add Cluster Content**: Create supporting articles that link to pillars
3. **Update Impact Metrics**: Maintain transparency dashboard
4. **Manage Team Profiles**: Keep staff information current

## 🛠️ Technical Details

### Schema Location

- Content schemas: `schemas/index.ts`
- Configuration: `sanity.config.ts`

### Key Features

- **Rich Text Editing**: Full block editor with images and links
- **SEO Optimization**: Meta descriptions, slugs, keywords
- **Content Relationships**: Pillar-to-cluster page linking
- **Publishing Workflow**: Draft/publish with timestamps
- **Preview System**: Visual content previews in studio

### Integration Ready

Schemas are designed for easy integration with SvelteKit frontend using GROQ queries. See `CONTENT-README.md` for detailed implementation examples.

## 📚 Documentation

- **📖 Content Strategy Guide**: `CONTENT-README.md`
- **🔧 Technical Implementation**: Schema field documentation
- **🎯 SEO Best Practices**: Built into schema descriptions

## 🎯 Success Metrics

- **SEO Growth**: Organic traffic to pillar and cluster content
- **Content Depth**: Comprehensive coverage of recovery housing topics
- **User Engagement**: Increased time on site and conversion rates
- **Authority Building**: Improved domain authority and keyword rankings

---

**Ready to create compelling content that drives impact?** Start with your first pillar page! 📈✨
