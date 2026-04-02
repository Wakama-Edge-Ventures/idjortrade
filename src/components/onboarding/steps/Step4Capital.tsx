"use client";

import { useState } from "react";
import { capitalRanges, revenuRanges } from "@/lib/mock-onboarding";
import type { OnboardingData } from "@/types/onboarding";

interface Props {
  data: Partial<OnboardingData>;
  onChange: (d: Partial<OnboardingData>) => void;
}

const objectifsMensuels = ['5%', '10%', '20%', '30%', '50%+', 'Pas encore défini'];

const pillActive: React.CSSProperties = { padding: "8px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: "#00FF88", color: "#0A0E1A", border: "none" };
const pillInactive: React.CSSProperties = { ...pillActive, background: "var(--surface-high)", color: "var(--on-surface-dim)" };

// Mediane estimates for each capital range — used for risk FCFA display
const capitalMedianes: Record<string, number> = {
  '0-50k': 25000, '50k-200k': 125000, '200k-500k': 350000,
  '500k-1m': 750000, '1m+': 1500000,
};

export default function Step4Capital({ data, onChange }: Props) {
  const [risque, setRisque] = useState(1);

  const capitalBase = capitalMedianes[data.capitalDisponibleFCFA || ''] || 0;
  const riskFCFA = Math.round(capitalBase * risque / 100);

  return (
    <div className="space-y-7">
      <div className="text-center">
        <h2 className="font-headline font-bold text-2xl text-white">💰 Ton capital et tes objectifs</h2>
      </div>

      {/* Note confidentielle */}
      <div className="px-4 py-3 rounded-xl text-xs leading-relaxed"
        style={{ background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.15)", color: "var(--on-surface-dim)" }}>
        🔒 Ces informations sont strictement confidentielles. Elles permettent uniquement à Idjor de calibrer ses conseils de risk management.
      </div>

      {/* Capital */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--on-surface-dim)" }}>
          Capital disponible pour le trading
        </p>
        <div className="flex flex-col gap-2">
          {capitalRanges.map((r) => (
            <button key={r.id} onClick={() => onChange({ capitalDisponibleFCFA: r.id })}
              className="text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: data.capitalDisponibleFCFA === r.id ? "rgba(0,255,136,0.08)" : "var(--surface-high)",
                border: data.capitalDisponibleFCFA === r.id ? "1px solid rgba(0,255,136,0.4)" : "1px solid rgba(255,255,255,0.06)",
                color: data.capitalDisponibleFCFA === r.id ? "#00FF88" : "var(--on-surface)",
              }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Revenus */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--on-surface-dim)" }}>
          Revenu mensuel approximatif
        </p>
        <div className="flex flex-col gap-2">
          {revenuRanges.map((r) => (
            <button key={r.id} onClick={() => onChange({ revenuMensuelFCFA: r.id })}
              className="text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: data.revenuMensuelFCFA === r.id ? "rgba(0,255,136,0.08)" : "var(--surface-high)",
                border: data.revenuMensuelFCFA === r.id ? "1px solid rgba(0,255,136,0.4)" : "1px solid rgba(255,255,255,0.06)",
                color: data.revenuMensuelFCFA === r.id ? "#00FF88" : "var(--on-surface)",
              }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slider risque par trade */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
            Risque par trade
          </p>
          <span className="font-mono-data text-sm font-bold" style={{ color: "#00FF88" }}>
            {risque}% {capitalBase > 0 && `= ${riskFCFA.toLocaleString("fr-FR")} FCFA`}
          </span>
        </div>
        <input type="range" min="0.5" max="5" step="0.5" value={risque}
          onChange={(e) => { const v = parseFloat(e.target.value); setRisque(v); onChange({ pourcentageCapitalRisque: String(v) }); }}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: "var(--primary)", background: `linear-gradient(to right, #00FF88 0%, #00FF88 ${(risque / 5) * 100}%, var(--surface-highest) ${(risque / 5) * 100}%, var(--surface-highest) 100%)` }}
        />
        <div className="flex justify-between text-[10px]" style={{ color: "var(--on-surface-dim)" }}>
          <span>0.5%</span><span>5%</span>
        </div>
      </div>

      {/* Objectif mensuel */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--on-surface-dim)" }}>
          Rendement mensuel visé
        </p>
        <div className="flex flex-wrap gap-2">
          {objectifsMensuels.map((o) => (
            <button key={o} onClick={() => onChange({ objectifMensuelFCFA: o })}
              style={data.objectifMensuelFCFA === o ? pillActive : pillInactive}>{o}</button>
          ))}
        </div>
      </div>

      {/* Trading principal ou complémentaire */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--on-surface-dim)" }}>
          Le trading est-il ton revenu principal ?
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={() => onChange({ tradingEstRevenuPrincipal: true })}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={data.tradingEstRevenuPrincipal === true
              ? { background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.4)", color: "#00FF88" }
              : { background: "var(--surface-high)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--on-surface-dim)" }}>
            {"Oui, c'est mon objectif"}
          </button>
          <button onClick={() => onChange({ tradingEstRevenuPrincipal: false })}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={data.tradingEstRevenuPrincipal === false
              ? { background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.4)", color: "#00FF88" }
              : { background: "var(--surface-high)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--on-surface-dim)" }}>
            {"Non, c'est complémentaire"}
          </button>
        </div>
      </div>
    </div>
  );
}
