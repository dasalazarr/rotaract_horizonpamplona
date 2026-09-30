import { createHash, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

export function normalizePhone(raw: unknown): string | null {
  let p = String(raw ?? '').replace(/[\s().-]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  if (/^[6789]\d{8}$/.test(p)) p = '+34' + p;
  return /^\+[1-9]\d{7,14}$/.test(p) ? p : null;
}

export function clean(v: unknown, max: number): string | null {
  const s = String(v ?? '').trim().replace(/[\u0000-\u001f]/g, '');
  return s ? s.slice(0, max) : null;
}

export function clientIp(req: NextRequest): string {
  // En Vercel x-forwarded-for lo fija la plataforma.
  return (req.headers.get('x-forwarded-for')?.split(',')[0] ?? '').trim() || 'local';
}

export const hashIp = (ip: string) =>
  createHash('sha256').update((process.env.POLIO_IP_SALT ?? 'polio2026') + ip).digest('hex').slice(0, 32);

// Límite de envíos por IP: 5 cada 10 min. En serverless es por instancia; se suma al honeypot y la trampa de tiempo.
const hits = new Map<string, number[]>();
export function rateLimited(ip: string): boolean {
  const now = Date.now(), win = 10 * 60_000;
  const list = (hits.get(ip) ?? []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

/** Autenticación básica del CRM con POLIO_ADMIN_USER / POLIO_ADMIN_PASSWORD. */
export function adminAuth(req: NextRequest): 'ok' | 'denied' | 'disabled' {
  const pass = process.env.POLIO_ADMIN_PASSWORD;
  if (!pass) return 'disabled';
  const user = process.env.POLIO_ADMIN_USER ?? 'admin';
  const [scheme, token] = (req.headers.get('authorization') ?? '').split(' ');
  if (scheme !== 'Basic' || !token) return 'denied';
  const given = createHash('sha256').update(Buffer.from(token, 'base64').toString()).digest();
  const expected = createHash('sha256').update(`${user}:${pass}`).digest();
  return timingSafeEqual(given, expected) ? 'ok' : 'denied';
}

export function adminDenied(state: 'denied' | 'disabled'): Response {
  if (state === 'disabled') {
    return new Response('CRM desactivado: define POLIO_ADMIN_PASSWORD.', { status: 503 });
  }
  return new Response('Acceso restringido', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="CRM Polio 2026", charset="UTF-8"' },
  });
}

/** Mitigación CSRF para las escrituras del panel. */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.get('host'); } catch { return false; }
}
