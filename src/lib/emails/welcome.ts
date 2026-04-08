import { resend } from '@/lib/resend';

/**
 * Sends a welcome email after successful email verification.
 */
export async function sendWelcomeEmail(email: string, prenom: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'noreply@wickox.com',
    to: email,
    subject: `Bienvenue sur Wickox, ${prenom} !`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;background:#0A0E1A;padding:32px;border-radius:16px">
        <h2 style="color:#00FF88">Compte vérifié avec succès !</h2>
        <p style="color:#aaa">Bienvenue ${prenom}. Tu peux maintenant accéder à toutes les fonctionnalités de Wickox.</p>
        <a href="https://app.wickox.com/dashboard" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#00FF88;color:#0A0E1A;border-radius:8px;font-weight:bold;text-decoration:none">Accéder au dashboard →</a>
        <p style="color:#666;font-size:12px;margin-top:24px">⚠️ Le trading comporte des risques.</p>
      </div>
    `,
  });
}
