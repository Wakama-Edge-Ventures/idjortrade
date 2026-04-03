import { resend } from '@/lib/resend';

/**
 * Sends a 6-digit email verification code to the user.
 */
export async function sendVerificationEmail(email: string, prenom: string, code: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'noreply@wickox.com',
    to: email,
    subject: 'Ton code de vérification Wickox',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;background:#0A0E1A;padding:32px;border-radius:16px">
        <h2 style="color:#00FF88;margin-bottom:8px">Bienvenue sur Wickox, ${prenom} !</h2>
        <p style="color:#aaa">Ton code de vérification est :</p>
        <div style="font-size:48px;font-weight:bold;letter-spacing:8px;text-align:center;padding:20px;background:#141928;color:#00FF88;border-radius:12px;margin:16px 0">
          ${code}
        </div>
        <p style="color:#666">Ce code expire dans 10 minutes.</p>
        <p style="color:#666;font-size:12px">⚠️ Le trading comporte des risques. Les performances passées ne garantissent pas les résultats futurs.</p>
      </div>
    `,
  });
}
