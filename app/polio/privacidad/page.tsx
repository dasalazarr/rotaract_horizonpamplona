import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: { absolute: 'Privacidad · Pamplona contra la Polio 2026' },
  robots: { index: false },
};

const H = ({ children }: { children: React.ReactNode }) => <h2 className="mt-10 mb-3 text-xl font-semibold text-white">{children}</h2>;

export default function PolioPrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 sm:px-8 py-20 text-white/75 leading-relaxed">
      <Link href="/polio" className="text-sm text-[#FF8A8A] hover:text-white">← Volver a la campaña</Link>
      <h1 className="mt-6 font-display text-5xl sm:text-6xl text-white">Privacidad y aviso legal</h1>
      <p className="mt-4 rounded-2xl border border-[#FF4B4B]/40 bg-[#E4262F]/10 p-4 text-sm">
        Borrador pendiente de revisión legal. Completa los datos entre corchetes antes de publicar.
      </p>

      <H>Responsable del tratamiento</H>
      <p>Rotary Club Pamplona, [NIF], [domicilio social]. Contacto para privacidad: [correo del club]. La campaña cuenta con el apoyo de Rotaract Horizon Pamplona, que aloja esta página.</p>

      <H>Qué datos tratamos</H>
      <p>Nombre, número de WhatsApp, correo electrónico (opcional), formas de participación elegidas, origen de la visita (parámetros de campaña) y fecha y versión del consentimiento. Guardamos un identificador cifrado de la IP como prueba del consentimiento, no la IP en claro.</p>

      <H>Para qué</H>
      <p>Informarte sobre la campaña Pamplona contra la Polio 2026 y el acto del 24 de octubre en la Plaza del Castillo por WhatsApp y, si lo facilitas, por correo.</p>
      <p className="mt-3">Si compartes tu enlace personal de invitación, la vista previa de ese enlace muestra tu nombre de pila y tu número de globo a quienes lo reciban. No se muestra ningún otro dato.</p>

      <H>Legitimación</H>
      <p>Tu consentimiento expreso (art. 6.1.a RGPD), que puedes retirar en cualquier momento sin que afecte a la licitud del tratamiento anterior.</p>

      <H>Destinatarios</H>
      <p>No cedemos datos a terceros. Los proveedores técnicos actúan como encargados del tratamiento con contrato conforme al art. 28 RGPD: Vercel (alojamiento), Neon (base de datos, región UE) y [proveedor de WhatsApp o correo, si se usa].</p>

      <H>Conservación</H>
      <p>Hasta que te des de baja o, como máximo, 24 meses desde tu última interacción con la campaña.</p>

      <H>Tus derechos</H>
      <p>
        Acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [correo del club]. Puedes darte de baja respondiendo BAJA por WhatsApp
        o con el enlace de cada mensaje. Si consideras que no hemos atendido tus derechos, puedes reclamar ante la{' '}
        <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">Agencia Española de Protección de Datos</a>.
      </p>

      <H>Cookies</H>
      <p>Esta página no usa cookies de análisis ni de publicidad. Solo guarda en tu navegador, durante la sesión, el origen de la visita para atribuir el registro.</p>

      <H>Aviso legal y marcas</H>
      <p>Los emblemas de Rotary, Rotaract y End Polio Now son marcas de Rotary International y se usan conforme a sus normas de identidad visual.</p>
    </main>
  );
}
