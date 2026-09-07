import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { DonationBand } from '@/components/DonationBand';
import { donationFaqs } from '@/content/faq';
import { projects } from '@/content/projects';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Dona a Rotaract Horizon Pamplona — Transparencia e Impacto',
  description:
    'Tu aportación financia proyectos sociales de ayuda escolar, sostenibilidad y servicio comunitario en Pamplona. Métodos manuales directos vía Bizum y transferencia bancaria.',
  openGraph: {
    title: 'Dona a Horizon Pamplona | Causa Solidaria',
    description:
      'Tu aportación financia proyectos sociales con impacto directo y transparencia en Pamplona.',
  },
};

export default function DonaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 sm:pb-20 space-y-20">
      {/* HEADER */}
      <header className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-deep mb-3">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Compromiso Solidario</span>
        </div>

        {/* Serif H1 "Dona a Horizon Pamplona" */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-ink leading-tight mb-5">
          Dona a Horizon Pamplona
        </h1>

        {/* Lead about direct impact and transparency */}
        <p className="text-base sm:text-lg text-muted font-normal leading-relaxed">
          Creemos en la máxima transparencia: cada aportación se destina íntegramente a las compras y recursos de nuestros proyectos sociales de proximidad en Navarra, sin intermediarios comerciales ni gastos opacos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent" />
            100% aplicado a proyectos
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Sin intermediarios ni pasarelas con comisión
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" />
            Rendición de cuentas pública
          </span>
        </div>
      </header>

      {/* TWO METHOD CARDS (BIZUM / TRANSFERENCIA) VIA DONATION BAND */}
      <section>
        <DonationBand
          title="Métodos directos de aportación"
          subtitle="Realiza tu donación de forma inmediata a través de Bizum ONG o mediante transferencia a nuestra cuenta en entidad bancaria colaboradora."
        />
      </section>

      {/* SHORT "PARA QUÉ SE USA TU DONACIÓN" LIST POINTING TO ACTIVE PROJECTS */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent-deep font-semibold block mb-1">
            Destino del fondo
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-ink">
            ¿Para qué se usa tu donación?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="liquid-glass rounded-2xl p-6 border border-line flex flex-col justify-between"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-accent-deep font-medium block mb-2">
                  {project.area}
                </span>
                <h3 className="font-display text-2xl font-normal text-ink mb-2">
                  {project.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mb-4">
                  {project.excerpt}
                </p>
                <div className="py-2.5 px-3.5 rounded-xl bg-ink/5 text-xs text-muted flex items-center justify-between">
                  <span>Presupuesto objetivo:</span>
                  <span className="text-ink font-semibold">{project.indicators.budget} <span className="text-[10px] text-muted/60">(mockup)</span></span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-line flex items-center justify-between">
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="text-xs text-accent-deep hover:opacity-70 transition-opacity font-medium inline-flex items-center"
                >
                  Conocer el proyecto
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <span className="text-[11px] text-muted/70">
                  Concepto: {project.name.split('—')[0].trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MINI-FAQ (3 ITEMS, SHADCN ACCORDION) */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-accent" />
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-ink">
            Preguntas frecuentes sobre donaciones
          </h2>
        </div>

        <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-line">
          <Accordion type="single" collapsible className="w-full">
            {donationFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
