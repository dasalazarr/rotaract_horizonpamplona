'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowUpRight, CalendarDays, Clock, MapPin, Plus } from 'lucide-react';
import { CountUp, EASE, Reveal, shareUrl, waLink } from './shared';
import { polioCampaign, polioEvent, polioHero, polioLogos, polioPlaza, type CampaignMode } from '@/lib/polio/config';

const CHAPTERS = [
  { id: 'polio', n: '01', label: 'La polio' },
  { id: 'evento', n: '02', label: 'El evento' },
  { id: 'participa', n: '03', label: 'Participa' },
  { id: 'preguntas', n: '04', label: 'Preguntas' },
] as const;

const FAQ = [
  ['¿Hay riesgo de polio en España?', 'España está libre de polio, pero mientras el virus circule en algún país puede volver a viajar. Mantener la vacunación es la mejor protección: consulta el calendario vacunal con tu centro de salud.'],
  ['¿Hace falta inscribirse?', 'No. El acto es público y gratuito: basta con acercarse a la Plaza del Castillo el sábado 24 de octubre a las 19:30.'],
  ['¿Se sueltan los globos?', 'No. Los globos se inflan y se quedan en la plaza durante el acto: no se liberan al cielo, para no dejar residuos en el entorno.'],
  ['¿Qué es End Polio Now?', 'Es la campaña de Rotary para erradicar la polio en el mundo. Su color rojo es el que ilumina la plaza esa noche.'],
  ['¿Tengo que ser socio de Rotary?', 'No. La campaña está abierta a todo el mundo, de cualquier edad.'],
  ['¿Qué pasa si llueve?', 'Si hubiera algún cambio, lo publicaremos en esta página y en los canales de Rotary Club Pamplona y Rotaract Horizon Pamplona.'],
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

/** Enlace discreto: texto con flecha y subrayado fino. */
function SubtleLink({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group inline-flex items-center gap-1.5 border-b border-white/25 pb-0.5 text-[14px] text-white/75 transition hover:border-white hover:text-white"
    >
      {children}
      <ArrowUpRight className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
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

/** Logos oficiales en su color original, sobre blanco (sin recolorear las marcas). */
function Logos({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const h = size === 'lg' ? 'h-9 sm:h-14' : 'h-6 sm:h-7';
  return (
    <span className={`inline-flex items-center rounded-full bg-white ${size === 'lg' ? 'max-w-full gap-4 px-6 py-4 sm:gap-10 sm:px-12 sm:py-5' : 'gap-3 px-3.5 py-1.5 sm:gap-4 sm:px-4'}`}>
      {polioLogos.rotaryClub && (
        <Image src={polioLogos.rotaryClub} alt="Rotary Club Pamplona" width={172} height={67} className={`${h} w-auto`} />
      )}
      <span className={`w-px bg-black/15 ${size === 'lg' ? 'h-8 sm:h-10' : 'h-5'}`} aria-hidden="true" />
      <Image src={polioLogos.rotaract} alt="Rotaract Pamplona Horizon" width={994} height={312} className={`${h} w-auto`} />
    </span>
  );
}

/* --------------------------------- página --------------------------------- */

export function PolioLanding({ mode, inviter }: { mode: CampaignMode; inviter: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const active = useActiveChapter();
  const cd = useCountdown(polioEvent.start);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const photoY = useTransform(heroP, [0, 1], ['0%', '14%']);
  const copyY = useTransform(heroP, [0, 1], [0, -60]);
  const launch = mode === 'lanzamiento';
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${polioCampaign.name} · ${polioEvent.place}`)}&dates=20261024T173000Z/20261024T190000Z&location=${encodeURIComponent(polioEvent.address)}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pe min-h-screen bg-black text-white selection:bg-[#E4262F]/60">
      {/* ------------------------------ NAV ------------------------------ */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? 'border-b border-white/10 bg-black/80 backdrop-blur-xl' : 'border-b border-transparent'}`}>
        <nav aria-label="Campaña" className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <Link href="/polio" aria-label="Pamplona contra la Polio, inicio"><Logos /></Link>
          <ol className="hidden items-center gap-7 lg:flex">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={active === c.id ? 'location' : undefined}
                  className={`relative text-[13px] transition-colors ${active === c.id ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                  {c.label}
                  <span className={`absolute -bottom-[21px] left-0 h-px bg-white transition-all duration-500 ${active === c.id ? 'w-full' : 'w-0'}`} />
                </a>
              </li>
            ))}
          </ol>
          <span className="hidden items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-[12px] tabular-nums text-white/70 sm:inline-flex" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-[#FF4B4B]" /> {cd.d}d {cd.h}h {cd.m}m
          </span>
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
                {inviter} te invita a la Plaza del Castillo
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
                  Rotary Club Pamplona y Rotaract Horizon Pamplona encienden de rojo la Plaza del Castillo para recordar que la polio aún no está vencida y que la vacuna es la única protección.
                </p>
                <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
                  <SubtleLink href="/polio/evento.ics">Añadir al calendario</SubtleLink>
                  <SubtleLink href={polioEvent.mapsUrl} external>Cómo llegar</SubtleLink>
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
            <a className="underline underline-offset-2 hover:text-white" href={polioCampaign.endPolioUrl} target="_blank" rel="noopener noreferrer">End Polio Now</a>.
          </p>
        </section>

        {/* ---------------------------- 02 EL EVENTO ------------------------ */}
        <section id="evento" className="scroll-mt-16 border-t border-white/10 py-28 sm:py-36">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Reveal><Kicker n="02">El evento</Kicker></Reveal>
                <Reveal delay={0.05}><Title className="mt-6">Una noche en rojo en el corazón de Pamplona.</Title></Reveal>
              </div>
              <Reveal delay={0.1} className="lg:col-span-5">
                <p className="text-[16px] leading-relaxed text-white/60">
                  La plaza se ilumina en el rojo de End Polio Now y se llena de globos rojos: cada uno representa a un niño que merece crecer sin polio.
                  Un acto abierto y gratuito de divulgación y concienciación.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <figure className="relative mt-14 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 sm:aspect-[1376/600]">
                <Image src={polioPlaza.src} alt={polioPlaza.alt} fill sizes="(min-width: 1400px) 1320px, 100vw" className="object-cover object-[60%_50%] brightness-[0.72] saturate-[0.8] contrast-[1.05]" />
                <div className="absolute inset-0 bg-[#4A0A10] mix-blend-multiply opacity-35" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#E4262F]/10 to-transparent" aria-hidden="true" />
                <figcaption className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[12px] text-white/80 backdrop-blur-md">
                  <MapPin className="size-3.5" /> {polioEvent.place}, {polioEvent.city}
                </figcaption>
              </figure>
            </Reveal>

            <div className="mt-4 grid gap-10 lg:grid-cols-12">
              <ol className="divide-y divide-white/10 border-y border-white/10 lg:col-span-8">
                {polioEvent.programme.map((p, i) => (
                  <Reveal key={p.time} delay={i * 0.06}>
                    <li className="grid grid-cols-[88px_1fr_auto] items-center gap-6 py-6 sm:grid-cols-[160px_1fr_auto]">
                      <span className="font-display text-[32px] leading-none tabular-nums sm:text-[44px]">{p.time}</span>
                      <span className="text-[16px] text-white/80 sm:text-[18px]">{p.text}</span>
                      <span className="font-mono text-[12px] text-white/35">0{i + 1}</span>
                    </li>
                  </Reveal>
                ))}
              </ol>
              <Reveal delay={0.1} className="lg:col-span-4">
                <dl className="grid gap-5 border-t border-white/10 pt-6 text-[14px] lg:border-t-0 lg:pt-6">
                  {[['Fecha', `${polioEvent.dateLabel} de 2026`], ['Hora', polioEvent.timeLabel], ['Lugar', polioEvent.address], ['Entrada', 'Libre y gratuita']].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-white/40">{k}</dt>
                      <dd className="mt-1 text-white/85">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
                  <SubtleLink href="/polio/evento.ics">Calendario</SubtleLink>
                  <SubtleLink href={gcal} external>Google Calendar</SubtleLink>
                  <SubtleLink href={polioEvent.mapsUrl} external>Cómo llegar</SubtleLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------- 03 PARTICIPA ------------------------ */}
        <Participa />

        {/* ----------------------------- ORGANIZAN -------------------------- */}
        <section aria-labelledby="organizan" className="border-t border-white/10 py-24">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-8 px-5 text-center sm:px-8 lg:px-10">
            <Reveal><Kicker className="justify-center"><span id="organizan">Organizan</span></Kicker></Reveal>
            <Reveal delay={0.05}><Logos size="lg" /></Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-xl text-[15px] leading-relaxed text-white/55">
                Rotary lidera la erradicación de la polio desde 1985 con el programa PolioPlus, junto a la OMS, UNICEF y los socios de la Iniciativa Mundial.
                Rotary Club Pamplona, con Rotaract Horizon Pamplona, se suma al Día Mundial contra la Polio desde el corazón de la ciudad.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------- FAQ ------------------------------ */}
        <section id="preguntas" className="scroll-mt-16 border-t border-white/10 py-28">
          <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-5">
              <Kicker n="04">Preguntas</Kicker>
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
              [`${polioEvent.dateLabel} · ${polioEvent.timeLabel}`, '#evento'],
              ['Añadir al calendario', '/polio/evento.ics'],
              ['Google Calendar', gcal],
              ['Cómo llegar', polioEvent.mapsUrl],
            ]} />
            <FooterCol title="La campaña" links={CHAPTERS.map((c) => [c.label, `#${c.id}`] as [string, string])} />
            <FooterCol title="Organiza" links={[
              ['Rotary Club Pamplona', '/'],
              ['Rotaract Horizon Pamplona', '/'],
              ['End Polio Now', polioCampaign.endPolioUrl],
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

function Participa() {
  const ways: { title: string; text: string; link?: [string, string, boolean] | 'share' }[] = [
    { title: 'Ven a la plaza', text: `${polioEvent.dateLabel}, ${polioEvent.timeLabel}. ${polioEvent.place}. Acto abierto y gratuito.`, link: ['Cómo llegar', polioEvent.mapsUrl, true] },
    { title: 'Infórmate', text: 'Conoce cómo se está erradicando la polio en el mundo y revisa tu calendario vacunal con tu centro de salud.', link: ['End Polio Now', polioCampaign.endPolioUrl, true] },
    { title: 'Difunde', text: 'Comparte esta página en tus grupos. Cuanta más gente lo sepa, más fuerte se oye el mensaje.', link: 'share' },
  ];
  return (
    <section id="participa" className="scroll-mt-16 border-t border-white/10 py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <Reveal><Kicker n="03">Participa</Kicker></Reveal>
        <Reveal delay={0.05}><Title className="mt-6 max-w-xl">Tres formas de sumarte.</Title></Reveal>

        <div className="mt-14 grid border-t border-white/10 sm:grid-cols-3">
          {ways.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}
              className={`border-b border-white/10 py-8 sm:border-b-0 sm:pr-8 ${i > 0 ? 'sm:border-l sm:pl-8' : ''}`}>
              <p className="font-mono text-[12px] text-white/40">0{i + 1}</p>
              <h3 className="pe-sans mt-4 text-[24px] leading-tight">{w.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/55">{w.text}</p>
              {w.link === 'share' ? (
                <a href="https://wa.me/" onClick={(e) => { e.currentTarget.href = waLink(shareUrl()); }} target="_blank" rel="noopener noreferrer"
                  className="group mt-5 inline-flex items-center gap-1.5 border-b border-white/25 pb-0.5 text-[14px] text-white/75 transition hover:border-white hover:text-white">
                  Compartir por WhatsApp <ArrowUpRight className="size-3.5" />
                </a>
              ) : w.link ? (
                <div className="mt-5"><SubtleLink href={w.link[1]} external={w.link[2]}>{w.link[0]}</SubtleLink></div>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
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
