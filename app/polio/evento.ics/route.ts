import { polioEvent, polioCampaign } from '@/lib/polio/config';
import { getSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-static';

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function GET() {
  const url = `${getSiteUrl()}/polio`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rotary Club Pamplona//Polio 2026//ES', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', 'UID:polio-2026@rotary-pamplona',
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(polioEvent.start)}`, `DTEND:${stamp(polioEvent.end)}`,
    `SUMMARY:${polioCampaign.name} · ${polioEvent.place}`,
    `LOCATION:${polioEvent.address.replace(/,/g, '\\,')}`,
    `DESCRIPTION:La Plaza del Castillo se enciende de rojo y lanzamos globos rojos por la erradicación de la polio. ${url}`,
    `URL:${url}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="pamplona-contra-la-polio.ics"',
    },
  });
}
