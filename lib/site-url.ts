/**
 * Resuelve la URL pública real del sitio en cualquier entorno:
 * 1. APP_URL explícita (Cloud Run / AI Studio la inyecta en runtime).
 * 2. Dominio de producción de Vercel, si el despliegue vive ahí.
 * 3. Dominio del despliegue actual de Vercel (previews incluidos).
 * 4. Dominio de referencia como último recurso.
 *
 * Sin esto, las URLs absolutas (og:image, JSON-LD, sitemap) quedaban
 * apuntando a un dominio que nunca se puso en marcha, rompiendo las
 * miniaturas de WhatsApp/redes sociales en el despliegue real.
 */
export function getSiteUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://horizonpamplona.org';
}
