'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Copy, Download, ExternalLink, MessageCircle, RefreshCw, Search } from 'lucide-react';
import { INTERESTS, polioCampaign, type CampaignMode } from '@/lib/polio/config';

interface Contact {
  id: string; seq: number; nombre: string; whatsapp: string; email: string | null; intereses: string;
  utm_source: string | null; utm_medium: string | null; referido_por: string | null; ref_code: string;
  estado: 'activo' | 'baja'; baja_token: string; notas: string | null; creado: string;
}
interface Data { contacts: Contact[]; referrals: { nombre: string; invitados: number }[]; mode: CampaignMode; baseUrl: string }

const DEFAULT_TPL =
  'Hola {nombre}, gracias por sumar tu globo a Pamplona contra la Polio. Te esperamos el sábado 24 de octubre a las 19:30 en la Plaza del Castillo. ' +
  'Invita a quien quieras con tu enlace: {enlace}\n\nSi no quieres recibir más mensajes: {baja}';

const post = (path: string, body: unknown) =>
  fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); });

const input = 'rounded-xl border border-white/15 bg-white/[0.05] px-3.5 py-2.5 text-[15px] text-white outline-none focus:border-[#FF4B4B]';

export function AdminCRM() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [tpl, setTpl] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_TPL;
    try { return localStorage.getItem('polio-tpl') || DEFAULT_TPL; } catch { return DEFAULT_TPL; }
  });
  const [q, setQ] = useState('');
  const [fInterest, setFInterest] = useState('');
  const [fEstado, setFEstado] = useState('activo');
  const [fSource, setFSource] = useState('');
  const [toast, setToast] = useState('');
  const editing = useRef(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/polio/admin/contacts', { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      setData(await r.json());
      setError('');
    } catch {
      setError('No se pudieron cargar los contactos. ¿Está configurada la base de datos?');
    }
  }, []);

  useEffect(() => {
    // Petición asíncrona: el estado se actualiza al llegar la respuesta, no en el cuerpo del efecto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const id = setInterval(() => { if (!editing.current) load(); }, 60_000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const contacts = useMemo(() => data?.contacts ?? [], [data]);
  const active = contacts.filter((c) => c.estado === 'activo');
  const sources = [...new Set(contacts.map((c) => c.utm_source || 'directo'))].sort();
  const filtered = contacts.filter((c) =>
    (!fEstado || c.estado === fEstado) &&
    (!fInterest || c.intereses.split(',').includes(fInterest)) &&
    (!fSource || (c.utm_source || 'directo') === fSource) &&
    (!q || [c.nombre, c.whatsapp, c.email].some((v) => v?.toLowerCase().includes(q.toLowerCase()))));

  const today = new Date().toISOString().slice(0, 10);
  const fromWa = active.filter((c) => c.utm_source === 'whatsapp').length;
  const kpis: [string | number, string][] = [
    [active.length, `globos activos · meta ${polioCampaign.goal}`],
    [active.filter((c) => new Date(c.creado).toISOString().startsWith(today)).length, 'registros hoy'],
    [active.length ? `${Math.round((fromWa / active.length) * 100)} %` : '–', 'llegan desde WhatsApp'],
    [active.filter((c) => c.referido_por).length, 'llegan por invitación'],
    ...INTERESTS.map((i) => [active.filter((c) => c.intereses.split(',').includes(i.id)).length, i.label.toLowerCase()] as [number, string]),
    [contacts.length - active.length, 'bajas'],
  ];

  const waFor = (c: Contact) => {
    const base = data?.baseUrl ?? window.location.origin;
    const text = tpl
      .replaceAll('{nombre}', c.nombre.split(' ')[0])
      .replaceAll('{enlace}', `${base}/polio?ref=${c.ref_code}&utm_source=whatsapp&utm_medium=referral&utm_campaign=polio2026`)
      .replaceAll('{baja}', `${base}/polio/baja?t=${c.baja_token}`);
    return `https://wa.me/${c.whatsapp.replace('+', '')}?text=${encodeURIComponent(text)}`;
  };

  const setMode = async (mode: CampaignMode) => {
    try { await post('/api/polio/admin/mode', { mode }); setData((d) => d && { ...d, mode }); setToast(`Fase: ${mode}`); }
    catch { setToast('No se pudo cambiar la fase'); }
  };
  const toggleEstado = async (c: Contact) => {
    const estado = c.estado === 'activo' ? 'baja' : 'activo';
    await post('/api/polio/admin/estado', { id: c.id, estado });
    setData((d) => d && { ...d, contacts: d.contacts.map((x) => (x.id === c.id ? { ...x, estado } : x)) });
  };
  const saveNote = async (c: Contact, notas: string) => {
    editing.current = false;
    if ((c.notas ?? '') === notas) return;
    try {
      await post('/api/polio/admin/notas', { id: c.id, notas });
      setData((d) => d && { ...d, contacts: d.contacts.map((x) => (x.id === c.id ? { ...x, notas } : x)) });
      setToast('Nota guardada');
    } catch { setToast('No se pudo guardar'); }
  };
  const copyPhones = async () => {
    const phones = filtered.filter((c) => c.estado === 'activo').map((c) => c.whatsapp).join('\n');
    try { await navigator.clipboard.writeText(phones); setToast('Teléfonos copiados'); } catch { window.prompt('Copia los teléfonos:', phones); }
  };

  return (
    <div className="min-h-screen bg-[#0B0507] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0507]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#FFB3B3]">CRM</p>
            <h1 className="font-display text-2xl">Pamplona contra la Polio 2026</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={load} className="polio-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"><RefreshCw className="size-4" /> Actualizar</button>
            <Link href="/polio" target="_blank" className="polio-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"><ExternalLink className="size-4" /> Ver la web</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-5 py-8">
        {error && <p className="rounded-2xl border border-[#FF4B4B]/40 bg-[#E4262F]/10 p-4 text-[#FFB3B3]" role="alert">{error}</p>}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Resumen">
          {kpis.map(([n, l]) => (
            <div key={l} className="polio-card rounded-2xl p-4">
              <p className="font-display text-4xl text-[#FF4B4B] tabular-nums">{n}</p>
              <p className="mt-1 text-xs text-white/55">{l}</p>
            </div>
          ))}
        </section>

        <section className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="polio-card rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Fase de la campaña</h2>
            <p className="mt-1 text-sm text-white/55">Cambia al instante los textos de la web y la miniatura de WhatsApp.</p>
            <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Fase">
              {(['expectativa', 'lanzamiento'] as const).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={data?.mode === m} onClick={() => setMode(m)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold capitalize transition ${data?.mode === m ? 'border-[#FF4B4B] bg-[#E4262F] text-white' : 'border-white/15 text-white/70 hover:border-white/40'}`}>
                  {m}
                </button>
              ))}
            </div>
            <h3 className="mt-8 text-sm font-semibold text-white/80">Embajadores</h3>
            <ol className="mt-2 space-y-1.5 text-sm text-white/70">
              {data?.referrals.length ? data.referrals.map((r, i) => (
                <li key={i} className="flex justify-between"><span>{i + 1}. {r.nombre}</span><span className="tabular-nums text-[#FF8A8A]">{r.invitados}</span></li>
              )) : <li className="text-white/45">Todavía nadie ha traído registros con su enlace.</li>}
            </ol>
          </div>

          <div className="polio-card rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Mensaje para WhatsApp</h2>
            <p className="mt-1 text-sm text-white/55">
              Variables: <code className="text-[#FFB3B3]">{'{nombre}'}</code>, <code className="text-[#FFB3B3]">{'{enlace}'}</code> (su invitación personal) y{' '}
              <code className="text-[#FFB3B3]">{'{baja}'}</code>. El botón WhatsApp de cada contacto abre el chat con este texto.
            </p>
            <textarea
              value={tpl} rows={6} suppressHydrationWarning
              onChange={(e) => { setTpl(e.target.value); try { localStorage.setItem('polio-tpl', e.target.value); } catch { /* */ } }}
              className={`${input} mt-4 w-full resize-y leading-relaxed`}
              aria-label="Plantilla del mensaje"
            />
          </div>
        </section>

        <section className="polio-card rounded-3xl p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nombre, teléfono o correo" aria-label="Buscar" className={`${input} w-full pl-9`} />
            </label>
            <select value={fInterest} onChange={(e) => setFInterest(e.target.value)} className={input} aria-label="Interés">
              <option value="">Todos los intereses</option>
              {INTERESTS.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
            </select>
            <select value={fEstado} onChange={(e) => setFEstado(e.target.value)} className={input} aria-label="Estado">
              <option value="activo">Activos</option><option value="baja">Bajas</option><option value="">Todos</option>
            </select>
            <select value={fSource} onChange={(e) => setFSource(e.target.value)} className={input} aria-label="Fuente">
              <option value="">Todas las fuentes</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-white/55">{filtered.length} de {contacts.length} contactos</span>
            <span className="flex-1" />
            <button type="button" onClick={copyPhones} className="polio-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"><Copy className="size-4" /> Copiar teléfonos filtrados</button>
            <a href="/api/polio/admin/contacts.csv" className="inline-flex items-center gap-2 rounded-full bg-[#E4262F] px-4 py-2 text-sm font-semibold"><Download className="size-4" /> Exportar CSV</a>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-white/45">
                <tr>{['Globo', 'Nombre', 'WhatsApp', 'Intereses', 'Fuente', 'Alta', 'Notas', ''].map((h) => <th key={h} className="border-b border-white/10 px-2 py-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className={`border-b border-white/[0.06] align-top ${c.estado === 'baja' ? 'text-white/35' : ''}`}>
                    <td className="px-2 py-3 font-display text-lg text-[#FF6B6B] tabular-nums">{c.seq}</td>
                    <td className="px-2 py-3"><p className="font-medium">{c.nombre}</p>{c.email && <p className="text-white/45">{c.email}</p>}</td>
                    <td className="px-2 py-3 tabular-nums whitespace-nowrap">{c.whatsapp}</td>
                    <td className="px-2 py-3">{c.intereses.split(',').map((i) => <span key={i} className="mr-1 mb-1 inline-block rounded-full bg-[#E4262F]/15 px-2 py-0.5 text-xs text-[#FFB3B3]">{i}</span>)}</td>
                    <td className="px-2 py-3 text-white/60">{[c.utm_source || 'directo', c.utm_medium].filter(Boolean).join(' / ')}{c.referido_por ? ' · invitado' : ''}</td>
                    <td className="px-2 py-3 whitespace-nowrap text-white/60">{new Date(c.creado).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td className="px-2 py-3">
                      <input defaultValue={c.notas ?? ''} placeholder="Añadir nota" aria-label={`Nota sobre ${c.nombre}`}
                        onFocus={() => { editing.current = true; }} onBlur={(e) => saveNote(c, e.target.value)}
                        className="w-full min-w-[160px] rounded-lg border border-transparent bg-transparent px-2 py-1 hover:border-white/15 focus:border-[#FF4B4B] focus:bg-white/[0.05] outline-none" />
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-right">
                      {c.estado === 'activo' && (
                        <a href={waFor(c)} target="_blank" rel="noopener noreferrer" className="mr-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-[#062B14]">
                          <MessageCircle className="size-3.5" /> WhatsApp
                        </a>
                      )}
                      <button type="button" onClick={() => toggleEstado(c)} className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:border-white/40">
                        {c.estado === 'activo' ? 'Dar de baja' : 'Reactivar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <p className="py-10 text-center text-white/45">{data ? 'No hay contactos con estos filtros.' : 'Cargando…'}</p>}
          </div>
        </section>
      </main>

      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0B0507]">{toast}</div>}
    </div>
  );
}
