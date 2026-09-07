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
}

export const events: EventItem[] = [
  {
    name: 'Reunión abierta de septiembre', // Evento semilla requerido
    slug: 'reunion-abierta-septiembre',
    type: 'abierto',
    typeLabel: 'Jornada Abierta',
    cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80',
    date: 'Viernes, 26 de septiembre de 2026',
    dayNumber: '26',
    monthUpper: 'SEPTIEMBRE',
    year: 2026,
    time: '19:30',
    isoDateTime: '2026-09-26T19:30:00+02:00',
    place: 'Pamplona (Centro Cívico Condestable / Sala Multiusos)',
    addressDetails: 'Calle Mayor 2, Casco Antiguo, 31001 Pamplona',
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
    name: 'Taller práctico de oratoria y debate persuasivo',
    slug: 'taller-oratoria-debate-persuasivo',
    type: 'club',
    typeLabel: 'Formación en Liderazgo',
    cover: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=80',
    date: 'Sábado, 17 de octubre de 2026',
    dayNumber: '17',
    monthUpper: 'OCTUBRE',
    year: 2026,
    time: '10:30',
    isoDateTime: '2026-10-17T10:30:00+02:00',
    place: 'Pamplona (Edificio Amigos, Campus Universitario)',
    addressDetails: 'Campus Universidad de Navarra / UPNA, Pamplona',
    description: 'Sesión intensiva dirigida a dominar la estructura de discursos de impacto, control del lenguaje no verbal y argumentación dialéctica en foros de toma de decisiones.',
    agenda: [
      { time: '10:30', item: 'Apertura y fundamentos de la retórica contemporánea' },
      { time: '11:30', item: 'Ejercicios de improvisación y control de la voz' },
      { time: '12:30', item: 'Simulación de debate parlamentario por equipos' },
      { time: '13:30', item: 'Feedback personalizado de ponentes invitados' },
    ],
    capacity: '20 plazas',
    status: 'abierto',
    statusLabel: 'Abierto',
    registration: 'email',
    registrationEmail: 'hola@horizonpamplona.org',
  },
  {
    name: 'Jornada ecológica en las riberas del Arga',
    slug: 'jornada-ecologica-riberas-arga',
    type: 'colaboracion',
    typeLabel: 'Servicio Comunitario',
    cover: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
    date: 'Sábado, 8 de noviembre de 2026',
    dayNumber: '08',
    monthUpper: 'NOVIEMBRE',
    year: 2026,
    time: '09:30',
    isoDateTime: '2026-11-08T09:30:00+02:00',
    place: 'Parque Fluvial de la Comarca (Paseo de Aranzadi)',
    addressDetails: 'Paseo fluvial de Aranzadi, Pamplona',
    description: 'Actividad de campo abierta a toda la ciudadanía pamplonesa para la retirada controlada de microplásticos y reforestación de especies autóctonas en la ribera fluvial.',
    agenda: [
      { time: '09:30', item: 'Punto de encuentro y reparto de material de protección y guantes' },
      { time: '10:00', item: 'Briefing medioambiental y asignación de tramos del río' },
      { time: '12:00', item: 'Pesaje colectivo de residuos y separación en puntos limpios' },
      { time: '12:45', item: 'Aperitivo de agradecimiento para voluntarios' },
    ],
    capacity: '40 plazas',
    status: 'abierto',
    statusLabel: 'Abierto',
    registration: 'email',
    registrationEmail: 'hola@horizonpamplona.org',
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
