'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  animate, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue,
} from 'motion/react';
import {
  ArrowDown, Building2, CalendarPlus, Copy, HandHeart, Heart, MapPin, Megaphone, Navigation, Share2, Users,
} from 'lucide-react';
import { BalloonCanvas } from './BalloonCanvas';
import { Countdown } from './Countdown';
import { PlazaScene } from './PlazaScene';
import { RegisterForm, type Registered } from './RegisterForm';
import { HeroBackdrop } from './HeroBackdrop';
import { HERO_VARIANTS, polioCampaign, polioEvent, polioLogos, type CampaignMode, type HeroBackdropVariant } from '@/lib/polio/config';

const EASE = [0.16, 1, 0.3, 1] as const;

/* --------------------------------- helpers -------------------------------- */

function shareUrl(ref?: string) {
  const u = new URL('/polio', window.location.origin);
  u.searchParams.set('utm_source', 'whatsapp');
  u.searchParams.set('utm_medium', ref ? 'referral' : 'share');
  u.searchParams.set('utm_campaign', 'polio2026');
  if (ref) u.searchParams.set('ref', ref);
  return u.toString();
}
const waLink = (url: string) => `https://wa.me/?text=${encodeURIComponent(`${polioCampaign.shareText} ${url}`)}`;

function useToast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(''), 2200);
    return () => clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div role="status" className="fixed left-1/2 bottom-24 z-[70] -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0B0507] shadow-2xl">
      {msg}
    </div>
  ) : null;
  return { toast: setMsg, node };
}

async function copyText(text: string, toast: (m: string) => void) {
  try { await navigator.clipboard.writeText(text); toast('Enlace copiado'); }
  catch { window.prompt('Copia este enlace:', text); }
}

function Reveal({ children, delay = 0, className = '', y = 24 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
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

function CountUp({ to, decimals = 0, prefix = '', suffix = '', group = true }: { to: number; decimals?: number; prefix?: string; suffix?: string; group?: boolean }) {
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

/** Texto que se ilumina palabra a palabra con el scroll. */
function ScrollText({ text, accent = [] }: { text: string; accent?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="font-display text-[34px] leading-[1.12] sm:text-[52px] lg:text-[64px] max-w-5xl">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={accent.includes(w.replace(/[.,]/g, ''))}>
          {w}
        </Word>
      ))}
    </p>
  );
}
function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className={`inline-block mr-[0.25em] ${accent ? 'italic text-[#FF5A5A]' : 'text-white'}`}>
      {children}
    </motion.span>
  );
}

