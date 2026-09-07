/**
 * MOSAICO DE MIEMBROS Y JUNTA DIRECTIVA - ROTARACT HORIZON PAMPLONA
 * 
 * Este archivo centraliza la composición de la Junta y socios representativos.
 * AVISO DE PRIVACIDAD / RGPD: La publicación de fotografías de personas físicas
 * requiere consentimiento explícito previo y documentado. Por ello, por defecto
 * se emplea el sistema de iniciales tipográficas sobre degradado institucional magenta.
 * Para añadir fotos reales, asigne la URL correspondiente en el campo 'photo'
 * y asegúrese de contar con la autorización firmada del socio.
 */

export interface Member {
  id: string;
  name: string; // Nombre completo (mockup editable)
  role: string; // Cargo o vocalía (mockup editable)
  initials: string; // Dos iniciales en mayúsculas
  bio?: string; // Breve descripción profesional o académica
  photo?: string; // URL opcional sujeta a consentimiento RGPD
}

export const members: Member[] = [
  {
    id: '1',
    name: 'Lucía Mendívil Ardanaz', // (mockup)
    role: 'Presidenta', // (mockup)
    initials: 'LM',
    bio: 'Graduada en Relaciones Internacionales. Coordinación institucional y visión estratégica del club.',
  },
  {
    id: '2',
    name: 'Mikel Echeverría Oroz', // (mockup)
    role: 'Vicepresidente', // (mockup)
    initials: 'ME',
    bio: 'Ingeniero Industrial. Enlace con entidades colaboradoras y supervisión operativa.',
  },
  {
    id: '3',
    name: 'Carmen Sanz de Galdeano', // (mockup)
    role: 'Secretaria', // (mockup)
    initials: 'CS',
    bio: 'Estudiante de Derecho. Gestión documental, actas y relación con el Distrito 2202.',
  },
  {
    id: '4',
    name: 'Javier Zabalza Larrea', // (mockup)
    role: 'Tesorero', // (mockup)
    initials: 'JZ',
    bio: 'Economista y auditor junior. Control presupuestario, rendición de cuentas y transparencia.',
  },
  {
    id: '5',
    name: 'Amaia Goñi Urra', // (mockup)
    role: 'Proyectos', // (mockup)
    initials: 'AG',
    bio: 'Educadora social. Liderazgo de iniciativas comunitarias de refuerzo escolar e inclusión.',
  },
  {
    id: '6',
    name: 'Iñigo Berruezo Martínez', // (mockup)
    role: 'Imagen', // (mockup)
    initials: 'IB',
    bio: 'Diseñador multimedia. Estrategia de comunicación digital, prensa y creación de contenido.',
  },
];
