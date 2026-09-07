'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';
import { siteConfig } from '@/content/site';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Navegación principal"
            className="liquid-glass rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-shadow duration-300"
          >
            {/* LOGO */}
            <Link
              href="/"
              id="nav-logo-link"
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D42365] rounded-full"
            >
              <Image
                src="/assets/rotaract.png"
                alt="Rotaract Horizon Pamplona"
                width={160}
                height={67}
                className="h-8 sm:h-9 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {siteConfig.navigation.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    id={`nav-link-${item.href.replace('/', '') || 'inicio'}`}
                    className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-full ${
                      isActive
                        ? 'text-ink font-semibold'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D42365]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT ACTION: DONA BUTTON & MOBILE TOGGLE */}
            <div className="flex items-center gap-3">
              <Link
                href="/dona"
                id="nav-dona-cta"
                className="btn-primary text-xs sm:text-sm px-3.5 sm:px-5 py-1.5 sm:py-2 inline-flex"
              >
                <Heart className="w-3.5 h-3.5 mr-1.5 fill-current hidden sm:inline" />
                Dona
              </Link>

              {/* Mobile hamburger button */}
              <button
                type="button"
                id="nav-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-muted hover:text-ink rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D42365]"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* MOBILE FULL-HEIGHT GLASS MENU */}
      {mobileMenuOpen && (
        <div
          id="nav-mobile-backdrop"
          className="fixed inset-0 z-40 bg-paper/95 backdrop-blur-xl md:hidden flex flex-col justify-between p-6 pt-24 animate-in fade-in duration-200"
        >
          <div className="flex flex-col space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#D42365] font-medium px-2">
              Navegación
            </p>
            {siteConfig.navigation.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between text-2xl font-display py-2 px-3 rounded-xl transition-colors ${
                    isActive
                      ? 'text-ink bg-ink/5 font-normal'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#D42365]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Dona button pinned at bottom */}
          <div className="pt-6 border-t border-line flex flex-col gap-3">
            <Link
              href="/dona"
              onClick={() => setMobileMenuOpen(false)}
              id="nav-mobile-dona-pinned"
              className="btn-primary w-full py-3.5 text-base justify-center shadow-lg"
            >
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Dona a Horizon Pamplona
            </Link>
            <p className="text-center text-xs text-muted">
              Rotaract Horizon Pamplona · Navarra, España
            </p>
          </div>
        </div>
      )}
    </>
  );
}
