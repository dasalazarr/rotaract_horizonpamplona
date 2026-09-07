/**
 * EVENTOS Y REUNIONES - ROTARACT HORIZON PAMPLONA
 * 
 * Contiene los eventos del club con slugs estables y amigables para códigos QR.
 * Calcula automáticamente si un evento ha finalizado según la fecha actual.
 */

export interface EventItem {
  name: string; // Título del evento (mockup editable)
  slug: string; // Slug QR-friendly en minúsculas con guiones
  type: 'club' | 'distrito' | 'abierto' | 'colaboracion';
  typeLabel: string;
  cover: string;
  date: string; // Fecha en español para lectura directa
  dayNumber: string; // "26"
  monthUpper: string; // "SEPTIEMBRE"
  year: number;
  time: string; // "19:30"
  isoDateTime: string; // Fecha ISO para cálculo de estado automático y JSON-LD
  place: string; // "Pamplona, Navarra"
  addressDetails: string; // Dirección o sala
  description: string;
  agenda: {
    time: string;
    item: string;
  }[];
  capacity: string; // "25 plazas"
  status: 'proximo' | 'abierto' | 'completo' | 'finalizado';
  statusLabel: string;
  registration: 'email' | 'external' | 'none';
  registrationEmail?: string;
  registrationUrl?: string; // Requerido cuando registration === 'external'
}

export const events: EventItem[] = [
  {
    name: 'Reunión abierta de septiembre', // Evento semilla requerido
    slug: 'reunion-abierta-septiembre',
    type: 'abierto',
    typeLabel: 'Jornada Abierta',
    cover: '/assets/reunion.jpg',
    date: 'Viernes, 26 de septiembre de 2026',
    dayNumber: '26',
    monthUpper: 'SEPTIEMBRE',
    year: 2026,
    time: '19:30',
    isoDateTime: '2026-09-26T19:30:00+02:00',
    place: 'Pamplona (Café Iruña)',
    addressDetails: 'Plaza del Castillo 44, 31001 Pamplona',
    description: 'Encuentro participativo para nuevos simpatizantes, universitarios y profesionales jóvenes de Pamplona. Descubriremos la hoja de ruta de los proyectos de este curso, la dinámica de trabajo en comisiones y cómo sumarte como socio o colaborador en iniciativas de acción directa.',
    agenda: [
      { time: '19:30', item: 'Recepción de asistentes y bienvenida informal con el equipo directivo' },
      { time: '20:00', item: 'Presentación de Horizon Pamplona: proyectos en curso y valores rotaractianos' },
      { time: '20:30', item: 'Dinámica ágil de cocreación: retos sociales de la juventud en Navarra' },
      { time: '21:00', item: 'Ronda abierta de preguntas, networking y cierre distendido' },
    ],
    capacity: '25 plazas disponibles',
    status: 'proximo',
    statusLabel: 'Próximo',
    registration: 'email',
    registrationEmail: 'hola@horizonpamplona.org',
  },
  {
    name: 'El Mejor Espárrago del Mundo — XIV Cata Solidaria',
    slug: 'xiv-cata-solidaria-esparrago',
    type: 'colaboracion',
    typeLabel: 'Colaboración Rotary Pamplona',
    cover: '/assets/esparrago-cata-solidaria.jpg',
    date: 'Viernes, 25 de septiembre de 2026',
    dayNumber: '25',
    monthUpper: 'SEPTIEMBRE',
    year: 2026,
    time: '12:00',
    isoDateTime: '2026-09-25T12:00:00+02:00',
    place: 'Pamplona (Hotel Tres Reyes)',
    addressDetails: 'Jardines de la Taconera s/n, 31001 Pamplona',
    description: 'La XIV Cata Solidaria del Espárrago, organizada por el Rotary Club de Pamplona con el apoyo del Instituto Navarro de Tecnologías e Infraestructuras Agroalimentarias (INTIA) y la Cofradía del Espárrago de Navarra, elige cada año la mejor conserva de espárrago del mundo. Durante los doce meses siguientes, la venta solidaria de las latas ganadoras a través de la tienda on-line del Rotary Club de Pamplona financia proyectos sociales locales y el Programa END POLIO NOW. La jornada incluye cata y cena (85 €) y una visita opcional a Artajona y el Proyecto Food Forest (15 €).',
    agenda: [
      { time: '12:00', item: 'Inicio del acto oficial: cata a ciegas del jurado, entrega de Delantales Solidarios y cheques a los proyectos locales' },
      { time: '12:30', item: 'Fallo del jurado y proclamación de la conservera ganadora 2026' },
      { time: '13:00', item: 'Lunch' },
      { time: '17:00', item: 'Salida en autobús hacia Bodegas Monjardín' },
      { time: '20:00', item: 'Cena y cambio de collares' },
    ],
    capacity: 'Plazas limitadas',
    status: 'abierto',
    statusLabel: 'Abierto',
    registration: 'external',
    registrationUrl: 'https://www.rotaryclubpamplona.com/eventos/',
  },
];

/**
 * Determina el estado efectivo de un evento.
 * Si la fecha del evento es anterior a la fecha actual,
 * cambia automáticamente a 'finalizado'.
 */
export function getEffectiveEventStatus(event: EventItem): {
  status: EventItem['status'];
  label: string;
  isPast: boolean;
} {
  const eventDate = new Date(event.isoDateTime);
  const now = new Date();

  if (now > eventDate) {
    return {
      status: 'finalizado',
      label: 'Finalizado',
      isPast: true,
    };
  }

  return {
    status: event.status,
    label: event.statusLabel,
    isPast: false,
  };
}
