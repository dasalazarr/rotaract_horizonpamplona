'use client';

import React, { useState } from 'react';
import { articles, Article } from '@/content/articles';
import { ArticleCard } from '@/components/ArticleCard';
import { Badge } from '@/components/ui/badge';

type CategoryFilter = 'Todo' | 'Club' | 'Distrito' | 'Proyectos' | 'Eventos';

export function ActualidadClient() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todo');

  const categories: CategoryFilter[] = ['Todo', 'Club', 'Distrito', 'Proyectos', 'Eventos'];

  const filteredArticles =
    selectedCategory === 'Todo'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="space-y-12">
      {/* FILTER PILLS */}
      <div
        role="tablist"
        aria-label="Filtro de categorías de artículos"
        className="flex flex-wrap items-center gap-2.5"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D42365] ${
                isSelected
                  ? 'bg-[#D42365] text-white shadow-md'
                  : 'liquid-glass text-[#abb3bf] hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ARTICLES GRID */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article: Article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="liquid-glass rounded-2xl p-12 text-center text-[#abb3bf]">
          No hay publicaciones en la categoría seleccionada por el momento.
        </div>
      )}
    </div>
  );
}
