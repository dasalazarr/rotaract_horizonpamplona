import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Target, Users, Coins, Sparkles } from 'lucide-react';
import { projects } from '@/content/projects';
import { Badge } from '@/components/ui/badge';
import { DonationBand } from '@/components/DonationBand';

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: 'Proyecto no encontrado',
    };
  }

  return {
    title: `${project.name} — Proyecto Social`,
    description: project.excerpt,
    openGraph: {
      title: `${project.name} | Rotaract Horizon Pamplona`,
      description: project.tagline,
      images: [
        {
          url: project.cover,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description: project.tagline,
      images: [project.cover],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 sm:pb-16 space-y-16">
      {/* Back Link */}
      <div>
        <Link
          href="/proyectos"
          className="inline-flex items-center text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Volver a Proyectos
        </Link>
      </div>

      {/* HEADER SECTION */}
      <div className="max-w-4xl space-y-4">
        {/* Meta row: status pill + ODS pill + area pill */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge
            variant={project.status === 'activo' ? 'default' : 'glass'}
            className="text-xs capitalize font-medium"
          >
            {project.statusLabel}
          </Badge>

          {project.ods.map((ods) => (
            <Badge key={ods.number} variant="muted" className="text-xs">
              ODS {ods.number}: {ods.name}
            </Badge>
          ))}

          <Badge variant="glass" className="text-xs">
            {project.area}
          </Badge>
        </div>

        {/* Serif H1 */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-ink leading-tight">
          {project.name}
        </h1>

        {/* Muted Tagline */}
        <p className="text-xl sm:text-2xl text-muted font-light leading-relaxed">
          {project.tagline}
        </p>
      </div>

      {/* 21:9 COVER PLACEHOLDER (Aspect Ratio 21/9) */}
      <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden bg-paper-soft border border-line shadow-2xl">
        <Image
          src={project.cover}
          alt={project.name}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      </div>

      {/* KPI GRID (4 cards):
          - budget (with magenta progress bar = executed%)
          - executed %
          - people impacted
          - volunteers
          Big Instrument Serif magenta numbers, uppercase micro labels */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Presupuesto & Barra magenta */}
        <div className="liquid-glass rounded-2xl p-6 border border-line flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Presupuesto
              </span>
              <span className="text-[10px] text-muted/60">(mockup)</span>
            </div>
            <div className="font-display text-4xl sm:text-5xl font-normal text-accent leading-none mb-3">
              {project.indicators.budget}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted mb-1.5">
              <span>Ejecución del fondo</span>
              <span className="font-mono text-ink font-medium">{project.indicators.budgetExecutedPct}%</span>
            </div>
            {/* Magenta Progress Bar */}
            <div className="w-full h-2 rounded-full bg-ink/10 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${project.indicators.budgetExecutedPct}%` }}
                role="progressbar"
                aria-valuenow={project.indicators.budgetExecutedPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: Porcentaje ejecutado */}
        <div className="liquid-glass rounded-2xl p-6 border border-line flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Progreso Técnico
              </span>
              <span className="text-[10px] text-muted/60">(mockup)</span>
            </div>
            <div className="font-display text-4xl sm:text-5xl font-normal text-accent leading-none mb-2">
              {project.indicators.budgetExecutedPct}%
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Hitos planificados cumplidos según cronograma semestral.
          </p>
        </div>

        {/* KPI 3: Personas impactadas */}
        <div className="liquid-glass rounded-2xl p-6 border border-line flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Impacto Directo
              </span>
              <span className="text-[10px] text-muted/60">(mockup)</span>
            </div>
            <div className="font-display text-4xl sm:text-5xl font-normal text-accent leading-none mb-2">
              {project.indicators.peopleImpacted}
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Beneficiarios directos acompañados en Pamplona.
          </p>
        </div>

        {/* KPI 4: Voluntarios */}
        <div className="liquid-glass rounded-2xl p-6 border border-line flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Voluntarios
              </span>
              <span className="text-[10px] text-muted/60">(mockup)</span>
            </div>
            <div className="font-display text-4xl sm:text-5xl font-normal text-accent leading-none mb-2">
              {project.indicators.volunteers}
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Jóvenes implicados en comisiones activas.
          </p>
        </div>
      </section>

      {/* PROSE SECTIONS: "EL CONTEXTO" / "OBJETIVOS" */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
        {/* El contexto (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D42365]" />
            <span className="text-xs uppercase tracking-widest text-accent-deep font-semibold">
              Diagnóstico
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-ink">
            El contexto
          </h2>
          <div className="text-ink text-base sm:text-lg leading-relaxed space-y-4 pt-2">
            <p>{project.context}</p>
          </div>
        </div>

        {/* Objetivos (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f472b6]" />
            <span className="text-xs uppercase tracking-widest text-accent-deep font-semibold">
              Metas
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-ink">
            Objetivos estratégicos
          </h2>
          <ul className="space-y-4 pt-2">
            {project.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-ink">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3-IMAGE GALLERY PLACEHOLDERS */}
      <section className="space-y-6 pt-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-deep font-semibold block mb-1">
            Registro Visual
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-normal text-ink">
            Galería de actividades
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {project.gallery.map((img, idx) => (
            <figure
              key={idx}
              className="liquid-glass rounded-2xl overflow-hidden border border-line group"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-soft">
                <Image
                  src={img.url}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <figcaption className="p-4 text-xs text-muted leading-snug">
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PROJECT-SPECIFIC DONA BAND (Bizum + transferencia cards, concept note "Proyecto: [name]") */}
      <section className="pt-8">
        <DonationBand
          conceptNote={`Proyecto: ${project.name}`}
          title={`Apoya el ${project.name}`}
          subtitle="Tu colaboración permite sufragar materiales didácticos, kits sostenibles y el desplazamiento de los equipos sobre el terreno."
        />
      </section>
    </div>
  );
}
