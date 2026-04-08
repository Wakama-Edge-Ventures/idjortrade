"use client";

import { niveaux } from "@/lib/mock-onboarding";
import type { OnboardingData } from "@/types/onboarding";

interface Props {
  data: Partial<OnboardingData>;
  onChange: (d: Partial<OnboardingData>) => void;
}

const anneesOptions = [{ id: '0', label: 'Jamais' }, { id: '1-2', label: '1-2 ans' }, { id: '3-5', label: '3-5 ans' }, { id: '5+', label: '5+ ans' }];
const sourceOptions = ['YouTube', 'Formation payante', 'Livre', 'Ami/communauté', 'Autodidacte', "Pas encore appris"];

const pillBase: React.CSSProperties = { padding: "8px 16px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", border: "1px solid transparent" };
const pillActive: React.CSSProperties = { ...pillBase, background: "var(--sol-gradient)", color: "white", border: "1px solid var(--bullish)" };
const pillInactive: React.CSSProperties = { ...pillBase, background: "var(--surface-high)", color: "var(--text-secondary)" };
const chipBase: React.CSSProperties = { padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", border: "1px solid transparent" };
const chipActive: React.CSSProperties = { ...chipBase, background: "rgba(20,241,149,0.15)", color: "var(--bullish)", border: "1px solid rgba(20,241,149,0.3)" };
const chipInactive: React.CSSProperties = { ...chipBase, background: "var(--surface-high)", color: "var(--text-secondary)" };

export default function Step2Experience({ data, onChange }: Props) {
  const toggleSource = (id: string) => {
    const current = data.sourceApprentissage || [];
    onChange({ sourceApprentissage: current.includes(id) ? current.filter((s) => s !== id) : [...current, id] });
  };

  return (
    <div className="space-y-7">
      <div className="text-center space-y-2">
        <h2 className="font-display font-semibold text-2xl text-white">📊 Ton niveau de trading</h2>
      </div>

      {/* Niveau */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {niveaux.map((n) => {
          const active = data.niveauTrading === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onChange({ niveauTrading: n.id as OnboardingData['niveauTrading'] })}
              className="text-left p-4 rounded-2xl transition-all"
              style={{
                background: active ? "var(--bullish-muted)" : "var(--surface-high)",
                border: active ? "1px solid rgba(153,69,255,0.5)" : "1px solid rgba(255,255,255,0.06)",
                boxShadow: active ? "0 0 10px rgba(20,241,149,0.2)" : "none",
              }}
            >
              <div className="text-2xl mb-2">{n.emoji}</div>
              <p className="font-bold text-sm text-white">{n.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{n.description}</p>
            </button>
          );
        })}
      </div>

      {/* Ancienneté */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Depuis combien de temps tu trades ?
        </p>
        <div className="flex flex-wrap gap-2">
          {anneesOptions.map((o) => (
            <button key={o.id} onClick={() => onChange({ anneesExperience: o.id as OnboardingData['anneesExperience'] })}
              style={data.anneesExperience === o.id ? pillActive : pillInactive}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* A déjà perdu */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          As-tu déjà perdu une somme importante en tradant ?
        </p>
        <div className="flex gap-2">
          <button onClick={() => onChange({ aDejaPerduCapital: true })} style={data.aDejaPerduCapital === true ? pillActive : pillInactive}>Oui</button>
          <button onClick={() => onChange({ aDejaPerduCapital: false })} style={data.aDejaPerduCapital === false ? pillActive : pillInactive}>Non</button>
        </div>
      </div>

      {/* Sources */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Comment as-tu appris le trading ? (plusieurs choix)
        </p>
        <div className="flex flex-wrap gap-2">
          {sourceOptions.map((s) => {
            const active = (data.sourceApprentissage || []).includes(s);
            return <button key={s} onClick={() => toggleSource(s)} style={active ? chipActive : chipInactive}>{s}</button>;
          })}
        </div>
      </div>
    </div>
  );
}
