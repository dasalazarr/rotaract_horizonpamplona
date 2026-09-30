'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { INTERESTS } from '@/lib/polio/config';
import { attribution, type Registered } from './shared';

const field =
  'peer w-full border-0 border-b border-white/20 bg-transparent px-0 pb-3 pt-7 text-[19px] text-white placeholder-transparent ' +
  'outline-none transition-colors focus:border-white aria-[invalid=true]:border-[#FF6B6B]';
const label =
  'pointer-events-none absolute left-0 top-7 text-[19px] text-white/40 transition-all ' +
  'peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-white/60 ' +
  'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-white/60';

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[120px_1fr] sm:gap-8">
      <legend className="contents">
        <span className="flex items-baseline gap-3 text-[13px] text-white/45 sm:block">
          <span className="font-mono text-white/70">{n}</span>
          <span className="sm:mt-1 sm:block">{title}</span>
        </span>
      </legend>
      <div>{children}</div>
    </fieldset>
  );
}

export function RegisterForm({ chosen, onToggle, onRegistered }: {
  chosen: string[]; onToggle: (id: string) => void; onRegistered: (r: Registered) => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const loadedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { loadedAt.current = Date.now(); attribution(); }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({}); setMessage('');
    const fd = new FormData(e.currentTarget);
    setSending(true);
    try {
      const res = await fetch('/api/polio/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: fd.get('nombre'), whatsapp: fd.get('whatsapp'), email: fd.get('email'),
          intereses: chosen, consent: fd.get('consent') === 'on',
          website: fd.get('website'), formLoadedAt: loadedAt.current, ...attribution(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setMessage(data.error ?? 'No se pudo enviar. Inténtalo de nuevo.');
        requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
        return;
      }
      onRegistered({ seq: data.seq, ref: data.ref, nombre: data.nombre, count: data.count });
    } catch {
      setMessage('Sin conexión. Revisa tu red e inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  }

  const err = (name: string) =>
    errors[name] ? <p id={`e-${name}-err`} className="mt-2 text-sm text-[#FF8A8A]">{errors[name]}</p> : null;

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid gap-10">
      <Step n="01" title="Cómo te sumas">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => {
            const on = chosen.includes(i.id);
            return (
              <button
                key={i.id} type="button" role="checkbox" aria-checked={on} onClick={() => onToggle(i.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium transition ${on ? 'border-white bg-white text-black' : 'border-white/20 text-white/75 hover:border-white/50 hover:text-white'}`}
              >
                {on && <Check className="size-3.5" strokeWidth={2.5} />}
                {i.label}
              </button>
            );
          })}
        </div>
        {err('intereses')}
      </Step>

      <Step n="02" title="Tus datos">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative">
            <input id="e-nombre" name="nombre" placeholder="Nombre" autoComplete="given-name" maxLength={80} required className={field}
              aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? 'e-nombre-err' : undefined} />
            <label htmlFor="e-nombre" className={label}>Nombre</label>
            {err('nombre')}
          </div>
          <div className="relative">
            <input id="e-whatsapp" name="whatsapp" type="tel" inputMode="tel" placeholder="WhatsApp" autoComplete="tel" required className={field}
              aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? 'e-whatsapp-err' : 'e-whatsapp-hint'} />
            <label htmlFor="e-whatsapp" className={label}>WhatsApp</label>
            {err('whatsapp') ?? <p id="e-whatsapp-hint" className="mt-2 text-xs text-white/40">Fuera de España, añade el prefijo (+33).</p>}
          </div>
          <div className="relative sm:col-span-2">
            <input id="e-email" name="email" type="email" placeholder="Correo" autoComplete="email" maxLength={120} className={field}
              aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'e-email-err' : undefined} />
            <label htmlFor="e-email" className={label}>Correo <span className="normal-case tracking-normal text-white/30">(opcional)</span></label>
            {err('email')}
          </div>
        </div>
      </Step>

      {/* Honeypot: invisible para personas */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="e-website">No rellenes este campo</label>
        <input id="e-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Step n="03" title="Confirmación">
        <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed text-white/80">
          <input type="checkbox" name="consent" required className="mt-1 size-[18px] shrink-0 accent-white"
            aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'e-consent-err' : undefined} />
          <span>Acepto que Rotary Club Pamplona trate mis datos para informarme de esta campaña por WhatsApp y correo. Puedo darme de baja cuando quiera.</span>
        </label>
        {err('consent')}
        <p className="mt-4 text-xs leading-relaxed text-white/40">
          Responsable: Rotary Club Pamplona. Finalidad: informarte de la campaña contra la polio 2026. Legitimación: tu consentimiento.
          No cedemos tus datos. Más información en la{' '}
          <Link href="/polio/privacidad" className="underline underline-offset-2 hover:text-white">política de privacidad</Link>.
        </p>
      </Step>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p role="alert" className="text-[15px] text-[#FF8A8A] sm:order-2">{message}</p>
        <button
          type="submit" disabled={sending}
          className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-[16px] font-medium text-black transition hover:bg-[#F2F2F2] active:scale-[0.99] disabled:opacity-60"
        >
          {sending ? <><Loader2 className="size-5 animate-spin" /> Soltando tu globo…</> : <>Sumar mi globo <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></>}
        </button>
      </div>
    </form>
  );
}
