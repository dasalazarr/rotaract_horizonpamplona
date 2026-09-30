'use client';

import { useEffect, useRef } from 'react';

interface Props {
  /** Globos simultáneos en pantalla (se limita a 240 por rendimiento). */
  count: number;
  className?: string;
  /** Si se indica, un globo destacado sube y se queda flotando con esta etiqueta. */
  highlightLabel?: string | null;
  /** Multiplicador de velocidad de subida. */
  speed?: number;
  /** Tamaño base de los globos (px). */
  size?: number;
  /** Decorativo: reduce la cantidad en pantallas estrechas. En el cielo de participantes, false (1 globo = 1 persona). */
  ambient?: boolean;
}

interface Balloon {
  x: number; y: number; r: number; vy: number; phase: number; sway: number; depth: number; tint: number;
}

const MAX = 240;

export function BalloonCanvas({ count, className, highlightLabel = null, speed = 1, size = 1, ambient = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef(highlightLabel);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, last = performance.now(), visible = true;
    let px = 0, pxTarget = 0;
    let balloons: Balloon[] = [];
    const special = { y: 0, active: false };

    const make = (initial: boolean): Balloon => {
      const depth = 0.25 + Math.random() * 0.75;
      const r = (6 + depth * 18) * size;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * (h + 200) : h + r * 4 + Math.random() * 80,
        r, depth,
        vy: (0.12 + depth * 0.42) * speed,
        phase: Math.random() * Math.PI * 2,
        sway: 4 + Math.random() * 14,
        tint: Math.random(),
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const populate = () => {
      const n = Math.min(Math.max(ambient ? Math.round(count * Math.min(1, Math.max(0.45, w / 1200))) : count, 0), MAX);
      balloons = Array.from({ length: n }, () => make(true)).sort((a, b) => a.depth - b.depth);
    };

    const drawBalloon = (x: number, y: number, r: number, alpha: number, t: number, phase: number, glow = false) => {
      const ry = r * 1.2;
      // Hilo
      ctx.strokeStyle = `rgba(255,214,214,${0.28 * alpha})`;
      ctx.lineWidth = Math.max(0.6, r / 22);
      ctx.beginPath();
      ctx.moveTo(x, y + ry + r * 0.18);
      ctx.bezierCurveTo(
        x + Math.sin(t * 0.0012 + phase) * r * 0.5, y + ry + r * 1.2,
        x - Math.sin(t * 0.001 + phase) * r * 0.5, y + ry + r * 2.2,
        x + Math.sin(t * 0.0008 + phase) * r * 0.3, y + ry + r * 3.4,
      );
      ctx.stroke();
      if (glow) {
        const halo = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3.2);
        halo.addColorStop(0, 'rgba(255,70,70,0.45)');
        halo.addColorStop(1, 'rgba(255,70,70,0)');
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
      }
      // Cuerpo
      const g = ctx.createRadialGradient(x - r * 0.38, y - ry * 0.42, r * 0.08, x, y, r * 1.35);
      g.addColorStop(0, `rgba(255,150,140,${alpha})`);
      g.addColorStop(0.42, `rgba(232,34,46,${alpha})`);
      g.addColorStop(1, `rgba(110,4,14,${alpha})`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, y + ry);
      ctx.bezierCurveTo(x + r * 1.05, y + ry * 0.55, x + r * 1.05, y - ry, x, y - ry);
      ctx.bezierCurveTo(x - r * 1.05, y - ry, x - r * 1.05, y + ry * 0.55, x, y + ry);
      ctx.fill();
      // Nudo
      ctx.beginPath();
      ctx.moveTo(x - r * 0.13, y + ry + r * 0.2);
      ctx.lineTo(x + r * 0.13, y + ry + r * 0.2);
      ctx.lineTo(x, y + ry - r * 0.02);
      ctx.closePath(); ctx.fill();
      // Brillo
      ctx.fillStyle = `rgba(255,255,255,${0.28 * alpha})`;
      ctx.beginPath();
      ctx.ellipse(x - r * 0.4, y - ry * 0.45, r * 0.16, r * 0.32, -0.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = (t: number) => {
      const dt = Math.min(64, t - last) / 16.67;
      last = t;
      px += (pxTarget - px) * 0.04;
      ctx.clearRect(0, 0, w, h);

      for (const b of balloons) {
        if (!reduce) b.y -= b.vy * dt;
        if (b.y < -b.r * 5) Object.assign(b, make(false));
        const x = b.x + Math.sin(t * 0.0005 * (0.6 + b.depth) + b.phase) * b.sway + px * b.depth * 28;
        drawBalloon(x, b.y, b.r, 0.25 + b.depth * 0.75, t, b.phase);
      }

      const label = labelRef.current;
      if (label) {
        if (!special.active) { special.active = true; special.y = h + 80; }
        const target = h * 0.3;
        special.y += (target - special.y) * (reduce ? 1 : 0.018 * dt);
        const x = w * (w < 640 ? 0.8 : 0.78) + Math.sin(t * 0.0009) * 10 + px * 20;
        const y = special.y + Math.sin(t * 0.0015) * 6;
        const r = 34 * size;
        drawBalloon(x, y, r, 1, t, 0, true);
        ctx.font = '600 14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,245,238,0.95)';
        ctx.fillText(label, x, y + r * 1.2 + r * 3.4 + 22);
      } else {
        special.active = false;
      }

      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    const start = () => { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); };

    resize();
    populate();
    start();
    redrawRef.current = start;

    const ro = new ResizeObserver(() => { resize(); populate(); if (reduce) start(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => { pxTarget = e.clientX / window.innerWidth - 0.5; };
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [count, speed, size, ambient]);

  // Redibuja cuando cambia el globo destacado (necesario con movimiento reducido).
  useEffect(() => {
    labelRef.current = highlightLabel;
    redrawRef.current();
  }, [highlightLabel]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
