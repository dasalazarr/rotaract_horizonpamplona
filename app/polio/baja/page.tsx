import type { Metadata } from 'next';
import { UnsubscribeButton } from './UnsubscribeButton';

export const metadata: Metadata = {
  title: { absolute: 'Darse de baja · Pamplona contra la Polio 2026' },
  robots: { index: false },
};

type Props = { searchParams: Promise<{ t?: string }> };

export default async function PolioUnsubscribePage({ searchParams }: Props) {
  const { t } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="polio-glass-strong w-full max-w-md rounded-[28px] p-8 text-center">
        <h1 className="font-display text-4xl text-white">Darse de baja</h1>
        <p className="mt-3 text-white/65">Dejarás de recibir mensajes de la campaña Pamplona contra la Polio 2026.</p>
        <UnsubscribeButton token={t ?? ''} />
      </div>
    </main>
  );
}
