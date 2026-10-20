/**
 * CAMPAÑA CONTRA LA POLIO PAMPLONA 2026 — datos editables
 *
 * Fecha, lugar, textos compartidos y logos de la campaña. Cambiar aquí, no en los componentes.
 */

export const polioEvent = {
  // 24 de octubre de 2026, 19:30 hora peninsular (CEST, UTC+2)
  start: '2026-10-24T19:30:00+02:00',
  end: '2026-10-24T21:00:00+02:00',
  dateLabel: 'Sábado 24 de octubre',
  timeLabel: '19:30 h',
  place: 'Plaza del Castillo',
  city: 'Pamplona',
  address: 'Plaza del Castillo, 31001 Pamplona, Navarra',
  mapsUrl: 'https://maps.google.com/?q=Plaza+del+Castillo+Pamplona',
  programme: [
    { time: '19:30', text: 'La Plaza del Castillo se enciende de rojo.' },
    { time: '19:45', text: 'Inflamos globos rojos: cada uno, un niño que merece crecer sin polio.' },
    { time: '20:00', text: 'Información sobre la polio y la vacunación, con Rotary y Rotaract.' },
  ],
};

export const polioCampaign = {
  name: 'Pamplona contra la Polio',
  year: 2026,
  hashtag: '#PamplonaContraLaPolio',
  goal: 1000,
  // Por debajo de este número el contador muestra una invitación en lugar de la cifra.
  counterThreshold: 20,
  organizer: 'Rotary Club Pamplona',
  partner: 'Rotaract Horizon Pamplona',
  endPolioUrl: 'https://www.endpolio.org/es',
  gpeiUrl: 'https://polioeradication.org/',
  shareText:
    'El 24 de octubre a las 19:30 la Plaza del Castillo se enciende de rojo contra la polio. Toda la información:',
  // Sube la versión si cambias las imágenes: WhatsApp cachea la miniatura por URL.
  ogVersion: 'v2',
};

/**
 * LOGOS. Deja el archivo en /public/polio/logos/ y escribe aquí su ruta.
 * Mientras `src` sea null se muestra el nombre en texto, sin romper nada.
 * Descarga oficial: Rotary Brand Center (brandcenter.rotary.org), con cuenta My Rotary.
 */
export const polioLogos: { rotaryClub: string | null; endPolioNow: string | null; rotaract: string } = {
  rotaryClub: '/polio/rotary-club.png',
  endPolioNow: null, // p. ej. '/polio/logos/end-polio-now-blanco.svg'
  rotaract: '/polio/rotaract-pamplona-horizon.png',
};

export const INTERESTS = [
  { id: 'asistir', label: 'Ir a la plaza' },
  { id: 'voluntariado', label: 'Ser voluntario' },
  { id: 'donar', label: 'Donar' },
  { id: 'difundir', label: 'Difundir' },
  { id: 'patrocinar', label: 'Patrocinar' },
] as const;

export type InterestId = (typeof INTERESTS)[number]['id'];
export type CampaignMode = 'expectativa' | 'lanzamiento';

export const CONSENT_VERSION = 'v1-2026-09-30';

/** Foto del hero (y de las tarjetas de «Súmate»). */
export const polioHero = {
  src: '/polio/hero-rotary-end-polio.jpg',
};

export const polioPlaza = {
  src: '/polio/plaza-del-castillo-pamplona-1.jpg',
  alt: 'Plaza del Castillo de Pamplona, con su templete y las fachadas que la rodean',
};
