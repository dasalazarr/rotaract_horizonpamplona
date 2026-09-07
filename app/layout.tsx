import type { Metadata } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/content/site';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://horizonpamplona.org'),
  title: {
    default: 'Rotaract Horizon Pamplona — Servir. Crecer. Liderar Pamplona.',
    template: '%s | Rotaract Horizon Pamplona',
  },
  description:
    'Sitio web oficial de Rotaract Horizon Pamplona. Jóvenes que transforman su entorno a través del servicio, formación en liderazgo y proyectos con impacto real en Pamplona.',
  keywords: [
    'Rotaract',
    'Rotaract Pamplona',
    'Horizon Pamplona',
    'Rotary Pamplona',
    'Voluntariado Navarra',
    'Juventud Pamplona',
    'Liderazgo joven Navarra',
    'Proyectos sociales Pamplona',
  ],
  authors: [{ name: 'Rotaract Horizon Pamplona' }],
  creator: 'Rotaract Horizon Pamplona',
  openGraph: {
    title: 'Rotaract Horizon Pamplona — Servir. Crecer. Liderar Pamplona.',
    description:
      'Somos jóvenes que transforman su entorno: proyectos con impacto real, formación en liderazgo y una comunidad que te empuja a dar lo mejor de ti en Pamplona.',
    url: '/',
    siteName: 'Rotaract Horizon Pamplona',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Rotaract Horizon Pamplona — Jóvenes comprometidos con la comunidad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotaract Horizon Pamplona',
    description:
      'Jóvenes que transforman su entorno: proyectos con impacto real en Pamplona.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Organization JSON-LD Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: 'https://horizonpamplona.org',
    logo: 'https://horizonpamplona.org/icon.png',
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pamplona',
      addressRegion: 'Navarra',
      addressCountry: 'ES',
    },
    sameAs: [
      'https://instagram.com/rotaracthorizonpamplona',
      siteConfig.linkedin,
    ].filter(Boolean),
  };

  return (
    <html lang="es" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="bg-paper text-ink min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
