'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Silueta estilizada de la Plaza del Castillo (fachadas y templete).
 * Al hacer scroll, las ventanas y la plaza se encienden de rojo.
 */

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1200, H = 520, GROUND = 440;

interface Win { x: number; y: number; w: number; h: number; at: number }
interface Facade { x: number; w: number; h: number; roof: 'flat' | 'cornice' | 'gable'; wins: Win[] }

function buildFacades(): Facade[] {
  const r = rng(24102026);
  const out: Facade[] = [];
  let x = -10;
  while (x < W + 10) {
    const w = 90 + Math.floor(r() * 90);
    const h = 190 + Math.floor(r() * 130);
    const roofs = ['flat', 'cornice', 'gable'] as const;
    const f: Facade = { x, w, h, roof: roofs[Math.floor(r() * 3)], wins: [] };
    const cols = Math.max(2, Math.floor(w / 34));
    const rows = Math.floor((h - 70) / 44);
    const cw = w / cols;
    for (let row = 0; row < rows; row++) {
      for (let c = 0; c < cols; c++) {
        f.wins.push({
          x: x + c * cw + cw * 0.28, y: GROUND - h + 40 + row * 44,
          w: cw * 0.44, h: row === rows - 1 ? 30 : 24,
          at: 0.12 + r() * 0.7,
        });
      }
    }
    out.push(f);
    x += w + 2;
  }
  return out;
}

export function PlazaScene({ mode }: { mode: 'expectativa' | 'lanzamiento' }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const facades = useMemo(() => buildFacades(), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] });
  // En expectativa la plaza solo se enciende a medias: el resto se revela el 24.
  const cap = mode === 'lanzamiento' ? 1 : 0.55;
  const glow = useTransform(scrollYProgress, [0.15, 0.95], [0, cap]);
  const [lit, setLit] = useState(reduce ? cap : 0);
  useMotionValueEvent(glow, 'change', (v) => {
    const q = Math.round(v * 40) / 40;
    if (q !== lit) setLit(q);
  });
  const level = reduce ? cap : lit;

  return (
    <div ref={ref} className="relative w-full" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" preserveAspectRatio="xMidYMax meet">
        <defs>
          <radialGradient id="plaza-glow" cx="50%" cy="100%" r="75%">
            <stop offset="0%" stopColor="#FF2A36" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#C4101E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0B0507" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="facade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1C0F12" />
            <stop offset="100%" stopColor="#120809" />
          </linearGradient>
          <linearGradient id="facade-lit" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7A0A14" />
            <stop offset="100%" stopColor="#1C0F12" />
          </linearGradient>
          <filter id="win-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Luz roja que sube desde la plaza */}
        <motion.rect x="0" y="0" width={W} height={H} fill="url(#plaza-glow)" style={{ opacity: reduce ? cap : glow }} />

        {facades.map((f, i) => (
          <g key={i}>
            <rect x={f.x} y={GROUND - f.h} width={f.w} height={f.h} fill="url(#facade)" />
            <rect x={f.x} y={GROUND - f.h} width={f.w} height={f.h} fill="url(#facade-lit)" opacity={level * 0.9} />
            {f.roof === 'cornice' && <rect x={f.x - 4} y={GROUND - f.h - 8} width={f.w + 8} height="10" fill="#1C0F12" />}
            {f.roof === 'gable' && (
              <polygon points={`${f.x},${GROUND - f.h} ${f.x + f.w / 2},${GROUND - f.h - 26} ${f.x + f.w},${GROUND - f.h}`} fill="#1C0F12" />
            )}
            {f.wins.map((w, j) => {
              const on = level >= w.at;
              return (
                <rect
                  key={j} x={w.x} y={w.y} width={w.w} height={w.h} rx="1.5"
                  fill={on ? '#FF4B4B' : '#241316'}
                  opacity={on ? 0.95 : 1}
                  filter={on ? 'url(#win-glow)' : undefined}
                  style={{ transition: 'fill .6s ease, opacity .6s ease' }}
                />
              );
            })}
          </g>
        ))}

        {/* Templete de la plaza */}
        <g transform={`translate(${W / 2} 0)`}>
          <ellipse cx="0" cy={GROUND + 6} rx="190" ry="14" fill="#FF2A36" opacity={level * 0.55} />
          <rect x="-120" y={GROUND - 22} width="240" height="22" fill="#170B0D" />
          <rect x="-110" y={GROUND - 28} width="220" height="8" fill="#1E0F12" />
          {[-96, -58, -20, 20, 58, 96].map((cx) => (
            <rect key={cx} x={cx - 4} y={GROUND - 118} width="8" height="90" fill="#1E0F12" />
          ))}
          <rect x="-118" y={GROUND - 128} width="236" height="12" fill="#1E0F12" />
          <path d={`M-126 ${GROUND - 128} Q0 ${GROUND - 210} 126 ${GROUND - 128} Z`} fill="#1A0C0F" />
          <rect x="-3" y={GROUND - 232} width="6" height="30" fill="#1A0C0F" />
          <circle cx="0" cy={GROUND - 236} r="6" fill={level > 0.5 ? '#FF4B4B' : '#241316'} style={{ transition: 'fill .8s' }} />
          <rect x="-100" y={GROUND - 116} width="200" height="86" fill="#FF2A36" opacity={level * 0.35} />
        </g>

        {/* Farolas */}
        {[140, 360, 840, 1060].map((x) => (
          <g key={x}>
            <rect x={x - 2} y={GROUND - 96} width="4" height="96" fill="#1E0F12" />
            <circle cx={x} cy={GROUND - 100} r="7" fill={level > 0.3 ? '#FFD2C2' : '#3A2226'} filter={level > 0.3 ? 'url(#win-glow)' : undefined} />
          </g>
        ))}

        <rect x="0" y={GROUND} width={W} height={H - GROUND} fill="#0B0507" />
        <rect x="0" y={GROUND} width={W} height="4" fill="#FF2A36" opacity={level * 0.8} />
      </svg>
    </div>
  );
}
