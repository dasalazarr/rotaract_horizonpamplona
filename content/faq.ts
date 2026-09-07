/**
 * PREGUNTAS FRECUENTES (FAQ) SOBRE DONACIONES Y APOYO
 * ROTARACT HORIZON PAMPLONA
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const donationFaqs: FaqItem[] = [
  {
    id: 'faq-destino-fondos',
    question: '¿A qué se destina exactamente el dinero de las donaciones?',
    answer:
      'El 100% de las aportaciones recibidas se aplica directamente a la ejecución material de nuestros proyectos de servicio comunitario en Pamplona y su comarca (material pedagógico para refuerzo escolar, kits medioambientales, logística de voluntariado y gastos indispensables de cobertura). Los socios de Rotaract actúan de manera estrictamente voluntaria y no perciben remuneración alguna.',
  },
  {
    id: 'faq-recibo-peticion',
    question: '¿Puedo solicitar un justificante o recibo de mi aportación?',
    answer:
      'Por supuesto. Tras realizar tu aportación por Bizum o transferencia bancaria, escríbenos a hola@horizonpamplona.org indicando la fecha, importe y datos identificativos. La tesorería del club emitirá un certificado justificativo oficial firmado por la directiva.',
  },
  {
    id: 'faq-otras-formas-colaborar',
    question: '¿Qué otras vías existen para colaborar sin aportar fondos?',
    answer:
      'La ayuda material y humana es tan decisiva como la financiera. Aceptamos patrocinios institucionales o empresariales, cesión de espacios para talleres o actividades, donaciones en especie (material escolar, equipamiento informático reacondicionado o recursos de imprenta) y, muy especialmente, tu tiempo y talento como voluntario en nuestras acciones abiertas.',
  },
];
