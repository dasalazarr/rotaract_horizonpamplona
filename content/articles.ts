/**
 * ARTÍCULOS DE ACTUALIDAD - ROTARACT HORIZON PAMPLONA
 * 
 * Contenido editorial con categorías: Club, Distrito, Proyectos, Eventos.
 * Cada artículo se renderiza automáticamente en /actualidad y /actualidad/[slug].
 */

export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  category: 'Club' | 'Distrito' | 'Proyectos' | 'Eventos';
  date: string; // Formato legible en español
  isoDate: string;
  readingTime: string;
  cover: string;
  author: string;
  body: {
    paragraphs: string[];
    blockquote?: string;
  };
  cta: 'dona' | 'socios' | null;
}

export const articles: Article[] = [
  {
    title: 'Constitución oficial de Rotaract Horizon Pamplona: nueva energía juvenil en Navarra',
    slug: 'constitucion-oficial-rotaract-horizon-pamplona',
    category: 'Club',
    date: '14 de febrero de 2026',
    isoDate: '2026-02-14',
    readingTime: '3 min de lectura',
    cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
    author: 'Junta Directiva',
    excerpt: 'Nace un nuevo espacio de liderazgo cívico para universitarios y jóvenes profesionales comprometidos con resolver retos locales mediante la acción directa.',
    body: {
      paragraphs: [
        'En un encuentro celebrado en el corazón de la capital navarra, jóvenes de diversos perfiles universitarios y profesionales consolidaron la fundación de Rotaract Horizon Pamplona, un club orientado a transformar la inquietud social en proyectos de impacto tangible.',
        'La iniciativa responde a la necesidad de construir puentes intergeneracionales en Pamplona, promoviendo el servicio solidario con un enfoque riguroso, medible y transparente. A través del respaldo de la red global de Rotary International, el nuevo club une su vocación local con una perspectiva global.',
        'Durante las próximas semanas, la entidad presentará sus dos primeros programas de intervención en materia de refuerzo escolar y sostenibilidad urbana, invitando a la ciudadanía joven a integrarse activamente en las comisiones de trabajo.',
      ],
      blockquote: 'No entendemos el liderazgo como una posición de privilegio, sino como la responsabilidad ineludible de ponerse al servicio de la comunidad.',
    },
    cta: 'socios',
  },
  {
    title: 'Encuentro Distrital 2202: liderazgo compartido entre clubes del norte peninsular',
    slug: 'encuentro-distrital-2202-liderazgo-compartido',
    category: 'Distrito',
    date: '28 de enero de 2026',
    isoDate: '2026-01-28',
    readingTime: '4 min de lectura',
    cover: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
    author: 'Comisión de Distrito',
    excerpt: 'Representantes de Horizon Pamplona participaron en las jornadas formativas del Distrito 2202 debatiendo sobre innovación social y gobernanza asociativa.',
    body: {
      paragraphs: [
        'Los miembros de la directiva de Horizon Pamplona se desplazaron este fin de semana a las sesiones de trabajo del Distrito 2202 de Rotary, que agrupa a delegaciones juveniles de Navarra, Aragón, Cataluña, La Rioja, Cantabria y País Vasco.',
        'El eje central de las jornadas abordó la profesionalización en la gestión de proyectos de voluntariado y la implementación de sistemas de medición de impacto según las directrices de los Objetivos de Desarrollo Sostenible (ODS).',
        'El intercambio de buenas prácticas con clubes veteranos refuerza el despliegue metodológico con el que Horizon Pamplona aborda sus programas de intervención social para este ejercicio.',
      ],
      blockquote: 'La fuerza de nuestra red reside en la capacidad de cooperar más allá de nuestras fronteras geográficas inmediatas.',
    },
    cta: 'socios',
  },
  {
    title: 'Avances del Proyecto 1: apoyo y mentoría educativa en barrios de Pamplona',
    slug: 'avances-proyecto-1-mentoria-educativa-pamplona',
    category: 'Proyectos',
    date: '10 de enero de 2026',
    isoDate: '2026-01-10',
    readingTime: '3 min de lectura',
    cover: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80',
    author: 'Equipo de Proyectos',
    excerpt: 'Comienza la fase diagnóstica para coordinar sesiones de refuerzo y orientación a escolares en colaboración con entidades locales navarras.',
    body: {
      paragraphs: [
        'El equipo de proyectos de Horizon Pamplona ha finalizado la primera ronda de entrevistas con educadores y mediadores sociales de varios distritos pamploneses para estructurar un modelo de mentoría cercana y constante.',
        'El plan contempla talleres semanales orientados al fomento de la lectura comprensiva, resolución de dudas en materias troncales y estímulo de vocaciones científicas y humanísticas entre niños y adolescentes.',
        'Gracias a las aportaciones de nuestros donantes y al compromiso de los socios voluntarios, la previsión contempla atender a más de 45 alumnos a lo largo del curso académico.',
      ],
      blockquote: 'Garantizar que ningún estudiante se quede atrás por falta de acompañamiento es una de las mayores inversiones cívicas de nuestra ciudad.',
    },
    cta: 'dona',
  },
  {
    title: 'Convocatoria abierta: conoce la metodología de trabajo de Horizon Pamplona',
    slug: 'convocatoria-abierta-metodologia-trabajo',
    category: 'Eventos',
    date: '18 de diciembre de 2025',
    isoDate: '2025-12-18',
    readingTime: '2 min de lectura',
    cover: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80',
    author: 'Vocalía de Membresía',
    excerpt: 'Abrimos nuestras sesiones mensuales para que jóvenes con iniciativa descubran cómo formulamos proyectos desde cero.',
    body: {
      paragraphs: [
        'En Rotaract Horizon Pamplona creemos firmemente en la transparencia y la participación horizontal. Por ello, celebramos reuniones abiertas bimestrales para que cualquier persona interesada pueda conocer nuestra dinámica interna sin compromiso previo.',
        'Durante la sesión, los asistentes participan en una dinámica de ideación de soluciones para retos urbanos, conocen a los socios fundadores y comprenden el proceso de incorporación.',
      ],
    },
    cta: 'socios',
  },
  {
    title: 'Sostenibilidad circular: plan de recuperación de excedentes y reciclaje activo',
    slug: 'sostenibilidad-circular-plan-recuperacion-excedentes',
    category: 'Proyectos',
    date: '02 de diciembre de 2025',
    isoDate: '2025-12-02',
    readingTime: '3 min de lectura',
    cover: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1600&q=80',
    author: 'Comisión Ambiental',
    excerpt: 'Definición de las líneas maestras de nuestro segundo proyecto centrado en la concienciación y reducción del desperdicio en comercios locales.',
    body: {
      paragraphs: [
        'La transición ecológica requiere compromisos cotidianos y alianzas locales de proximidad. Horizon Pamplona avanza en el diseño de su segundo proyecto marco, enfocado en optimizar la gestión de residuos en establecimientos de proximidad.',
        'A través de campañas divulgativas e intervenciones directas con el pequeño comercio de la cuenca de Pamplona, el proyecto busca reducir la huella ambiental comunitaria mientras fomenta el consumo responsable.',
      ],
      blockquote: 'El cambio medioambiental se consolida calle a calle, con soluciones viables y trabajo codo a codo con los comerciantes.',
    },
    cta: 'dona',
  },
  {
    title: 'Rotaract y Rotary: un legado centenario adaptado a la juventud del siglo XXI',
    slug: 'rotaract-rotary-legado-centenario-juventud-siglo-xxi',
    category: 'Club',
    date: '15 de noviembre de 2025',
    isoDate: '2025-11-15',
    readingTime: '4 min de lectura',
    cover: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80',
    author: 'Presidencia',
    excerpt: '¿Qué significa formar parte de una de las mayores redes de servicio voluntario internacional? Una reflexión sobre vocación, ética y futuro.',
    body: {
      paragraphs: [
        'Con más de 10.000 clubes en todo el planeta, Rotaract representa el rostro joven y proactivo de Rotary International. Desde Pamplona, Horizon recoge ese testigo histórico adaptándolo a las inquietudes tecnológicas, sociales y ecológicas contemporáneas.',
        'Ser socio de Rotaract significa acceder a una plataforma de desarrollo personal sin parangón: liderar equipos de trabajo, gestionar presupuestos con rigor ético, intervenir en causas de emergencia y establecer lazos de compañerismo con jóvenes de más de 180 países.',
      ],
      blockquote: 'Rotaract no es una actividad extraescolar ni un club social cerrado; es una escuela de ciudadanía activa y servicio riguroso.',
    },
    cta: 'socios',
  },
];
