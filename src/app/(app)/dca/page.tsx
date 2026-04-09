"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import WeexBanner from "@/components/shared/WeexBanner";

/* ── Types ──────────────────────────────────────────────────────────────── */
type Asset = "BTC" | "ETH" | "SOL" | "XRP" | "OR";
type Frequency = "hebdo" | "mensuel";

interface SimRow {
  date: string;
  montantPeriode: number;
  totalInvesti: number;
  prixFCFA: number;
  qteCettePeriode: number;
  totalAccumule: number;
  valeurActuelle: number;
}

/* ── Prix historiques hardcodés (USD) — 12 mois ────────────────────────── */
const USD_TO_FCFA = 620;

const PRICES_USD: Record<Asset, number[]> = {
  BTC: [65000, 68000, 72000, 69000, 75000, 82000, 78000, 85000, 91000, 87000, 94000, 98000],
  ETH: [3200,  3400,  3600,  3300,  3700,  4000,  3800,  4200,  4500,  4300,  4700,  5100],
  SOL: [140,   155,   168,   145,   172,   195,   182,   210,   235,   220,   248,   265],
  XRP: [0.52,  0.58,  0.65,  0.55,  0.70,  0.85,  0.78,  0.92,  1.05,  0.98,  1.15,  1.28],
  OR:  [2050,  2100,  2200,  2180,  2250,  2320,  2290,  2380,  2450,  2410,  2500,  2580],
};

const ASSET_LABELS: Record<Asset, string> = {
  BTC: "Bitcoin (BTC)",
  ETH: "Ethereum (ETH)",
  SOL: "Solana (SOL)",
  XRP: "Ripple (XRP)",
  OR: "Or (XAU)",
};

