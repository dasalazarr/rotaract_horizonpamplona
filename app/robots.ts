import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://horizonpamplona.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/miembros', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
