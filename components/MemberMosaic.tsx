'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { members, Member } from '@/content/members';
import { ShieldCheck, UserCheck } from 'lucide-react';

export function MemberMosaic() {
  // AVISO RGPD: Por defecto se muestran iniciales sobre degradado magenta institucional
  // para cumplir con la normativa española de protección de datos personales.
  // El usuario puede conmutar el modo si se disponen de consentimientos formalizados.
  const [showInitialsOnly, setShowInitialsOnly] = useState(true);

  return (
    <div id="member-mosaic" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
            Junta y equipo motor
          </h3>
          <p className="text-xs text-[#abb3bf] mt-1">
            6 miembros fundadores · Valores de referencia (mockup)
          </p>
        </div>

        {/* Toggle initials vs photo placeholder mode with consent note */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInitialsOnly(!showInitialsOnly)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#abb3bf] hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
            title="Conmutar visualización de iniciales / fotografías con consentimiento"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D42365]" />
            <span>
              {showInitialsOnly ? 'Modo Iniciales (RGPD)' : 'Modo Retratos'}
            </span>
          </button>
        </div>
      </div>

      {/* Grid of 6 members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((member: Member) => (
          <div
            key={member.id}
            id={`member-card-${member.id}`}
            className="liquid-glass rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-transform duration-200 hover:scale-[1.02]"
          >
            {/* 76px circular avatar with initials on magenta gradient */}
            <div className="relative w-[76px] h-[76px] shrink-0 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#D42365] via-[#a81c50] to-[#f472b6] shadow-md flex items-center justify-center">
              {!showInitialsOnly && member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={72}
                  height={72}
                  className="rounded-full object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#081621] flex items-center justify-center">
                  <span className="font-display text-2xl font-normal text-white tracking-wider">
                    {member.initials}
                  </span>
                </div>
              )}
            </div>

            {/* Member info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-semibold text-[#D42365] uppercase tracking-wider">
                  {member.role}
                </span>
                <span className="text-[10px] text-[#abb3bf]/60">(mockup)</span>
              </div>

              <h4 className="font-medium text-white text-base truncate">
                {member.name}
              </h4>

              {member.bio && (
                <p className="text-xs text-[#abb3bf] line-clamp-2 mt-1 leading-snug">
                  {member.bio}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Privacy legal note */}
      <p className="text-[11px] text-[#abb3bf]/70 italic flex items-center gap-1.5">
        <UserCheck className="w-3.5 h-3.5 text-[#D42365] shrink-0" />
        <span>
          Aviso RGPD: Las identidades y cargos reflejados son simulaciones editables en{' '}
          <code className="text-white/80 font-mono">content/members.ts</code>. La publicación de fotografías requiere consentimiento expreso.
        </span>
      </p>
    </div>
  );
}
