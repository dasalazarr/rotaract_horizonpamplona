import React from 'react';
import type { Metadata } from 'next';
import { projects } from '@/content/projects';
import { ProjectCard } from '@/components/ProjectCard';

export const metadata: Metadata = {
  title: 'Proyectos Sociales de Impacto Comunitario',
  description:
    'Iniciativas de voluntariado y desarrollo social impulsadas por Rotaract Horizon Pamplona en la comarca de Pamplona.',
  openGraph: {
    title: 'Proyectos | Rotaract Horizon Pamplona',
    description:
      'Descubre las iniciativas en marcha y cómo nuestras comisiones de trabajo transforman Pamplona.',
  },
};

export default function ProyectosIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:py-20">
      {/* Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D42365] mb-3">
          <span>Iniciativas en curso</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight mb-4">
          Proyectos Comunitarios
        </h1>
        <p className="text-base sm:text-lg text-[#abb3bf] leading-relaxed">
          Cada proyecto nace de un diagnóstico riguroso de necesidades locales en Pamplona, cuenta con metas medibles e involucra a la ciudadanía joven en su ejecución directa.
        </p>
      </div>

      {/* Grid of project cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
