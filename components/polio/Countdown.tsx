'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

function parts(target: number) {
  const ms = Math.max(0, target - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    done: ms === 0,
    units: [
      { key: 'd', label: 'días', value: String(Math.floor(s / 86400)).padStart(2, '0') },
      { key: 'h', label: 'horas', value: String(Math.floor(s / 3600) % 24).padStart(2, '0') },
      { key: 'm', label: 'min', value: String(Math.floor(s / 60) % 60).padStart(2, '0') },
      { key: 's', label: 'seg', value: String(s % 60).padStart(2, '0') },
    ],
  };
}

function Digit({ char, reduce }: { char: string; reduce: boolean }) {
  return (
    <span className="relative inline-block w-[0.62em] h-[1em] overflow-hidden align-top">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          initial={reduce ? false : { y: '-100%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={reduce ? undefined : { y: '100%', opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 text-center"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown({ target, doneLabel }: { target: string; doneLabel: string }) {
  const t = Date.parse(target);
  const reduce = Boolean(useReducedMotion());
  const [state, setState] = useState<ReturnType<typeof parts> | null>(null);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      setState(parts(t));
      id = setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();
    return () => clearTimeout(id);
  }, [t]);

  if (state?.done) {
    return <p className="font-display text-3xl sm:text-4xl text-[#FF6B6B]">{doneLabel}</p>;
  }

  return (
    <div className="flex items-stretch gap-2 sm:gap-3" role="timer" aria-label="Cuenta atrás hasta el 24 de octubre a las 19:30">
      {(state?.units ?? parts(t).units.map((u) => ({ ...u, value: '--' }))).map((u, i) => (
        <div key={u.key} className="flex items-stretch gap-2 sm:gap-3">
          {i > 0 && <span className="hidden sm:block self-center font-display text-5xl text-white/25 -mt-4" aria-hidden="true">:</span>}
          <div className="polio-glass rounded-2xl px-2.5 sm:px-5 pt-3 pb-2 text-center w-[76px] sm:w-auto sm:min-w-[104px]">
            <div className="flex justify-center whitespace-nowrap font-display text-[40px] sm:text-[64px] leading-none tabular-nums text-white" aria-hidden="true">
              {u.value.split('').map((c, j) => <Digit key={j} char={c} reduce={reduce} />)}
            </div>
            <div className="mt-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/55">{u.label}</div>
          </div>
        </div>
      ))}
      <span className="sr-only" aria-live="off">
        {state ? `${state.units[0].value} días, ${state.units[1].value} horas y ${state.units[2].value} minutos` : ''}
      </span>
    </div>
  );
}
