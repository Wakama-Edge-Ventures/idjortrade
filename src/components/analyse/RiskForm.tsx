"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { TIMEFRAME_GROUPS, defaultTimeframeForMode } from "@/lib/timeframes";
import type { TradingMode } from "@/lib/timeframes";

export type RiskFormData = {
  asset: string;
  timeframe: string;
  capitalFCFA: number;
  risquePct: number;
  ratioRR: number;
  marche: string;
  tradingMode: TradingMode;
};

export type RiskFormRef = {
  getFormData: () => RiskFormData | null;
};

interface RiskFormProps {
  mode: "swing" | "scalp";
}
const marches = ["Crypto", "Forex", "Actions", "Indices"];
const rrOptions = ["1:1", "1:2", "1:3", "Custom"];
const modesAnalyse = ["⚡ Rapide", "🔬 Approfondi"];
const FCFA_PER_USD = 655;

const defaultTradingMode = (mode: "swing" | "scalp"): TradingMode =>
  mode === "swing" ? "swing" : "scalp";

const RiskForm = forwardRef<RiskFormRef, RiskFormProps>(
  function RiskForm({ mode }, ref) {
    const [asset, setAsset] = useState("");
    const [capital, setCapital] = useState("");
    const [risque, setRisque] = useState(1);
    const [rr, setRr] = useState("1:2");
    const [marche, setMarche] = useState("Crypto");
    const [tradingMode, setTradingMode] = useState<TradingMode>(defaultTradingMode(mode));
    const [timeframe, setTimeframe] = useState(defaultTimeframeForMode(defaultTradingMode(mode)));
    const [modeAnalyse, setModeAnalyse] = useState("⚡ Rapide");

    const capitalNum = parseFloat(capital.replace(/\s/g, "")) || 250000;
    const riskFCFA = Math.round(capitalNum * risque / 100);
    const rrNum = rr === "Custom" ? 2 : parseInt(rr.split(":")[1]);
    const gainFCFA = riskFCFA * rrNum;
    const capitalUSD = Math.round(capitalNum / FCFA_PER_USD);

    const currentGroup = TIMEFRAME_GROUPS.find(g => g.mode === tradingMode) ?? TIMEFRAME_GROUPS[0];

    function handleTradingModeChange(newMode: TradingMode) {
      setTradingMode(newMode);
      setTimeframe(defaultTimeframeForMode(newMode));
    }

    useImperativeHandle(ref, () => ({
      getFormData: () => {
        if (!asset.trim()) return null;
        return {
          asset: asset.trim().toUpperCase(),
          timeframe,
          capitalFCFA: capitalNum || 100000,
          risquePct: risque,
          ratioRR: rrNum,
          marche,
          tradingMode,
        };
      },
    }));

    const btnBase = "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer";
    const btnActive = { background: "rgba(0,255,136,0.15)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.3)" };
    const btnInactive = { background: "var(--surface-highest)", color: "var(--on-surface-dim)", border: "1px solid transparent" };

    return (
      <div className="space-y-5">

        {/* Actif */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Actif *
          </label>
          <input
            type="text"
            value={asset}
            onChange={e => setAsset(e.target.value)}
            placeholder="Ex: SOL/USDT, BTC/USDT, EUR/USD"
            className="w-full rounded-xl px-4 py-3 text-sm font-mono-data text-white outline-none transition-colors"
            style={{ background: "var(--surface-highest)", border: "1px solid var(--outline)" }}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = "rgba(0,255,136,0.4)"; }}
            onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--outline)"; }}
          />
        </div>

        {/* Capital */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Capital disponible
          </label>
          <div className="relative">
            <input
              type="number"
              value={capital}
              onChange={e => setCapital(e.target.value)}
              placeholder="250 000"
              className="w-full rounded-xl px-4 py-3 text-sm font-mono-data text-white outline-none transition-colors"
              style={{ background: "var(--surface-highest)", border: "1px solid var(--outline)" }}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = "rgba(0,255,136,0.4)"; }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--outline)"; }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--on-surface-dim)" }}>
              FCFA
            </span>
          </div>
          {capitalNum > 0 && (
            <p className="text-xs" style={{ color: "var(--on-surface-dim)" }}>
              ≈ ${capitalUSD.toLocaleString("fr-FR")} USD
            </p>
          )}
        </div>

        {/* Risque */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--on-surface-dim)" }}>
              Risque par trade
            </label>
            <span className="text-sm font-bold font-mono-data" style={{ color: "#00FF88" }}>
              {risque}% {capitalNum > 0 && `= ${riskFCFA.toLocaleString("fr-FR")} FCFA`}
            </span>
          </div>
          <input
            type="range" min="0.25" max="5" step="0.25"
            value={risque}
            onChange={e => setRisque(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              accentColor: "var(--primary)",
              background: `linear-gradient(to right, #00FF88 0%, #00FF88 ${(risque/5)*100}%, var(--surface-highest) ${(risque/5)*100}%, var(--surface-highest) 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px]" style={{ color: "var(--on-surface-dim)" }}>
            <span>0.25%</span><span>5%</span>
          </div>
        </div>

        {/* R/R */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Ratio R/R
          </label>
          <div className="flex gap-2 flex-wrap">
            {rrOptions.map(opt => (
              <button key={opt} className={btnBase}
                style={rr === opt ? btnActive : btnInactive}
                onClick={() => setRr(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Marché */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Marché
          </label>
          <div className="flex gap-2 flex-wrap">
            {marches.map(m => (
              <button key={m} className={btnBase}
                style={marche === m ? btnActive : btnInactive}
                onClick={() => setMarche(m)}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Trading Mode + Timeframe */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Style · Timeframe
          </label>
          {/* Mode pills */}
          <div className="flex gap-1.5">
            {TIMEFRAME_GROUPS.map(g => (
              <button key={g.mode} className={btnBase}
                style={tradingMode === g.mode ? btnActive : btnInactive}
                onClick={() => handleTradingModeChange(g.mode)}>
                {g.label}
              </button>
            ))}
          </div>
          {/* Timeframe pills — scrollable */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {currentGroup.frames.map((tf: string) => (
              <button key={tf}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                style={timeframe === tf ? btnActive : btnInactive}
                onClick={() => setTimeframe(tf)}>
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Mode analyse */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Mode analyse
          </label>
          <div className="flex gap-2">
            {modesAnalyse.map(m => (
              <button key={m} className={btnBase}
                style={modeAnalyse === m ? btnActive : btnInactive}
                onClick={() => setModeAnalyse(m)}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Récap live */}
        {capitalNum > 0 && (
          <div className="rounded-xl px-4 py-3"
            style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)" }}>
            <p className="text-xs font-mono-data" style={{ color: "var(--on-surface-dim)" }}>
              Risque:{" "}
              <span style={{ color: "#FF3B5C" }}>{riskFCFA.toLocaleString("fr-FR")} FCFA</span>
              {" → "}Gain cible:{" "}
              <span style={{ color: "#00FF88" }}>{gainFCFA.toLocaleString("fr-FR")} FCFA</span>
              {" "}({rr === "Custom" ? "Custom" : rr})
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--outline)", color: "var(--on-surface-dim)" }}
            onClick={() => {
              setAsset(""); setCapital(""); setRisque(1); setRr("1:2");
              setMarche("Crypto");
              setTimeframe(mode === "swing" ? "D1" : "M5");
              setModeAnalyse("⚡ Rapide");
            }}
          >
            Réinitialiser
          </button>
          <button
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{ border: "1px solid rgba(0,255,136,0.3)", color: "#00FF88" }}
          >
            Sauvegarder défaut
          </button>
        </div>

      </div>
    );
  }
);

export default RiskForm;
