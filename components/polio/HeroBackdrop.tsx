'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { RefObject } from 'react';
import { polioHero, type HeroBackdropVariant } from '@/lib/polio/config';

/**
 * Fondo fotográfico del hero, con tres tratamientos:
 * - blur: foto desenfocada tras un velo nocturno con resplandor rojo.
 * - duotono: foto en blanco y negro teñida de rojo End Polio Now.
 * - velo: foto nítida a la derecha que se funde en la noche bajo el titular.
 */
export function HeroBackdrop({ variant, sectionRef }: { variant: HeroBackdropVariant; sectionRef: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const photo = (
    <Image
      src={polioHero.src}
      alt=""
      fill
      priority
      sizes="100vw"
      className={`object-cover ${variant === 'velo' ? 'object-[70%_30%]' : 'object-center'} ${reduce ? '' : 'polio-kenburns'}`}
    />
  );

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-[#0B0507]" aria-hidden="true">
      <motion.div style={{ y: reduce ? 0 : y }} className="absolute inset-0">
        {variant === 'blur' && (
          <div className="absolute -inset-10 blur-[14px] saturate-[1.25] brightness-[0.55]">{photo}</div>
        )}

        {variant === 'duotono' && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 grayscale contrast-[1.2] brightness-[0.95] blur-[1.5px]">{photo}</div>
            <div className="absolute inset-0 bg-[#E4262F] mix-blend-multiply" />
            <div className="absolute inset-0 bg-[#3A0308] mix-blend-screen opacity-60" />
          </div>
        )}

        {variant === 'velo' && (
          <div className="polio-velo-mask absolute inset-y-0 right-0 w-full lg:w-[72%] brightness-[0.75] saturate-[1.1]">{photo}</div>
        )}
      </motion.div>

      {/* Capas de lectura: el titular siempre sobre fondo oscuro */}
      {variant === 'blur' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_75%_65%,rgba(228,38,47,0.45),transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0507]/85 via-[#0B0507]/45 to-transparent" />
        </>
      )}
      {variant === 'duotono' && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0507]/90 via-[#0B0507]/55 to-[#0B0507]/10" />
      )}
      {variant === 'velo' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0507] via-transparent to-[#0B0507]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0507] via-[#0B0507]/70 to-transparent lg:via-[#0B0507]/30" />
        </>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(228,38,47,0.35),transparent_60%)]" />
    </div>
  );
}
