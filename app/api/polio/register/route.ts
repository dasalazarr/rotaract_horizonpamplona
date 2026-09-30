import { NextRequest, NextResponse } from 'next/server';
import { polioStore } from '@/lib/polio/store';
import { INTERESTS } from '@/lib/polio/config';
import { clean, clientIp, hashIp, normalizePhone, rateLimited } from '@/lib/polio/server-utils';

export const dynamic = 'force-dynamic';

const VALID = new Set<string>(INTERESTS.map((i) => i.id));

export async function POST(req: NextRequest) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud no válida.' }, { status: 400 });
  }

  // Honeypot y trampa de tiempo: respondemos como si todo fuera bien.
  const loadedAt = Number(data.formLoadedAt);
  if (data.website || (loadedAt && Date.now() - loadedAt < 2500)) {
    return NextResponse.json({ ok: true, seq: 0, ref: null, nombre: '' });
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Demasiados intentos. Prueba en unos minutos.' }, { status: 429 });
  }

  const errors: Record<string, string> = {};
  const nombre = clean(data.nombre, 80);
  const whatsapp = normalizePhone(data.whatsapp);
  const email = clean(data.email, 120);
  const intereses = Array.isArray(data.intereses) ? data.intereses.filter((i): i is string => VALID.has(String(i))) : [];
  if (!nombre || nombre.length < 2) errors.nombre = 'Escribe tu nombre.';
  if (!whatsapp) errors.whatsapp = 'Escribe un móvil válido, por ejemplo 612 345 678 o +34 612 345 678.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Revisa el correo.';
  if (!intereses.length) errors.intereses = 'Elige al menos una forma de participar.';
  if (data.consent !== true) errors.consent = 'Necesitamos tu permiso para escribirte.';
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Revisa los campos marcados.', errors }, { status: 422 });
  }

  try {
    const store = polioStore();
    const c = await store.upsert({
      nombre: nombre!, whatsapp: whatsapp!, email, intereses,
      utm_source: clean(data.utm_source, 60),
      utm_medium: clean(data.utm_medium, 60),
      utm_campaign: clean(data.utm_campaign, 60),
      ref: clean(data.ref, 12),
      ipHash: hashIp(ip),
    });
    return NextResponse.json(
      { ok: true, created: c.created, seq: c.seq, ref: c.ref_code, nombre: c.nombre.split(' ')[0], count: await store.count() },
      { status: c.created ? 201 : 200 },
    );
  } catch (err) {
    console.error('[polio/register]', err);
    return NextResponse.json({ error: 'No hemos podido guardar tu registro. Inténtalo en un momento.' }, { status: 500 });
  }
}
