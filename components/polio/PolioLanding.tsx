'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, CalendarPlus, Check, Clock, Copy, Lock, MapPin, Navigation, Plus, Share2,
} from 'lucide-react';
import { BalloonCanvas } from './BalloonCanvas';
import { PlazaScene } from './PlazaScene';
import { RegisterForm } from './RegisterForm';
import { CountUp, EASE, Reveal, copyText, shareUrl, useToast, waLink, type Registered } from './shared';
import { polioCampaign, polioEvent, polioHero, polioLogos, type CampaignMode } from '@/lib/polio/config';

const CHAPTERS = [
  { id: 'polio', n: '01', label: 'La polio' },
  { id: 'noche', n: '02', label: 'La noche' },
  { id: 'sumate', n: '03', label: 'Súmate' },
  { id: 'cielo', n: '04', label: 'El cielo' },
  { id: 'participa', n: '05', label: 'Registro' },
] as const;

const WAYS = [
  { id: 'asistir', title: 'Ven a la plaza', text: `${polioEvent.dateLabel}, ${polioEvent.timeLabel}. ${polioEvent.place}.`, tag: 'Presencial', photo: '50% 30%' },
  { id: 'voluntariado', title: 'Hazte voluntario', text: 'Montaje, globos y difusión. Te contamos cómo ayudar.', tag: 'Equipo', photo: '20% 60%' },
  { id: 'donar', title: 'Dona', text: 'Cada euro de Rotary para la polio se multiplica con sus aliados.', tag: 'End Polio Now', photo: null },
  { id: 'difundir', title: 'Difunde', text: 'Un mensaje en tu grupo de WhatsApp puede sumar diez globos.', tag: 'Online', photo: '80% 40%' },
  { id: 'patrocinar', title: 'Patrocina', text: 'Empresas de Pamplona junto a una causa global.', tag: 'Empresas', photo: null },
] as const;

const FAQ = [
  ['¿Hay riesgo de polio en España?', 'España está libre de polio, pero mientras el virus circule en algún país puede volver a viajar. Mantener la vacunación es la mejor protección: consulta el calendario vacunal con tu centro de salud.'],
  ['¿Qué haréis con mis datos?', 'Solo los usamos para informarte de esta campaña. No los cedemos ni los vendemos. Cada mensaje incluye cómo darte de baja.'],
  ['¿A dónde va el dinero que done?', 'Las donaciones en línea van directamente a la Fundación Rotaria para el programa PolioPlus, a través de End Polio Now.'],
  ['¿Tengo que ser socio de Rotary?', 'No. La campaña está abierta a todo el mundo, de cualquier edad.'],
  ['¿Qué pasa si llueve?', 'Si cambia algo, avisaremos por WhatsApp a las personas registradas.'],
] as const;

/* --------------------------------- hooks ---------------------------------- */

function useCountdown(target: string) {
  const t = Date.parse(target);
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => { setMs(Math.max(0, t - Date.now())); id = setTimeout(tick, 1000 - (Date.now() % 1000)); };
    tick();
    return () => clearTimeout(id);
  }, [t]);
  if (ms === null) return { done: false, d: '--', h: '--', m: '--', s: '--' };
  const s = Math.floor(ms / 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return { done: ms === 0, d: p(Math.floor(s / 86400)), h: p(Math.floor(s / 3600) % 24), m: p(Math.floor(s / 60) % 60), s: p(s % 60) };
}

/** Capítulo visible, para el índice del menú. */
function useActiveChapter() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

/* ------------------------------- primitivas ------------------------------- */

