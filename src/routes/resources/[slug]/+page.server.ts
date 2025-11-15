import type { PageServerLoad } from './$types';
import { sanityClient } from '$lib/utils/sanity';

export const load: PageServerLoad = async ({ params, setHeaders, url }) => {
  // Set caching headers for content-heavy pages
  setHeaders({
    'Cache-Control': 'public, max-age=3600, s-maxage=86400', // 1 hour browser, 1 day CDN
    'CDN-Cache-Control': 'public, max-age=86400',
  });

  try {
    const { slug } = params;

    // Query Sanity for the pillar page content
    let page = await sanityClient.fetch(`
      *[_type == "pillarPage" && slug.current == $slug && isPublished == true][0]{
        _type,
        title,
        slug,
        metaDescription,
        heroImage,
        heroTitle,
        heroSubtitle,
        content,
        targetKeywords,
        relatedClusterPages[]->{
          title,
          slug,
          excerpt,
          featuredImage
        },
        publishedAt,
        tableOfContents
      }
    `, { slug });

    if (!page) {
      page = await sanityClient.fetch(`
        *[_type == "clusterPage" && slug.current == $slug && isPublished == true][0]{
          _type,
          title,
          slug,
          excerpt,
          featuredImage,
          pillarPage->{
            title,
            slug
          },
          content,
          tags,
          readTime,
          author->{
            name,
            title
          },
          publishedAt
        }
      `, { slug });
    }

    if (!page) {
      return {
        status: 404,
        error: 'Page not found'
      };
    }

    return {
      page,
      canonical: `${url.origin}/resources/${page?.slug?.current}`
    };
  } catch (error) {
    console.error('Server error in pillar page:', error);
    return {
      status: 500,
      error: 'Failed to load page content'
    };
  }
};
