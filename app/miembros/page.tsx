import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, Sparkles, Heart, Shield, Users, Gift, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * ZONA DE MIEMBROS — MVP TEASER (Área restringida)
 * 
 * NOTA DE ARQUITECTURA / FASE 2:
 * En la siguiente fase de desarrollo este módulo incorporará autenticación segura
 * (Magic Link por email / OAuth Google) y control de acceso basado en roles (RBAC):
 * - Invitado (acceso a resúmenes y calendario ampliado)
 * - Colaborador (gestión de tareas de proyectos y banco de recursos)
 * - Socio de pleno derecho (actas, votaciones de asamblea y directorio)
 * - Directiva (administración de solicitudes, contabilidad y envíos)
 * - Admin (gestión técnica global)
 * 
 * Esta sección incluye directiva noindex para preservar la privacidad de los miembros.
 */

export const metadata: Metadata = {
  title: 'Espacio de Miembros — Próximamente',
  description:
    'Un espacio privado para la comunidad de socios y colaboradores de Rotaract Horizon Pamplona.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MiembrosPage() {
  const futurePerks = [
    {
      icon: Calendar,
      title: 'Acceso preferente a eventos',
      desc: 'Reserva anticipada para conferencias distritales y talleres con aforo reducido.',
    },
    {
      icon: Users,
      title: 'Networking y directorio profesional',
      desc: 'Conexión directa entre universitarios, egresados y rotarios mentores en Navarra.',
    },
    {
      icon: Gift,
      title: 'Merchandising y descuentos',
      desc: 'Ventajas exclusivas y convenios suscritos con comercios y entidades colaboradoras.',
    },
    {
      icon: Shield,
      title: 'Gobernanza y asamblea',
      desc: 'Consulta de actas, propuestas de proyectos y votación transparente de cargos directivos.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:py-24 text-center">
      {/* Centered layout */}
      <div className="liquid-glass rounded-3xl p-8 sm:p-14 border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Subtle decorative glow */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#D42365]/10 blur-3xl pointer-events-none"
        />

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-[#f472b6]">
          <Lock className="w-7 h-7" />
        </div>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D42365] mb-4">
          <span>Miembros</span>
        </div>

        {/* Serif H2 */}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight mb-5">
          Un espacio privado para la comunidad
        </h1>

        {/* Status pill: Acceso por invitación — próximamente */}
        <div className="mb-8">
          <Badge variant="glass" className="text-xs px-4 py-1 font-medium text-white/90">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#f472b6]" />
            Acceso por invitación — próximamente
          </Badge>
        </div>

        {/* Short description of what is coming */}
        <p className="text-base sm:text-lg text-[#abb3bf] max-w-2xl mx-auto leading-relaxed mb-12">
          Estamos construyendo el área privada para socios y colaboradores de Horizon Pamplona. Un entorno digital seguro con acceso exclusivo a eventos, directorio de networking, merchandising oficial y beneficios vinculados a tu apoyo y colaboración continuada.
        </p>

        {/* Feature Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-12">
          {futurePerks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#D42365]/15 text-[#f472b6] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-[#abb3bf] leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* One CTA: "Quiero colaborar" → /dona */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dona"
            id="miembros-colaborar-cta"
            className="btn-primary px-8 py-3.5 text-base font-medium shadow-xl w-full sm:w-auto"
          >
            <Heart className="w-4 h-4 mr-2 fill-current" />
            Quiero colaborar
          </Link>
          <Link
            href="/socios"
            className="btn-glass px-8 py-3.5 text-base font-medium w-full sm:w-auto"
          >
            Solicitar alta como socio
          </Link>
        </div>
      </div>
    </div>
  );
}
