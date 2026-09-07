import { MetadataRoute } from 'next';
import { articles } from '@/content/articles';
import { projects } from '@/content/projects';
import { events } from '@/content/events';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://horizonpamplona.org';

  const staticRoutes = [
    '',
    '/actualidad',
    '/socios',
    '/proyectos',
    '/eventos',
    '/dona',
    '/legal/aviso-legal',
    '/legal/privacidad',
    '/legal/cookies',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/dona' || route === '/socios' ? 0.9 : 0.8,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/actualidad/${article.slug}`,
    lastModified: new Date(article.isoDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/proyectos/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/eventos/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...articleRoutes, ...projectRoutes, ...eventRoutes];
}
