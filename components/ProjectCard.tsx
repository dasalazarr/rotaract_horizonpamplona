import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Target, Users } from 'lucide-react';
import { Project } from '@/content/projects';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      id={`project-card-${project.slug}`}
      className="liquid-glass rounded-2xl overflow-hidden group flex flex-col h-full transition-transform duration-300 hover:-translate-y-1"
    >
      {/* 16:10 Cover image */}
      <Link
        href={`/proyectos/${project.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c1822] block focus:outline-none"
        tabIndex={-1}
      >
        <Image
          src={project.cover}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081621] via-transparent to-transparent opacity-60" />

        {/* Status Pill */}
        <div className="absolute top-4 left-4 flex gap-2 items-center">
          <Badge
            variant={project.status === 'activo' ? 'default' : 'glass'}
            className="text-xs capitalize font-medium"
          >
            {project.statusLabel}
          </Badge>
          {project.ods[0] && (
            <Badge variant="muted" className="text-xs">
              ODS {project.ods[0].number}
            </Badge>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#D42365] font-medium block mb-2">
            {project.area}
          </span>

          <Link href={`/proyectos/${project.slug}`} className="block group-hover:text-[#f472b6] transition-colors">
            <h3 className="font-display text-2xl font-normal text-white mb-2.5 leading-snug">
              {project.name}
            </h3>
          </Link>

          <p className="text-sm text-[#abb3bf] line-clamp-2 leading-relaxed mb-4">
            {project.excerpt}
          </p>

          {/* Meta row: Presupuesto · mockup and impact */}
          <div className="py-3 px-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs text-[#abb3bf] mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-medium">Presupuesto:</span>
              <span className="text-[#f472b6] font-semibold">{project.indicators.budget}</span>
              <span className="text-[#abb3bf]/60">(mockup)</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#abb3bf]" />
              <span>{project.indicators.peopleImpacted}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <Link
            href={`/proyectos/${project.slug}`}
            className="inline-flex items-center text-sm font-medium text-[#D42365] group-hover:text-[#f472b6] transition-colors"
          >
            Ver proyecto
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <span className="text-xs text-[#abb3bf]">{project.indicators.volunteers} voluntarios</span>
        </div>
      </div>
    </article>
  );
}