/* ── Génère les 12 labels de date ──────────────────────────────────────── */
function buildDateLabels(count: number, freq: Frequency): string[] {
  const labels: string[] = [];
  const now = new Date();
  const monthsFR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

  if (freq === "mensuel") {
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(`${monthsFR[d.getMonth()]}. ${d.getFullYear()}`);
    }
  } else {
    // hebdo — juste numéroter les semaines en remontant
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      labels.push(`S${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
  }
  return labels;
}

/* ── Simulation ─────────────────────────────────────────────────────────── */
function simulate(asset: Asset, montant: number, freq: Frequency): SimRow[] {
  const prices = PRICES_USD[asset];
  const count = prices.length; // 12
  const labels = buildDateLabels(count, freq);
  const rows: SimRow[] = [];
  let totalInvesti = 0;
  let totalAccumule = 0;
  const currentPrice = prices[prices.length - 1] * USD_TO_FCFA;

  for (let i = 0; i < count; i++) {
    totalInvesti += montant;
    const prixFCFA = prices[i] * USD_TO_FCFA;
    const qteCettePeriode = montant / prixFCFA;
    totalAccumule += qteCettePeriode;
    const valeurActuelle = totalAccumule * currentPrice;

    rows.push({
      date: labels[i],
      montantPeriode: montant,
      totalInvesti,
      prixFCFA,
      qteCettePeriode,
      totalAccumule,
      valeurActuelle,
    });
  }
  return rows;
}

/* ── Formatters ─────────────────────────────────────────────────────────── */
function fmtFCFA(n: number) {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " FCFA";
}
function fmtQte(n: number, asset: Asset) {
  const digits = ["XRP", "SOL"].includes(asset) ? 4 : asset === "OR" ? 4 : 6;
  return n.toLocaleString("fr-FR", { maximumFractionDigits: digits });
}
function fmtPrix(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M FCFA";
  if (n >= 1_000) return Math.round(n).toLocaleString("fr-FR") + " FCFA";
  return n.toFixed(2) + " FCFA";
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function DCAPage() {
  const { status } = useSession();
  if (status === "unauthenticated") {
    redirect("/login");
  }

  const [asset, setAsset] = useState<Asset>("BTC");
  const [montant, setMontant] = useState<number>(5000);
  const [freq, setFreq] = useState<Frequency>("hebdo");
  const [rows, setRows] = useState<SimRow[] | null>(null);

  const WEEX_URL = process.env.NEXT_PUBLIC_WEEX_AFFILIATE_URL ?? "";

  function handleSimuler() {
    if (montant < 1000) return;
    setRows(simulate(asset, montant, freq));
  }

  const lastRow = rows?.[rows.length - 1];
  const gainFCFA = lastRow ? lastRow.valeurActuelle - lastRow.totalInvesti : 0;
  const gainPct = lastRow ? ((gainFCFA / lastRow.totalInvesti) * 100) : 0;
  const isGain = gainFCFA >= 0;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-display font-semibold text-2xl text-white">
          Investissement DCA
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Simule une stratégie d&apos;achat régulier sur 12 périodes avec des prix historiques réalistes.
        </p>
      </div>

      {/* Formulaire */}
      <div className="card p-6 space-y-5">
        <h2 className="font-display font-semibold text-base text-white">Paramètres de simulation</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Actif */}
          <div className="space-y-1.5">
            <label className="section-label block">Actif</label>
            <select
              value={asset}
              onChange={e => setAsset(e.target.value as Asset)}
              className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-colors"
              style={{
                background: "var(--surface-highest)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              {(Object.entries(ASSET_LABELS) as [Asset, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Montant */}
          <div className="space-y-1.5">
            <label className="section-label block">Montant par période (FCFA)</label>
            <div className="relative">
              <input
                type="number"
                min={1000}
                step={500}
                value={montant}
                onChange={e => setMontant(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-colors"
                style={{
                  background: "var(--surface-highest)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                placeholder="5 000"
              />
            </div>
            {montant > 0 && montant < 1000 && (
              <p className="text-xs" style={{ color: "var(--bearish)" }}>Minimum 1 000 FCFA</p>
            )}
          </div>

          {/* Fréquence */}
          <div className="space-y-1.5">
            <label className="section-label block">Fréquence</label>
            <div className="flex gap-2">
              {(["hebdo", "mensuel"] as Frequency[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFreq(f)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: freq === f ? "rgba(20,241,149,0.12)" : "var(--surface-highest)",
                    color: freq === f ? "var(--bullish)" : "var(--text-secondary)",
                    border: freq === f ? "1px solid rgba(20,241,149,0.3)" : "1px solid var(--border)",
                  }}
                >
                  {f === "hebdo" ? "Hebdo" : "Mensuel"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSimuler}
          disabled={montant < 1000}
          className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            background: montant >= 1000 ? "var(--sol-gradient)" : "var(--surface-highest)",
            color: montant >= 1000 ? "white" : "var(--text-tertiary)",
            cursor: montant >= 1000 ? "pointer" : "not-allowed",
          }}
        >
          Simuler →
        </button>
      </div>

      {/* Résultats */}
      {rows && lastRow && (
        <>
          {/* Résumé */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card p-4 space-y-1">
              <p className="section-label">Total investi</p>
              <p className="font-data text-lg font-bold text-white">
                {fmtFCFA(lastRow.totalInvesti)}
              </p>
            </div>
            <div className="card p-4 space-y-1">
              <p className="section-label">Valeur actuelle</p>
              <p className="font-data text-lg font-bold" style={{ color: "var(--bullish)" }}>
                {fmtFCFA(Math.round(lastRow.valeurActuelle))}
              </p>
            </div>
            <div className="card p-4 space-y-1">
              <p className="section-label">Gain / Perte</p>
              <p
                className="font-data text-lg font-bold"
                style={{ color: isGain ? "var(--bullish)" : "var(--bearish)" }}
              >
                {isGain ? "+" : ""}{fmtFCFA(Math.round(gainFCFA))}
              </p>
            </div>
            <div className="card p-4 space-y-1">
              <p className="section-label">Performance</p>
              <p
                className="font-data text-lg font-bold"
                style={{ color: isGain ? "var(--bullish)" : "var(--bearish)" }}
              >
                {isGain ? "+" : ""}{gainPct.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Tableau */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-display font-semibold text-base text-white">
                Historique période par période
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {ASSET_LABELS[asset]} — {freq === "hebdo" ? "52 semaines" : "12 mois"} (affichage 12 périodes)
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-low)" }}>
                    {["Date", "Investi/pér.", "Prix actif", "Qté achetée", "Total accumulé", "Valeur actuelle"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const isLast = i === rows.length - 1;
                    const rowGain = row.valeurActuelle - row.totalInvesti;
                    return (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          background: isLast ? "rgba(20,241,149,0.04)" : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                        }}
                      >
                        <td className="px-4 py-3 font-medium whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                          {row.date}
                        </td>
                        <td className="px-4 py-3 font-data whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                          {fmtFCFA(row.montantPeriode)}
                        </td>
                        <td className="px-4 py-3 font-data whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                          {fmtPrix(row.prixFCFA)}
                        </td>
                        <td className="px-4 py-3 font-data whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                          {fmtQte(row.qteCettePeriode, asset)}
                        </td>
                        <td className="px-4 py-3 font-data whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                          {fmtQte(row.totalAccumule, asset)}
                        </td>
                        <td
                          className="px-4 py-3 font-data font-semibold whitespace-nowrap"
                          style={{ color: rowGain >= 0 ? "var(--bullish)" : "var(--bearish)" }}
                        >
                          {fmtFCFA(Math.round(row.valeurActuelle))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                * Prix historiques estimatifs à titre indicatif. La performance passée ne préjuge pas des résultats futurs.
                Les prix sont exprimés en FCFA au taux indicatif 1 USD = {USD_TO_FCFA} FCFA.
              </p>
            </div>
          </div>
        </>
      )}

      {/* CTA Weex */}
      <div className="space-y-3">
        {WEEX_URL && (
          <Link
            href={WEEX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, rgba(20,241,149,0.15) 0%, rgba(20,241,149,0.08) 100%)",
              border: "1px solid rgba(20,241,149,0.3)",
              color: "var(--bullish)",
            }}
          >
            Commence ton DCA sur Weex →
          </Link>
        )}
        <WeexBanner />
      </div>
    </div>
  );
}
