import { coloradoTechnicalSEO } from '$lib/utils/colorado-technical-seo';

export const GET = async () => {
  const robotsTxt = coloradoTechnicalSEO.generateRobotsTxt();
  
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=3600'
    }
  });
};