function Kicker({ n, children, className = '' }: { n?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white/45 ${className}`}>
      {n && <span className="font-mono text-white/70">{n}</span>}
      {n && <span className="h-px w-6 bg-white/25" aria-hidden="true" />}
      {children}
    </p>
  );
}

function Title({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`pe-sans text-[34px] leading-[1.05] sm:text-[48px] lg:text-[56px] ${className}`}>{children}</h2>;
}

function ScrollText({ text, accent }: { text: string; accent: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 50%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="font-display text-[36px] leading-[1.08] sm:text-[54px] lg:text-[68px] tracking-[-0.02em]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={accent.includes(w.replace(/[.,]/g, ''))}>{w}</Word>
      ))}
    </p>
  );
}
function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className={`mr-[0.22em] inline-block ${accent ? 'italic text-[#FF4B4B]' : ''}`}>{children}</motion.span>
  );
}

function Lockup() {
  return (
    <span className="inline-flex items-center gap-3">
      {polioLogos.rotaryClub
        ? <Image src={polioLogos.rotaryClub} alt="Rotary Club Pamplona" width={180} height={54} className="h-7 w-auto" />
        : <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-white sm:text-[13px]">Rotary Club Pamplona</span>}
      <span className="hidden h-4 w-px bg-white/25 sm:block" aria-hidden="true" />
      <Image src={polioLogos.rotaract} alt="Rotaract Horizon Pamplona" width={120} height={50} className="hidden h-6 w-auto brightness-0 invert opacity-80 sm:block" />
    </span>
  );
}

/* --------------------------------- página --------------------------------- */

export function PolioLanding({ mode, initialCount, inviter }: { mode: CampaignMode; initialCount: number; inviter: string | null }) {
  const [count, setCount] = useState(initialCount);
  const [me, setMe] = useState<Registered | null>(null);
  const [chosen, setChosen] = useState<string[]>(['asistir']);
  const [scrolled, setScrolled] = useState(false);
  const { toast, node: toastNode } = useToast();
  const reduce = useReducedMotion();
  const active = useActiveChapter();
  const cd = useCountdown(polioEvent.start);
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const formInView = useInView(formRef, { margin: '-20% 0px' });
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const photoY = useTransform(heroP, [0, 1], ['0%', '14%']);
  const copyY = useTransform(heroP, [0, 1], [0, -60]);
  const launch = mode === 'lanzamiento';
  const lowCount = count < polioCampaign.counterThreshold;
  const pct = Math.min(1, count / polioCampaign.goal);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const id = setInterval(() => {
      fetch('/api/polio/stats').then((r) => r.json()).then((d) => typeof d.count === 'number' && setCount(d.count)).catch(() => {});
    }, 60_000);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(id); };
  }, []);

  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const onRegistered = (r: Registered) => { setMe(r); setCount(r.count); };
  const myUrl = me ? shareUrl(me.ref) : null;
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${polioCampaign.name} · ${polioEvent.place}`)}&dates=20261024T173000Z/20261024T190000Z&location=${encodeURIComponent(polioEvent.address)}`;

  return (
    <div className="pe min-h-screen bg-black text-white selection:bg-[#E4262F]/60">
      <a href="#participa" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        Ir al registro
      </a>

      {/* ------------------------------ NAV ------------------------------ */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? 'border-b border-white/10 bg-black/80 backdrop-blur-xl' : 'border-b border-transparent'}`}>
        <nav aria-label="Campaña" className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <Link href="/polio" aria-label="Pamplona contra la Polio, inicio"><Lockup /></Link>
          <ol className="hidden items-center gap-7 lg:flex">
            {CHAPTERS.slice(0, 4).map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={active === c.id ? 'location' : undefined}
                  className={`relative text-[13px] transition-colors ${active === c.id ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                  {c.label}
                  <span className={`absolute -bottom-[21px] left-0 h-px bg-white transition-all duration-500 ${active === c.id ? 'w-full' : 'w-0'}`} />
                </a>
              </li>
            ))}
          </ol>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-[12px] tabular-nums text-white/70 sm:inline-flex" aria-hidden="true">
              <span className="size-1.5 rounded-full bg-[#FF4B4B]" /> {cd.d}d {cd.h}h {cd.m}m
            </span>
            <a href="#participa" className="inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-medium text-black transition hover:bg-white/85">
              Participar
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* ------------------------------ HERO ----------------------------- */}
        <section ref={heroRef} className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
          <motion.div style={{ y: reduce ? 0 : photoY }} className="absolute inset-0 -z-20" aria-hidden="true">
            <Image src={polioHero.src} alt="" fill priority sizes="100vw"
              className={`object-cover object-[50%_30%] grayscale-[35%] brightness-[0.62] contrast-[1.08] ${reduce ? '' : 'polio-kenburns'}`} />
          </motion.div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/55 to-black/30" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/20 to-transparent" aria-hidden="true" />

          <motion.div style={{ y: reduce ? 0 : copyY }} className="mx-auto w-full max-w-[1400px] px-5 pb-10 pt-32 sm:px-8 lg:px-10 lg:pb-14">
            <motion.ul
              initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/75"
            >
              <li className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#FF4B4B]" />Día Mundial contra la Polio</li>
              <li className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-white/50" />{polioEvent.dateLabel}</li>
              <li className="flex items-center gap-1.5"><Clock className="size-3.5 text-white/50" />{polioEvent.timeLabel}</li>
              <li className="flex items-center gap-1.5"><MapPin className="size-3.5 text-white/50" />{polioEvent.place}</li>
            </motion.ul>

            {inviter && (
              <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] text-white backdrop-blur-md">
                <span className="grid size-5 place-items-center rounded-full bg-white text-[11px] font-semibold text-black">{inviter[0]}</span>
                {inviter} te ha invitado a sumarte
              </motion.p>
            )}

            <h1 className="mt-6 max-w-5xl font-display text-[56px] leading-[0.92] tracking-[-0.025em] sm:text-[96px] lg:text-[128px]">
              {(launch ? [<>Pamplona se enciende</>, <>de <em className="text-[#FF4B4B]">rojo.</em></>] : [<>Algo <em className="text-[#FF4B4B]">rojo</em> llega</>, <>a la Plaza del Castillo.</>]).map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.05em]">
                  <motion.span className="block" initial={reduce ? false : { y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, delay: 0.1 + i * 0.1, ease: EASE }}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <div className="mt-10 grid gap-10 border-t border-white/15 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <Reveal delay={0.4} y={12}>
                <p className="max-w-md text-[16px] leading-relaxed text-white/65">
                  {launch
                    ? 'La plaza se ilumina de rojo y soltamos globos por los niños que aún no están protegidos.'
                    : 'Una noche para hacer visible una lucha que casi hemos ganado. Suma tu globo y te lo contamos antes que a nadie.'}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#participa" className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white pl-5 pr-6 text-[15px] font-medium text-black transition hover:bg-white/85">
                    <Plus className="size-4" /> Sumar mi globo
                  </a>
                  <a href="/polio/evento.ics" className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/25 px-5 text-[15px] text-white transition hover:border-white/60 hover:bg-white/5">
                    <CalendarPlus className="size-4" /> Añadir al calendario
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.55} y={12} className="lg:min-w-[380px]">
                {cd.done ? (
                  <p className="font-display text-3xl">La plaza ya brilla en rojo. <em className="text-[#FF4B4B]">Gracias, Pamplona.</em></p>
                ) : (
                  <div role="timer" aria-label={`Faltan ${cd.d} días, ${cd.h} horas y ${cd.m} minutos`}>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Faltan</p>
                    <div className="mt-2 flex items-end gap-5 sm:gap-7" aria-hidden="true">
                      {[[cd.d, 'días'], [cd.h, 'horas'], [cd.m, 'min'], [cd.s, 'seg']].map(([v, l]) => (
                        <div key={l}>
                          <p className="pe-sans text-[40px] font-light leading-none tabular-nums sm:text-[52px]">{v}</p>
                          <p className="mt-2 text-[11px] text-white/45">{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Reveal>
            </div>
          </motion.div>
        </section>

        {/* Barra de progreso de la campaña, a sangre */}
        <div className="border-y border-white/10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-5 text-[13px] sm:flex-row sm:items-center sm:gap-8 sm:px-8 lg:px-10">
            <p className="shrink-0 text-white/55">
              {lowCount ? <>Sé de los primeros · meta <span className="text-white">{polioCampaign.goal} globos</span></> : <><span className="tabular-nums text-white">{count}</span> globos de {polioCampaign.goal}</>}
            </p>
            <div className="relative h-px flex-1 bg-white/15">
              <motion.div className="absolute inset-y-0 left-0 bg-white" initial={{ width: 0 }} whileInView={{ width: `${Math.max(pct * 100, 1.5)}%` }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} />
            </div>
            <p className="shrink-0 font-mono text-[12px] text-white/45">{polioCampaign.hashtag}</p>
          </div>
        </div>

        {/* ---------------------------- 01 LA POLIO ------------------------- */}
        <section id="polio" className="mx-auto max-w-[1400px] scroll-mt-16 px-5 py-28 sm:px-8 sm:py-40 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3"><Reveal><Kicker n="01">La enfermedad</Kicker></Reveal></div>
            <div className="lg:col-span-9">
              <ScrollText
                text="La polio no tiene cura. Ataca sobre todo a niños menores de cinco años y puede dejar parálisis para siempre en cuestión de horas. Pero tiene vacuna. Y gracias a ella, estamos a punto de vencerla."
                accent={['cura', 'vacuna', 'vencerla']}
              />
            </div>
          </div>

          <div className="mt-28 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3"><Reveal><Kicker>El último tramo</Kicker></Reveal></div>
            <div className="lg:col-span-9">
              <Reveal><Title className="max-w-3xl">Hemos recorrido más del 99&nbsp;% del camino. <span className="text-white/40">El último tramo es el más difícil.</span></Title></Reveal>
              <Timeline />
            </div>
          </div>

          <dl className="mt-24 grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
            {[
              { n: <CountUp to={350000} prefix="≈ " />, t: 'niños paralizados al año en 1988, en 125 países.' },
              { n: <CountUp to={2} />, t: 'países donde aún circula el virus salvaje: Pakistán y Afganistán.' },
              { n: <CountUp to={1985} group={false} />, t: 'año en que Rotary se comprometió a erradicarla con PolioPlus.' },
              { n: <CountUp to={0} />, t: 'curas. Solo la vacuna protege, y cuesta céntimos.' },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 0.06} className={`border-white/10 py-8 pr-6 ${i % 2 ? 'pl-6' : ''} ${i > 0 ? 'lg:border-l lg:pl-6' : ''} ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''}`}>
                <dt className="font-display text-[44px] leading-none tabular-nums sm:text-[64px]">{f.n}</dt>
                <dd className="mt-4 max-w-[26ch] text-[14px] leading-relaxed text-white/55">{f.t}</dd>
              </Reveal>
            ))}
          </dl>
          <p className="mt-4 text-[12px] text-white/35">
            Fuentes: <a className="underline underline-offset-2 hover:text-white" href={polioCampaign.gpeiUrl} target="_blank" rel="noopener noreferrer">GPEI</a> y{' '}
            <a className="underline underline-offset-2 hover:text-white" href={polioCampaign.endPolioUrl} target="_blank" rel="noopener noreferrer">End Polio Now</a>. Cifras aproximadas, pendientes de validación.
          </p>
        </section>

        {/* ---------------------------- 02 LA NOCHE ------------------------- */}
        <section id="noche" className="scroll-mt-16 border-t border-white/10 py-28 sm:py-36">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Reveal><Kicker n="02">La noche</Kicker></Reveal>
                <Reveal delay={0.05}><Title className="mt-6">{launch ? 'La plaza se enciende de rojo.' : '¿Qué pasará a las 19:30?'}</Title></Reveal>
              </div>
              <Reveal delay={0.1} className="lg:col-span-5">
                <p className="text-[16px] leading-relaxed text-white/60">
                  {launch
                    ? 'Cada globo rojo representa a un niño que merece crecer sin polio. Con la plaza iluminada en el rojo de End Polio Now, Pamplona recordará que el último tramo depende de todos.'
                    : 'Pamplona va a hacer visible una lucha que casi hemos ganado. Todavía no podemos contarte más. Una pista: mira hacia arriba.'}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <figure className="relative mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0507]">
                {launch && <BalloonCanvas ambient count={reduce ? 10 : 22} speed={0.8} className="absolute inset-0 h-full w-full" />}
                <PlazaScene mode={mode} />
                <figcaption className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[12px] text-white/75 backdrop-blur-md">
                  <MapPin className="size-3.5" /> {polioEvent.place}, {polioEvent.city}
                </figcaption>
              </figure>
            </Reveal>

            <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {polioEvent.programme.map((p, i) => (
                <Reveal key={p.time} delay={i * 0.06}>
                  <li className="grid grid-cols-[88px_1fr_auto] items-center gap-6 py-6 sm:grid-cols-[160px_1fr_auto]">
                    <span className="font-display text-[32px] leading-none tabular-nums sm:text-[44px]">{p.time}</span>
                    {launch || me ? (
                      <span className="text-[16px] text-white/80 sm:text-[18px]">{p.text}</span>
                    ) : (
                      <span className="flex items-center gap-3" aria-label="Se desvelará a quienes se registren">
                        <span className="h-3 rounded-full bg-white/10" style={{ width: `${[62, 48, 70][i] ?? 55}%` }} />
                      </span>
                    )}
                    <span className="font-mono text-[12px] text-white/35">0{i + 1}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
            {!launch && !me && (
              <Reveal className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2.5 text-[14px] text-white/55"><Lock className="size-4" /> El programa se desvela primero a quienes suman su globo.</p>
                <a href="#participa" className="inline-flex items-center gap-2 text-[14px] font-medium text-white hover:underline underline-offset-4">Desbloquear el programa <ArrowRight className="size-4" /></a>
              </Reveal>
            )}
          </div>
        </section>

        {/* ---------------------------- 03 SÚMATE --------------------------- */}
        <Ways chosen={chosen} onToggle={toggle} />

        {/* ---------------------------- 04 EL CIELO ------------------------- */}
        <section id="cielo" className="relative isolate scroll-mt-16 overflow-hidden border-t border-white/10 py-32 sm:py-44">
          <BalloonCanvas count={Math.min(count, 240)} highlightLabel={me ? `Tu globo · nº ${me.seq}` : null} speed={0.5} className="absolute inset-0 -z-10 h-full w-full opacity-80" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,black)]" aria-hidden="true" />
          <div className="mx-auto max-w-[1400px] px-5 text-center sm:px-8 lg:px-10">
            <Reveal><Kicker n="04" className="justify-center">El cielo de Pamplona</Kicker></Reveal>
            <Reveal delay={0.05}>
              <p className="mt-10 font-display text-[120px] leading-[0.85] tabular-nums tracking-[-0.04em] sm:text-[200px]">
                <CountUp to={count} /><span className="text-[0.3em] text-white/35 tracking-normal"> / {polioCampaign.goal}</span>
              </p>
            </Reveal>
            <Reveal delay={0.1}><Title className="mx-auto mt-8 max-w-2xl">Cada globo es una persona que se suma.</Title></Reveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-md text-[15px] text-white/55">
                {me ? 'Ahí está el tuyo. Invita a tres personas y haz que el cielo se llene.' : 'Suma el tuyo y míralo subir. Queremos llenar el cielo antes del 24 de octubre.'}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------------------- 05 REGISTRO ------------------------- */}
        <section id="participa" ref={formRef} className="scroll-mt-16 border-t border-white/10 py-28 sm:py-36">
          <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Reveal><Kicker n="05">Registro</Kicker></Reveal>
                <Reveal delay={0.05}><Title className="mt-6">Suma tu globo al cielo de Pamplona.</Title></Reveal>
                {inviter && !me && (
                  <Reveal delay={0.08}><p className="mt-6 text-[15px] text-white/70">Vienes de parte de <span className="text-white">{inviter}</span>. Tu globo subirá junto al suyo.</p></Reveal>
                )}
                <Reveal delay={0.1}>
                  <ul className="mt-10 divide-y divide-white/10 border-y border-white/10 text-[15px]">
                    {['Conoce la iniciativa antes que nadie.', 'Pocos mensajes, solo de esta campaña.', 'Tu enlace para invitar y ver tu globo volar.'].map((t, i) => (
                      <li key={t} className="flex gap-5 py-4 text-white/70"><span className="font-mono text-[12px] leading-6 text-white/35">0{i + 1}</span>{t}</li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={0.14}>
                  <p className="mt-8 text-[13px] text-white/45">
                    Tu globo será el <span className="text-white tabular-nums">nº {count + 1}</span> · {Math.max(0, polioCampaign.goal - count)} para la meta
                  </p>
                </Reveal>
              </div>
            </div>

            <div className="lg:col-span-7">
              {me && myUrl ? (
                <Ticket me={me} url={myUrl} onCopy={() => copyText(myUrl, toast)} gcal={gcal} />
              ) : (
                <RegisterForm chosen={chosen} onToggle={toggle} onRegistered={onRegistered} />
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------- FAQ ------------------------------ */}
        <section className="border-t border-white/10 py-28">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-5">
              <Kicker>Preguntas</Kicker>
              <Title className="mt-6">Lo que suele preguntarse.</Title>
            </div>
            <div className="lg:col-span-7">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group border-b border-white/10 first:border-t">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[17px] text-white/90 transition hover:text-white [&::-webkit-details-marker]:hidden">
                    {q}
                    <Plus className="size-4 shrink-0 text-white/50 transition duration-300 group-open:rotate-45 group-open:text-white" />
                  </summary>
                  <p className="-mt-2 pb-6 pr-10 text-[15px] leading-relaxed text-white/55">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------ FOOTER ----------------------------- */}
      <footer className="overflow-hidden border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 lg:px-10">
          <p className="pe-sans select-none whitespace-nowrap text-[25vw] font-semibold leading-[0.8] tracking-[-0.06em] lg:text-[21vw] xl:text-[290px]" aria-hidden="true">
            24<span className="text-[#E4262F]">·</span>10<span className="text-white/25">·26</span>
          </p>
          <div className="mt-14 grid gap-10 border-t border-white/10 pt-10 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="max-w-[30ch] leading-relaxed text-white/55">{polioCampaign.name}. Una noche en rojo para terminar lo que empezamos en 1985.</p>
            </div>
            <FooterCol title="El evento" links={[
              [`${polioEvent.dateLabel} · ${polioEvent.timeLabel}`, '#noche'],
              ['Añadir al calendario', '/polio/evento.ics'],
              ['Google Calendar', gcal],
              ['Cómo llegar', polioEvent.mapsUrl],
            ]} />
            <FooterCol title="La campaña" links={CHAPTERS.map((c) => [c.label, `#${c.id}`] as [string, string])} />
            <FooterCol title="Organiza" links={[
              ['Rotary Club Pamplona', '/'],
              ['Rotaract Horizon Pamplona', '/'],
              ['End Polio Now', polioCampaign.endPolioUrl],
              ['Donar', polioCampaign.donateUrl],
            ]} />
          </div>
          <div className="mt-14 flex flex-col gap-3 border-t border-white/10 py-6 text-[12px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="rounded border border-white/20 px-1.5 py-0.5 font-mono text-[10px] text-white/60">{polioCampaign.hashtag}</span>
              <Link href="/polio/privacidad" className="hover:text-white">Privacidad y aviso legal</Link>
            </div>
            <p>© {polioCampaign.year} {polioCampaign.organizer} · con {polioCampaign.partner}</p>
          </div>
        </div>
      </footer>

      {/* Barra fija en móvil */}
      <motion.div
        initial={false}
        animate={{ y: scrolled && !formInView && !me ? 0 : 120 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-3 bottom-3 z-[60] sm:hidden"
      >
        <a href="#participa" className="flex items-center justify-between rounded-full border border-white/15 bg-black/85 py-2 pl-5 pr-2 backdrop-blur-xl">
          <span className="font-mono text-[12px] tabular-nums text-white/75">{cd.d}d {cd.h}h {cd.m}m · 19:30</span>
          <span className="rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-black">Sumar mi globo</span>
        </a>
      </motion.div>

      {toastNode}
    </div>
  );
}

/* ------------------------------- secciones -------------------------------- */

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const reduce = useReducedMotion();
  const marks = [
    { y: '1988', t: '≈ 350.000 casos', at: 0 },
    { y: '1994', t: 'América, libre de polio', at: 0.16 },
    { y: '2020', t: 'África, libre del virus salvaje', at: 0.84 },
    { y: '2026', t: 'El último 1 %', at: 0.99 },
  ];
  return (
    <div ref={ref} className="mt-14">
      <div className="relative h-px bg-white/15">
        <motion.div className="absolute inset-y-0 left-0 bg-white" initial={{ width: reduce ? '99%' : 0 }} animate={{ width: inView || reduce ? '99%' : 0 }} transition={{ duration: 2.2, ease: EASE }} />
        <span className="polio-last-mile absolute right-0 top-1/2 size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#FF4B4B]" />
        {marks.slice(0, 3).map((m) => (
          <span key={m.y} className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-white" style={{ left: `${m.at * 100}%` }} />
        ))}
      </div>
      <div className="relative mt-5 hidden h-10 sm:block">
        {marks.map((m, i) => (
          <div key={m.y} className={`absolute max-w-[22ch] text-[12px] ${i === marks.length - 1 ? 'right-0 text-right' : m.at > 0.6 ? '-translate-x-full pr-3 text-right' : ''}`} style={i === marks.length - 1 ? undefined : { left: `${m.at * 100}%` }}>
            <p className={`font-mono ${i === marks.length - 1 ? 'text-[#FF6B6B]' : 'text-white/80'}`}>{m.y}</p>
            <p className="mt-0.5 text-white/40">{m.t}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[12px] sm:hidden">
        <span className="font-mono text-white/60">1988 · ≈ 350.000 casos</span>
        <span className="font-mono text-[#FF6B6B]">El último 1 %</span>
      </div>
    </div>
  );
}

function Ways({ chosen, onToggle }: { chosen: string[]; onToggle: (id: string) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * Math.min(600, rail.current.clientWidth * 0.8), behavior: 'smooth' });
  const labels = WAYS.filter((w) => chosen.includes(w.id)).map((w) => w.title);

  return (
    <section id="sumate" className="scroll-mt-16 border-t border-white/10 py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal><Kicker n="03">Súmate</Kicker></Reveal>
            <Reveal delay={0.05}><Title className="mt-6 max-w-xl">Elige cómo quieres estar.</Title></Reveal>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scroll(-1)} aria-label="Anterior" className="grid size-10 place-items-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"><ArrowLeft className="size-4" /></button>
            <button type="button" onClick={() => scroll(1)} aria-label="Siguiente" className="grid size-10 place-items-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"><ArrowRight className="size-4" /></button>
          </div>
        </div>
      </div>

      <div ref={rail} className="pe-rail mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:scroll-px-10 lg:px-10 xl:px-[max(2.5rem,calc((100vw_-_1400px)/2_+_2.5rem))] xl:scroll-px-[max(2.5rem,calc((100vw_-_1400px)/2_+_2.5rem))]">
        {WAYS.map((w, i) => {
          const on = chosen.includes(w.id);
          return (
            <article key={w.id} className="w-[76vw] max-w-[300px] shrink-0 snap-start">
              <button
                type="button" role="checkbox" aria-checked={on} onClick={() => onToggle(w.id)}
                className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border text-left transition duration-500 ${on ? 'border-white' : 'border-white/10 hover:border-white/40'}`}
              >
                {w.photo ? (
                  <Image src={polioHero.src} alt="" fill sizes="300px" style={{ objectPosition: w.photo }}
                    className="object-cover grayscale brightness-[0.55] transition duration-700 group-hover:scale-105 group-hover:grayscale-[40%]" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_80%_0%,rgba(228,38,47,0.35),transparent_60%),linear-gradient(180deg,#141011,#0A0708)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <span className="absolute left-4 top-4 font-mono text-[12px] text-white/60">0{i + 1}</span>
                <span className={`absolute right-4 top-4 grid size-7 place-items-center rounded-full border transition ${on ? 'border-white bg-white text-black' : 'border-white/40 text-white/70 group-hover:border-white'}`}>
                  {on ? <Check className="size-3.5" strokeWidth={2.5} /> : <Plus className="size-3.5" />}
                </span>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">{w.tag}</p>
                  <h3 className="pe-sans mt-2 text-[24px] leading-tight">{w.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/60">{w.text}</p>
                </div>
              </button>
              {w.id === 'donar' && (
                <a href={polioCampaign.donateUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[13px] text-white/60 hover:text-white">
                  Donar en End Polio Now <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </article>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-white/55" aria-live="polite">
            {labels.length ? <>Tu selección: <span className="text-white">{labels.join(' · ')}</span></> : 'Toca una tarjeta para elegir cómo sumarte.'}
          </p>
          <a href="#participa" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-[14px] font-medium text-black transition hover:bg-white/85">
            Continuar <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Ticket({ me, url, onCopy, gcal }: { me: Registered; url: string; onCopy: () => void; gcal: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}
      tabIndex={-1} ref={(el) => el?.focus()} className="outline-none"
    >
      <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#0C0C0C]">
        <div className="relative p-7 sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_100%_0%,rgba(228,38,47,0.35),transparent_60%)]" aria-hidden="true" />
          <div className="relative flex items-start justify-between gap-6">
            <Kicker>Pase · {polioCampaign.name}</Kicker>
            <span className="font-mono text-[12px] text-white/50">#{me.ref}</span>
          </div>
          <p className="relative mt-10 font-display text-[88px] leading-[0.85] tabular-nums tracking-[-0.03em] sm:text-[128px]">
            <span className="text-white/30">nº</span> {String(me.seq).padStart(3, '0')}
          </p>
          <p className="relative mt-5 pe-sans text-[26px] leading-tight sm:text-[32px]">Gracias, {me.nombre}. <span className="text-white/45">Tu globo ya vuela.</span></p>
        </div>
        <div className="relative grid grid-cols-3 border-t border-dashed border-white/15 text-[13px]">
          <span className="absolute -left-3 -top-3 size-6 rounded-full bg-black" aria-hidden="true" />
          <span className="absolute -right-3 -top-3 size-6 rounded-full bg-black" aria-hidden="true" />
          {[['Fecha', '24 oct 2026'], ['Hora', '19:30 h'], ['Lugar', polioEvent.place]].map(([k, v]) => (
            <div key={k} className="border-r border-white/10 px-5 py-5 last:border-r-0 sm:px-7">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">{k}</p>
              <p className="mt-1.5 text-white">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-[15px] text-white/60">Ayúdanos a llegar a {polioCampaign.goal}: invita a tres personas. Tu enlace muestra tu invitación personal en WhatsApp.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={waLink(url)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-black transition hover:bg-white/85">
          <Share2 className="size-4" /> Invitar por WhatsApp
        </a>
        <button type="button" onClick={onCopy} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 text-[15px] transition hover:border-white/60">
          <Copy className="size-4" /> Copiar mi enlace
        </button>
        <a href={gcal} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 text-[15px] transition hover:border-white/60">
          <CalendarPlus className="size-4" /> Calendario
        </a>
        <a href={polioEvent.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 text-[15px] transition hover:border-white/60">
          <Navigation className="size-4" /> Cómo llegar
        </a>
      </div>
      <a href="#cielo" className="mt-6 inline-block text-[13px] text-white/50 underline underline-offset-4 hover:text-white">Ver mi globo en el cielo</a>
    </motion.div>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([l, href]) => (
          <li key={l}>
            {href.startsWith('http')
              ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/70 transition hover:text-white">{l}</a>
              : <a href={href} className="text-white/70 transition hover:text-white">{l}</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

