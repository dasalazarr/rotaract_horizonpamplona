import { randomBytes, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { CONSENT_VERSION, type CampaignMode } from './config';

/**
 * Almacén de contactos de la campaña.
 * - Producción (Vercel): Postgres en Neon, vía DATABASE_URL.
 * - Desarrollo sin DATABASE_URL: archivo JSON en .data/ (ignorado por git).
 */

export interface Contact {
  id: string;
  seq: number; // número de globo
  nombre: string;
  whatsapp: string;
  email: string | null;
  intereses: string; // separados por comas
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ref_code: string;
  referido_por: string | null;
  fase_registro: CampaignMode;
  consent_at: string;
  consent_version: string;
  consent_ip_hash: string | null;
  estado: 'activo' | 'baja';
  baja_token: string;
  notas: string | null;
  creado: string;
  actualizado: string;
}

export interface NewContact {
  nombre: string;
  whatsapp: string;
  email: string | null;
  intereses: string[];
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ref: string | null;
  ipHash: string | null;
}

export interface Referral { nombre: string; ref_code: string; invitados: number }

interface Store {
  getMode(): Promise<CampaignMode>;
  setMode(m: CampaignMode): Promise<void>;
  count(): Promise<number>;
  upsert(c: NewContact): Promise<Contact & { created: boolean }>;
  byRef(code: string): Promise<Contact | null>;
  unsubscribe(token: string): Promise<Contact | null>;
  setEstado(id: string, estado: 'activo' | 'baja'): Promise<void>;
  setNotas(id: string, notas: string | null): Promise<void>;
  all(): Promise<Contact[]>;
  referrals(): Promise<Referral[]>;
  recentFirstNames(limit: number): Promise<{ seq: number; nombre: string }[]>;
}

const code = (n: number) => randomBytes(n * 2).toString('base64url').replace(/[-_]/g, '').slice(0, n);
const token = () => randomBytes(18).toString('base64url');
const firstName = (s: string) => s.trim().split(/\s+/)[0];
const mergeInterests = (a: string, b: string[]) => [...new Set([...a.split(',').filter(Boolean), ...b])].join(',');

/* ---------------------------------- Neon ---------------------------------- */

function neonStore(url: string): Store {
  const sql = neon(url);
  let ready: Promise<unknown> | null = null;
  const init = () =>
    (ready ??= (async () => {
      await sql`CREATE TABLE IF NOT EXISTS polio_contacts (
        id UUID PRIMARY KEY,
        seq SERIAL UNIQUE,
        nombre TEXT NOT NULL,
        whatsapp TEXT NOT NULL UNIQUE,
        email TEXT,
        intereses TEXT NOT NULL,
        utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
        ref_code TEXT NOT NULL UNIQUE,
        referido_por UUID,
        fase_registro TEXT NOT NULL,
        consent_at TIMESTAMPTZ NOT NULL,
        consent_version TEXT NOT NULL,
        consent_ip_hash TEXT,
        estado TEXT NOT NULL DEFAULT 'activo',
        baja_token TEXT NOT NULL UNIQUE,
        notas TEXT,
        creado TIMESTAMPTZ NOT NULL DEFAULT now(),
        actualizado TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS polio_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
      await sql`INSERT INTO polio_settings (key, value) VALUES ('mode', 'expectativa') ON CONFLICT DO NOTHING`;
    })().catch((e) => { ready = null; throw e; }));

  const one = async (rows: Promise<Record<string, unknown>[]>) => ((await rows)[0] as unknown as Contact | undefined) ?? null;

  const store: Store = {
    async getMode() {
      await init();
      const r = await sql`SELECT value FROM polio_settings WHERE key = 'mode'`;
      return (r[0]?.value as CampaignMode) ?? 'expectativa';
    },
    async setMode(m) {
      await init();
      await sql`UPDATE polio_settings SET value = ${m} WHERE key = 'mode'`;
    },
    async count() {
      await init();
      const r = await sql`SELECT COUNT(*)::int AS n FROM polio_contacts WHERE estado = 'activo'`;
      return r[0].n as number;
    },
    async upsert(c) {
      await init();
      const existing = await one(sql`SELECT * FROM polio_contacts WHERE whatsapp = ${c.whatsapp}`);
      if (existing) {
        const updated = await one(sql`UPDATE polio_contacts SET
          nombre = ${c.nombre}, email = COALESCE(${c.email}, email),
          intereses = ${mergeInterests(existing.intereses, c.intereses)},
          consent_at = now(), consent_version = ${CONSENT_VERSION}, consent_ip_hash = ${c.ipHash},
          estado = 'activo', actualizado = now()
          WHERE id = ${existing.id} RETURNING *`);
        return { ...(updated as Contact), created: false };
      }
      const referrer = c.ref ? await one(sql`SELECT id FROM polio_contacts WHERE ref_code = ${c.ref}`) : null;
      const mode = await store.getMode();
      const created = await one(sql`INSERT INTO polio_contacts
        (id, nombre, whatsapp, email, intereses, utm_source, utm_medium, utm_campaign, ref_code,
         referido_por, fase_registro, consent_at, consent_version, consent_ip_hash, baja_token)
        VALUES (${randomUUID()}, ${c.nombre}, ${c.whatsapp}, ${c.email}, ${c.intereses.join(',')},
          ${c.utm_source}, ${c.utm_medium}, ${c.utm_campaign}, ${code(6)}, ${referrer?.id ?? null},
          ${mode}, now(), ${CONSENT_VERSION}, ${c.ipHash}, ${token()})
        RETURNING *`);
      return { ...(created as Contact), created: true };
    },
    async byRef(ref) {
      await init();
      return one(sql`SELECT * FROM polio_contacts WHERE ref_code = ${ref}`);
    },
    async unsubscribe(t) {
      await init();
      return one(sql`UPDATE polio_contacts SET estado = 'baja', actualizado = now()
        WHERE baja_token = ${t} RETURNING *`);
    },
    async setEstado(id, estado) {
      await init();
      await sql`UPDATE polio_contacts SET estado = ${estado}, actualizado = now() WHERE id = ${id}`;
    },
    async setNotas(id, notas) {
      await init();
      await sql`UPDATE polio_contacts SET notas = ${notas}, actualizado = now() WHERE id = ${id}`;
    },
    async all() {
      await init();
      return (await sql`SELECT * FROM polio_contacts ORDER BY creado DESC`) as unknown as Contact[];
    },
    async referrals() {
      await init();
      return (await sql`SELECT r.nombre, r.ref_code, COUNT(c.id)::int AS invitados
        FROM polio_contacts c JOIN polio_contacts r ON r.id = c.referido_por
        GROUP BY r.id ORDER BY invitados DESC LIMIT 20`) as Referral[];
    },
    async recentFirstNames(limit) {
      await init();
      const rows = await sql`SELECT seq, nombre FROM polio_contacts WHERE estado = 'activo'
        ORDER BY seq DESC LIMIT ${limit}`;
      return rows.map((r) => ({ seq: r.seq as number, nombre: firstName(r.nombre as string) }));
    },
  };
  return store;
}

/* ------------------------------ Archivo local ----------------------------- */

interface FileData { mode: CampaignMode; seq: number; contacts: Contact[] }

function fileStore(): Store {
  const file = path.join(process.cwd(), '.data', 'polio.json');
  let queue: Promise<unknown> = Promise.resolve();

  const read = async (): Promise<FileData> => {
    try { return JSON.parse(await fs.readFile(file, 'utf8')); }
    catch { return { mode: 'expectativa', seq: 0, contacts: [] }; }
  };
  const write = async (d: FileData) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(d, null, 2));
  };
  // Serializa las escrituras para no perder registros simultáneos.
  const mutate = <T>(fn: (d: FileData) => T): Promise<T> => {
    const run = queue.then(async () => { const d = await read(); const r = fn(d); await write(d); return r; });
    queue = run.catch(() => {});
    return run;
  };
  const now = () => new Date().toISOString();

  return {
    getMode: async () => (await read()).mode,
    setMode: (m) => mutate((d) => { d.mode = m; }),
    count: async () => (await read()).contacts.filter((c) => c.estado === 'activo').length,
    upsert: (c) => mutate((d) => {
      const existing = d.contacts.find((x) => x.whatsapp === c.whatsapp);
      if (existing) {
        Object.assign(existing, {
          nombre: c.nombre, email: c.email ?? existing.email,
          intereses: mergeInterests(existing.intereses, c.intereses),
          consent_at: now(), consent_version: CONSENT_VERSION, consent_ip_hash: c.ipHash,
          estado: 'activo', actualizado: now(),
        });
        return { ...existing, created: false };
      }
      const referrer = c.ref ? d.contacts.find((x) => x.ref_code === c.ref) : undefined;
      const contact: Contact = {
        id: randomUUID(), seq: ++d.seq, nombre: c.nombre, whatsapp: c.whatsapp, email: c.email,
        intereses: c.intereses.join(','), utm_source: c.utm_source, utm_medium: c.utm_medium,
        utm_campaign: c.utm_campaign, ref_code: code(6), referido_por: referrer?.id ?? null,
        fase_registro: d.mode, consent_at: now(), consent_version: CONSENT_VERSION,
        consent_ip_hash: c.ipHash, estado: 'activo', baja_token: token(), notas: null,
        creado: now(), actualizado: now(),
      };
      d.contacts.push(contact);
      return { ...contact, created: true };
    }),
    byRef: async (ref) => (await read()).contacts.find((c) => c.ref_code === ref) ?? null,
    unsubscribe: (t) => mutate((d) => {
      const c = d.contacts.find((x) => x.baja_token === t);
      if (c) { c.estado = 'baja'; c.actualizado = now(); }
      return c ?? null;
    }),
    setEstado: (id, estado) => mutate((d) => {
      const c = d.contacts.find((x) => x.id === id);
      if (c) { c.estado = estado; c.actualizado = now(); }
    }),
    setNotas: (id, notas) => mutate((d) => {
      const c = d.contacts.find((x) => x.id === id);
      if (c) { c.notas = notas; c.actualizado = now(); }
    }),
    all: async () => [...(await read()).contacts].sort((a, b) => b.creado.localeCompare(a.creado)),
    referrals: async () => {
      const { contacts } = await read();
      const counts = new Map<string, number>();
      for (const c of contacts) if (c.referido_por) counts.set(c.referido_por, (counts.get(c.referido_por) ?? 0) + 1);
      return [...counts].map(([id, invitados]) => {
        const r = contacts.find((c) => c.id === id)!;
        return { nombre: r.nombre, ref_code: r.ref_code, invitados };
      }).sort((a, b) => b.invitados - a.invitados).slice(0, 20);
    },
    recentFirstNames: async (limit) =>
      (await read()).contacts.filter((c) => c.estado === 'activo')
        .sort((a, b) => b.seq - a.seq).slice(0, limit)
        .map((c) => ({ seq: c.seq, nombre: firstName(c.nombre) })),
  };
}

let instance: Store | null = null;
export function polioStore(): Store {
  if (instance) return instance;
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (url) return (instance = neonStore(url));
  if (process.env.VERCEL) throw new Error('DATABASE_URL no configurada: conecta Neon en Vercel.');
  return (instance = fileStore());
}
