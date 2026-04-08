"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function passwordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "", color: "transparent", width: "0%" };
  const score =
    (pw.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(pw) ? 1 : 0) +
    (/[0-9]/.test(pw) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
  if (score <= 1) return { label: "Faible", color: "var(--bearish)", width: "25%" };
  if (score === 2) return { label: "Moyen", color: "#F5A623", width: "55%" };
  return { label: "Fort", color: "var(--bullish)", width: "100%" };
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") ?? undefined;
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = passwordStrength(password);
  const mismatch = confirm.length > 0 && password !== confirm;

  const inputStyle = {
    background: "var(--surface-highest)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    color: "white",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenom, email, password, refCode }),
    });

    const data = await res.json() as { success?: boolean; error?: string; requiresVerification?: boolean };

    if (!res.ok) {
      setError(data.error ?? "Erreur lors de la création du compte.");
      setLoading(false);
      return;
    }

    // If API requires email verification, redirect to verify page
    if (data.requiresVerification) {
      localStorage.setItem('pending_verify_email', email);
      router.push('/verify?email=' + encodeURIComponent(email));
      setLoading(false);
      return;
    }

    // Fallback: redirect to login (should not happen with current API)
    router.push("/login");
  }

  return (
    <>
      <div className="space-y-1">
        <h1 className="font-display font-semibold text-2xl text-white">Créer un compte</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Commencez à analyser vos charts en 30 secondes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}>Prénom</label>
          <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)}
            placeholder="Kofi" required style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(153,69,255,0.5)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="kofi@example.com" required style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(153,69,255,0.5)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}>Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required minLength={8} style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(153,69,255,0.5)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")} />
          {password.length > 0 && (
            <div className="space-y-1">
              <div className="h-1 rounded-full w-full" style={{ background: "var(--surface-highest)" }}>
                <div className="h-1 rounded-full transition-all"
                  style={{ width: strength.width, background: strength.color }} />
              </div>
              <p className="text-[10px] font-semibold" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}>Confirmer le mot de passe</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••" required style={{
              ...inputStyle,
              borderColor: mismatch ? "rgba(244,63,94,0.5)" : "var(--border)",
            }}
            onFocus={e => (e.target.style.borderColor = mismatch ? "rgba(244,63,94,0.5)" : "rgba(153,69,255,0.5)")}
            onBlur={e => (e.target.style.borderColor = mismatch ? "rgba(244,63,94,0.5)" : "var(--border)")} />
          {mismatch && (
            <p className="text-[10px] font-semibold" style={{ color: "var(--bearish)" }}>
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-xs font-medium"
            style={{ background: "var(--bearish-muted)", border: "1px solid rgba(244,63,94,0.2)", color: "var(--bearish)" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || mismatch}
          className="w-full py-3 rounded-2xl font-display font-semibold text-sm transition-all"
          style={{
            background: loading || mismatch ? "var(--surface-highest)" : "var(--sol-gradient)",
            color: "white",
            opacity: loading ? 0.7 : 1,
            cursor: loading || mismatch ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Création du compte…" : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Déjà un compte ?{" "}
        <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--bullish)" }}>
          Se connecter
        </Link>
      </p>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
