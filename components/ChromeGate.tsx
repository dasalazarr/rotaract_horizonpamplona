'use client';

import { usePathname } from 'next/navigation';

/**
 * Oculta la navegación y el pie globales en las secciones que tienen su propia
 * experiencia a pantalla completa (p. ej. la campaña /polio).
 */
const IMMERSIVE_PREFIXES = ['/polio'];

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  if (IMMERSIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return <>{children}</>;
}
