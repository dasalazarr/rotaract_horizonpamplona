'use client';

import { useState } from 'react';
import Link from 'next/link';

export function UnsubscribeButton({ token }: { token: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  if (state === 'done') {
    return <p className="mt-8 text-lg text-white" role="status">Listo. No recibirás más mensajes. Gracias por tu apoyo.</p>;
  }

  return (
    <div className="mt-8 grid gap-3">
      <button
        type="button"
        disabled={!token || state === 'sending'}
        onClick={async () => {
          setState('sending');
          const r = await fetch('/api/polio/baja', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }),
          }).catch(() => null);
          setState(r?.ok ? 'done' : 'error');
        }}
        className="rounded-full bg-[#E4262F] px-6 py-3.5 font-semibold text-white transition hover:bg-[#F0333C] disabled:opacity-60"
      >
        {state === 'sending' ? 'Procesando…' : 'Confirmar baja'}
      </button>
      {(state === 'error' || !token) && (
        <p className="text-sm text-[#FF8A8A]" role="alert">El enlace no es válido o ya se usó.</p>
      )}
      <Link href="/polio" className="text-sm text-white/55 underline underline-offset-4 hover:text-white">Volver a la campaña</Link>
    </div>
  );
}
