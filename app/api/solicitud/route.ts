import { NextRequest, NextResponse } from 'next/server';

/**
 * ENDPOINT DE RECEPCIÓN DE SOLICITUDES DE ADMISIÓN (SOCIOS)
 * 
 * En producción este handler puede conectarse a proveedores de correo transaccional
 * como Resend, SendGrid o Google Workspace SMTP:
 * 
 * 1. Envía notificación a la Junta Directiva (hola@horizonpamplona.org)
 * 2. Envía acuse de recibo inmediato y de bienvenida al solicitante
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      age,
      occupation,
      location,
      email,
      motivation,
      rgpdConsent,
      // Honeypot field for anti-bot protection
      websiteAddress,
      // Time trap: timestamp when form was rendered
      formLoadedAt,
    } = body;

    // SPAM PROTECTION 1: Honeypot check
    if (websiteAddress && websiteAddress.trim() !== '') {
      // Silently reject bots without raising alarms
      return NextResponse.json({ success: true, message: 'Solicitud tramitada' });
    }

    // SPAM PROTECTION 2: Time-trap check (submitted in less than 2.5 seconds = likely bot)
    const now = Date.now();
    if (formLoadedAt && now - Number(formLoadedAt) < 2500) {
      return NextResponse.json({ success: true, message: 'Solicitud tramitada' });
    }

    // Validation
    if (!fullName || !age || !occupation || !location || !email || !motivation || !rgpdConsent) {
      return NextResponse.json(
        { error: 'Por favor, completa todos los campos requeridos y acepta la política de privacidad.' },
        { status: 400 }
      );
    }

    if (Number(age) < 16 || Number(age) > 40) {
      return NextResponse.json(
        { error: 'El club Rotaract acoge a jóvenes de entre 16 y 40 años.' },
        { status: 400 }
      );
    }

    // Stubs for email notification to membership inbox and applicant auto-confirmation:
    //
    // e.g. with Resend:
    // await resend.emails.send({
    //   from: 'Rotaract Horizon Pamplona <no-reply@horizonpamplona.org>',
    //   to: 'hola@horizonpamplona.org',
    //   subject: `Nueva solicitud de socio: ${fullName}`,
    //   text: `Nombre: ${fullName}, Edad: ${age}, Ocupación: ${occupation}, Localidad: ${location}, Email: ${email}\nMotivación: ${motivation}`,
    // });
    //
    // await resend.emails.send({
    //   from: 'Rotaract Horizon Pamplona <hola@horizonpamplona.org>',
    //   to: email,
    //   subject: 'Hemos recibido tu solicitud — Rotaract Horizon Pamplona',
    //   text: `Hola ${fullName}, gracias por tu interés en sumarte a nuestro club. En menos de 4 días nos pondremos en contacto contigo para una breve charla informal.`,
    // });

    console.log('[SOLICITUD ADMISIÓN RECIBIDA]', {
      timestamp: new Date().toISOString(),
      fullName,
      age,
      occupation,
      location,
      email,
      motivationLength: motivation.length,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Hemos recibido tu solicitud correctamente. Te contactaremos en menos de 4 días.',
        data: { fullName, email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error procesando solicitud:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud. Por favor inténtalo de nuevo o escríbenos directamente.' },
      { status: 500 }
    );
  }
}
