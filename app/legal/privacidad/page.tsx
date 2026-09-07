import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Política de Privacidad y Protección de Datos',
  description: 'Tratamiento de datos personales conforme al RGPD (UE 2016/679) y a la Ley Orgánica 3/2018 (LOPDGDD).',
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:py-16 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-xs uppercase tracking-wider text-[#abb3bf] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Volver a Inicio
        </Link>
      </div>

      <header>
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D42365] mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Protección de Datos (RGPD)</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-white mb-4">
          Política de Privacidad
        </h1>
        <p className="text-sm text-[#abb3bf]">
          Conforme al Reglamento General de Protección de Datos (UE 2016/679) y la LOPDGDD 3/2018.
        </p>
      </header>

      <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10 space-y-8 text-sm text-[#C4CEDC] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            1. Responsable del tratamiento
          </h2>
          <p>
            El responsable del tratamiento de los datos recabados en este sitio web es <strong>{siteConfig.name}</strong>, con sede en Pamplona (Navarra, España) y dirección de contacto para cuestiones de protección de datos: <span className="text-[#f472b6] font-mono">{siteConfig.email}</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            2. Finalidad del tratamiento de los datos
          </h2>
          <p>
            Los datos personales facilitados a través de nuestro formulario de admisión o por correo electrónico serán tratados exclusivamente con las siguientes finalidades:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#abb3bf]">
            <li><strong>Gestión de candidaturas de socios:</strong> Tramitar solicitudes de incorporación, coordinar entrevistas presenciales y enviar información preparatoria sobre las actividades del club.</li>
            <li><strong>Atención de consultas y donaciones:</strong> Resolver dudas planteadas por ciudadanos y emitir certificados justificativos de aportaciones voluntarias a proyectos cuando sean requeridos.</li>
            <li><strong>Inscripción en eventos abiertos:</strong> Gestionar el aforo y la acreditación de asistentes a talleres, debates y actividades solidarias.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            3. Legitimación
          </h2>
          <p>
            La base jurídica que legitima el tratamiento de sus datos es el <strong>consentimiento expreso e inequívoco</strong> manifestado al marcar la casilla correspondiente antes de enviar el formulario de admisión o al remitir voluntariamente una consulta vía email.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            4. Conservación y cesión a terceros
          </h2>
          <p>
            Los datos no serán comunicados a terceras empresas ni transferidos fuera del Espacio Económico Europeo sin su consentimiento expreso, salvo obligación legal o necesidad técnica inherente al servicio (por ejemplo, gestión del censo de socios ante la secretaría del Distrito 2202 de Rotary). Se conservarán mientras el interesado no solicite su supresión.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            5. Derechos del usuario
          </h2>
          <p>
            Usted puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición enviando un correo electrónico a <span className="text-[#f472b6]">{siteConfig.email}</span> indicando en el asunto &quot;Protección de Datos&quot; y adjuntando copia de su documento de identidad.
          </p>
        </section>
      </div>
    </div>
  );
}
