import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Mail, Instagram, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/content/site';

export function Footer() {
  return (
    <footer id="site-footer" className="border-t border-line bg-paper-soft mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* COL 1: LOGO + DESCRIPCIÓN (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D42365] rounded-full"
            >
              <Image
                src="/assets/rotaract.png"
                alt="Rotaract Horizon Pamplona"
                width={190}
                height={79}
                className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-muted text-sm leading-relaxed max-w-sm">
              Somos jóvenes que transforman su entorno: proyectos con impacto real, formación en liderazgo y una comunidad que te empuja a dar lo mejor de ti en Pamplona y Navarra.
            </p>

            <div className="pt-2 text-xs text-muted/80">
              Rotaract Club adscrito al Distrito 2202 de Rotary International.
            </div>
          </div>

          {/* COL 2: EXPLORA LINKS (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-accent-deep font-semibold">
              Explora
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-muted hover:text-ink transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/actualidad" className="text-muted hover:text-ink transition-colors">
                  Actualidad y Noticias
                </Link>
              </li>
              <li>
                <Link href="/socios" className="text-muted hover:text-ink transition-colors">
                  Cómo ser socio
                </Link>
              </li>
              <li>
                <Link href="/proyectos" className="text-muted hover:text-ink transition-colors">
                  Proyectos en marcha
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="text-muted hover:text-ink transition-colors">
                  Eventos y reuniones
                </Link>
              </li>
            </ul>
          </div>

          {/* COL 3: CLUB LINKS Y CONTACTO (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-accent-deep font-semibold">
              Club
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/dona"
                  className="inline-flex items-center text-accent-deep hover:text-ink transition-colors font-medium"
                >
                  <Heart className="w-3.5 h-3.5 mr-2 fill-current" />
                  Dona a nuestros proyectos
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center text-muted hover:text-ink transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 mr-2 text-accent" />
                  {siteConfig.email} <span className="ml-1 text-xs text-muted/60">(mockup)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-muted hover:text-ink transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 mr-2 text-accent" />
                  Instagram {siteConfig.instagram} <span className="ml-1 text-xs text-muted/60">(mockup)</span>
                </a>
              </li>
              <li>
                <Link
                  href="/miembros"
                  className="inline-flex items-center text-muted hover:text-ink transition-colors"
                >
                  <span>Miembros</span>
                  <span className="ml-2 text-xs py-0.5 px-2 rounded-full bg-ink/5 text-ink/70">
                    Próximamente
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-14 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© 2026 Rotaract Horizon Pamplona. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-5">
            <Link href="/legal/aviso-legal" className="hover:text-ink transition-colors">
              Aviso legal
            </Link>
            <span>·</span>
            <Link href="/legal/privacidad" className="hover:text-ink transition-colors">
              Privacidad
            </Link>
            <span>·</span>
            <Link href="/legal/cookies" className="hover:text-ink transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
