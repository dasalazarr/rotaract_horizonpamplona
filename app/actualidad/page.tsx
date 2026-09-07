import React from 'react';
import type { Metadata } from 'next';
import { ActualidadClient } from './ActualidadClient';

export const metadata: Metadata = {
  title: 'Actualidad y Crónica de Actividades',
  description:
    'Artículos, comunicados y seguimiento de los proyectos comunitarios de Rotaract Horizon Pamplona en Navarra y el Distrito 2202.',
  openGraph: {
    title: 'Actualidad | Rotaract Horizon Pamplona',
    description:
      'Artículos, comunicados y seguimiento de los proyectos comunitarios de Rotaract Horizon Pamplona.',
  },
};

export default function ActualidadPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 sm:pb-20">
      {/* Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-deep mb-3">
          <span>Publicaciones</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-ink leading-tight mb-4">
          Actualidad del Club
        </h1>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          Reflexiones sobre voluntariado juvenil, memorias de actividades, avances de proyectos de servicio y novedades institucionales en Pamplona.
        </p>
      </div>

      {/* Filter and Grid */}
      <ActualidadClient />
    </div>
  );
}
