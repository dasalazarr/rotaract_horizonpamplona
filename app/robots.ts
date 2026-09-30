import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        // La miniatura de WhatsApp debe poder leerse aunque /api/ esté bloqueado.
        allow: ['/', '/api/polio/og'],
        disallow: ['/miembros', '/api/', '/polio/admin', '/polio/baja'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
