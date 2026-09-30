import { NextRequest, NextResponse } from 'next/server';
import { polioStore } from '@/lib/polio/store';

export const dynamic = 'force-dynamic';

// La baja se confirma con POST (botón), nunca al abrir el enlace:
// las vistas previas de WhatsApp visitan los enlaces y darían de baja sin querer.
export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({ token: '' }));
  if (typeof token !== 'string' || token.length < 10) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const c = await polioStore().unsubscribe(token);
  return NextResponse.json({ ok: Boolean(c) }, { status: c ? 200 : 404 });
}
