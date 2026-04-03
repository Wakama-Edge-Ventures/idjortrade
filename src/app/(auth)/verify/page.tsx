"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Resolve email from query param or localStorage (set during registration)
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fromParam = searchParams.get("email");
    if (fromParam) {
      setEmail(fromParam);
    } else if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("pending_verify_email") ?? "");
    }
  }, [searchParams]);

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Focus the first input on mount
  useEffect(() => {
    refs[0].current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleDigit(index: number, value: string) {
    const v = value.replace(/\D/g, "").slice(0, 1);
    const newDigits = [...digits];
    newDigits[index] = v;
    setDigits(newDigits);
    // Advance focus to the next field
    if (v && index < 5) refs[index + 1].current?.focus();
    // Auto-submit when all 6 digits are filled
    if (newDigits.every((d) => d)) {
      handleVerify(newDigits.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  async function handleVerify(code: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json() as { error?: string; success?: boolean };
      if (!res.ok) {
        setError(data.error ?? "Code invalide");
        setDigits(["", "", "", "", "", ""]);
        refs[0].current?.focus();
        return;
      }
      // Clear pending email and redirect to login with verified flag
      if (typeof window !== "undefined") {
        localStorage.removeItem("pending_verify_email");
      }
      router.push("/login?verified=1");
    } catch {
      setError("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    try {
      await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* ignore */ }
  }

  const inputStyle: React.CSSProperties = {
    width: "48px",
    height: "56px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    background: "var(--surface-highest)",
    border: "1px solid var(--outline)",
    borderRadius: "12px",
    color: "white",
    outline: "none",
  };

  return (
    <>
      <div className="space-y-1 text-center">
        <h1 className="font-headline font-bold text-2xl text-white">Vérifie ton email</h1>
        <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>
          Entre le code à 6 chiffres envoyé à
        </p>
        <p className="text-sm font-semibold" style={{ color: "#00FF88" }}>{email}</p>
      </div>

      {/* 6-digit code inputs */}
      <div className="flex justify-center gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={loading}
            style={{
              ...inputStyle,
              borderColor: d ? "rgba(0,255,136,0.4)" : "var(--outline)",
            }}
          />
        ))}
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-xl text-xs font-medium text-center"
          style={{
            background: "rgba(255,59,92,0.08)",
            border: "1px solid rgba(255,59,92,0.2)",
            color: "#FF3B5C",
          }}
        >
          {error}
        </div>
      )}

      {loading && (
        <p className="text-center text-sm" style={{ color: "var(--on-surface-dim)" }}>
          Vérification…
        </p>
      )}

      <div className="text-center space-y-2">
        <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>
          Tu n'as pas reçu le code ?
        </p>
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="text-sm font-semibold"
          style={{
            color: resendCooldown > 0 ? "var(--on-surface-dim)" : "#00FF88",
            cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
            background: "none",
            border: "none",
          }}
        >
          {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : "Renvoyer le code"}
        </button>
      </div>
    </>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
