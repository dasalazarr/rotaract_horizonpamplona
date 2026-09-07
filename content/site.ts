/**
 * CONFIGURACIÓN GENERAL DEL CLUB ROTARACT HORIZON PAMPLONA
 * 
 * Este archivo centraliza los datos editables clave de la entidad:
 * - Datos bancarios y de Bizum para donaciones
 * - Estadísticas destacadas de la portada (mockup)
 * - Información de contacto y redes
 * 
 * Edite los valores de este archivo para actualizar los textos sin tocar código.
 */

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  location: string;
  email: string; // Correo de contacto oficial (mockup)
  instagram: string; // Enlace / usuario de Instagram (mockup)
  linkedin?: string;
  bizumCode: string; // Código de donación Bizum (mockup)
  iban: string; // Código de cuenta bancaria IBAN (mockup)
  bankName: string;
  noteDonationPending: string;
  stats: {
    sociosActivos: {
      value: number;
      label: string; // "(mockup)"
    };
    horasServicio: {
      value: number;
      label: string; // "(mockup)"
    };
    proyectosEnCurso: {
      value: number;
      label: string; // "(mockup)"
    };
  };
  navigation: {
    label: string;
    href: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: 'Rotaract Horizon Pamplona',
  shortName: 'Horizon Pamplona',
  tagline: 'Servir. Crecer. Liderar Pamplona.',
  location: 'Pamplona / Iruña, Navarra, España',
  
  // DATOS DE CONTACTO (MOCKUP EDITABLE)
  email: 'hola@horizonpamplona.org', // (mockup)
  instagram: '@rotaracthorizonpamplona', // (mockup)
  linkedin: 'https://linkedin.com/company/rotaract-horizon-pamplona', // (mockup)
  
  // DATOS DE DONACIÓN (MOCKUP EDITABLE)
  bizumCode: '02235', // Código Bizum ONG / Donaciones (mockup)
  iban: 'ES00 0000 0000 0000 0000 0000', // IBAN para transferencias (mockup)
  bankName: 'CaixaBank / Laboral Kutxa (Pamplona)', // (mockup)
  noteDonationPending: 'Código e IBAN oficiales pendientes de confirmar',

  // ESTADÍSTICAS DEL CLUB EN PORTADA (MOCKUP EDITABLE)
  stats: {
    sociosActivos: {
      value: 12,
      label: 'Socios activos', // (mockup)
    },
    horasServicio: {
      value: 4,
      label: 'Nacionalidades', // (mockup)
    },
    proyectosEnCurso: {
      value: 1,
      label: 'Proyecto en desarrollo', // (mockup)
    },
  },

  // MENÚ DE NAVEGACIÓN
  navigation: [
    { label: 'Inicio', href: '/' },
    { label: 'Actualidad', href: '/actualidad' },
    { label: 'Socios', href: '/socios' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Eventos', href: '/eventos' },
    { label: 'Miembros', href: '/miembros' },
  ],
};
