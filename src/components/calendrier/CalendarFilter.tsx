"use client";

import { useState } from "react";

const periodes = ["Aujourd'hui", 'Cette semaine', 'Tout'];
const impacts = ['Tous', '🔴 Fort', '🟡 Moyen', '🟢 Faible'];
const devises = ['Tous', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const tabActive: React.CSSProperties = { padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: "var(--surface-highest)", color: "var(--on-surface)", border: "none" };
const tabInactive: React.CSSProperties = { ...tabActive, background: "transparent", color: "var(--on-surface-dim)" };
const chipActive: React.CSSProperties = { padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, cursor: "pointer", background: "rgba(0,255,136,0.15)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.3)" };
const chipInactive: React.CSSProperties = { ...chipActive, background: "var(--surface-high)", color: "var(--on-surface-dim)", border: "1px solid transparent" };

export default function CalendarFilter() {
  const [periode, setPeriode] = useState("Aujourd'hui");
  const [impact, setImpact] = useState("Tous");
  const [devise, setDevise] = useState("Tous");

  return (
    <div className="space-y-3">
      {/* Period tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--surface-high)" }}>
        {periodes.map((p) => (
          <button key={p} onClick={() => setPeriode(p)} style={periode === p ? tabActive : tabInactive}>{p}</button>
        ))}
      </div>

      {/* Impact and currency filter chips */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold self-center" style={{ color: "var(--on-surface-dim)" }}>Impact:</span>
        {impacts.map((i) => <button key={i} onClick={() => setImpact(i)} style={impact === i ? chipActive : chipInactive}>{i}</button>)}
        <span className="text-xs font-semibold self-center ml-2" style={{ color: "var(--on-surface-dim)" }}>Devise:</span>
        {devises.map((d) => <button key={d} onClick={() => setDevise(d)} style={devise === d ? chipActive : chipInactive}>{d}</button>)}
      </div>
    </div>
  );
}
