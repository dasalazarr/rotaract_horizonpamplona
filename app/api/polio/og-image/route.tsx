import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import sharp from 'sharp';
import { polioStore } from '@/lib/polio/store';
import { polioEvent, polioHero, type CampaignMode } from '@/lib/polio/config';

/**
 * Miniatura Open Graph (1200×630) para WhatsApp y redes.
 * Replica el hero de /polio: la misma foto oscurecida, con el titular en serif y el acento rojo.
 * - Sin parámetros: la de la fase actual (expectativa / lanzamiento).
 * - ?ref=CODE: invitación personal («María te invita a sumarte»).
 */
export const runtime = 'nodejs';

const W = 1200;
const H = 630;

async function googleFont(family: string, text: string, style = '') {
  const url = `https://fonts.googleapis.com/css2?family=${family}${style}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { cache: 'force-cache' })).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) throw new Error(`Fuente no disponible: ${family}`);
  return (await fetch(src[1], { cache: 'force-cache' })).arrayBuffer();
}

/** Recorta y oscurece la foto del hero para que el titular quede legible, como el tratamiento CSS del sitio. */
async function heroPhotoDataUrl(origin: string): Promise<string> {
  const buf = Buffer.from(await (await fetch(`${origin}${polioHero.src}`, { cache: 'force-cache' })).arrayBuffer());
  const resized = sharp(buf).resize({ width: W });
  const { height: scaledHeight } = await resized.metadata();
  // object-position: 50% 30%, igual que en el hero.
  const top = Math.max(0, Math.min(Math.round(((scaledHeight ?? H) - H) * 0.3), (scaledHeight ?? H) - H));
  const jpg = await resized
    .extract({ left: 0, top, width: W, height: H })
    .modulate({ brightness: 0.48, saturation: 0.55 })
    .linear(1.1, -14)
    .jpeg({ quality: 88 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpg.toString('base64')}`;
}

function Dot() {
  return <div style={{ width: 4, height: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.4)', display: 'flex' }} />;
}

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')?.slice(0, 12) ?? null;
  let mode: CampaignMode = 'expectativa';
  let inviter: string | null = null;
  try {
    const store = polioStore();
    mode = await store.getMode();
    if (ref) {
      const c = await store.byRef(ref);
      if (c && c.estado === 'activo') inviter = c.nombre.trim().split(/\s+/)[0].slice(0, 18);
    }
  } catch { /* sin base de datos: miniatura genérica */ }

  const launch = mode === 'lanzamiento' || Boolean(inviter);
  const line1 = launch ? 'Pamplona se enciende' : 'Algo rojo llega';
  const line2 = launch ? 'de rojo.' : 'a la Plaza del Castillo.';
  const kicker = 'DÍA MUNDIAL CONTRA LA POLIO';
  const badge = inviter ? `${inviter} te invita a sumarte` : null;
  const brand = 'ROTARY CLUB PAMPLONA';
  const partner = 'ROTARACT HORIZON PAMPLONA';
  const hashtag = '#PamplonaContraLaPolio';
  const infoParts = [polioEvent.dateLabel.toUpperCase(), polioEvent.timeLabel.toUpperCase(), polioEvent.place.toUpperCase()];

  const [photo, serif, serifItalic, sans] = await Promise.all([
    heroPhotoDataUrl(req.nextUrl.origin),
    googleFont('Instrument+Serif', line1),
    googleFont('Instrument+Serif', line2, ':ital@1'),
    googleFont('Inter:wght@500;600', kicker + infoParts.join('') + (badge ?? '') + brand + partner + hashtag),
  ]);

  const png = new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', position: 'relative',
          background: '#000', fontFamily: 'Inter', color: '#FFFFFF',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} width={W} height={H} style={{ position: 'absolute', inset: 0, display: 'flex' }} alt="" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)' }} />

        {/* Kicker */}
        <div style={{ position: 'absolute', left: 64, top: 56, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 9, height: 9, borderRadius: 9999, background: '#FF4B4B', display: 'flex' }} />
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 3, color: 'rgba(255,255,255,0.9)', display: 'flex' }}>{kicker}</div>
        </div>

        {/* Titular */}
        <div style={{ position: 'absolute', left: 64, right: 64, bottom: 74, display: 'flex', flexDirection: 'column' }}>
          {badge && (
            <div style={{
              display: 'flex', alignSelf: 'flex-start', alignItems: 'center', gap: 12, marginBottom: 28,
              padding: '10px 22px 10px 12px', borderRadius: 9999, background: 'rgba(255,255,255,0.14)',
            }}>
              <div style={{
                display: 'flex', width: 32, height: 32, borderRadius: 9999, background: '#FFFFFF', color: '#000',
                fontSize: 18, fontWeight: 600, alignItems: 'center', justifyContent: 'center',
              }}>{inviter![0]}</div>
              <div style={{ display: 'flex', fontSize: 24 }}>{badge}</div>
            </div>
          )}

          <div style={{ display: 'flex', fontFamily: 'Instrument Serif', fontSize: 84, lineHeight: 1, letterSpacing: -1, whiteSpace: 'nowrap' }}>{line1}</div>
          <div style={{
            display: 'flex', fontFamily: 'Instrument Serif Italic', fontSize: launch ? 84 : 66, lineHeight: 1.12,
            letterSpacing: -1, whiteSpace: 'nowrap', color: '#FF4B4B', marginTop: 2,
          }}>{line2}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 32, fontSize: 21, fontWeight: 500, letterSpacing: 1, color: 'rgba(255,255,255,0.75)' }}>
            {infoParts.map((p, i) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {i > 0 && <Dot />}
                <div style={{ display: 'flex' }}>{p}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Firma */}
        <div style={{ position: 'absolute', left: 64, right: 64, bottom: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 16, fontWeight: 600, letterSpacing: 2, color: 'rgba(255,255,255,0.45)' }}>
            <div style={{ display: 'flex' }}>{brand}</div>
            <Dot />
            <div style={{ display: 'flex' }}>{partner}</div>
          </div>
          <div style={{ display: 'flex', fontSize: 16, fontWeight: 600, letterSpacing: 1, color: 'rgba(255,255,255,0.45)' }}>{hashtag}</div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 },
        { name: 'Instrument Serif Italic', data: serifItalic, style: 'normal', weight: 400 },
        { name: 'Inter', data: sans, style: 'normal', weight: 500 },
      ],
    },
  );

  // JPG: los degradados sobre foto en PNG superan los 300 KB y WhatsApp puede omitir la miniatura.
  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
