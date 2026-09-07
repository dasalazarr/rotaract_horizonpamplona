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
    date: '31 de julio de 2026',
    isoDate: '2026-07-31',
    readingTime: '3 min de lectura',
    cover: '/assets/constitucion-oficial.jpg',
    author: 'Junta Directiva',
    excerpt: 'Nace un nuevo espacio de liderazgo cívico para universitarios y jóvenes profesionales comprometidos con resolver retos locales mediante la acción directa.',
    body: {
      paragraphs: [
        'En un encuentro celebrado en el corazón de la capital navarra, jóvenes de diversos perfiles universitarios y profesionales consolidaron la fundación de Rotaract Horizon Pamplona, un club orientado a transformar la inquietud social en proyectos de impacto tangible.',
        'La iniciativa responde a la necesidad de construir puentes intergeneracionales en Pamplona, promoviendo el servicio solidario con un enfoque riguroso, medible y transparente. A través del respaldo de la red global de Rotary International, el nuevo club une su vocación local con una perspectiva global.',
        'Durante las próximas semanas, el club consolidará su hoja de ruta para el año entrante, avanzando en la planificación de comisiones, calendario de actividades y objetivos de servicio. Este recorrido se enmarca en el patrocinio del Rotary Club de Pamplona, club padrino de Rotaract Horizon Pamplona, cuyo respaldo institucional impulsa el desarrollo de la nueva generación rotaractiana en Navarra.',
      ],
      blockquote: 'No entendemos el liderazgo como una posición de privilegio, sino como la responsabilidad ineludible de ponerse al servicio de la comunidad.',
    },
    cta: 'socios',
  },
  {
    title: 'XVIII Congreso del Distrito 2202 en Salou: Horizon Pamplona teje lazos de cara al futuro',
    slug: 'encuentro-distrital-2202-liderazgo-compartido',
    category: 'Distrito',
    date: '18 de mayo de 2026',
    isoDate: '2026-05-18',
    readingTime: '4 min de lectura',
    cover: '/assets/xviii-congreso-distrito-2202-salou.jpg',
    author: 'Comisión de Distrito',
    excerpt: 'Rotaract Horizon Pamplona participó en el XVIII Congreso del Distrito 2202, celebrado en Salou, presentándose ante el resto de clubes y estrechando lazos de cara al futuro.',
    body: {
      paragraphs: [
        'Rotaract Horizon Pamplona participó en el XVIII Congreso del Distrito 2202, celebrado los días 15 y 16 de mayo en el TAS de Salou. El club navarro se presentó ante el resto de clubes del distrito, conectando con la red rotaria y rotaractiana del norte peninsular y sentando las bases de futuras colaboraciones.',
        'El Congreso del Distrito es mucho más que una reunión: es el momento del año para reencontrarse, inspirarse con los proyectos de otros clubes, celebrar los logros alcanzados durante el ejercicio y disfrutar de ese compañerismo rotario que impulsa a seguir sirviendo a las comunidades.',
        'La edición de este año reunió un programa exigente, con ponencias inspiradoras, dinámicas de trabajo en equipo y espacios pensados para estrechar lazos entre clubes de Rotary y Rotaract de todo el distrito, reforzando la proyección de Horizon Pamplona como una de las voces jóvenes emergentes de la región.',
      ],
      blockquote: 'La fuerza de nuestra red reside en la capacidad de cooperar más allá de nuestras fronteras geográficas inmediatas.',
    },
    cta: 'socios',
  },
  {
    title: 'La noche más solidaria',
    slug: 'avances-proyecto-1-mentoria-educativa-pamplona',
    category: 'Club',
    date: '13 de mayo de 2026',
    isoDate: '2026-05-13',
    readingTime: '4 min de lectura',
    cover: '/assets/nochemassolidaria.jpg',
    author: 'Junta Directiva',
    excerpt: 'Rotaract Horizon Pamplona participó en La Noche Más Solidaria, la gala benéfica del Rotary Club de Pamplona, presentándose ante donantes y comunidad y sumando su apoyo a las iniciativas del club rotario.',
    body: {
      paragraphs: [
        'Rotaract Horizon Pamplona participó en La Noche Más Solidaria, la gala benéfica que el Rotary Club de Pamplona organiza cada año para recaudar fondos con fines sociales. El club navarro se presentó ante los principales donantes y ante la comunidad pamplonesa, compartiendo mesa y compromiso con las iniciativas impulsadas por el Rotary Club de Pamplona.',
        'La edición de este año se celebró el viernes 12 de mayo, a las 20:00 h, en el Hotel Iruña Park. La entrada tuvo un precio de 35 € por persona, y quienes no pudieron asistir contaron con una Fila Cero para colaborar igualmente con los proyectos solidarios. La velada comenzó con una cena maridada con vinos de Bodegas Primicia (La Rioja) y amenizada por la actuación en directo de Concordia Jazz Gang.',
        'Durante los postres se celebró un sorteo con productos donados, entre otros, por Movistar Team, Xota Osasuna Magna, Caja Rural-Seguros RGA, David Yarnoz, Juan Torres Zalba, Lacturale, Pizzerías Isla Sicilia, Akari Gastroteka, Coffing y El Caserío, tras el cual la fiesta continuó con copas y baile de la mano de Concordia Jazz Gang. Todo lo recaudado por el Rotary Club de Pamplona en esta gala se destina este año a sus proyectos solidarios, una causa a la que Horizon Pamplona suma su apoyo activo como parte de la gran familia rotaria de Navarra.',
      ],
      blockquote: 'La solidaridad se multiplica cuando distintas generaciones de la familia rotaria se sientan a la misma mesa por una misma causa.',
    },
    cta: 'dona',
  },
];
