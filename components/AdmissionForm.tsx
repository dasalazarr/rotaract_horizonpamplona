'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

export function AdmissionForm() {
  const formLoadedAtRef = useRef<number>(0);

  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    occupation: '',
    location: '',
    email: '',
    motivation: '',
    rgpdConsent: false,
    websiteAddress: '', // Honeypot field (hidden)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (

    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.rgpdConsent) {
      setErrorMessage('Debes aceptar la política de privacidad para enviar tu solicitud.');
      return;
    }

    const ageNum = parseInt(formData.age, 10);
    if (isNaN(ageNum) || ageNum < 16 || ageNum > 40) {
      setErrorMessage('La edad debe estar comprendida entre 16 y 40 años.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/solicitud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formLoadedAt: formLoadedAtRef.current,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al tramitar la solicitud');
      }

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        id="admission-success-state"
        className="liquid-glass rounded-3xl p-8 sm:p-10 border border-emerald-500/30 bg-paper-soft text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-display text-3xl font-normal text-ink mb-3">
          ¡Solicitud enviada!
        </h3>
        <p className="text-base text-muted max-w-md mx-auto mb-6 leading-relaxed">
          Hemos recibido tu solicitud correctamente. Te contactaremos en menos de 4 días laborales para organizar una breve charla informal y conocer tus inquietudes.
        </p>
        <div className="p-4 rounded-xl bg-ink/5 border border-line text-xs text-muted max-w-sm mx-auto">
          Revisa tu bandeja de entrada en <strong className="text-ink">{formData.email}</strong> (también la carpeta de correo no deseado).
        </div>
        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setFormData({
              fullName: '',
              age: '',
              occupation: '',
              location: '',
              email: '',
              motivation: '',
              rgpdConsent: false,
              websiteAddress: '',
            });
            formLoadedAtRef.current = Date.now();
          }}
          className="mt-8 text-xs text-accent-deep hover:underline"
        >
          Enviar otra respuesta
        </button>
      </div>
    );
  }

  return (
    <form
      id="admission-form"
      onSubmit={handleSubmit}
      className="liquid-glass rounded-3xl p-7 sm:p-9 border border-line space-y-5"
      noValidate
    >
      <div>
        <h3 className="font-display text-2xl sm:text-3xl font-normal text-ink mb-1.5">
          Formulario de admisión
        </h3>
        <p className="text-xs text-muted">
          Los campos marcados con asterisco (*) son obligatorios.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot field for anti-bot protection (visually hidden) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="websiteAddress">No rellenar si eres humano</label>
        <input
          type="text"
          id="websiteAddress"
          name="websiteAddress"
          tabIndex={-1}
          autoComplete="off"
          value={formData.websiteAddress}
          onChange={handleChange}
        />
      </div>

      {/* 1. Nombre completo */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-xs font-medium text-ink/90 uppercase tracking-wider mb-1.5"
        >
          Nombre completo *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          placeholder="Ej. Martín Arregui Goñi"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-paper-soft border border-line text-ink placeholder-muted/60 text-sm focus:outline-none focus:border-[#D42365] focus:ring-1 focus:ring-[#D42365] transition-colors"
        />
      </div>

      {/* 2. Edad + Ocupación (grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="age"
            className="block text-xs font-medium text-ink/90 uppercase tracking-wider mb-1.5"
          >
            Edad (16–40) *
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="16"
            max="40"
            required
            placeholder="Ej. 24"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-paper-soft border border-line text-ink placeholder-muted/60 text-sm focus:outline-none focus:border-[#D42365] focus:ring-1 focus:ring-[#D42365] transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="occupation"
            className="block text-xs font-medium text-ink/90 uppercase tracking-wider mb-1.5"
          >
            Ocupación *
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            required
            placeholder="Estudiante, ingeniero, sanitaria..."
            value={formData.occupation}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-paper-soft border border-line text-ink placeholder-muted/60 text-sm focus:outline-none focus:border-[#D42365] focus:ring-1 focus:ring-[#D42365] transition-colors"
          />
        </div>
      </div>

      {/* 3. Ubicación + Correo electrónico (grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="block text-xs font-medium text-ink/90 uppercase tracking-wider mb-1.5"
          >
            Ubicación *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            placeholder="Pamplona, Burlada, Zizur..."
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-paper-soft border border-line text-ink placeholder-muted/60 text-sm focus:outline-none focus:border-[#D42365] focus:ring-1 focus:ring-[#D42365] transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-ink/90 uppercase tracking-wider mb-1.5"
          >
            Correo electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="tu-correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-paper-soft border border-line text-ink placeholder-muted/60 text-sm focus:outline-none focus:border-[#D42365] focus:ring-1 focus:ring-[#D42365] transition-colors"
          />
        </div>
      </div>

      {/* 4. ¿Por qué quieres unirte? (textarea) */}
      <div>
        <label
          htmlFor="motivation"
          className="block text-xs font-medium text-ink/90 uppercase tracking-wider mb-1.5"
        >
          ¿Por qué quieres unirte? *
        </label>
        <textarea
          id="motivation"
          name="motivation"
          required
          rows={4}
          placeholder="Cuéntanos tus inquietudes, causas que te motivan o qué esperas aportar al club..."
          value={formData.motivation}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-paper-soft border border-line text-ink placeholder-muted/60 text-sm focus:outline-none focus:border-[#D42365] focus:ring-1 focus:ring-[#D42365] transition-colors resize-y"
        />
      </div>

      {/* 5. RGPD consent checkbox with privacy link */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            id="rgpdConsent"
            name="rgpdConsent"
            required
            checked={formData.rgpdConsent}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-line text-[#D42365] focus:ring-[#D42365] bg-paper-soft cursor-pointer"
          />
          <span className="text-xs text-muted leading-relaxed">
            He leído y acepto la{' '}
            <Link
              href="/legal/privacidad"
              className="text-accent-deep underline hover:text-ink transition-colors"
              target="_blank"
            >
              política de privacidad
            </Link>
            . Mis datos se usarán solo para gestionar mi solicitud. *
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <button
          type="submit"
          id="btn-submit-admission"
          disabled={isSubmitting}
          className="btn-primary w-full py-3.5 text-sm sm:text-base font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Tramitando solicitud...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar solicitud</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
