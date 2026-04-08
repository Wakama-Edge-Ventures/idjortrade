"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show success message if redirected from /verify
  const verified = searchParams.get("verified") === "1";

  const inputStyle = {
    background: "var(--surface-highest)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    color: "white",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      if (result?.ok) {
        // Check if the session carries the unverified flag
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json() as { user?: { emailNotVerified?: boolean } };
        if (sessionData?.user?.emailNotVerified) {
          router.push('/verify?email=' + encodeURIComponent(email));
          return;
        }
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Erreur de connexion. Réessaie.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur réseau. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-1">
        <h1 className="font-display font-semibold text-2xl text-white">Connexion</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Accédez à votre espace trading
        </p>
      </div>

      {/* Email verified success banner */}
      {verified && (
        <div
          className="px-4 py-3 rounded-xl text-xs font-medium"
          style={{ background: "var(--bullish-muted)", border: "1px solid rgba(20,241,149,0.2)", color: "var(--bullish)" }}
        >
          ✓ Email vérifié ! Connecte-toi maintenant.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="kofi@example.com"
            required
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(153,69,255,0.5)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = "rgba(153,69,255,0.5)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-xs font-medium"
            style={{ background: "var(--bearish-muted)", border: "1px solid rgba(244,63,94,0.2)", color: "var(--bearish)" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl font-display font-semibold text-sm transition-all"
          style={{
            background: loading ? "var(--surface-highest)" : "var(--sol-gradient)",
            color: "white",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--bullish)" }}>
          S'inscrire
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
