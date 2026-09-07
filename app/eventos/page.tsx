import React from 'react';
import type { Metadata } from 'next';
import { events } from '@/content/events';
import { EventCard } from '@/components/EventCard';

export const metadata: Metadata = {
  title: 'Agenda de Eventos y Reuniones Abiertas',
  description:
    'Encuentros, jornadas de formación y actividades de voluntariado organizadas por Rotaract Horizon Pamplona.',
  openGraph: {
    title: 'Eventos y Agenda | Rotaract Horizon Pamplona',
    description:
      'Participa en nuestras reuniones y talleres abiertos para jóvenes en Pamplona.',
  },
};

export default function EventosIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:py-20">
      {/* Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D42365] mb-3">
          <span>Encuentros y Calendario</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight mb-4">
          Agenda de Eventos
        </h1>
        <p className="text-base sm:text-lg text-[#abb3bf] leading-relaxed">
          Nuestras sesiones y actividades son abiertas a cualquier persona con inquietudes de servicio o liderazgo. Consulta las próximas fechas y reserva tu asistencia.
        </p>
      </div>

      {/* Grid of event cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </div>
  );
}
