import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Instagram, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/content/site';

export function Footer() {
  return (
    <footer id="site-footer" className="border-t border-white/10 bg-[#061018] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* COL 1: LOGO + DESCRIPCIÓN (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D42365] rounded-full"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full text-[#D42365]"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
                  <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                  <line x1="12" y1="3" x2="12" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="17.5" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="6.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="17.5" y1="12" x2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-display text-xl text-white font-normal">
                Rotaract <span className="text-[#abb3bf] font-light">Horizon Pamplona</span>
              </span>
            </Link>

            <p className="text-[#abb3bf] text-sm leading-relaxed max-w-sm">
              Somos jóvenes que transforman su entorno: proyectos con impacto real, formación en liderazgo y una comunidad que te empuja a dar lo mejor de ti en Pamplona y Navarra.
            </p>

            <div className="pt-2 text-xs text-[#abb3bf]/80">
              Rotaract Club adscrito al Distrito 2202 de Rotary International.
            </div>
          </div>

          {/* COL 2: EXPLORA LINKS (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#D42365] font-semibold">
              Explora
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-[#abb3bf] hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/actualidad" className="text-[#abb3bf] hover:text-white transition-colors">
                  Actualidad y Noticias
                </Link>
              </li>
              <li>
                <Link href="/socios" className="text-[#abb3bf] hover:text-white transition-colors">
                  Cómo ser socio
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="text-[#abb3bf] hover:text-white transition-colors">
                  Proyectos en marcha
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="text-[#abb3bf] hover:text-white transition-colors">
                  Eventos y reuniones
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3: CLUB LINKS Y CONTACTO (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#D42365] font-semibold">
              Club
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/dona"
                  className="inline-flex items-center text-[#D42365] hover:text-white transition-colors font-medium"
                >
                  <Heart className="w-3.5 h-3.5 mr-2 fill-current" />
                  Dona a nuestros proyectos
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center text-[#abb3bf] hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 mr-2 text-[#D42365]" />
                  {siteConfig.email} <span className="ml-1 text-xs text-[#abb3bf]/60">(mockup)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#abb3bf] hover:text-white transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 mr-2 text-[#D42365]" />
                  Instagram {siteConfig.instagram} <span className="ml-1 text-xs text-[#abb3bf]/60">(mockup)</span>
                </a>
              </li>
              <li>
                <Link
                  href="/miembros"
                  className="inline-flex items-center text-[#abb3bf] hover:text-white transition-colors"
                >
                  <span>Miembros</span>
                  <span className="ml-2 text-xs py-0.5 px-2 rounded-full bg-white/10 text-white/80">
                    Próximamente
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#abb3bf]">
          <p>© 2026 Rotaract Horizon Pamplona. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-5">
            <Link href="/legal/aviso-legal" className="hover:text-white transition-colors">
              Aviso legal
            </Link>
            <span>·</span>
            <Link href="/legal/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <span>·</span>
            <Link href="/legal/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
