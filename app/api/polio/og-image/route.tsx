import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { polioStore } from '@/lib/polio/store';
import type { CampaignMode } from '@/lib/polio/config';

/**
 * Miniatura Open Graph (1200×630) para WhatsApp y redes.
 * - Sin parámetros: la de la fase actual (expectativa / lanzamiento).
 * - ?ref=CODE: invitación personal («María te invita · Globo nº 37»).
 */
export const runtime = 'nodejs';

async function googleFont(family: string, text: string, style = '') {
  const url = `https://fonts.googleapis.com/css2?family=${family}${style}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { cache: 'force-cache' })).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) throw new Error(`Fuente no disponible: ${family}`);
  return (await fetch(src[1], { cache: 'force-cache' })).arrayBuffer();
}

const BALLOONS = [
  { x: 905, y: 70, r: 70, o: 1 },
  { x: 1050, y: 190, r: 52, o: 0.9 },
  { x: 836, y: 262, r: 38, o: 0.75 },
  { x: 1000, y: 370, r: 34, o: 0.6 },
  { x: 1120, y: 40, r: 26, o: 0.5 },
  { x: 760, y: 60, r: 22, o: 0.45 },
];

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')?.slice(0, 12) ?? null;
  let mode: CampaignMode = 'expectativa';
  let inviter: { nombre: string; seq: number } | null = null;
  try {
    const store = polioStore();
    mode = await store.getMode();
    if (ref) {
      const c = await store.byRef(ref);
      if (c && c.estado === 'activo') inviter = { nombre: c.nombre.trim().split(/\s+/)[0].slice(0, 18), seq: c.seq };
    }
  } catch { /* sin base de datos: miniatura genérica */ }

  const kicker = inviter ? `${inviter.nombre} te invita · Globo nº ${inviter.seq}` : 'Día Mundial contra la Polio';
  const line1 = mode === 'lanzamiento' || inviter ? 'Pamplona se enciende' : 'Algo rojo llega';
  const line2 = mode === 'lanzamiento' || inviter ? 'de rojo.' : 'a la Plaza del Castillo.';
  const pill = '24 OCT · 19:30 · PLAZA DEL CASTILLO';
  const brand = 'ROTARY CLUB PAMPLONA  ×  ROTARACT HORIZON PAMPLONA';

  const [serif, serifItalic, sans] = await Promise.all([
    googleFont('Instrument+Serif', line1),
    googleFont('Instrument+Serif', line2, ':ital@1'),
    googleFont('Inter:wght@600', kicker + pill + brand + '#PamplonaContraLaPolio'),
  ]);

  const png = new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', position: 'relative',
          background: '#0B0507', fontFamily: 'Inter', color: '#FFF5EE',
        }}
      >
        {/* Resplandor rojo de la plaza */}
        <div style={{
          position: 'absolute', left: 420, top: -160, width: 1100, height: 1100, borderRadius: 9999, display: 'flex',
          backgroundImage: 'radial-gradient(circle, rgba(228,38,47,0.85) 0%, rgba(160,12,24,0.45) 35%, rgba(11,5,7,0) 68%)',
        }} />
        {BALLOONS.map((b, i) => (
          <div key={i} style={{ position: 'absolute', left: b.x - b.r, top: b.y, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: b.o }}>
            <div style={{
              width: b.r * 2, height: b.r * 2.36, borderRadius: '50%', display: 'flex', position: 'relative',
              background: '#D81E2A',
            }}>
              <div style={{
                position: 'absolute', left: b.r * 0.42, top: b.r * 0.38, width: b.r * 0.42, height: b.r * 0.7,
                borderRadius: '50%', background: 'rgba(255,190,185,0.55)', display: 'flex',
              }} />
            </div>
            <div style={{ width: 1.5, height: b.r * 2.4, background: 'rgba(255,215,215,0.45)', display: 'flex' }} />
          </div>
        ))}

        <div style={{ position: 'absolute', left: 72, top: 60, display: 'flex', flexDirection: 'column', width: 900 }}>
          <div style={{ fontSize: 20, letterSpacing: 2.5, color: '#FFB3B3', display: 'flex' }}>{brand}</div>
          <div style={{
            marginTop: 52, fontSize: 30, color: '#FFFFFF', display: 'flex', alignSelf: 'flex-start',
            padding: inviter ? '8px 18px' : '0', borderRadius: 9999,
            background: inviter ? 'rgba(228,38,47,0.9)' : 'transparent',
          }}>{kicker}</div>
          <div style={{ marginTop: 22, fontFamily: 'Instrument Serif', fontSize: 92, lineHeight: 1, display: 'flex', whiteSpace: 'nowrap' }}>{line1}</div>
          <div style={{ fontFamily: 'Instrument Serif Italic', fontSize: mode === 'lanzamiento' || inviter ? 92 : 72, lineHeight: 1.1, whiteSpace: 'nowrap', color: '#FF6B6B', display: 'flex' }}>{line2}</div>
        </div>

        <div style={{ position: 'absolute', left: 72, bottom: 64, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', padding: '14px 26px', borderRadius: 9999, background: '#FFF5EE', color: '#B5121B', fontSize: 28 }}>{pill}</div>
          <div style={{ display: 'flex', fontSize: 24, color: '#FFB3B3' }}>#PamplonaContraLaPolio</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 },
        { name: 'Instrument Serif Italic', data: serifItalic, style: 'normal', weight: 400 },
        { name: 'Inter', data: sans, style: 'normal', weight: 600 },
      ],
    },
  );

  // JPG: los degradados en PNG superan los 300 KB y WhatsApp puede omitir la miniatura.
  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
