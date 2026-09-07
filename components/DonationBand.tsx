'use client';

import React, { useState } from 'react';
import { Copy, Check, Heart, Smartphone, Building2 } from 'lucide-react';
import { siteConfig } from '@/content/site';

interface DonationBandProps {
  conceptNote?: string;
  title?: string;
  subtitle?: string;
}

export function DonationBand({
  conceptNote,
  title = 'Tu aportación mueve Pamplona',
  subtitle = 'Cada euro se destina íntegramente a financiar material, recursos educativos e intervenciones comunitarias de impacto directo.',
}: DonationBandProps) {
  const [copiedBizum, setCopiedBizum] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  const copyToClipboard = (text: string, type: 'bizum' | 'iban') => {
    navigator.clipboard.writeText(text);
    if (type === 'bizum') {
      setCopiedBizum(true);
      setTimeout(() => setCopiedBizum(false), 2000);
    } else {
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2000);
    }
  };

  return (
    <section
      id="donation-band"
      className="relative rounded-3xl p-8 sm:p-12 lg:p-14 border border-[#D42365]/35 bg-gradient-to-b from-[#132230] to-[#0a1824] shadow-2xl overflow-hidden"
    >
      {/* Subtle magenta tint accent glow */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#D42365]/10 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D42365]/15 border border-[#D42365]/30 text-xs font-semibold uppercase tracking-wider text-[#f472b6] mb-4">
          <Heart className="w-3 h-3 fill-current" />
          <span>Dona</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-white mb-4 leading-tight">
          {title}
        </h2>

        <p className="text-[#abb3bf] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
          {subtitle}
        </p>

        {conceptNote && (
          <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-[#abb3bf]">
            <span className="text-white font-medium">Concepto recomendado: </span>
            <span className="text-[#f472b6] font-mono font-semibold">{conceptNote}</span>
          </div>
        )}

        {/* TWO METHOD CARDS SIDE BY SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* BIZUM CARD */}
          <div className="liquid-glass rounded-2xl p-6 flex flex-col justify-between border border-white/10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D42365]/20 flex items-center justify-center text-[#f472b6]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-base">Bizum ONG</h3>
                    <p className="text-xs text-[#abb3bf]">Donación instantánea</p>
                  </div>
                </div>
                <span className="text-xs text-[#abb3bf]/70 px-2 py-0.5 rounded bg-white/5">
                  (mockup)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between mb-2">
                <div>
                  <span className="text-[11px] text-[#abb3bf] uppercase tracking-wider block">
                    Código de envío
                  </span>
                  <span className="font-mono text-xl text-white font-bold tracking-wider">
                    {siteConfig.bizumCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(siteConfig.bizumCode, 'bizum')}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#D42365]"
                  aria-label="Copiar código Bizum"
                  title="Copiar código Bizum"
                >
                  {copiedBizum ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#abb3bf]" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#abb3bf]/80 mt-2">
              Selecciona &quot;Donar a ONG&quot; o &quot;Causa solidaria&quot; en tu app bancaria e introduce el código.
            </p>
          </div>

          {/* TRANSFERENCIA BANCARIA */}
          <div className="liquid-glass rounded-2xl p-6 flex flex-col justify-between border border-white/10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-base">Transferencia</h3>
                    <p className="text-xs text-[#abb3bf]">{siteConfig.bankName}</p>
                  </div>
                </div>
                <span className="text-xs text-[#abb3bf]/70 px-2 py-0.5 rounded bg-white/5">
                  (mockup)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between mb-2">
                <div className="overflow-hidden pr-2">
                  <span className="text-[11px] text-[#abb3bf] uppercase tracking-wider block">
                    IBAN Cuenta bancaria
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-white font-semibold tracking-wider truncate block">
                    {siteConfig.iban}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(siteConfig.iban, 'iban')}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#D42365]"
                  aria-label="Copiar número de cuenta IBAN"
                  title="Copiar número de cuenta IBAN"
                >
                  {copiedIban ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#abb3bf]" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#abb3bf]/80 mt-2">
              Beneficiario: Rotaract Horizon Pamplona. Concepto: &quot;Donación club&quot; o el nombre del proyecto.
            </p>
          </div>
        </div>

        {/* SMALL MUTED NOTE REQUIRED */}
        <p className="text-xs text-[#abb3bf] italic">
          {siteConfig.noteDonationPending} (mockup editable en /content/site.ts).
        </p>
      </div>
    </section>
  );
}
