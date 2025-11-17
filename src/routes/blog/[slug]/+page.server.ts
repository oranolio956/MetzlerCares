import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { sanityClient, queries } from '$lib/utils/sanity'

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params
  
  try {
    // Fetch the blog post
    const post = await sanityClient.fetch(queries.getBlogPostBySlug(slug), { slug })
    
    if (!post) {
      throw error(404, 'Blog post not found')
    }
    
    // Fetch related posts
    const relatedPosts = await sanityClient.fetch(
      queries.getRelatedBlogPosts(post._id, post.tags, 3),
      { postId: post._id, tags: post.tags }
    )
    
    // Generate structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.publishedAt,
      "dateModified": post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name,
        "jobTitle": post.author.title
      },
      "publisher": {
        "@type": "Organization",
        "name": "Metzler Foundations",
        "logo": {
          "@type": "ImageObject",
          "url": "https://metzlerfoundations.org/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://metzlerfoundations.org/blog/${post.slug.current}`
      }
    }
    
    if (post.featuredImage) {
      structuredData.image = `https://metzlerfoundations.org${post.featuredImage.url}`
    }
    
    return {
      post,
      relatedPosts: relatedPosts || [],
      structuredData
    }
  } catch (err) {
    console.error('Error loading blog post:', err)
    throw error(500, 'Failed to load blog post')
  }
}