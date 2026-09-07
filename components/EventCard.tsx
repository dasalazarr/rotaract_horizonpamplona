import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, ArrowRight, Calendar } from 'lucide-react';
import { EventItem, getEffectiveEventStatus } from '@/content/events';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const { status, label, isPast } = getEffectiveEventStatus(event);

  return (
    <article
      id={`event-card-${event.slug}`}
      className="liquid-glass rounded-2xl overflow-hidden group flex flex-col h-full transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Top Cover */}
      <Link
        href={`/eventos/${event.slug}`}
        className="relative aspect-[16/9] w-full overflow-hidden bg-paper-soft block focus:outline-none"
        tabIndex={-1}
      >
        <Image
          src={event.cover}
          alt={event.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70" />

        {/* Floating Date Badge on the Image */}
        <div className="absolute top-4 left-4 rounded-xl bg-ink/85 backdrop-blur-md border border-white/10 px-3.5 py-2 text-center shadow-lg">
          <span className="font-display text-2xl font-normal text-[#D42365] leading-none block">
            {event.dayNumber}
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-white/90 block mt-0.5">
            {event.monthUpper.slice(0, 3)}
          </span>
        </div>

        {/* Status and Type Pills */}
        <div className="absolute top-4 right-4 flex gap-1.5 items-center">
          <Badge
            variant={isPast ? 'muted' : status === 'proximo' ? 'default' : 'glass'}
            className="text-xs"
          >
            {label}
          </Badge>
          <Badge variant="glass" className="text-xs">
            {event.typeLabel}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-4 text-xs text-muted mb-3">
            <span className="inline-flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-accent" />
              {event.time} h
            </span>
            <span>·</span>
            <span className="inline-flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-muted" />
              {event.year}
            </span>
          </div>

          <Link href={`/eventos/${event.slug}`} className="block group-hover:text-accent transition-colors">
            <h3 className="font-display text-2xl font-normal text-ink leading-snug mb-2.5">
              {event.name}
            </h3>
          </Link>

          <p className="text-sm text-muted line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          <div className="flex items-start text-xs text-muted/90 gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.place}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-line flex items-center justify-between">
          <Link
            href={`/eventos/${event.slug}`}
            className="inline-flex items-center text-sm font-medium text-accent-deep group-hover:opacity-70 transition-opacity"
          >
            Ver detalles
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <span className="text-xs text-muted/80">{event.capacity}</span>
        </div>
      </div>
    </article>
  );
}
