import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { Article } from '@/content/articles';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article
      id={`article-card-${article.slug}`}
      className="liquid-glass rounded-2xl overflow-hidden group flex flex-col h-full transition-transform duration-300 hover:-translate-y-1"
    >
      {/* 16:10 Cover image container */}
      <Link
        href={`/actualidad/${article.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-paper-soft block focus:outline-none"
        tabIndex={-1}
      >
        <Image
          src={article.cover}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60" />
        <div className="absolute top-3.5 left-3.5">
          <Badge variant="glass" className="text-xs">
            {article.category}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs text-muted mb-3">
            <time dateTime={article.isoDate}>{article.date}</time>
            <span>·</span>
            <span className="inline-flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {article.readingTime}
            </span>
          </div>

          <Link href={`/actualidad/${article.slug}`} className="block group-hover:text-accent transition-colors">
            {/* serif-none H3 (Inter/sans) as specified in prompt */}
            <h3 className="font-sans text-lg font-medium text-ink leading-snug line-clamp-2 mb-2.5">
              {article.title}
            </h3>
          </Link>

          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-5 mt-4 border-t border-line flex items-center justify-between">
          <Link
            href={`/actualidad/${article.slug}`}
            className="inline-flex items-center text-sm font-medium text-accent-deep group-hover:opacity-70 transition-opacity"
          >
            Leer
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <span className="text-xs text-muted/80">{article.author}</span>
        </div>
      </div>
    </article>
  );
}
