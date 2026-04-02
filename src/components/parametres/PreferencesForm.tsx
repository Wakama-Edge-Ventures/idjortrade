"use client";

import { useState } from "react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{
        background: on ? "rgba(0,255,136,0.25)" : "var(--surface-high)",
        border: on ? "1px solid rgba(0,255,136,0.4)" : "1px solid var(--outline)",
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
        style={{
          background: on ? "#00FF88" : "var(--on-surface-dim)",
          transform: on ? "translateX(22px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}

function ButtonGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          style={
            value === opt
              ? { background: "rgba(0,255,136,0.15)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.3)" }
              : { background: "var(--surface-highest)", color: "var(--on-surface-dim)", border: "1px solid transparent" }
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function PreferencesForm() {
  const [devise, setDevise] = useState("FCFA");
  const [langue, setLangue] = useState("🇫🇷 Français");
  const [modeAnalyse, setModeAnalyse] = useState("Rapide");
  const [risque, setRisque] = useState(1);
  const [notifPush, setNotifPush] = useState(true);
  const [emailQuot, setEmailQuot] = useState(false);
  const [alertesMarche, setAlertesMarche] = useState(false);

  const rowClass = "flex items-center justify-between py-4";
  const separatorStyle: React.CSSProperties = { borderTop: "1px solid rgba(255,255,255,0.05)" };
  const labelStyle = "text-sm font-semibold text-white";
  const subStyle: React.CSSProperties = { fontSize: "11px", color: "var(--on-surface-dim)" };

  return (
    <div className="space-y-1 max-w-lg">

      <div className={rowClass}>
        <div>
          <p className={labelStyle}>Devise</p>
          <p style={subStyle}>Affichage des montants</p>
        </div>
        <ButtonGroup options={["FCFA", "USD"]} value={devise} onChange={setDevise} />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div>
          <p className={labelStyle}>Langue</p>
          <p style={subStyle}>Interface et analyses</p>
        </div>
        <ButtonGroup options={["🇫🇷 Français", "🇬🇧 English"]} value={langue} onChange={setLangue} />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div>
          <p className={labelStyle}>Mode analyse</p>
          <p style={subStyle}>Défaut pour les nouvelles analyses</p>
        </div>
        <ButtonGroup options={["Rapide", "Approfondi"]} value={modeAnalyse} onChange={setModeAnalyse} />
      </div>

      <div style={separatorStyle} className="py-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className={labelStyle}>Risque par trade</p>
            <p style={subStyle}>{risque}% du capital</p>
          </div>
          <span className="font-mono-data text-sm font-bold" style={{ color: "#00FF88" }}>{risque}%</span>
        </div>
        <input
          type="range"
          min="0.25" max="5" step="0.25"
          value={risque}
          onChange={(e) => setRisque(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            accentColor: "var(--primary)",
            background: `linear-gradient(to right, #00FF88 0%, #00FF88 ${(risque / 5) * 100}%, var(--surface-highest) ${(risque / 5) * 100}%, var(--surface-highest) 100%)`,
          }}
        />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div>
          <p className={labelStyle}>Notifications push</p>
          <p style={subStyle}>Signaux et alertes temps réel</p>
        </div>
        <Toggle on={notifPush} onToggle={() => setNotifPush(!notifPush)} />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div>
          <p className={labelStyle}>Résumé email quotidien</p>
          <p style={subStyle}>Récap de votre journée trading</p>
        </div>
        <Toggle on={emailQuot} onToggle={() => setEmailQuot(!emailQuot)} />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div className="flex items-center gap-2">
          <div>
            <p className={labelStyle}>Alertes marché</p>
            <p style={subStyle}>Mouvements importants des actifs</p>
          </div>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623" }}
          >
            PRO
          </span>
        </div>
        <Toggle on={alertesMarche} onToggle={() => setAlertesMarche(!alertesMarche)} />
      </div>

    </div>
  );
}
