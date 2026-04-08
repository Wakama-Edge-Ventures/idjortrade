"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ReferralStats {
  id: string;
  code: string;
  signups: number;
  earnings: number;
  createdAt: string;
}

export default function AffiliationPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral/stats")
      .then((r) => r.json())
      .then((data: ReferralStats) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const refLink = stats ? `${baseUrl}/register?ref=${stats.code}` : "";

  function copyLink() {
    if (!refLink) return;
    navigator.clipboard.writeText(refLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-display font-semibold text-2xl text-white">Programme d&apos;affiliation</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Invite tes amis et gagne des récompenses à chaque inscription.
        </p>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Chargement…</p>
        </div>
      ) : stats ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-5 space-y-1">
              <p className="section-label">Inscrits via ton lien</p>
              <p className="font-data text-4xl font-bold text-white">{stats.signups}</p>
            </div>
            <div className="card p-5 space-y-1">
              <p className="section-label">Gains cumulés</p>
              <p className="font-data text-4xl font-bold" style={{ color: "var(--gold)" }}>
                {stats.earnings.toLocaleString("fr-FR")}
                <span className="text-base ml-1 font-medium" style={{ color: "var(--text-secondary)" }}>FCFA</span>
              </p>
            </div>
          </div>

          {/* Code + lien partageable */}
          <div className="card p-6 space-y-5">
            <div>
              <p className="section-label mb-2">Ton code de parrainage</p>
              <div
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl"
                style={{ background: "var(--surface-highest)" }}
              >
                <span className="font-data text-2xl font-bold tracking-widest text-white">
                  {stats.code}
                </span>
              </div>
            </div>

            <div>
              <p className="section-label mb-2">Lien partageable</p>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "var(--surface-highest)", border: "1px solid var(--border)" }}
              >
                <p className="flex-1 text-xs font-data truncate" style={{ color: "var(--text-secondary)" }}>
                  {refLink}
                </p>
                <button
                  onClick={copyLink}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: copied ? "rgba(20,241,149,0.15)" : "rgba(153,69,255,0.15)",
                    color: copied ? "var(--bullish)" : "var(--sol-purple)",
                    border: `1px solid ${copied ? "rgba(20,241,149,0.3)" : "rgba(153,69,255,0.3)"}`,
                  }}
                >
                  {copied ? "Copié ✓" : "Copier"}
                </button>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg text-white">Comment ça marche ?</h2>
            <ol className="space-y-3">
              {[
                "Partage ton lien unique avec tes amis traders.",
                "Ils s'inscrivent sur Idjortrade via ton lien.",
                "Tu gagnes une récompense à chaque inscription confirmée.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--sol-gradient)", color: "white" }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : (
        <div className="card p-8 text-center space-y-3">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Impossible de charger les stats. Réessaie.
          </p>
          <Link href="/dashboard" className="text-xs font-bold" style={{ color: "var(--bullish)" }}>
            ← Retour
          </Link>
        </div>
      )}
    </div>
  );
}
