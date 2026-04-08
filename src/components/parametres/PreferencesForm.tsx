"use client";

import { useState, useEffect } from "react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{
        background: on ? "rgba(20,241,149,0.25)" : "var(--surface-high)",
        border: on ? "1px solid rgba(153,69,255,0.5)" : "1px solid var(--border)",
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
        style={{
          background: on ? "var(--bullish)" : "var(--text-secondary)",
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
              ? { background: "rgba(20,241,149,0.15)", color: "var(--bullish)", border: "1px solid rgba(20,241,149,0.3)" }
              : { background: "var(--surface-highest)", color: "var(--text-secondary)", border: "1px solid transparent" }
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
  const [savedMsg, setSavedMsg] = useState(false);

  // Load preferences from the API on mount
  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        const p = data.profile;
        if (!p) return;
        if (p.devise) setDevise(p.devise);
        if (p.langue) setLangue(p.langue === "fr" ? "🇫🇷 Français" : "🇬🇧 English");
        if (p.modeAnalyse) setModeAnalyse(p.modeAnalyse === "rapide" ? "Rapide" : "Approfondi");
        if (p.risqueDefaut !== null && p.risqueDefaut !== undefined) setRisque(p.risqueDefaut);
        if (p.notifPush !== null) setNotifPush(p.notifPush);
        if (p.resumeEmail !== null) setEmailQuot(p.resumeEmail);
        if (p.alerteMarche !== null) setAlertesMarche(p.alerteMarche);
      })
      .catch(() => {});
  }, []);

  // Auto-save a patch to the API and show confirmation
  async function savePrefs(patch: Record<string, unknown>) {
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2000);
    } catch { /* ignore */ }
  }

  const rowClass = "flex items-center justify-between py-4";
  const separatorStyle: React.CSSProperties = { borderTop: "1px solid rgba(255,255,255,0.05)" };
  const labelStyle = "text-sm font-semibold text-white";
  const subStyle: React.CSSProperties = { fontSize: "11px", color: "var(--text-secondary)" };

  return (
    <div className="space-y-1 max-w-lg">

      {/* Saved confirmation */}
      {savedMsg && (
        <p className="text-xs font-semibold" style={{ color: "var(--bullish)" }}>
          Sauvegardé ✓
        </p>
      )}

      <div className={rowClass}>
        <div>
          <p className={labelStyle}>Devise</p>
          <p style={subStyle}>Affichage des montants</p>
        </div>
        <ButtonGroup
          options={["FCFA", "USD"]}
          value={devise}
          onChange={(v) => { setDevise(v); savePrefs({ devise: v }); }}
        />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div>
          <p className={labelStyle}>Langue</p>
          <p style={subStyle}>Interface et analyses</p>
        </div>
        <ButtonGroup
          options={["🇫🇷 Français", "🇬🇧 English"]}
          value={langue}
          onChange={(v) => { setLangue(v); savePrefs({ langue: v === "🇫🇷 Français" ? "fr" : "en" }); }}
        />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div>
          <p className={labelStyle}>Mode analyse</p>
          <p style={subStyle}>Défaut pour les nouvelles analyses</p>
        </div>
        <ButtonGroup
          options={["Rapide", "Approfondi"]}
          value={modeAnalyse}
          onChange={(v) => { setModeAnalyse(v); savePrefs({ modeAnalyse: v === "Rapide" ? "rapide" : "approfondi" }); }}
        />
      </div>

      <div style={separatorStyle} className="py-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className={labelStyle}>Risque par trade</p>
            <p style={subStyle}>{risque}% du capital</p>
          </div>
          <span className="font-data text-sm font-bold" style={{ color: "var(--bullish)" }}>{risque}%</span>
        </div>
        <input
          type="range"
          min="0.25"
          max="5"
          step="0.25"
          value={risque}
          onChange={(e) => setRisque(parseFloat(e.target.value))}
          onMouseUp={() => savePrefs({ risqueDefaut: risque })}
          onTouchEnd={() => savePrefs({ risqueDefaut: risque })}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            accentColor: "var(--sol-purple)",
            background: `linear-gradient(to right, #14F195 0%, #14F195 ${(risque / 5) * 100}%, var(--surface-highest) ${(risque / 5) * 100}%, var(--surface-highest) 100%)`,
          }}
        />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div>
          <p className={labelStyle}>Notifications push</p>
          <p style={subStyle}>Signaux et alertes temps réel</p>
        </div>
        <Toggle
          on={notifPush}
          onToggle={() => { setNotifPush(!notifPush); savePrefs({ notifPush: !notifPush }); }}
        />
      </div>

      <div style={separatorStyle} className={rowClass}>
        <div>
          <p className={labelStyle}>Résumé email quotidien</p>
          <p style={subStyle}>Récap de votre journée trading</p>
        </div>
        <Toggle
          on={emailQuot}
          onToggle={() => { setEmailQuot(!emailQuot); savePrefs({ resumeEmail: !emailQuot }); }}
        />
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
        <Toggle
          on={alertesMarche}
          onToggle={() => { setAlertesMarche(!alertesMarche); savePrefs({ alerteMarche: !alertesMarche }); }}
        />
      </div>

    </div>
  );
}
