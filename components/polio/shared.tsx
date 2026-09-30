'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { polioCampaign } from '@/lib/polio/config';

export const EASE = [0.16, 1, 0.3, 1] as const;

export interface Registered { seq: number; ref: string; nombre: string; count: number }

const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'ref'] as const;

/** Guarda UTM y referido de la primera visita para atribuir el registro. */
export function attribution() {
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ATTR_KEYS) {
    let v = params.get(k);
    try { if (v) sessionStorage.setItem(`polio_${k}`, v); else v = sessionStorage.getItem(`polio_${k}`); } catch { /* sin almacenamiento */ }
    if (v) out[k] = v.slice(0, 60);
  }
  return out;
}

export function shareUrl(ref?: string) {
  const u = new URL('/polio', window.location.origin);
  u.searchParams.set('utm_source', 'whatsapp');
  u.searchParams.set('utm_medium', ref ? 'referral' : 'share');
  u.searchParams.set('utm_campaign', 'polio2026');
  if (ref) u.searchParams.set('ref', ref);
  return u.toString();
}
export const waLink = (url: string) => `https://wa.me/?text=${encodeURIComponent(`${polioCampaign.shareText} ${url}`)}`;

export function useToast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(''), 2200);
    return () => clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div role="status" className="fixed left-1/2 bottom-24 z-[70] -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-2xl">
      {msg}
    </div>
  ) : null;
  return { toast: setMsg, node };
}

export async function copyText(text: string, toast: (m: string) => void) {
  try { await navigator.clipboard.writeText(text); toast('Enlace copiado'); }
  catch { window.prompt('Copia este enlace:', text); }
}

export function Reveal({ children, delay = 0, className = '', y = 24 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ to, decimals = 0, prefix = '', suffix = '', group = true }: { to: number; decimals?: number; prefix?: string; suffix?: string; group?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduce = useReducedMotion();
  const fmt = (v: number) => prefix + v.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: group }) + suffix;
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) { ref.current.textContent = fmt(to); return; }
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (v) => { if (ref.current) ref.current.textContent = fmt(v); } });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, reduce]);
  return <span ref={ref}>{fmt(reduce ? to : 0)}</span>;
}
