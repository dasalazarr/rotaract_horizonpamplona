import { NextRequest, NextResponse } from 'next/server';

/**
 * Protege el CRM de la campaña (/polio/admin y su API) con autenticación básica.
 * Credenciales en variables de entorno: POLIO_ADMIN_USER y POLIO_ADMIN_PASSWORD.
 * Las rutas de la API vuelven a comprobarlo en el servidor.
 */
export function middleware(req: NextRequest) {
  const pass = process.env.POLIO_ADMIN_PASSWORD;
  if (!pass) return new NextResponse('CRM desactivado: define POLIO_ADMIN_PASSWORD.', { status: 503 });

  const expected = `${process.env.POLIO_ADMIN_USER ?? 'admin'}:${pass}`;
  const [scheme, token] = (req.headers.get('authorization') ?? '').split(' ');
  let given = '';
  try { given = scheme === 'Basic' && token ? atob(token) : ''; } catch { given = ''; }

  // Comparación de tiempo constante.
  let diff = given.length ^ expected.length;
  for (let i = 0; i < expected.length; i++) diff |= (given.charCodeAt(i) || 0) ^ expected.charCodeAt(i);
  if (diff === 0) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  return new NextResponse('Acceso restringido', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="CRM Polio 2026", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ['/polio/admin/:path*', '/polio/admin', '/api/polio/admin/:path*'],
};
