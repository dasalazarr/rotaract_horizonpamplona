import { NextRequest, NextResponse } from 'next/server';
import { polioStore } from '@/lib/polio/store';
import { adminAuth, adminDenied, clean, sameOrigin } from '@/lib/polio/server-utils';
import { getSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ action: string }> };

const CSV_COLS = [
  'seq', 'nombre', 'whatsapp', 'email', 'intereses', 'estado', 'fase_registro', 'utm_source', 'utm_medium',
  'utm_campaign', 'ref_code', 'referido_por', 'consent_at', 'consent_version', 'notas', 'creado',
] as const;

const csvCell = (v: unknown) => {
  let s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@]/.test(s) && !/^\+\d+$/.test(s)) s = `'${s}`; // evita fórmulas en Excel
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(req: NextRequest, { params }: Ctx) {
  const auth = adminAuth(req);
  if (auth !== 'ok') return adminDenied(auth);
  const { action } = await params;
  const store = polioStore();

  if (action === 'contacts') {
    const [contacts, referrals, mode] = await Promise.all([store.all(), store.referrals(), store.getMode()]);
    return NextResponse.json({ contacts, referrals, mode, baseUrl: getSiteUrl() }, { headers: { 'Cache-Control': 'no-store' } });
  }
  if (action === 'contacts.csv') {
    const rows = (await store.all()).map((c) => CSV_COLS.map((k) => csvCell(c[k])).join(','));
    return new Response('﻿' + [CSV_COLS.join(','), ...rows].join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="contactos-polio-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  }
  return NextResponse.json({ error: 'No encontrado.' }, { status: 404 });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const auth = adminAuth(req);
  if (auth !== 'ok') return adminDenied(auth);
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 });
  const { action } = await params;
  const body = await req.json().catch(() => ({}));
  const store = polioStore();

  if (action === 'mode' && (body.mode === 'expectativa' || body.mode === 'lanzamiento')) {
    await store.setMode(body.mode);
    return NextResponse.json({ ok: true, mode: body.mode });
  }
  if (action === 'estado' && typeof body.id === 'string' && (body.estado === 'activo' || body.estado === 'baja')) {
    await store.setEstado(body.id, body.estado);
    return NextResponse.json({ ok: true });
  }
  if (action === 'notas' && typeof body.id === 'string') {
    await store.setNotas(body.id, clean(body.notas, 500));
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Acción no válida.' }, { status: 400 });
}
