'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { INTERESTS } from '@/lib/polio/config';

export interface Registered { seq: number; ref: string; nombre: string; count: number }

const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'ref'] as const;

/** Guarda UTM y referido de la primera visita para atribuir el registro. */
function attribution() {
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ATTR_KEYS) {
    let v = params.get(k);
    try { if (v) sessionStorage.setItem(`polio_${k}`, v); else v = sessionStorage.getItem(`polio_${k}`); } catch { /* sin almacenamiento */ }
    if (v) out[k] = v.slice(0, 60);
  }
  return out;
}

const field =
  'w-full min-h-[52px] rounded-xl bg-white/[0.06] border border-white/15 px-4 text-[17px] text-white placeholder:text-white/35 ' +
  'outline-none transition focus:border-[#FF4B4B] focus:bg-white/[0.09] focus:ring-4 focus:ring-[#FF4B4B]/20 aria-[invalid=true]:border-[#FF6B6B]';

export function RegisterForm({ onRegistered }: { onRegistered: (r: Registered) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [chosen, setChosen] = useState<string[]>(['asistir']);
  const loadedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { loadedAt.current = Date.now(); attribution(); }, []);

  const toggle = (id: string) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

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
    errors[name] ? <p id={`${name}-err`} className="mt-2 text-sm text-[#FF8A8A]">{errors[name]}</p> : null;

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="p-nombre" className="block text-sm font-medium text-white/80 mb-2">Nombre</label>
          <input id="p-nombre" name="nombre" autoComplete="given-name" maxLength={80} required className={field}
            aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? 'nombre-err' : undefined} />
          {err('nombre')}
        </div>
        <div>
          <label htmlFor="p-whatsapp" className="block text-sm font-medium text-white/80 mb-2">WhatsApp</label>
          <input id="p-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="612 345 678" required className={field}
            aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? 'whatsapp-err' : 'whatsapp-hint'} />
          {err('whatsapp') ?? <p id="whatsapp-hint" className="mt-2 text-xs text-white/45">Fuera de España, añade el prefijo (p. ej. +33).</p>}
        </div>
      </div>

      <div>
        <label htmlFor="p-email" className="block text-sm font-medium text-white/80 mb-2">
          Correo <span className="font-normal text-white/45">(opcional)</span>
        </label>
        <input id="p-email" name="email" type="email" autoComplete="email" maxLength={120} className={field}
          aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-err' : undefined} />
        {err('email')}
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-white/80 mb-3">¿Cómo quieres sumarte?</legend>
        <div className="flex flex-wrap gap-2.5">
          {INTERESTS.map((i) => {
            const on = chosen.includes(i.id);
            return (
              <button
                key={i.id} type="button" role="checkbox" aria-checked={on} onClick={() => toggle(i.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[15px] font-medium transition
                  ${on ? 'border-[#FF4B4B] bg-[#E4262F] text-white shadow-[0_6px_24px_-6px_rgba(228,38,47,0.7)]' : 'border-white/15 bg-white/[0.04] text-white/80 hover:border-white/35'}`}
              >
                <span className={`grid place-items-center size-4 rounded-full border ${on ? 'border-white bg-white text-[#E4262F]' : 'border-white/40'}`}>
                  {on && <Check className="size-3" strokeWidth={3} />}
                </span>
                {i.label}
              </button>
            );
          })}
        </div>
        {err('intereses')}
      </fieldset>

      {/* Honeypot: invisible para personas */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="p-website">No rellenes este campo</label>
        <input id="p-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[15px] text-white/85 cursor-pointer">
          <input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-[#E4262F]"
            aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'consent-err' : undefined} />
          <span>Acepto que Rotary Club Pamplona trate mis datos para informarme de esta campaña por WhatsApp y correo. Puedo darme de baja cuando quiera.</span>
        </label>
        {err('consent')}
      </div>

      <p className="text-xs leading-relaxed text-white/45">
        Responsable: Rotary Club Pamplona. Finalidad: informarte de la campaña contra la polio 2026. Legitimación: tu consentimiento.
        No cedemos tus datos. Derechos de acceso, rectificación, supresión y otros en la{' '}
        <Link href="/polio/privacidad" className="underline underline-offset-2 hover:text-white">política de privacidad</Link>.
      </p>

      <button
        type="submit" disabled={sending}
        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#E4262F] px-8 py-4 text-[17px] font-semibold text-white
          shadow-[0_10px_40px_-10px_rgba(228,38,47,0.9)] transition hover:bg-[#F0333C] active:scale-[0.99] disabled:opacity-70"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        {sending ? <><Loader2 className="size-5 animate-spin" /> Soltando tu globo…</> : 'Quiero sumar mi globo'}
      </button>

      <AnimatePresence>
        {message && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="text-[15px] text-[#FF8A8A]">
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
