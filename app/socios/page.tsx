import React from 'react';
import type { Metadata } from 'next';
import { AdmissionForm } from '@/components/AdmissionForm';
import { MemberMosaic } from '@/components/MemberMosaic';

export const metadata: Metadata = {
  title: 'Socios — Únete a Rotaract Horizon Pamplona',
  description:
    'Para jóvenes que quieren servir, crecer y liderar proyectos reales en Pamplona. Descubre qué buscamos, los beneficios de ser socio y envía tu solicitud.',
  openGraph: {
    title: 'Únete a Rotaract Horizon Pamplona | Socios',
    description:
      'Para jóvenes que quieren servir, crecer y liderar proyectos reales en Pamplona. No hace falta experiencia: hace falta ganas.',
  },
};

export default function SociosPage() {
  const queBuscamosItems = [
    {
      title: 'Compromiso genuino',
      description: 'Voluntad para involucrarte de manera continua en las causas del club.',
    },
    {
      title: 'Iniciativa y proactividad',
      description: 'Ganas de aportar ideas y llevarlas a cabo sin esperar a que otros lo hagan.',
    },
    {
      title: 'Trabajo en equipo y respeto',
      description: 'Capacidad de cooperar en ambientes diversos con vocación de servicio.',
    },
    {
      title: 'Asistencia regular a reuniones',
      description: 'Presencia en sesiones quincenales y eventos clave en Pamplona.',
    },
  ];

  const beneficiosItems = [
    {
      title: 'Formación en liderazgo',
      description: 'Talleres de oratoria, dirección de proyectos, gestión de presupuestos y resolución de conflictos.',
    },
    {
      title: 'Red Rotaract local e internacional',
      description: 'Conexión con miles de jóvenes profesionales y líderes rotarios en más de 180 países.',
    },
    {
      title: 'Proyectos de impacto medible',
      description: 'Oportunidad de ver el resultado tangible de tu esfuerzo en barrios de Navarra.',
    },
    {
      title: 'Ventajas de la zona de miembros',
      description: 'Acceso a eventos exclusivos, networking profesional, merchandising y descuentos por colaboración.',
    },
  ];

  const procesoSteps = [
    {
      number: '01',
      title: 'Envía el formulario',
      description: 'Rellena tus datos básicos y cuéntanos qué inquietudes te mueven.',
    },
    {
      number: '02',
      title: 'Charla informal',
      description: 'Tomamos un café presencial para conocernos y resolver tus dudas sin compromiso.',
    },
    {
      number: '03',
      title: 'Actividad abierta',
      description: 'Participas como observador o voluntario en uno de nuestros proyectos en curso.',
    },
    {
      number: '04',
      title: 'Alta y onboarding',
      description: 'Votación en asamblea, entrega de insignias y bienvenida al club y al Distrito 2202.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:py-20 space-y-24">
      {/* 1. CENTERED HEADER */}
      <header className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D42365] mb-3">
          <span>Socios</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight mb-5">
          Únete a Horizon Pamplona
        </h1>
        <p className="text-base sm:text-lg text-[#abb3bf] font-normal leading-relaxed">
          Para jóvenes que quieren servir, crecer y liderar proyectos reales en Pamplona. No hace falta experiencia: hace falta ganas.
        </p>
      </header>

      {/* 2. TWO COLUMNS: "QUÉ BUSCAMOS" / "BENEFICIOS" */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Qué buscamos */}
        <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D42365]" />
            <h2 className="font-display text-3xl font-normal text-white">
              Qué buscamos
            </h2>
          </div>
          <p className="text-sm text-[#abb3bf] mb-8">
            No exigimos un currículum dilatado; buscamos valores compartidos y ganas de construir.
          </p>

          <ul className="divide-y divide-white/10">
            {queBuscamosItems.map((item, idx) => (
              <li key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5">
                {/* Magenta dash marker */}
                <span className="text-[#D42365] font-bold text-lg leading-none mt-0.5 select-none">
                  —
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#abb3bf] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Beneficios */}
        <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f472b6]" />
            <h2 className="font-display text-3xl font-normal text-white">
              Beneficios
            </h2>
          </div>
          <p className="text-sm text-[#abb3bf] mb-8">
            Una plataforma de crecimiento que te prepara para liderar en tu vida profesional y cívica.
          </p>

          <ul className="divide-y divide-white/10">
            {beneficiosItems.map((item, idx) => (
              <li key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5">
                {/* Magenta dash marker */}
                <span className="text-[#D42365] font-bold text-lg leading-none mt-0.5 select-none">
                  —
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#abb3bf] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. "CÓMO ES EL PROCESO" — 4 STEPS GRID */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#D42365] font-semibold block mb-2">
            Paso a Paso
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-white">
            Cómo es el proceso
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {procesoSteps.map((step) => (
            <div
              key={step.number}
              className="liquid-glass rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
            >
              <div>
                {/* Big serif magenta number 01–04 */}
                <span className="font-display text-5xl sm:text-6xl font-normal text-[#D42365] leading-none block mb-4">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-normal text-white mb-2">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-[#abb3bf] leading-relaxed mt-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TWO-COLUMN BLOCK: ADMISSION FORM (LEFT) + MEMBER MOSAIC (RIGHT) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: ADMISSION FORM (7 cols) */}
        <div className="lg:col-span-7">
          <AdmissionForm />
        </div>

        {/* Right: MEMBER MOSAIC (5 cols) */}
        <div className="lg:col-span-5">
          <MemberMosaic />
        </div>
      </section>
    </div>
  );
}
