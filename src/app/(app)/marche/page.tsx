"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Globe } from "lucide-react";
import CryptoTable, { formatPrice, formatLargeNumber } from "@/components/market/CryptoTable";
import type { CoinMarket, ForexRate } from "@/lib/coingecko";
import type { Quote } from "@/lib/twelvedata";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "crypto" | "forex" | "actions" | "matieres";

const TABS: { id: Tab; label: string }[] = [
  { id: "crypto", label: "Crypto" },
  { id: "forex", label: "Forex" },
  { id: "actions", label: "Actions" },
  { id: "matieres", label: "Matières" },
];

// ─── LIVE Badge + Countdown ───────────────────────────────────────────────────

function LiveBadge({ countdown }: { countdown: number }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold"
        style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.2)" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "#00FF88", boxShadow: "0 0 6px #00FF88", animation: "pulse 1.5s infinite" }}
        />
        LIVE
      </span>
      <span className="text-xs tabular-nums" style={{ color: "var(--on-surface-dim)" }}>
        Actu. dans {countdown}s
      </span>
    </div>
  );
}

// ─── Forex Table ──────────────────────────────────────────────────────────────

function ForexTable({ rates }: { rates: ForexRate[] }) {
  const [search, setSearch] = useState("");
  const filtered = rates.filter((r) =>
    r.pair.toLowerCase().includes(search.toLowerCase()) ||
    r.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--on-surface-dim)" }}>
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher une paire…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm rounded-xl pl-9 pr-4 py-2.5"
          style={{ background: "var(--surface-highest)", border: "1px solid var(--outline)", color: "white", outline: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,136,0.4)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--outline)")}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--outline)" }}>
              {["Paire", "Description", "Cours", "Var. 24h"].map((col) => (
                <th key={col}
                  className={`text-xs font-semibold uppercase tracking-widest py-3 ${col === "Paire" || col === "Description" ? "text-left" : "text-right"} ${col === "Description" ? "hidden md:table-cell" : ""}`}
                  style={{ color: "var(--on-surface-dim)", paddingLeft: "0.75rem", paddingRight: "0.75rem", whiteSpace: "nowrap" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.pair}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-mono-data font-bold text-sm text-white">{r.pair}</span>
                  {r.pair.includes("XOF") || r.pair.includes("NGN") || r.pair.includes("GHS") || r.pair.includes("MAD") || r.pair.includes("ZAR") ? (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(245,166,35,0.1)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.2)" }}>
                      AFR
                    </span>
                  ) : null}
                </td>
                <td className="py-3 px-3 text-sm hidden md:table-cell" style={{ color: "var(--on-surface-dim)" }}>{r.label}</td>
                <td className="py-3 px-3 text-right font-mono-data font-bold text-sm text-white">
                  {formatPrice(r.rate)}
                </td>
                <td className="py-3 px-3 text-right">
                  {r.change24h !== null ? (
                    <span className="font-mono-data text-sm" style={{ color: r.change24h >= 0 ? "#00FF88" : "#FF3B5C" }}>
                      {r.change24h >= 0 ? "+" : ""}{r.change24h.toFixed(2)}%
                    </span>
                  ) : (
                    <span style={{ color: "var(--on-surface-dim)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="py-12 text-center text-sm" style={{ color: "var(--on-surface-dim)" }}>Aucun résultat</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Quotes Table (Actions / Matières) ────────────────────────────────────────

function QuotesTable({ quotes, emptyMessage }: { quotes: Quote[]; emptyMessage: string }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--outline)" }}>
            {["Actif", "Nom", "Cours", "Var. 24h", "Haut", "Bas"].map((col) => (
              <th key={col}
                className={`text-xs font-semibold uppercase tracking-widest py-3 ${col === "Actif" || col === "Nom" ? "text-left" : "text-right"} ${col === "Nom" ? "hidden md:table-cell" : ""} ${["Haut", "Bas"].includes(col) ? "hidden lg:table-cell" : ""}`}
                style={{ color: "var(--on-surface-dim)", paddingLeft: "0.75rem", paddingRight: "0.75rem", whiteSpace: "nowrap" }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {quotes.length === 0 && (
            <tr><td colSpan={6} className="py-12 text-center text-sm" style={{ color: "var(--on-surface-dim)" }}>{emptyMessage}</td></tr>
          )}
          {quotes.map((q) => {
            const pos = q.percent_change >= 0;
            return (
              <tr key={q.symbol}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-mono-data font-bold text-sm text-white">{q.symbol}</span>
                </td>
                <td className="py-3 px-3 text-sm hidden md:table-cell" style={{ color: "var(--on-surface-dim)" }}>{q.name}</td>
                <td className="py-3 px-3 text-right font-mono-data font-bold text-sm text-white whitespace-nowrap">
                  {q.symbol.includes("USD") || q.symbol === "USOIL" ? "$" : ""}{formatPrice(q.price)}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="font-mono-data text-sm" style={{ color: pos ? "#00FF88" : "#FF3B5C" }}>
                    {pos ? "+" : ""}{q.percent_change.toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono-data text-sm hidden lg:table-cell whitespace-nowrap" style={{ color: "var(--on-surface-dim)" }}>
                  {formatPrice(q.high)}
                </td>
                <td className="py-3 px-3 text-right font-mono-data text-sm hidden lg:table-cell whitespace-nowrap" style={{ color: "var(--on-surface-dim)" }}>
                  {formatPrice(q.low)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Top Movers from CoinGecko ────────────────────────────────────────────────

function TopMovers({ coins }: { coins: CoinMarket[] }) {
  if (!coins.length) return null;
  const sorted = [...coins].sort(
    (a, b) => Math.abs(b.price_change_percentage_24h_in_currency ?? 0) - Math.abs(a.price_change_percentage_24h_in_currency ?? 0)
  );
  const gainers = sorted.filter((c) => (c.price_change_percentage_24h_in_currency ?? 0) > 0).slice(0, 3);
  const losers = sorted.filter((c) => (c.price_change_percentage_24h_in_currency ?? 0) < 0).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { label: "Meilleurs gains 24h", items: gainers, color: "#00FF88", bg: "rgba(0,255,136,0.05)", border: "rgba(0,255,136,0.15)" },
        { label: "Plus fortes baisses 24h", items: losers, color: "#FF3B5C", bg: "rgba(255,59,92,0.05)", border: "rgba(255,59,92,0.15)" },
      ].map(({ label, items, color, bg, border }) => (
        <div key={label} className="rounded-2xl p-4 space-y-3"
          style={{ background: bg, border: `1px solid ${border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</p>
          {items.map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} width={20} height={20} className="rounded-full" />
                <div>
                  <p className="text-sm font-bold text-white leading-none">{c.name}</p>
                  <p className="text-xs uppercase font-mono-data" style={{ color: "var(--on-surface-dim)" }}>{c.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono-data font-bold text-sm text-white">${formatPrice(c.current_price)}</p>
                <p className="font-mono-data text-xs font-bold" style={{ color }}>
                  {(c.price_change_percentage_24h_in_currency ?? 0) >= 0 ? "+" : ""}{(c.price_change_percentage_24h_in_currency ?? 0).toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const REFRESH_INTERVAL = 60; // seconds

export default function MarchePage() {
  const [activeTab, setActiveTab] = useState<Tab>("crypto");
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [forexRates, setForexRates] = useState<ForexRate[]>([]);
  const [actionQuotes, setActionQuotes] = useState<Quote[]>([]);
  const [matieresQuotes, setMatieresQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const lastFetchTab = useRef<Tab | null>(null);

  const fetchTabData = useCallback(async (tab: Tab) => {
    setLoading(true);
    try {
      if (tab === "crypto") {
        const res = await fetch("/api/market/crypto?per_page=100");
        if (res.ok) setCoins(await res.json());
      } else if (tab === "forex") {
        const res = await fetch("/api/market/forex");
        if (res.ok) setForexRates(await res.json());
      } else if (tab === "actions") {
        const res = await fetch("/api/market/quotes?symbols=AAPL,MSFT,GOOGL,AMZN,TSLA,NVDA,META,JPM");
        if (res.ok) {
          const data = await res.json();
          setActionQuotes(Array.isArray(data) ? data : Object.values(data));
        }
      } else if (tab === "matieres") {
        const res = await fetch("/api/market/quotes?symbols=XAU/USD,XAG/USD,USOIL,COPPER,NATGAS");
        if (res.ok) {
          const data = await res.json();
          setMatieresQuotes(Array.isArray(data) ? data : Object.values(data));
        }
      }
    } catch {
      // silently fail — show stale data
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load for crypto (always fetch on mount)
  useEffect(() => {
    fetchTabData("crypto");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch when tab changes
  useEffect(() => {
    if (lastFetchTab.current === activeTab) return;
    lastFetchTab.current = activeTab;
    fetchTabData(activeTab);
    setCountdown(REFRESH_INTERVAL);
  }, [activeTab, fetchTabData]);

  // Auto-refresh countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          fetchTabData(activeTab);
          return REFRESH_INTERVAL;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab, fetchTabData]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>
            <Globe size={22} />
          </div>
          <div>
            <h1 className="font-headline font-bold text-2xl text-white">Marché</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--on-surface-dim)" }}>
              Prix en temps réel — Crypto, Forex, Actions, Matières premières
            </p>
          </div>
        </div>
        <LiveBadge countdown={countdown} />
      </div>

      {/* Top Movers — crypto only */}
      {activeTab === "crypto" && coins.length > 0 && (
        <TopMovers coins={coins} />
      )}

      {/* Tabs */}
      <div className="card p-1.5 flex gap-1 w-full overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
            style={{
              background: activeTab === id ? "#00FF88" : "transparent",
              color: activeTab === id ? "#0A0E1A" : "var(--on-surface-dim)",
              minWidth: "80px",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card p-4 md:p-6">
        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <svg className="animate-spin" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" style={{ color: "#00FF88" }} />
              <path d="M14 3a11 11 0 0 1 11 11" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>Chargement des données…</p>
          </div>
        ) : (
          <>
            {activeTab === "crypto" && <CryptoTable coins={coins} />}
            {activeTab === "forex" && <ForexTable rates={forexRates} />}
            {activeTab === "actions" && (
              <QuotesTable
                quotes={actionQuotes}
                emptyMessage="Données actions indisponibles — vérifiez votre clé Twelvedata"
              />
            )}
            {activeTab === "matieres" && (
              <QuotesTable
                quotes={matieresQuotes}
                emptyMessage="Données matières premières indisponibles — vérifiez votre clé Twelvedata"
              />
            )}
          </>
        )}
      </div>

      {/* Data sources */}
      <p className="text-xs text-center" style={{ color: "var(--on-surface-dim)" }}>
        {activeTab === "crypto" && "Source: CoinGecko API · Actualisation toutes les 60s"}
        {activeTab === "forex" && "Source: Open Exchange Rates · Actualisation toutes les heures · Paires africaines incluses"}
        {(activeTab === "actions" || activeTab === "matieres") && "Source: Twelvedata · Actualisation toutes les 30s"}
      </p>
    </div>
  );
}
