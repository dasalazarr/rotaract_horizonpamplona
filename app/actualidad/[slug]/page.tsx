import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Heart, UserPlus } from 'lucide-react';
import { articles } from '@/content/articles';
import { Badge } from '@/components/ui/badge';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Rotaract Horizon Pamplona`,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.isoDate,
      authors: [article.author],
      images: [
        {
          url: article.cover,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.cover],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [article.cover.startsWith('http') ? article.cover : `https://horizonpamplona.org${article.cover}`],
    datePublished: article.isoDate,
    author: {
      '@type': 'Organization',
      name: article.author || 'Rotaract Horizon Pamplona',
      url: 'https://horizonpamplona.org',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rotaract Horizon Pamplona',
      logo: {
        '@type': 'ImageObject',
        url: 'https://horizonpamplona.org/icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://horizonpamplona.org/actualidad/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 sm:pb-16">
        {/* Back Link */}
        <div className="max-w-[680px] mx-auto mb-8">
          <Link
            href="/actualidad"
            className="inline-flex items-center text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Volver a Actualidad
          </Link>
        </div>

        {/* Editorial Reading Template (max-w content ~680px) */}
        <div className="max-w-[680px] mx-auto">
          {/* Centered category + date meta */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="glass" className="text-xs">
                {article.category}
              </Badge>
              <span className="text-xs text-muted">·</span>
              <span className="text-xs text-muted inline-flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.readingTime}
              </span>
            </div>

            <time
              dateTime={article.isoDate}
              className="text-xs uppercase tracking-widest text-muted font-medium"
            >
              {article.date}
            </time>
          </div>

          {/* Serif H1 */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-ink text-center leading-[1.15] mb-6">
            {article.title}
          </h1>

          {/* Muted Standfirst */}
          <p className="text-lg sm:text-xl text-muted text-center font-normal leading-relaxed mb-10 pb-8 border-b border-line">
            {article.excerpt}
          </p>

          {/* 16:8 Cover Placeholder (Aspect Ratio 2:1) */}
          <div className="relative aspect-[16/8] w-full rounded-2xl overflow-hidden bg-paper-soft mb-10 border border-line shadow-xl">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Body paragraphs (17px, relaxed, ink) */}
          <div className="space-y-6 text-[17px] leading-[1.75] text-ink font-normal">
            {article.body.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}

            {/* Pull-quote with 2px magenta left border in Instrument Serif */}
            {article.body.blockquote && (
              <blockquote className="my-10 pl-6 border-l-2 border-accent py-1">
                <p className="font-display text-2xl sm:text-3xl text-ink font-normal italic leading-snug">
                  &ldquo;{article.body.blockquote}&rdquo;
                </p>
                <cite className="block text-xs uppercase tracking-wider text-accent-deep font-semibold mt-3 not-italic">
                  Rotaract Horizon Pamplona
                </cite>
              </blockquote>
            )}
          </div>

          {/* Author signature */}
          <div className="mt-12 pt-6 border-t border-line flex items-center justify-between text-xs text-muted">
            <span>Publicado por: <strong className="text-ink">{article.author}</strong></span>
            <span>Horizon Pamplona · Distrito 2202</span>
          </div>

          {/* End CTA row [Dona] + [Únete] */}
          <div className="mt-14 p-8 rounded-2xl liquid-glass border border-line flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl text-ink mb-1">
                ¿Quieres formar parte del cambio?
              </h3>
              <p className="text-xs text-muted">
                Apoya nuestros proyectos comunitarios o súmate como socio voluntario.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/dona"
                className="btn-primary px-5 py-2.5 text-sm flex-1 sm:flex-initial text-center"
              >
                <Heart className="w-4 h-4 mr-1.5 fill-current" />
                Dona
              </Link>
              <Link
                href="/socios"
                className="btn-glass px-5 py-2.5 text-sm flex-1 sm:flex-initial text-center"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                Únete
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
