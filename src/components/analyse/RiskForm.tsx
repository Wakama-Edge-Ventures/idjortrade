"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
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
  productType: "spot" | "futures";
  platform: string;
  currentPrice?: number;
};

export type RiskFormRef = {
  getFormData: () => RiskFormData | null;
};

interface RiskFormProps {
  mode: "swing" | "scalp" | "day";
}

const marches = ["Crypto", "Forex", "Actions", "Indices"];
const rrOptions = ["1:1", "1:2", "1:3", "Custom"];
const modesAnalyse = ["⚡ Rapide", "🔬 Approfondi"];
const FCFA_PER_USD = 655;

const PLATFORMS = ["Binance", "Bybit", "OKX", "Kraken", "Coinbase", "MT4/MT5", "TradingView", "Autre"];

const ASSET_SUGGESTIONS = [
  "BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT",
  "ADA/USDT", "AVAX/USDT", "MATIC/USDT", "DOT/USDT", "LINK/USDT",
  "DOGE/USDT", "TRX/USDT", "LTC/USDT", "BCH/USDT",
  "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "EUR/GBP",
  "XAU/USD", "XAG/USD", "USOIL",
  "AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN",
];

function normalizeSymbol(s: string): string {
  return s.replace("/USDT", "/USD").replace("/BUSD", "/USD").toUpperCase();
}

