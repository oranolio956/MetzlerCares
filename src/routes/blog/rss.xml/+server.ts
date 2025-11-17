import { sanityClient, queries } from '$lib/utils/sanity'

function generateRSSFeed(posts: any[]) {
  const siteUrl = 'https://metzlerfoundations.org'
  const currentDate = new Date().toUTCString()
  
  const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug.current}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug.current}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${post.author.name}</author>
      <category>${post.pillarPage?.title || 'Recovery'}</category>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
    </item>
  `).join('')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Metzler Foundations - Thought Leadership</title>
    <link>${siteUrl}</link>
    <description>Expert insights on sober living, recovery support, and nonprofit innovation that drives measurable impact in our communities.</description>
    <language>en-US</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>Metzler Foundations</title>
      <link>${siteUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`
}

export async function GET() {
  try {
    // Fetch recent blog posts
    const posts = await sanityClient.fetch(queries.getRecentBlogPostsForRSS, { limit: 20 })
    
    if (!posts || posts.length === 0) {
      return new Response('No blog posts found', { status: 404 })
    }
    
    const rss = generateRSSFeed(posts)
    
    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}