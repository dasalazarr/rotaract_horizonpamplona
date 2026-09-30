# Rotaract Horizon Pamplona — Portal Web Oficial

Sitio web oficial de **Rotaract Horizon Pamplona**, club juvenil de voluntariado y liderazgo adscrito al Distrito 2202 de Rotary International en Pamplona (Navarra, España).

Diseñado con un estilo editorial cinematográfico oscuro (cinematic dark editorial), minimalista y elegante, con el efecto de firma visual **liquid-glass**, tipografía refinada (*Instrument Serif* + *Inter*) y paleta institucional en azul marino oscuro con acentos magenta (`#D42365`).

Todo el contenido del sitio está estrictamente redactado en español (**es-ES**).

---

## 📂 Dónde editar el contenido (Guía para no desarrolladores)

Toda la información y textos de muestra *(mockups)* se encuentran centralizados en archivos tipados dentro de la carpeta `/content`. No es necesario tocar código ni lógica de componentes para actualizar los datos:

| Qué deseas cambiar | Archivo a editar | Variables / Campos clave |
| :--- | :--- | :--- |
| **Código Bizum** | `/content/site.ts` | `siteConfig.bizumCode` |
| **Cuenta IBAN y Banco** | `/content/site.ts` | `siteConfig.iban`, `siteConfig.bankName` |
| **Estadísticas de portada** | `/content/site.ts` | `siteConfig.stats.sociosActivos`, `horasServicio`, `proyectosEnCurso` |
| **Correo e Instagram** | `/content/site.ts` | `siteConfig.email`, `siteConfig.instagram` |
| **Proyectos sociales** | `/content/projects.ts` | `projects` (nombres, presupuestos, porcentajes ejecutados, personas impactadas, voluntarios, fotos) |
| **Eventos y reuniones** | `/content/events.ts` | `events` (nombre, fecha, hora, lugar, agenda por horas, aforo, estado automático) |
| **Mosaico de socios y cargos** | `/content/members.ts` | `members` (nombre, cargo de la directiva, iniciales, bio, foto sujeta a RGPD) |
| **Artículos y noticias** | `/content/articles.ts` | `articles` (titular, fecha, categoría, cuerpo, citas destacadas, tiempos de lectura) |
| **Preguntas frecuentes donaciones** | `/content/faq.ts` | `donationFaqs` (preguntas y respuestas del acordeón en `/dona`) |

---

## 🎨 Sistema de diseño y estilo visual

- **Color primario:** `#D42365` (magenta institucional). Reservado para botones CTA principales, estados activos del menú, etiquetas eyebrow, números estadísticos y barras de progreso.
- **Fondo base:** Azul marino oscuro cinematográfico `hsl(201 60% 8%)`.
- **Efecto de firma (.liquid-glass):** Superficie translúcida con `backdrop-filter: blur(8px)`, borde perimetral sutil mediante máscara de degradado e iluminación interna suave.
- **Tipografía:**
  - *Instrument Serif*: Títulos principales, cifras hero y citas editoriales.
  - *Inter*: Textos explicativos, navegación, etiquetas y campos de formulario.

---

## 🧭 Rutas disponibles

- `/` — Página de Inicio (Hero con vídeo/poster, banda de estadísticas, actualidad, proyectos, próximo evento, banda Dona).
- `/actualidad` — Índice de publicaciones con filtro interactivo por categoría (Todo, Club, Distrito, Proyectos, Eventos).
- `/actualidad/[slug]` — Vista de lectura editorial con tiempo de lectura, citas destacadas, botones de acción y esquema Article JSON-LD.
- `/socios` — Admisión y membresía: qué buscamos, beneficios, proceso 01–04, formulario con protección anti-spam y mosaico de directiva con cumplimiento RGPD.
- `/proyectos` — Índice de proyectos en marcha.
- `/proyectos/[slug]` — Ficha completa con indicadores clave (KPIs), barra de ejecución presupuestaria magenta, contexto, objetivos, galería y banda de donación vinculada.
- `/eventos` — Calendario de actividades.
- `/eventos/[slug]` — Ficha con agenda cronometrada, caja de fecha liquid-glass, cálculo automático de evento finalizado, botón de inscripción gratuita y esquema Event JSON-LD.
- `/miembros` — Espacio de miembros (MVP Teaser con aviso de acceso por invitación y directiva noindex).
- `/dona` — Página de donaciones directas (Bizum, Transferencia) y preguntas frecuentes.
- `/legal/aviso-legal` — Aviso legal conforme a la LSSI-CE.
- `/legal/privacidad` — Política de privacidad conforme al RGPD y LOPDGDD.
- `/legal/cookies` — Política de cookies informativas.
- `/sitemap.xml` & `/robots.txt` — Indexación y optimización para motores de búsqueda.

---

## 🛠️ Tecnologías empleadas

- **Next.js 15 (App Router)** + React 19 + TypeScript
- **Tailwind CSS v4** + Radix UI Primitives (Accordion, Dialog, Slot)
- **Lucide Icons** para iconografía sobria
- **Google Fonts** vía `next/font/google` (*Instrument Serif* e *Inter*)

---

## Campaña «Pamplona contra la Polio 2026» (`/polio`)

Landing inmersiva a pantalla completa (sin la navegación de Rotaract), registro de contactos y CRM para la
campaña de Rotary Club Pamplona con Rotaract Horizon Pamplona. Acto: **24 de octubre de 2026, 19:30, Plaza del Castillo**.

| Ruta | Qué es |
| :--- | :--- |
| `/polio` | Landing: cuenta atrás, la enfermedad, la iniciativa (plaza que se enciende), cielo de globos, invitación y registro |
| `/polio/admin` | CRM protegido: KPIs, filtros, notas, bajas, CSV, embajadores, mensaje de WhatsApp por contacto y cambio de fase |
| `/api/polio/og` | Miniatura de WhatsApp (JPG 1200×630). Con `?ref=` muestra «Nombre te invita · Globo nº X» |
| `/polio/evento.ics` | Evento para el calendario |
| `/polio/baja?t=` | Baja con confirmación (botón, para que las vistas previas de WhatsApp no den de baja a nadie) |
| `/polio/privacidad` | Privacidad de la campaña (**borrador: completar los `[corchetes]`**) |

**Dónde editar:** fecha, lugar, programa, meta, textos para compartir y logos en `lib/polio/config.ts`.
Los logos oficiales van en `public/polio/logos/` y se activan escribiendo su ruta en `polioLogos`.

**Variables de entorno (Vercel → Settings → Environment Variables):**

| Variable | Para qué |
| :--- | :--- |
| `DATABASE_URL` | Postgres de Neon (Vercel → Storage → Neon la crea sola). Sin ella, en local se usa `.data/polio.json` |
| `POLIO_ADMIN_PASSWORD` | Contraseña del CRM (usuario `admin`, o `POLIO_ADMIN_USER`) |
| `POLIO_IP_SALT` | Cadena aleatoria para cifrar la IP del consentimiento |

Las tablas (`polio_contacts`, `polio_settings`) se crean solas en la primera petición.

**Fases:** desde el CRM se cambia entre *Expectativa* y *Lanzamiento*; cambian los textos y la miniatura al instante.
Si rediseñas la miniatura, sube `ogVersion` en `lib/polio/config.ts` (WhatsApp cachea por URL).
