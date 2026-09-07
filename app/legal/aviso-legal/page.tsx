import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Información legal y datos identificativos de Rotaract Horizon Pamplona según la Ley 34/2002 (LSSI-CE).',
};

export default function AvisoLegalPage() {
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
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-white mb-4">
          Aviso Legal
        </h1>
        <p className="text-sm text-[#abb3bf]">
          Última actualización: Febrero de 2026 · Cumplimiento de la Ley 34/2002 (LSSI-CE)
        </p>
      </header>

      <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10 space-y-8 text-sm text-[#C4CEDC] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            1. Datos identificativos de la entidad
          </h2>
          <p>
            En cumplimiento del deber de información estipulado en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#abb3bf]">
            <li><strong>Denominación:</strong> {siteConfig.name} (Club juvenil adscrito al Distrito 2202 de Rotary International)</li>
            <li><strong>Domicilio social:</strong> Pamplona / Iruña, Comunidad Foral de Navarra, España</li>
            <li><strong>Contacto electrónico:</strong> {siteConfig.email} (mockup editable)</li>
            <li><strong>Naturaleza:</strong> Entidad cívica sin ánimo de lucro orientada al servicio a la comunidad y formación de la juventud.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            2. Condiciones de uso
          </h2>
          <p>
            El acceso y uso de este sitio web atribuye la condición de usuario, aceptando plenamente los términos expuestos en este aviso. El contenido de este portal tiene carácter estrictamente informativo, divulgativo y asociativo en relación con las actividades de voluntariado y proyectos de Horizon Pamplona.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            3. Propiedad intelectual e industrial
          </h2>
          <p>
            Todos los elementos que forman el sitio web (diseño, tipografías, logotipos, textos, código fuente y estructura) pertenecen legítimamente a Rotaract Horizon Pamplona o cuentan con las preceptivas licencias de uso. La marca Rotaract y los emblemas de Rotary son marcas registradas de Rotary International, utilizadas bajo autorización asociativa.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            4. Legislación aplicable y jurisdicción
          </h2>
          <p>
            Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web, será de aplicación la legislación española, siendo competentes para la resolución de todos los conflictos derivados los Juzgados y Tribunales de la ciudad de Pamplona (Navarra).
          </p>
        </section>
      </div>
    </div>
  );
}
