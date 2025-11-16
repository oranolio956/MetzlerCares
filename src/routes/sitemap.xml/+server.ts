import type { RequestHandler } from './$types';
import { seoGenerator } from '$lib/utils/colorado-seo-generator';
import { seoPageGenerator } from '$lib/utils/seo-page-generator';

export const GET: RequestHandler = async ({ url }) => {
  try {
    // Generate sitemap data for Colorado recovery services
    const sitemapData = seoGenerator.generateSitemapData();
    const seoPages = seoPageGenerator.generatePages().map((p) => ({
      url: `${url.origin}/seo/${p.slug}`,
      lastModified: new Date().toISOString(),
      priority: p.priority === 'high' ? 0.9 : p.priority === 'medium' ? 0.7 : 0.5
    }));
    
    // Add existing pages from the main site
    const existingPages = [
      { url: `${url.origin}/`, lastModified: new Date().toISOString(), priority: 1.0 },
      { url: `${url.origin}/get-aid`, lastModified: new Date().toISOString(), priority: 0.9 },
      { url: `${url.origin}/donate`, lastModified: new Date().toISOString(), priority: 0.9 },
      { url: `${url.origin}/impact`, lastModified: new Date().toISOString(), priority: 0.8 },
      { url: `${url.origin}/partners`, lastModified: new Date().toISOString(), priority: 0.7 },
      { url: `${url.origin}/co`, lastModified: new Date().toISOString(), priority: 0.9 },
      { url: `${url.origin}/scholarships`, lastModified: new Date().toISOString(), priority: 0.8 },
      { url: `${url.origin}/faq/sober-living`, lastModified: new Date().toISOString(), priority: 0.7 }
    ];
    
    const guides = [
      { url: `${url.origin}/guides/sober-living-colorado`, lastModified: new Date().toISOString(), priority: 0.7 },
      { url: `${url.origin}/guides/consumer-protection`, lastModified: new Date().toISOString(), priority: 0.6 }
    ];
    guides.push({ url: `${url.origin}/guides/scholarship-pathways`, lastModified: new Date().toISOString(), priority: 0.7 })
    const allUrls = [...existingPages, ...sitemapData, ...seoPages, ...guides];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};