function Lockup({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const h = size === 'lg' ? 'h-12' : 'h-8';
  return (
    <span className="inline-flex items-center gap-3 sm:gap-4">
      {polioLogos.rotaryClub ? (
        <Image src={polioLogos.rotaryClub} alt="Rotary Club Pamplona" width={200} height={60} className={`${h} w-auto`} />
      ) : (
        <span className="leading-tight">
          <span className={`block font-semibold tracking-tight text-white ${size === 'lg' ? 'text-lg' : 'text-[15px]'}`}>Rotary Club Pamplona</span>
          {size === 'lg' && <span className="block text-xs text-white/50">Logo oficial pendiente</span>}
        </span>
      )}
      <span className="h-6 w-px bg-white/20" aria-hidden="true" />
      <Image src={polioLogos.rotaract} alt="Rotaract Horizon Pamplona" width={160} height={67} className={`${h} w-auto brightness-0 invert opacity-90`} />
    </span>
  );
}

/* --------------------------------- página --------------------------------- */

export function PolioLanding({ mode, initialCount, backdrop, showBackdropSwitcher = false }: {
  mode: CampaignMode; initialCount: number; backdrop: HeroBackdropVariant; showBackdropSwitcher?: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [me, setMe] = useState<Registered | null>(null);
  const [showBar, setShowBar] = useState(false);
  const { toast, node: toastNode } = useToast();
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 160]);
  const heroFade = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const formInView = useInView(formRef, { margin: '-20% 0px' });
  const launch = mode === 'lanzamiento';
  const lowCount = count < polioCampaign.counterThreshold;

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const id = setInterval(() => {
      fetch('/api/polio/stats').then((r) => r.json()).then((d) => typeof d.count === 'number' && setCount(d.count)).catch(() => {});
    }, 60_000);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(id); };
  }, []);

  const onRegistered = (r: Registered) => {
    setMe(r);
    setCount(r.count);
  };

  const myUrl = me ? shareUrl(me.ref) : null;
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${polioCampaign.name} · ${polioEvent.place}`)}&dates=20261024T173000Z/20261024T190000Z&location=${encodeURIComponent(polioEvent.address)}`;

  return (
    <div className="polio min-h-screen bg-[#0B0507] text-white selection:bg-[#E4262F]/50">
      <a href="#participa" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-[#0B0507]">
        Ir al registro
      </a>

      {/* ------------------------------ NAV ------------------------------ */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6 pt-4">
        <nav aria-label="Campaña" className="polio-glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-2.5 pl-5 pr-2.5">
          <Link href="/polio" aria-label="Pamplona contra la Polio, inicio"><Lockup /></Link>
          <a href="#participa" className="hidden sm:inline-flex rounded-full bg-[#E4262F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#F0333C]">
            Quiero participar
          </a>
        </nav>
      </header>

      <main>
        {/* ------------------------------ HERO ----------------------------- */}
        <section ref={heroRef} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
          <HeroBackdrop variant={backdrop} sectionRef={heroRef} />
          <BalloonCanvas ambient count={reduce ? 14 : 30} className="absolute inset-0 -z-10 h-full w-full" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#0B0507] to-transparent" aria-hidden="true" />

          <motion.div style={{ y: reduce ? 0 : heroY, opacity: reduce ? 1 : heroFade }} className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.2em] text-[#FFB3B3]"
            >
              <span className="relative flex size-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4B4B] opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-[#FF4B4B]" /></span>
              24 · 10 · 2026 — Día Mundial contra la Polio
            </motion.p>

            <h1 className="font-display text-[54px] leading-[0.95] sm:text-[88px] lg:text-[120px] tracking-[-0.02em] max-w-5xl">
              {(launch ? ['Pamplona se enciende', 'de rojo.'] : ['Algo rojo llega a la', 'Plaza del Castillo.']).map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className={`block ${i === 1 ? 'italic text-[#FF4B4B] polio-glow-text' : ''}`}
                    initial={reduce ? false : { y: '105%' }} animate={{ y: '0%' }}
                    transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <Reveal delay={0.5} className="mt-7 max-w-xl">
              <p className="text-lg sm:text-xl leading-relaxed text-white/70">
                {launch
                  ? 'El 24 de octubre a las 19:30 la Plaza del Castillo se ilumina de rojo y lanzamos globos rojos por los niños que aún no están protegidos.'
                  : 'El 24 de octubre a las 19:30 va a pasar algo en el corazón de Pamplona. Suma tu globo y te lo contamos antes que a nadie.'}
              </p>
            </Reveal>

            <Reveal delay={0.65} className="mt-10">
              <Countdown target={polioEvent.start} doneLabel="La plaza ya brilla en rojo. Gracias, Pamplona." />
            </Reveal>

            <Reveal delay={0.8} className="mt-10 flex flex-col sm:flex-row gap-3">
              <a href="#participa" className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#E4262F] px-8 py-4 text-[17px] font-semibold text-white shadow-[0_10px_50px_-10px_rgba(228,38,47,0.95)] transition hover:bg-[#F0333C]">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                Quiero sumar mi globo
              </a>
              <a href="/polio/evento.ics" className="polio-glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[16px] font-medium text-white transition hover:bg-white/10">
                <CalendarPlus className="size-5" /> Añadir al calendario
              </a>
            </Reveal>

            <Reveal delay={0.95} className="mt-8">
              <p className="text-[15px] text-white/55">
                {lowCount
                  ? <>Sé de los primeros en sumarte · meta: <strong className="text-white">{polioCampaign.goal} globos</strong></>
                  : <><strong className="text-white text-lg tabular-nums">{count}</strong> vecinos ya han sumado su globo · meta: {polioCampaign.goal}</>}
              </p>
            </Reveal>
          </motion.div>

          <a href="#polio" aria-label="Seguir leyendo" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-white">
            <ArrowDown className={`size-6 ${reduce ? '' : 'animate-bounce'}`} />
          </a>
        </section>

        {/* ---------------------------- LA POLIO --------------------------- */}
        <section id="polio" className="relative mx-auto max-w-6xl px-5 sm:px-8 py-28 sm:py-40">
          <Reveal><p className="polio-eyebrow">La enfermedad</p></Reveal>
          <ScrollText
            text="La polio no tiene cura. Ataca sobre todo a niños menores de cinco años y puede dejar parálisis para siempre en cuestión de horas. Pero tiene vacuna. Y gracias a ella, estamos a punto de vencerla."
            accent={['cura', 'vacuna', 'vencerla']}
          />

          <div className="mt-24 sm:mt-32">
            <Reveal><h2 className="font-display text-4xl sm:text-6xl max-w-3xl">Hemos recorrido más del <span className="italic text-[#FF4B4B] whitespace-nowrap">99 %</span> del camino.</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-4 max-w-2xl text-lg text-white/60">Pero el último tramo es el más difícil: mientras el virus circule en un solo país, puede volver a viajar a cualquier otro.</p></Reveal>
            <ProgressBar />
          </div>

          <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: <CountUp to={350000} prefix="≈ " />, t: 'niños paralizados al año en 1988, en 125 países.' },
              { n: <CountUp to={2} />, t: 'países donde aún circula el virus salvaje: Pakistán y Afganistán.' },
              { n: <CountUp to={1985} group={false} />, t: 'año en que Rotary se comprometió a erradicarla con PolioPlus.' },
              { n: <CountUp to={0} />, t: 'curas. Solo la vacuna protege, y cuesta céntimos.' },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <article className="polio-card h-full rounded-3xl p-7">
                  <p className="font-display text-5xl sm:text-6xl text-[#FF4B4B] tabular-nums">{f.n}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/65">{f.t}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/40">
            Fuentes: <a className="underline underline-offset-2 hover:text-white" href={polioCampaign.gpeiUrl} target="_blank" rel="noopener noreferrer">GPEI</a> y{' '}
            <a className="underline underline-offset-2 hover:text-white" href={polioCampaign.endPolioUrl} target="_blank" rel="noopener noreferrer">End Polio Now</a>. Cifras aproximadas, pendientes de validación.
          </p>
        </section>

        {/* --------------------------- LA INICIATIVA ------------------------ */}
        <section id="iniciativa" className="relative overflow-hidden pt-24 sm:pt-32">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal><p className="polio-eyebrow">La iniciativa</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl max-w-4xl leading-[0.98]">
                {launch ? <>La plaza se enciende <span className="italic text-[#FF4B4B]">de rojo.</span></> : <>¿Qué pasará a las <span className="italic text-[#FF4B4B]">19:30</span>?</>}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/65">
                {launch
                  ? 'Cada globo rojo representa a un niño que merece crecer sin polio. Con la Plaza del Castillo iluminada en el rojo de End Polio Now, Pamplona recordará que el último tramo depende de todos.'
                  : 'Pamplona va a hacer visible una lucha que casi hemos ganado. Todavía no podemos contarte más. Una pista: mira hacia arriba.'}
              </p>
            </Reveal>
          </div>

          <div className="relative mt-10">
            {launch && <BalloonCanvas ambient count={reduce ? 12 : 26} speed={0.8} className="absolute inset-0 h-full w-full" />}
            <PlazaScene mode={mode} />
          </div>

          <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24 sm:pb-32 -mt-2">
            {launch ? (
              <ol className="grid gap-4 sm:grid-cols-3">
                {polioEvent.programme.map((p, i) => (
                  <Reveal key={p.time} delay={i * 0.1} className="h-full">
                    <li className="polio-card h-full rounded-3xl p-6">
                      <p className="font-display text-4xl text-[#FF4B4B] tabular-nums">{p.time}</p>
                      <p className="mt-2 text-white/75">{p.text}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            ) : (
              <Reveal>
                <div className="polio-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl p-6 sm:p-8">
                  <p className="text-lg text-white/80">Lo revelaremos primero a quienes hayan sumado su globo.</p>
                  <a href="#participa" className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-[#0B0507] transition hover:bg-[#FFE3E3]">Quiero saberlo</a>
                </div>
              </Reveal>
            )}
            <Reveal delay={0.1}>
              <p className="mt-10 max-w-3xl text-white/55 leading-relaxed">
                Rotary lidera la erradicación de la polio desde 1985 con el programa PolioPlus, junto a la OMS, UNICEF y otros socios de la Iniciativa Mundial.
                Rotary Club Pamplona, con el apoyo de Rotaract Horizon Pamplona, se suma al Día Mundial contra la Polio desde el corazón de la ciudad.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------- EL CIELO --------------------------- */}
        <section id="cielo" className="relative isolate overflow-hidden border-y border-white/10 bg-gradient-to-b from-[#12070A] via-[#1A080C] to-[#0B0507] py-28 sm:py-36">
          <BalloonCanvas
            count={Math.min(count, 240)}
            highlightLabel={me ? `Tu globo · nº ${me.seq}` : null}
            speed={0.6}
            className="absolute inset-0 -z-10 h-full w-full"
          />
          <div className="mx-auto max-w-6xl px-5 sm:px-8 text-center">
            <Reveal><p className="polio-eyebrow justify-center">El cielo de Pamplona</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mx-auto font-display text-5xl sm:text-7xl max-w-4xl leading-[0.98]">
                Cada globo es una persona <span className="italic text-[#FF4B4B]">que se suma.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <GoalRing count={count} goal={polioCampaign.goal} />
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-xl text-white/60">
                {me ? '¡Ahí está el tuyo! Ahora invita a tres personas y haz que el cielo se llene.' : 'Suma el tuyo y míralo subir. Queremos llenar el cielo antes del 24 de octubre.'}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------------------- INVITACIÓN -------------------------- */}
        <section id="invitacion" className="mx-auto max-w-6xl px-5 sm:px-8 py-28 sm:py-36">
          <Reveal><p className="polio-eyebrow">La invitación</p></Reveal>
          <Reveal delay={0.05}><h2 className="font-display text-5xl sm:text-7xl max-w-3xl leading-[0.98]">Te esperamos. <span className="italic text-[#FF4B4B]">Así puedes sumarte.</span></h2></Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: MapPin, t: 'Ven a la plaza', d: `${polioEvent.dateLabel}, ${polioEvent.timeLabel}. ${polioEvent.place}.` },
              { icon: Users, t: 'Hazte voluntario', d: 'Ayúdanos con el montaje, los globos y la difusión.' },
              { icon: HandHeart, t: 'Dona', d: 'Cada euro de Rotary para la polio se multiplica con sus aliados.', href: polioCampaign.donateUrl },
              { icon: Megaphone, t: 'Difunde', d: 'Reenvía esta página a tus grupos de WhatsApp.' },
              { icon: Building2, t: 'Patrocina', d: 'Empresas de Pamplona junto a una causa global.' },
            ].map((w, i) => (
              <Reveal key={w.t} delay={i * 0.06}>
                <article className="polio-card group h-full rounded-3xl p-6 transition duration-500 hover:-translate-y-1 hover:border-[#FF4B4B]/50">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#E4262F]/15 text-[#FF6B6B] transition group-hover:bg-[#E4262F] group-hover:text-white">
                    <w.icon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{w.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/60">{w.d}</p>
                  {w.href && (
                    <a href={w.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[15px] font-semibold text-[#FF6B6B] underline-offset-4 hover:underline">Donar en End Polio Now →</a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="polio-ticket mt-8 grid gap-6 rounded-[28px] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/70">Tu cita</p>
                <p className="mt-2 font-display text-4xl sm:text-6xl leading-none">{polioEvent.dateLabel} · {polioEvent.timeLabel}</p>
                <p className="mt-3 text-lg text-white/80">{polioEvent.place}, {polioEvent.city}</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <a href="/polio/evento.ics" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-[#B5121B] transition hover:bg-[#FFE3E3]"><CalendarPlus className="size-5" /> Calendario</a>
                <a href={gcal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 font-medium transition hover:bg-white/10">Google Calendar</a>
                <a href={polioEvent.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 font-medium transition hover:bg-white/10"><Navigation className="size-4" /> Cómo llegar</a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ----------------------------- REGISTRO --------------------------- */}
        <section id="participa" ref={formRef} className="relative isolate overflow-hidden py-28 sm:py-36">
          <div className="polio-aurora absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
          <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <Reveal><p className="polio-eyebrow">Regístrate</p></Reveal>
              <Reveal delay={0.05}><h2 className="font-display text-5xl sm:text-7xl leading-[0.98]">Suma tu globo <span className="italic text-[#FF4B4B]">al cielo de Pamplona.</span></h2></Reveal>
              <Reveal delay={0.12}>
                <ul className="mt-8 space-y-3 text-white/70">
                  <li className="flex gap-3"><Heart className="mt-0.5 size-5 shrink-0 text-[#FF6B6B]" /> Serás de los primeros en conocer la iniciativa.</li>
                  <li className="flex gap-3"><Heart className="mt-0.5 size-5 shrink-0 text-[#FF6B6B]" /> Pocos mensajes por WhatsApp, solo de esta campaña.</li>
                  <li className="flex gap-3"><Heart className="mt-0.5 size-5 shrink-0 text-[#FF6B6B]" /> Tu propio enlace para invitar y ver tu globo volar.</li>
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="polio-glass-strong rounded-[32px] p-6 sm:p-10">
                {me && myUrl ? (
                  <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: EASE }} className="text-center" tabIndex={-1} ref={(el) => el?.focus()}>
                    <div className="relative mx-auto h-40 w-28" aria-hidden="true">
                      <motion.div className="absolute inset-0" initial={reduce ? false : { y: 60, opacity: 0 }} animate={{ y: [60, -6, 0], opacity: 1 }} transition={{ duration: 1.6, ease: EASE }}>
                        <div className="polio-balloon mx-auto" />
                      </motion.div>
                    </div>
                    <p className="polio-eyebrow justify-center mt-2">Globo nº {me.seq}</p>
                    <h3 className="font-display text-4xl sm:text-5xl">¡Gracias, {me.nombre}! <span className="italic text-[#FF4B4B]">Tu globo ya vuela.</span></h3>
                    <p className="mx-auto mt-4 max-w-sm text-white/65">Ayúdanos a llegar a {polioCampaign.goal}: invita a tres personas. Tu enlace muestra tu invitación personal en WhatsApp.</p>
                    <div className="mt-8 flex flex-col gap-3">
                      <a href={waLink(myUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-[17px] font-semibold text-[#062B14] transition hover:brightness-110">
                        <Share2 className="size-5" /> Invitar por WhatsApp
                      </a>
                      <button type="button" onClick={() => copyText(myUrl, toast)} className="polio-glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium transition hover:bg-white/10">
                        <Copy className="size-4" /> Copiar mi enlace
                      </button>
                      <a href="#cielo" className="text-sm text-white/55 underline underline-offset-4 hover:text-white">Ver mi globo en el cielo</a>
                    </div>
                  </motion.div>
                ) : (
                  <RegisterForm onRegistered={onRegistered} />
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------- COMPARTE --------------------------- */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-24 text-center">
          <Reveal><h2 className="mx-auto font-display text-4xl sm:text-6xl max-w-3xl">Un mensaje en tu grupo puede sumar <span className="italic text-[#FF4B4B]">diez globos.</span></h2></Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
              <ShareButtons toast={toast} />
            </div>
            <p className="mt-8 text-lg font-semibold tracking-wide text-[#FF6B6B]">{polioCampaign.hashtag}</p>
          </Reveal>
        </section>

        {/* ------------------------------- FAQ ------------------------------ */}
        <section className="mx-auto max-w-3xl px-5 sm:px-8 pb-28">
          <Reveal><h2 className="font-display text-4xl sm:text-5xl mb-8">Preguntas frecuentes</h2></Reveal>
          {[
            ['¿Hay riesgo de polio en España?', 'España está libre de polio, pero mientras el virus circule en algún país puede volver a viajar. Mantener la vacunación es la mejor protección: consulta el calendario vacunal con tu centro de salud.'],
            ['¿Qué haréis con mis datos?', 'Solo los usamos para informarte de esta campaña. No los cedemos ni los vendemos. Cada mensaje incluye cómo darte de baja.'],
            ['¿A dónde va el dinero que done?', 'Las donaciones en línea van directamente a la Fundación Rotaria para el programa PolioPlus, a través de End Polio Now.'],
            ['¿Tengo que ser socio de Rotary?', 'No. La campaña está abierta a todo el mundo, de cualquier edad.'],
            ['¿Qué pasa si llueve?', 'Si cambia algo, avisaremos por WhatsApp a las personas registradas.'],
          ].map(([q, a]) => (
            <details key={q} className="group border-b border-white/10 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                {q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/20 text-white/70 transition group-open:rotate-45 group-open:border-[#FF4B4B] group-open:text-[#FF4B4B]">+</span>
              </summary>
              <p className="mt-3 pr-12 leading-relaxed text-white/60">{a}</p>
            </details>
          ))}
        </section>
      </main>

      {/* ------------------------------ FOOTER ----------------------------- */}
      <footer className="border-t border-white/10 px-5 sm:px-8 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Una iniciativa de</p>
            <Lockup size="lg" />
            {polioLogos.endPolioNow ? (
              <Image src={polioLogos.endPolioNow} alt="End Polio Now" width={180} height={60} className="mt-6 h-10 w-auto" />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
            <Link href="/polio/privacidad" className="hover:text-white">Privacidad y aviso legal</Link>
            <a href={polioCampaign.endPolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">End Polio Now</a>
            <Link href="/" className="hover:text-white">Rotaract Horizon Pamplona</Link>
          </div>
        </div>
      </footer>

      {/* Barra fija en móvil */}
      <motion.div
        initial={false}
        animate={{ y: showBar && !formInView && !me ? 0 : 120 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-3 bottom-3 z-[60] sm:hidden"
      >
        <a href="#participa" className="polio-glass-strong flex items-center justify-between rounded-full py-2 pl-5 pr-2">
          <span className="text-sm font-medium">24 oct · 19:30 · Plaza del Castillo</span>
          <span className="rounded-full bg-[#E4262F] px-4 py-2.5 text-sm font-semibold">Participar</span>
        </a>
      </motion.div>

      {showBackdropSwitcher && (
        <div className="fixed bottom-20 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-1.5 rounded-2xl bg-black/75 p-2 text-xs backdrop-blur-md sm:bottom-auto sm:left-auto sm:right-6 sm:top-24 sm:translate-x-0 sm:flex-col sm:items-stretch">
          <span className="px-2 pt-1 text-white/50">Fondo</span>
          {HERO_VARIANTS.map((v) => (
            <a key={v} href={`?fondo=${v}`} className={`rounded-xl px-3 py-1.5 font-medium capitalize ${v === backdrop ? 'bg-[#E4262F] text-white' : 'text-white/75 hover:bg-white/10'}`}>{v}</a>
          ))}
        </div>
      )}

      {toastNode}
    </div>
  );
}

function ShareButtons({ toast }: { toast: (m: string) => void }) {
  return (
    <>
      <a href="https://wa.me/" onClick={(e) => { e.currentTarget.href = waLink(shareUrl()); }} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-[17px] font-semibold text-[#062B14] transition hover:brightness-110">
        <Share2 className="size-5" /> Compartir por WhatsApp
      </a>
      <button type="button" onClick={() => copyText(shareUrl(), toast)} className="polio-glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-medium transition hover:bg-white/10">
        <Copy className="size-4" /> Copiar enlace
      </button>
    </>
  );
}

function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="mt-12">
      <div className="relative h-5 sm:h-6 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#5A0710] via-[#B5121B] to-[#E4262F]"
          initial={{ width: reduce ? '99%' : '0%' }}
          animate={{ width: inView ? '99%' : reduce ? '99%' : '0%' }}
          transition={{ duration: 2.4, ease: EASE }}
        />
        <div className="polio-last-mile absolute inset-y-0 right-0 w-[1%] min-w-[10px] rounded-full bg-[#FF4B4B]" />
      </div>
      <div className="mt-3 flex justify-between text-xs sm:text-sm text-white/45">
        <span>1988 · ≈ 350.000 casos al año</span>
        <span className="text-[#FF6B6B] font-medium">El último 1&nbsp;%</span>
      </div>
    </div>
  );
}

function GoalRing({ count, goal }: { count: number; goal: number }) {
  const pct = Math.min(1, count / goal);
  const R = 88, C = 2 * Math.PI * R;
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mt-12 size-56 sm:size-64">
      <svg viewBox="0 0 200 200" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <motion.circle
          cx="100" cy="100" r={R} fill="none" stroke="#FF4B4B" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: reduce ? C * (1 - pct) : C }}
          whileInView={{ strokeDashoffset: C * (1 - pct) }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: EASE }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,75,75,0.8))' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <p className="font-display text-6xl sm:text-7xl tabular-nums leading-none"><CountUp to={count} /></p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">de {goal} globos</p>
      </div>
    </div>
  );
}
