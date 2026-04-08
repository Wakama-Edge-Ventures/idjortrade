"use client";

import { marchesOptions, stylesTrading } from "@/lib/mock-onboarding";
import type { OnboardingData } from "@/types/onboarding";

interface Props {
  data: Partial<OnboardingData>;
  onChange: (d: Partial<OnboardingData>) => void;
}

const plateformesOptions = ['Binance', 'Bybit', 'MT4/MT5', 'TradingView', 'OKX', 'Autre', "Aucune pour l'instant"];
const chipActive: React.CSSProperties = { padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: "rgba(20,241,149,0.15)", color: "var(--bullish)", border: "1px solid rgba(20,241,149,0.3)" };
const chipInactive: React.CSSProperties = { ...chipActive, background: "var(--surface-high)", color: "var(--text-secondary)", border: "1px solid transparent" };
const pillActive: React.CSSProperties = { padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, cursor: "pointer", background: "var(--sol-gradient)", color: "white", border: "1px solid var(--bullish)" };
const pillInactive: React.CSSProperties = { ...pillActive, background: "var(--surface-high)", color: "var(--text-secondary)", border: "1px solid transparent" };

export default function Step3Marches({ data, onChange }: Props) {
  const toggleMarche = (id: string) => {
    const c = data.marchesTraites || [];
    onChange({ marchesTraites: c.includes(id) ? c.filter((m) => m !== id) : [...c, id] });
  };
  const togglePlateforme = (id: string) => {
    const c = data.plateformesUtilisees || [];
    onChange({ plateformesUtilisees: c.includes(id) ? c.filter((p) => p !== id) : [...c, id] });
  };

  return (
    <div className="space-y-7">
      <div className="text-center">
        <h2 className="font-display font-semibold text-2xl text-white">🌍 Tes marchés de trading</h2>
      </div>

      {/* Marchés tradés */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Sur quels marchés as-tu déjà tradé ? (multi-select)
        </p>
        <div className="flex flex-wrap gap-2">
          {marchesOptions.map((m) => {
            const active = (data.marchesTraites || []).includes(m.id);
            return (
              <button key={m.id} onClick={() => toggleMarche(m.id)} style={active ? chipActive : chipInactive}>
                {m.emoji} {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Marché préféré */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Ton marché préféré
        </p>
        <div className="flex flex-wrap gap-2">
          {marchesOptions.map((m) => (
            <button key={m.id} onClick={() => onChange({ marchePrefere: m.id })}
              style={data.marchePrefere === m.id ? pillActive : pillInactive}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Style de trading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Ton style de trading
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stylesTrading.map((s) => {
            const active = data.styleTrading === s.id;
            return (
              <button key={s.id} onClick={() => onChange({ styleTrading: s.id as OnboardingData['styleTrading'] })}
                className="text-left p-4 rounded-2xl transition-all"
                style={{
                  background: active ? "var(--bullish-muted)" : "var(--surface-high)",
                  border: active ? "1px solid rgba(153,69,255,0.5)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-[10px] font-data px-1.5 py-0.5 rounded"
                    style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}>
                    {s.timeframe}
                  </span>
                </div>
                <p className="font-bold text-sm text-white">{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plateformes */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Plateformes utilisées
        </p>
        <div className="flex flex-wrap gap-2">
          {plateformesOptions.map((p) => {
            const active = (data.plateformesUtilisees || []).includes(p);
            return <button key={p} onClick={() => togglePlateforme(p)} style={active ? chipActive : chipInactive}>{p}</button>;
          })}
        </div>
      </div>
    </div>
  );
}
