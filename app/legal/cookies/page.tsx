import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies técnicas y analíticas en Rotaract Horizon Pamplona.',
};

export default function CookiesPage() {
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
          <Cookie className="w-4 h-4" />
          <span>Privacidad Digital</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-normal text-white mb-4">
          Política de Cookies
        </h1>
        <p className="text-sm text-[#abb3bf]">
          Transparencia absoluta en el uso de tecnologías de almacenamiento local y navegación.
        </p>
      </header>

      <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10 space-y-8 text-sm text-[#C4CEDC] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            1. ¿Qué son las cookies?
          </h2>
          <p>
            Una cookie es un pequeño archivo de texto que un sitio web almacena en el navegador del usuario al visitarlo. Sirve para recordar información sobre la visita, como preferencias de idioma, estado de autenticación o métricas agregadas de rendimiento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            2. Tipología de cookies utilizadas en este portal
          </h2>
          <p>
            Este sitio web está construido con un enfoque estricto de respeto a la privacidad del usuario:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#abb3bf]">
            <li><strong>Cookies técnicas esenciales:</strong> Necesarias para el correcto funcionamiento de la navegación, seguridad frente a ataques automatizados (anti-spam) y gestión del menú adaptable. No pueden desactivarse.</li>
            <li><strong>Ausencia de cookies publicitarias o rastreo comercial:</strong> Rotaract Horizon Pamplona no comercializa datos, no inserta publicidad programática de terceros ni realiza elaboración de perfiles con fines comerciales.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-white">
            3. Cómo gestionar o deshabilitar las cookies
          </h2>
          <p>
            Puede restringir, bloquear o borrar las cookies configurando las opciones de su navegador web (Chrome, Firefox, Safari, Edge). En caso de bloquear todas las cookies técnicas, algunas funciones visuales o de navegación podrían experimentar variaciones.
          </p>
        </section>
      </div>
    </div>
  );
}
