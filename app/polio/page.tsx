import type { Metadata } from 'next';
import { PolioLanding } from '@/components/polio/PolioLanding';
import { polioStore } from '@/lib/polio/store';
import { polioCampaign, type CampaignMode } from '@/lib/polio/config';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function campaignState(): Promise<{ mode: CampaignMode; count: number }> {
  try {
    const store = polioStore();
    const [mode, count] = await Promise.all([store.getMode(), store.count()]);
    return { mode, count };
  } catch (err) {
    console.error('[polio] sin base de datos', err);
    return { mode: 'expectativa', count: 0 };
  }
}

/** Nombre de pila de quien invita (?ref=), solo si su registro sigue activo. */
async function inviterName(ref: string | null): Promise<string | null> {
  if (!ref) return null;
  try {
    const c = await polioStore().byRef(ref);
    return c?.estado === 'activo' ? c.nombre.trim().split(/\s+/)[0] : null;
  } catch { return null; }
}

const refParam = (v: string | string[] | undefined) => (typeof v === 'string' ? v.slice(0, 12) : null);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const ref = refParam(sp.ref);
  const { mode } = await campaignState();

  const inviter = await inviterName(ref);

  const title = inviter
    ? `${inviter} te invita · Pamplona contra la Polio 2026`
    : 'Pamplona contra la Polio 2026 · 24 oct, Plaza del Castillo';
  const description =
    mode === 'lanzamiento' || inviter
      ? 'La Plaza del Castillo se enciende de rojo. 24 de octubre, 19:30. Suma tu globo.'
      : 'Algo rojo llega a la Plaza del Castillo el 24 de octubre a las 19:30. Suma tu globo.';
  // La URL cambia con la fase y el referido: WhatsApp cachea la miniatura por URL.
  const image = `/api/polio/og-image?${new URLSearchParams({
    ...(ref && inviter ? { ref } : { m: mode }),
    v: polioCampaign.ogVersion,
  })}`;
  const url = ref && inviter ? `/polio?ref=${encodeURIComponent(ref)}` : '/polio';

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/polio' },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      siteName: 'Rotary Club Pamplona · Rotaract Horizon Pamplona',
      title,
      description,
      url,
      images: [{ url: image, type: 'image/jpeg', width: 1200, height: 630, alt: 'Pamplona contra la Polio · 24 de octubre, 19:30, Plaza del Castillo' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function PolioPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [{ mode, count }, inviter] = await Promise.all([campaignState(), inviterName(refParam(sp.ref))]);
  return <PolioLanding mode={mode} initialCount={count} inviter={inviter} />;
}
