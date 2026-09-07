import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Mail, QrCode, CheckCircle2 } from 'lucide-react';
import { events, getEffectiveEventStatus } from '@/content/events';
import { Badge } from '@/components/ui/badge';

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return {
      title: 'Evento no encontrado',
    };
  }

  return {
    title: `${event.name} — ${event.date}`,
    description: event.description,
    openGraph: {
      title: `${event.name} | Rotaract Horizon Pamplona`,
      description: `${event.date} · ${event.place}. ${event.description}`,
      type: 'website',
      images: [
        {
          url: event.cover,
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.name,
      description: `${event.date} · ${event.place}`,
      images: [event.cover],
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const { status, label, isPast } = getEffectiveEventStatus(event);

  // Schema.org Event JSON-LD
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.isoDateTime,
    eventStatus: isPast
      ? 'https://schema.org/EventCompleted'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.place,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.addressDetails,
        addressLocality: 'Pamplona',
        addressRegion: 'Navarra',
        addressCountry: 'ES',
      },
    },
    image: [event.cover],
    organizer: {
      '@type': 'Organization',
      name: 'Rotaract Horizon Pamplona',
      url: 'https://horizonpamplona.org',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: isPast
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      url: `https://horizonpamplona.org/eventos/${event.slug}`,
      validFrom: '2026-01-01T00:00:00Z',
    },
  };

  const mailtoSubject = encodeURIComponent(`Inscripción a: ${event.name}`);
  const mailtoBody = encodeURIComponent(
    `Hola equipo de Rotaract Horizon Pamplona,\n\nMe gustaría reservar plaza para el evento "${event.name}" del ${event.date}.\n\nMis datos son:\n- Nombre:\n- Teléfono:\n- ¿Eres socio o simpatizante?:\n\n¡Gracias!`
  );
  const mailtoHref = `mailto:${event.registrationEmail || 'hola@horizonpamplona.org'}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:py-16 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/eventos"
            className="inline-flex items-center text-xs uppercase tracking-wider text-[#abb3bf] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Volver a Eventos
          </Link>
        </div>

        {/* HEADER AREA */}
        <div className="max-w-4xl space-y-4">
          {/* Meta pills: status + type */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge
              variant={isPast ? 'muted' : status === 'proximo' ? 'default' : 'glass'}
              className="text-xs"
            >
              {label}
            </Badge>
            <Badge variant="glass" className="text-xs">
              {event.typeLabel}
            </Badge>
            <Badge variant="muted" className="text-xs">
              {event.capacity}
            </Badge>
          </div>

          {/* Serif H1 */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight">
            {event.name}
          </h1>

          <p className="text-lg text-[#abb3bf] font-normal max-w-2xl">
            {event.date} · {event.time} h · {event.place}
          </p>
        </div>

        {/* 21:9 OG-OPTIMIZED COVER */}
        <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden bg-[#0c1822] border border-white/10 shadow-2xl">
          <Image
            src={event.cover}
            alt={event.name}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081621]/80 via-transparent to-transparent" />
        </div>

        {/* 2-COL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT (8 cols): Description + "Programa" agenda list */}
          <div className="lg:col-span-8 space-y-12">
            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-normal text-white">
                Sobre este encuentro
              </h2>
              <p className="text-base sm:text-lg text-[#C4CEDC] leading-relaxed font-normal">
                {event.description}
              </p>
              <div className="pt-2 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#abb3bf]">
                <strong className="text-white block mb-1">Localización detallada:</strong>
                <span>{event.addressDetails}</span>
              </div>
            </div>

            {/* "Programa" agenda list (serif magenta time, 1px separators) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D42365]" />
                <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
                  Programa de la sesión
                </h3>
              </div>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {event.agenda.map((slot, idx) => (
                  <div
                    key={idx}
                    className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
                  >
                    {/* Serif magenta time */}
                    <span className="font-display text-2xl text-[#D42365] font-normal shrink-0 w-24">
                      {slot.time} h
                    </span>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                      {slot.item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Small muted note: URL estable pensada para QR */}
            <div className="flex items-center gap-2 text-xs text-[#abb3bf] italic pt-2">
              <QrCode className="w-4 h-4 text-[#D42365] shrink-0" />
              <span>URL estable pensada para QR: /eventos/{event.slug}</span>
            </div>
          </div>

          {/* RIGHT (4 cols): LIQUID-GLASS DATEBOX */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="liquid-glass rounded-3xl p-8 border border-white/10 space-y-6 shadow-2xl">
              {/* Giant serif day number */}
              <div className="text-center pb-6 border-b border-white/10">
                <span className="font-display text-7xl sm:text-8xl font-normal text-[#D42365] leading-none block">
                  {event.dayNumber}
                </span>
                {/* Month · time uppercase */}
                <span className="text-xs font-semibold tracking-widest uppercase text-white block mt-2">
                  {event.monthUpper} · {event.time} H
                </span>
                <span className="text-xs text-[#abb3bf] block mt-1">
                  Año {event.year}
                </span>
              </div>

              {/* Place line & status */}
              <div className="space-y-3 text-xs text-[#abb3bf]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D42365] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{event.place}</strong>
                    <span className="text-[#abb3bf]/80">{event.addressDetails}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span>Aforo estimado:</span>
                  <span className="text-white font-medium">{event.capacity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Estado actual:</span>
                  <Badge
                    variant={isPast ? 'muted' : status === 'proximo' ? 'default' : 'glass'}
                    className="text-xs capitalize"
                  >
                    {label}
                  </Badge>
                </div>
              </div>

              {/* [Inscribirme] primary button (mailto stub when registration=email) */}
              <div className="pt-2">
                {isPast ? (
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-[#abb3bf]">
                    Este evento ya ha finalizado. Consulta nuestros próximos encuentros en la agenda.
                  </div>
                ) : (
                  <a
                    href={mailtoHref}
                    id="btn-inscribirme-evento"
                    className="btn-primary w-full py-3.5 text-sm font-medium flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Inscribirme gratis</span>
                  </a>
                )}
              </div>

              <p className="text-[11px] text-[#abb3bf] text-center leading-relaxed">
                Asistencia gratuita sin compromiso. Confirmación sujeta a disponibilidad de aforo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