const defaultTradingMode = (mode: "swing" | "scalp" | "day"): TradingMode =>
  mode === "swing" ? "swing" : mode === "day" ? "day" : "scalp";

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
    const [productType, setProductType] = useState<"spot" | "futures">("spot");
    const [platform, setPlatform] = useState("Binance");
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceLoading, setPriceLoading] = useState(false);
    const [priceFailed, setPriceFailed] = useState(false);
    const [manualPrice, setManualPrice] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const assetRef = useRef<HTMLDivElement>(null);

    const capitalNum = parseFloat(capital.replace(/\s/g, "")) || 250000;
    const riskFCFA = Math.round(capitalNum * risque / 100);
    const rrNum = rr === "Custom" ? 2 : parseInt(rr.split(":")[1]);
    const gainFCFA = riskFCFA * rrNum;
    const capitalUSD = Math.round(capitalNum / FCFA_PER_USD);

    const currentGroup = TIMEFRAME_GROUPS.find(g => g.mode === tradingMode) ?? TIMEFRAME_GROUPS[0];

    // Auto-fetch price when asset changes
    useEffect(() => {
      const trimmed = asset.trim();
      if (!trimmed) {
        setCurrentPrice(null);
        setPriceFailed(false);
        return;
      }
      const timer = setTimeout(async () => {
        setPriceLoading(true);
        try {
          const sym = normalizeSymbol(trimmed);
          const res = await fetch(`/api/market/quote?symbol=${encodeURIComponent(sym)}`);
          if (!res.ok) throw new Error("not found");
          const data = await res.json();
          if (data?.price) {
            setCurrentPrice(data.price);
            setPriceFailed(false);
          } else {
            throw new Error("no price");
          }
        } catch {
          setCurrentPrice(null);
          setPriceFailed(true);
        } finally {
          setPriceLoading(false);
        }
      }, 800);
      return () => clearTimeout(timer);
    }, [asset]);

    // Close suggestions on outside click
    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (assetRef.current && !assetRef.current.contains(e.target as Node)) {
          setShowSuggestions(false);
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    function handleAssetChange(value: string) {
      setAsset(value);
      if (value.trim().length >= 1) {
        const filtered = ASSET_SUGGESTIONS.filter(s =>
          s.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 6));
        setShowSuggestions(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }

    function selectSuggestion(s: string) {
      setAsset(s);
      setSuggestions([]);
      setShowSuggestions(false);
    }

    function handleTradingModeChange(newMode: TradingMode) {
      setTradingMode(newMode);
      setTimeframe(defaultTimeframeForMode(newMode));
    }

    useImperativeHandle(ref, () => ({
      getFormData: () => {
        if (!asset.trim()) return null;
        const priceValue = currentPrice ?? (manualPrice ? parseFloat(manualPrice) : undefined);
        return {
          asset: asset.trim().toUpperCase(),
          timeframe,
          capitalFCFA: capitalNum || 100000,
          risquePct: risque,
          ratioRR: rrNum,
          marche,
          tradingMode,
          productType,
          platform,
          currentPrice: priceValue,
        };
      },
    }));

    const btnBase = "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer";
    const btnActive = { background: "rgba(0,255,136,0.15)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.3)" };
    const btnInactive = { background: "var(--surface-highest)", color: "var(--on-surface-dim)", border: "1px solid transparent" };

    return (
      <div className="space-y-5">

        {/* Actif avec suggestions */}
        <div className="space-y-1.5" ref={assetRef}>
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Actif *
          </label>
          <div className="relative">
            <input
              type="text"
              value={asset}
              onChange={e => handleAssetChange(e.target.value)}
              placeholder="Ex: SOL/USDT, BTC/USDT, EUR/USD"
              className="w-full rounded-xl px-4 py-3 text-sm font-mono-data text-white outline-none transition-colors"
              style={{ background: "var(--surface-highest)", border: "1px solid var(--outline)" }}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = "rgba(0,255,136,0.4)"; if (suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--outline)"; }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-30 shadow-2xl"
                style={{ background: "var(--surface-high)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm font-mono-data transition-colors"
                    style={{ color: "var(--on-surface-dim)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "white"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--on-surface-dim)"; }}
                    onMouseDown={() => selectSuggestion(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Type de produit */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Type de produit
          </label>
          <div className="flex gap-2">
            <button className={btnBase}
              style={productType === "spot" ? btnActive : btnInactive}
              onClick={() => setProductType("spot")}>
              Spot
            </button>
            <button className={btnBase}
              style={productType === "futures" ? btnActive : btnInactive}
              onClick={() => setProductType("futures")}>
              Futures / Perpétuel
            </button>
          </div>
          {productType === "futures" && (
            <p className="text-xs px-3 py-2 rounded-lg"
              style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "#F5A623" }}>
              ⚠️ Les prix Futures peuvent différer du Spot. Vérifiez le prix exact sur votre plateforme.
            </p>
          )}
        </div>

        {/* Plateforme */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Plateforme de trading
          </label>
          <select
            value={platform}
            onChange={e => setPlatform(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors appearance-none cursor-pointer"
            style={{ background: "var(--surface-highest)", border: "1px solid var(--outline)" }}
          >
            {PLATFORMS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Prix actuel (auto-fetch) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--on-surface-dim)" }}>
            Prix actuel de l&apos;asset
          </label>
          <div className="relative">
            {priceLoading ? (
              <div className="w-full rounded-xl px-4 py-3 text-sm font-mono-data flex items-center gap-2"
                style={{ background: "var(--surface-highest)", border: "1px solid var(--outline)", color: "var(--on-surface-dim)" }}>
                <svg className="animate-spin w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
                  <path d="M6 2a4 4 0 0 1 4 4" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Récupération du prix…
              </div>
            ) : currentPrice != null ? (
              <>
                <input
                  type="number"
                  value={currentPrice}
                  readOnly
                  className="w-full rounded-xl px-4 py-3 pr-16 text-sm font-mono-data text-white outline-none"
                  style={{ background: "var(--surface-highest)", border: "1px solid rgba(0,255,136,0.3)" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded"
                  style={{ background: "rgba(0,255,136,0.15)", color: "#00FF88" }}>
                  LIVE
                </span>
              </>
            ) : (
              <input
                type="number"
                value={manualPrice}
                onChange={e => setManualPrice(e.target.value)}
                placeholder={priceFailed ? "Entrez le prix actuel manuellement" : "Renseignez l'actif pour auto-remplir"}
                className="w-full rounded-xl px-4 py-3 text-sm font-mono-data text-white outline-none transition-colors"
                style={{ background: "var(--surface-highest)", border: "1px solid var(--outline)" }}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = "rgba(0,255,136,0.4)"; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--outline)"; }}
              />
            )}
          </div>
          {currentPrice != null && (
            <p className="text-[10px]" style={{ color: "var(--on-surface-dim)" }}>
              Prix récupéré automatiquement — vérifiez sur votre plateforme avant d&apos;analyser
            </p>
          )}
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
          <div className="flex gap-1.5">
            {TIMEFRAME_GROUPS.map(g => (
              <button key={g.mode} className={btnBase}
                style={tradingMode === g.mode ? btnActive : btnInactive}
                onClick={() => handleTradingModeChange(g.mode)}>
                {g.label}
              </button>
            ))}
          </div>
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
              setMarche("Crypto"); setProductType("spot"); setPlatform("Binance");
              setCurrentPrice(null); setPriceFailed(false); setManualPrice("");
              setTimeframe(defaultTimeframeForMode(defaultTradingMode(mode)));
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
