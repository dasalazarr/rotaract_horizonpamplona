import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin, Users, Clock, Sparkles } from 'lucide-react';
import { siteConfig } from '@/content/site';
import { articles } from '@/content/articles';
import { projects } from '@/content/projects';
import { events, getEffectiveEventStatus } from '@/content/events';
import { ArticleCard } from '@/components/ArticleCard';
import { ProjectCard } from '@/components/ProjectCard';
import { DonationBand } from '@/components/DonationBand';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const latestArticles = articles.slice(0, 3);
  const featuredProjects = projects.slice(0, 2);
  const nextEvent = events[0];
  const nextEventStatus = nextEvent ? getEffectiveEventStatus(nextEvent) : null;

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION — Full viewport */}
      <section
        id="hero-section"
        className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20 pb-16"
      >
        {/* Background video with poster fallback */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-25 filter brightness-[0.6] contrast-110"
            aria-hidden="true"
          >
            {/* Dark background cinematic video placeholder */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-young-volunteers-planting-trees-in-a-forest-41121-large.mp4"
              type="video/mp4"
            />
          </video>
          {/* Opaque cream vignette so ink text stays legible over the video */}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/85 to-paper/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_var(--color-paper)_80%)]" />

          {/* Fallback label indicator (accessible / editorial reference) */}
          <div className="absolute bottom-4 right-4 z-10 text-[10px] text-muted/60 hidden md:block select-none">
            Vídeo de fondo — comunidad en acción
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          {/* Eyebrow */}
          <div className="fade-rise inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink/5 border border-ink/10 text-xs font-semibold uppercase tracking-widest text-accent-deep mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D42365] animate-pulse" />
            <span>Rotaract Horizon Pamplona</span>
          </div>

          {/* H1 in Instrument Serif, clamp(44px,7vw,84px), tight leading */}
          <h1 className="fade-rise-delay-1 font-display text-[clamp(44px,7vw,84px)] font-normal tracking-tight leading-[1.05] mb-6 max-w-4xl">
            <span className="text-ink block">Servir. Crecer.</span>
            <span className="text-muted font-light block">Liderar Pamplona.</span>
          </h1>

          {/* Lead paragraph */}
          <p className="fade-rise-delay-2 text-base sm:text-xl text-muted max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Somos jóvenes que transforman su entorno: proyectos con impacto real, formación en liderazgo y una comunidad que te empuja a dar lo mejor de ti.
          </p>

          {/* CTAs: [Únete] primary + [Conócenos] glass */}
          <div className="fade-rise-delay-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/socios"
              id="hero-unete-cta"
              className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base font-medium shadow-xl"
            >
              <Users className="w-4 h-4 mr-2" />
              Únete
            </Link>

            <Link
              href="#stats-section"
              id="hero-conocenos-cta"
              className="btn-glass w-full sm:w-auto px-8 py-3.5 text-base font-medium"
            >
              Conócenos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS BAND — liquid-glass rounded card, 3 cells separated by 1px borders */}
      <section id="stats-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="liquid-glass rounded-3xl p-4 sm:p-6 shadow-2xl border border-line">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line">
            {/* Cell 1 */}
            <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center">
              <span className="font-display text-4xl sm:text-5xl lg:text-6xl text-accent font-normal leading-none mb-2">
                {siteConfig.stats.sociosActivos.value}
              </span>
              <span className="text-sm font-medium text-ink/90">
                {siteConfig.stats.sociosActivos.label}
              </span>
              {/* Mockup code tag */}
              <span className="text-[10px] text-muted/70 mt-1 uppercase tracking-wider">
                (mockup)
              </span>
            </div>

            {/* Cell 2 */}
            <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center">
              <span className="font-display text-4xl sm:text-5xl lg:text-6xl text-accent font-normal leading-none mb-2">
                +{siteConfig.stats.horasServicio.value}
              </span>
              <span className="text-sm font-medium text-ink/90">
                {siteConfig.stats.horasServicio.label}
              </span>
              {/* Mockup code tag */}
              <span className="text-[10px] text-muted/70 mt-1 uppercase tracking-wider">
                (mockup)
              </span>
            </div>

            {/* Cell 3 */}
            <div className="p-6 sm:p-8 text-center flex flex-col items-center justify-center">
              <span className="font-display text-4xl sm:text-5xl lg:text-6xl text-accent font-normal leading-none mb-2">
                {siteConfig.stats.proyectosEnCurso.value}
              </span>
              <span className="text-sm font-medium text-ink/90">
                {siteConfig.stats.proyectosEnCurso.label}
              </span>
              {/* Mockup code tag */}
              <span className="text-[10px] text-muted/70 mt-1 uppercase tracking-wider">
                (mockup)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACTUALIDAD SECTION */}
      <section id="actualidad-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 w-full">
        {/* Section header: eyebrow + serif H2 "Actualidad" + muted lead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-deep mb-3">
              <span>Crónica y Novedades</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-normal text-ink leading-tight">
              Actualidad
            </h2>
            <p className="text-base sm:text-lg text-muted max-w-xl mt-3 font-normal">
              Noticias, reflexiones y avances de las iniciativas ciudadanas de nuestro club en Pamplona y el Distrito 2202.
            </p>
          </div>

          <Link
            href="/actualidad"
            className="inline-flex items-center text-sm font-medium text-accent-deep hover:opacity-70 transition-opacity self-start md:self-end"
          >
            Ver todas las publicaciones
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {/* 3 Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* 4. PROYECTOS SECTION — Subtle darker band */}
      <section id="proyectos-section" className="bg-paper-soft border-y border-line py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-deep mb-3">
                <span>Acción Directa</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-normal text-ink leading-tight">
                Proyectos en marcha
              </h2>
              <p className="text-base sm:text-lg text-muted max-w-xl mt-3">
                Iniciativas con objetivos cuantificables diseñadas para responder a retos concretos de nuestra comunidad local.
              </p>
            </div>

            <Link
              href="/proyectos"
              className="inline-flex items-center text-sm font-medium text-accent-deep hover:opacity-70 transition-opacity self-start md:self-end"
            >
              Explorar proyectos
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* 2 Large Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRÓXIMO EVENTO — One wide card */}
      {nextEvent && (
        <section id="proximo-evento-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-accent-deep font-semibold">
              Agenda Abierta
            </span>
          </div>

          <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-line relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Details (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="default" className="text-xs">
                    Próximo
                  </Badge>
                  <Badge variant="glass" className="text-xs">
                    {nextEvent.typeLabel}
                  </Badge>
                  <span className="text-xs text-muted">
                    {nextEvent.capacity}
                  </span>
                </div>

                {/* Serif title */}
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-ink leading-tight">
                  {nextEvent.name}
                </h3>

                <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
                  {nextEvent.description}
                </p>

                {/* Date / Place line */}
                <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-ink font-medium">{nextEvent.date}</span>
                    <span>·</span>
                    <span>{nextEvent.time} h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>{nextEvent.place}</span>
                  </div>
                </div>
              </div>

              {/* Right CTA (4 cols) */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-line lg:pl-8">
                <div className="text-left lg:text-right">
                  <span className="text-xs uppercase tracking-wider text-muted block">
                    Participación libre
                  </span>
                  <span className="text-xs text-accent-deep">
                    Abierto a no socios
                  </span>
                </div>

                <Link
                  href={`/eventos/${nextEvent.slug}`}
                  id="home-proximo-evento-cta"
                  className="btn-glass px-7 py-3 text-sm font-medium w-full sm:w-auto text-center"
                >
                  Consultar programa y plaza
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. DONA BAND */}
      <section id="home-donation-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <DonationBand />
      </section>
    </div>
  );
}
