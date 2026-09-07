/**
 * PROYECTOS SOCIALES - ROTARACT HORIZON PAMPLONA
 * 
 * Contiene la información de los proyectos del club.
 * Los datos están etiquetados como mockup editable para facilitar su personalización.
 */

export interface Project {
  name: string; // Título visible del proyecto (mockup editable)
  slug: string; // Slug QR-friendly en minúsculas y guiones
  status: 'idea' | 'activo' | 'abierto' | 'cerrado' | 'historico';
  statusLabel: string; // "Activo", "Abierto", etc.
  area: string; // "Educación y Juventud", "Sostenibilidad Local", etc.
  ods: {
    number: number;
    name: string;
  }[];
  cover: string; // Imagen principal 21:9 o 16:10
  tagline: string;
  excerpt: string;
  context: string;
  objectives: string[];
  indicators: {
    budget: string; // ej. "2.400 €" (mockup)
    budgetValue: number;
    budgetExecutedPct: number; // Porcentaje ejecutado (0-100) para barra magenta (mockup)
    peopleImpacted: string; // ej. "120 personas" (mockup)
    volunteers: string; // ej. "18 voluntarios" (mockup)
  };
  gallery: {
    url: string;
    caption: string;
  }[];
  cta: {
    primaryText: string;
    note: string;
  };
}

export const projects: Project[] = [
  {
    name: 'Proyecto 1 — mockup editable', // Nombre editable en content/projects.ts
    slug: 'proyecto-1-mockup-editable',
    status: 'activo',
    statusLabel: 'Activo',
    area: 'Educación y Reducción de Desigualdades',
    ods: [
      { number: 4, name: 'Educación de Calidad' },
      { number: 10, name: 'Reducción de las Desigualdades' },
    ],
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Refuerzo escolar y mentoría integral para jóvenes de barrios de Pamplona',
    excerpt: 'Programa de acompañamiento académico y desarrollo de habilidades personales para estudiantes en riesgo de exclusión escolar.',
    context: 'En diferentes distritos de la comarca de Pamplona, familias y colectivos vecinales identifican la brecha formativa y digital como una barrera crítica para el futuro de niños y adolescentes. Frente a esta realidad, nuestro club estructura un esquema de sesiones semanales presenciales donde universitarios y jóvenes graduados ofrecen refuerzo pedagógico individualizado, apoyo emocional y talleres de vocación profesional.',
    objectives: [
      'Proporcionar apoyo curricular personalizado en materias básicas (lengua, matemáticas e idiomas).',
      'Desarrollar competencias digitales y técnicas de estudio autónomo en entornos seguros.',
      'Organizar visitas culturales y talleres de divulgación con referentes locales de Navarra.',
      'Fomentar la autoestima escolar y la motivación hacia itinerarios formativos superiores.',
    ],
    indicators: {
      budget: '2.400 €', // Presupuesto estimado (mockup)
      budgetValue: 2400,
      budgetExecutedPct: 65, // 65% ejecutado (mockup)
      peopleImpacted: '45+', // Alumnos y familias beneficiadas (mockup)
      volunteers: '14', // Socios y colaboradores implicados (mockup)
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
        caption: 'Sesión de trabajo cooperativo y tutoría',
      },
      {
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
        caption: 'Taller de habilidades sociales y dinámicas grupales',
      },
      {
        url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
        caption: 'Espacio de lectura guiada y refuerzo lingüístico',
      },
    ],
    cta: {
      primaryText: 'Apoyar este proyecto con una donación',
      note: 'Indica el concepto "Proyecto 1" en tu Bizum o transferencia',
    },
  },
  {
    name: 'Proyecto 2 — mockup editable', // Nombre editable en content/projects.ts
    slug: 'proyecto-2-mockup-editable',
    status: 'abierto',
    statusLabel: 'Abierto',
    area: 'Acción por el Clima y Consumo Responsable',
    ods: [
      { number: 11, name: 'Ciudades y Comunidades Sostenibles' },
      { number: 12, name: 'Producción y Consumo Responsables' },
      { number: 13, name: 'Acción por el Clima' },
    ],
    cover: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
    tagline: 'Reducción de residuos y concienciación ambiental en el comercio local pamplonés',
    excerpt: 'Campaña participativa junto a establecimientos de proximidad para impulsar alternativas sostenibles y reducir la huella de embalajes plásticos.',
    context: 'El tejido comercial de proximidad de Pamplona posee una extraordinaria cercanía con la ciudadanía, constituyendo el canal idóneo para transformar hábitos hacia la economía circular. El proyecto colabora con comerciantes de ultramarinos, mercados municipales y hostelería para auditar sus flujos de residuos no reciclables e implantar opciones biodegradables y reutilizables.',
    objectives: [
      'Establecer diagnósticos sencillos de generación de residuos en 30 comercios asociados.',
      'Distribuir kits de sensibilización y bolsas reutilizables de material 100% reciclado.',
      'Organizar jornadas de recogida de plásticos y limpieza fluvial en las orillas del río Arga.',
      'Publicar una guía divulgativa abierta para el consumo sostenible en la comarca.',
    ],
    indicators: {
      budget: '1.800 €', // Presupuesto estimado (mockup)
      budgetValue: 1800,
      budgetExecutedPct: 30, // 30% ejecutado (mockup)
      peopleImpacted: '300+', // Ciudadanos y comerciantes alcanzados (mockup)
      volunteers: '18', // Voluntarios movilizados (mockup)
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
        caption: 'Muestreo de materiales y sensibilización a comerciantes',
      },
      {
        url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
        caption: 'Jornada comunitaria de limpieza de riberas',
      },
      {
        url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
        caption: 'Puntos verdes de recogida selectiva en barrios',
      },
    ],
    cta: {
      primaryText: 'Impulsar la sostenibilidad local',
      note: 'Indica el concepto "Proyecto 2" en tu Bizum o transferencia',
    },
  },
];
