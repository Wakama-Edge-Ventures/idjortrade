"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import type { PlanKey } from "@/lib/plans-config";
import { PLANS_CONFIG } from "@/lib/plans-config";

declare global {
  interface Window {
    openKkiapayWidget: (options: {
      amount: number;
      key: string;
      sandbox: boolean;
      email?: string;
      phone?: string;
      name?: string;
      callback?: string;
      data?: string;
    }) => void;
  }
}

type Tab = "kkiapay" | "crypto";
type CryptoCurrency = "USDT" | "BTC" | "SOL";

interface PaymentModalProps {
  plan: PlanKey;
  annual: boolean;
  onClose: () => void;
}

export default function PaymentModal({ plan, annual, onClose }: PaymentModalProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [tab, setTab] = useState<Tab>("kkiapay");
  const [cryptoCurrency, setCryptoCurrency] = useState<CryptoCurrency>("USDT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = PLANS_CONFIG[plan];
  const amountFCFA = annual ? config.annualFCFA : config.monthlyFCFA;
  const period = annual ? "annual" : "monthly";
  const isSandbox = process.env.NEXT_PUBLIC_KKIAPAY_SANDBOX === "true";

  // Listen for KkiaPay success event
  useEffect(() => {
    const handleSuccess = async (event: Event) => {
      const { transactionId } = (event as CustomEvent).detail as { transactionId: string };
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/payments/kkiapay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId, planId: plan, period }),
        });
        const data = await res.json() as { success: boolean; error?: string };

        if (data.success) {
          await update();
          router.push("/plans/success");
        } else {
          setError(data.error ?? "Vérification du paiement échouée");
          setLoading(false);
        }
      } catch {
        setError("Erreur réseau. Contactez le support.");
        setLoading(false);
      }
    };

    window.addEventListener("kkiapay-transaction-successful", handleSuccess as EventListener);
    return () => {
      window.removeEventListener("kkiapay-transaction-successful", handleSuccess as EventListener);
    };
  }, [plan, period, update, router]);

  function handleKkiaPay() {
    if (!window.openKkiapayWidget) {
      setError("Widget KkiaPay non chargé. Rechargez la page.");
      return;
    }
    setError(null);
    window.openKkiapayWidget({
      amount: amountFCFA,
      key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY!,
      sandbox: isSandbox,
      email: session?.user?.email ?? undefined,
      name: session?.user?.name ?? undefined,
      data: JSON.stringify({
        userId: session?.user?.id,
        planId: plan,
        period,
      }),
    });
  }

  async function handleCrypto() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/crypto/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, annual, currency: cryptoCurrency }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erreur NOWPayments");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de paiement");
      setLoading(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "kkiapay", label: "Mobile Money & Carte", icon: "💳" },
    { key: "crypto", label: "Crypto", icon: "₿" },
  ];

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "10px 8px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    transition: "all 0.15s",
    background: active ? "rgba(20,241,149,0.12)" : "transparent",
    color: active ? "var(--bullish)" : "var(--text-secondary)",
    outline: active ? "1px solid rgba(20,241,149,0.25)" : "none",
  });

  const primaryBtn: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    border: "none",
    background: loading ? "var(--surface-highest)" : "var(--bullish)",
    color: loading ? "var(--text-secondary)" : "white",
    opacity: loading ? 0.7 : 1,
    transition: "all 0.15s",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6 space-y-5"
        style={{
          background: "var(--surface-low)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display font-semibold text-lg text-white">
              Passer au plan {config.nameFr}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {amountFCFA.toLocaleString("fr-FR")} FCFA / {annual ? "mois (annuel)" : "mois"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ color: "var(--text-secondary)", background: "transparent", border: "none", cursor: "pointer", borderRadius: "8px", padding: "6px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: "var(--surface-highest)" }}>
          {tabs.map((t) => (
            <button key={t.key} style={tabStyle(tab === t.key)} onClick={() => { setTab(t.key); setError(null); }}>
              <span className="block text-base mb-0.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* KkiaPay tab */}
        {tab === "kkiapay" && (
          <div className="space-y-4">
            {isSandbox && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "rgba(245,166,35,0.08)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.2)" }}
              >
                <span>⚠️</span> Mode test activé — aucun débit réel
              </div>
            )}

            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Payez avec votre mobile ou votre carte bancaire. KkiaPay gère tout en toute sécurité.
            </p>

            {/* Payment method badges */}
            <div className="flex flex-wrap gap-2">
              {["Wave CI", "Orange Money", "MTN MoMo", "Visa", "Mastercard"].map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: "rgba(20,241,149,0.07)", color: "var(--bullish)", border: "1px solid rgba(20,241,149,0.15)" }}
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Amount highlight */}
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "rgba(20,241,149,0.05)", border: "1px solid rgba(20,241,149,0.12)" }}
            >
              <p className="text-2xl font-bold text-white font-data">
                {amountFCFA.toLocaleString("fr-FR")} FCFA
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                {annual ? "Facturation annuelle" : "Facturation mensuelle"}
              </p>
            </div>

            <button style={primaryBtn} disabled={loading} onClick={handleKkiaPay}>
              {loading ? "Vérification en cours…" : "Payer avec KkiaPay"}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
              🔒 Paiement sécurisé par KkiaPay
            </p>
          </div>
        )}

        {/* Crypto tab */}
        {tab === "crypto" && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Payez en crypto. Le montant est converti automatiquement au taux du marché.
            </p>
            <div className="flex gap-2">
              {(["USDT", "BTC", "SOL"] as CryptoCurrency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCryptoCurrency(c)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    border: cryptoCurrency === c ? "1px solid rgba(153,69,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    background: cryptoCurrency === c ? "var(--bullish-muted)" : "transparent",
                    color: cryptoCurrency === c ? "var(--bullish)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Amount highlight */}
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "rgba(20,241,149,0.05)", border: "1px solid rgba(20,241,149,0.12)" }}
            >
              <p className="text-2xl font-bold text-white font-data">
                {amountFCFA.toLocaleString("fr-FR")} FCFA
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                ≈ {(amountFCFA / 655.96).toFixed(2)} USD en {cryptoCurrency}
              </p>
            </div>

            <button style={primaryBtn} disabled={loading} onClick={handleCrypto}>
              {loading ? "Création de la facture…" : `Payer en ${cryptoCurrency}`}
            </button>
            <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
              Powered by NOWPayments · Confirmation en quelques minutes
            </p>
          </div>
        )}

        {error && (
          <p
            className="text-xs font-semibold px-4 py-3 rounded-xl"
            style={{ background: "var(--bearish-muted)", color: "var(--bearish)", border: "1px solid rgba(244,63,94,0.2)" }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
