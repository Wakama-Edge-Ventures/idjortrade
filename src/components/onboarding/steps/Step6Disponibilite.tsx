"use client";

import { sessionsOptions, objectifs } from "@/lib/mock-onboarding";
import type { OnboardingData } from "@/types/onboarding";

interface Props {
  data: Partial<OnboardingData>;
  onChange: (d: Partial<OnboardingData>) => void;
}

const heuresOptions = ['< 1h', '1-2h', '2-4h', '4-6h', '6h+'];
const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const pillActive: React.CSSProperties = { padding: "8px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: "var(--sol-gradient)", color: "white" };
const pillInactive: React.CSSProperties = { ...pillActive, background: "var(--surface-high)", color: "var(--text-secondary)" };
const chipActive: React.CSSProperties = { padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: "rgba(20,241,149,0.15)", color: "var(--bullish)", border: "1px solid rgba(20,241,149,0.3)" };
const chipInactive: React.CSSProperties = { ...chipActive, background: "var(--surface-high)", color: "var(--text-secondary)", border: "1px solid transparent" };

export default function Step6Disponibilite({ data, onChange }: Props) {
  const toggleSession = (id: string) => {
    const c = data.sessionsPreferees || [];
    onChange({ sessionsPreferees: c.includes(id) ? c.filter((s) => s !== id) : [...c, id] });
  };
  const toggleJour = (j: string) => {
    const c = data.joursDisponibles || [];
    onChange({ joursDisponibles: c.includes(j) ? c.filter((d) => d !== j) : [...c, j] });
  };

  return (
    <div className="space-y-7">
      <div className="text-center">
        <h2 className="font-display font-semibold text-2xl text-white">⏰ Tes disponibilités</h2>
      </div>

      {/* Heures/jour */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Heures par jour consacrées au trading
        </p>
        <div className="flex flex-wrap gap-2">
          {heuresOptions.map((h) => (
            <button key={h} onClick={() => onChange({ heuresParJour: h })} style={data.heuresParJour === h ? pillActive : pillInactive}>{h}</button>
          ))}
        </div>
      </div>

      {/* Sessions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>
          Sessions préférées
        </p>
        <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
          Note: Abidjan = GMT+0 (même heure que Londres en hiver)
        </p>
        <div className="flex flex-col gap-2">
          {sessionsOptions.map((s) => {
            const active = (data.sessionsPreferees || []).includes(s.id);
            return (
              <button key={s.id} onClick={() => toggleSession(s.id)}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                style={{
                  background: active ? "var(--bullish-muted)" : "var(--surface-high)",
                  border: active ? "1px solid rgba(153,69,255,0.5)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.emoji}</span>
                  <span className="text-sm font-semibold text-white">{s.label}</span>
                </div>
                <span className="text-xs font-data" style={{ color: "var(--text-secondary)" }}>{s.hours}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Jours */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Jours disponibles
        </p>
        <div className="flex flex-wrap gap-2">
          {jours.map((j) => {
            const active = (data.joursDisponibles || []).includes(j);
            return <button key={j} onClick={() => toggleJour(j)} style={active ? chipActive : chipInactive}>{j}</button>;
          })}
        </div>
      </div>

      {/* Objectif principal */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-secondary)" }}>
          Objectif principal avec Wickox
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {objectifs.map((o) => {
            const active = data.objectifPrincipal === o.id;
            return (
              <button key={o.id} onClick={() => onChange({ objectifPrincipal: o.id })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                style={{
                  background: active ? "var(--bullish-muted)" : "var(--surface-high)",
                  border: active ? "1px solid rgba(153,69,255,0.5)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                <span className="text-xl">{o.emoji}</span>
                <span className="text-sm font-semibold" style={{ color: active ? "var(--bullish)" : "var(--text-primary)" }}>{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
