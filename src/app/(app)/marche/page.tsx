"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Globe } from "lucide-react";
import CryptoTable, { formatPrice } from "@/components/market/CryptoTable";
import type { CoinMarket, ForexRate } from "@/lib/coingecko";
import type { Quote } from "@/lib/twelvedata";
import { useLang } from "@/lib/LangContext";

type Tab = "crypto" | "forex" | "actions" | "matieres";

const REFRESH_INTERVAL = 60;

function LiveBadge({ countdown, refreshLabel }: { countdown: number; refreshLabel: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold"
        style={{ background: "rgba(20,241,149,0.1)", color: "var(--bullish)", border: "1px solid rgba(20,241,149,0.2)" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--sol-gradient)", boxShadow: "0 0 6px var(--bullish)", animation: "pulse 1.5s infinite" }}
        />
        LIVE
      </span>
      <span className="text-xs tabular-nums" style={{ color: "var(--text-secondary)" }}>
        {refreshLabel} {countdown}s
      </span>
    </div>
  );
}

function ForexTable({ rates, searchPlaceholder, colLabels, emptyLabel }: {
  rates: ForexRate[];
  searchPlaceholder: string;
  colLabels: string[];
  emptyLabel: string;
}) {
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
          style={{ color: "var(--text-secondary)" }}>
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm rounded-xl pl-9 pr-4 py-2.5"
          style={{ background: "var(--surface-highest)", border: "1px solid var(--border)", color: "white", outline: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(153,69,255,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {colLabels.map((col, idx) => (
                <th key={col}
                  className={`text-xs font-semibold uppercase tracking-widest py-3 ${idx === 0 || idx === 1 ? "text-left" : "text-right"} ${idx === 1 ? "hidden md:table-cell" : ""}`}
                  style={{ color: "var(--text-secondary)", paddingLeft: "0.75rem", paddingRight: "0.75rem", whiteSpace: "nowrap" }}>
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
                  <span className="font-data font-bold text-sm text-white">{r.pair}</span>
                  {r.pair.includes("XOF") || r.pair.includes("NGN") || r.pair.includes("GHS") || r.pair.includes("MAD") || r.pair.includes("ZAR") ? (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(245,166,35,0.1)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.2)" }}>
                      AFR
                    </span>
                  ) : null}
                </td>
                <td className="py-3 px-3 text-sm hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>{r.label}</td>
                <td className="py-3 px-3 text-right font-data font-bold text-sm text-white">
                  {formatPrice(r.rate)}
                </td>
                <td className="py-3 px-3 text-right">
                  {r.change24h !== null ? (
                    <span className="font-data text-sm" style={{ color: r.change24h >= 0 ? "var(--bullish)" : "var(--bearish)" }}>
                      {r.change24h >= 0 ? "+" : ""}{r.change24h.toFixed(2)}%
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="py-12 text-center text-sm" style={{ color: "var(--text-secondary)" }}>{emptyLabel}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuotesTable({ quotes, emptyMessage, colLabels }: { quotes: Quote[]; emptyMessage: string; colLabels: string[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {colLabels.map((col, idx) => (
              <th key={col}
                className={`text-xs font-semibold uppercase tracking-widest py-3 ${idx === 0 || idx === 1 ? "text-left" : "text-right"} ${idx === 1 ? "hidden md:table-cell" : ""} ${idx >= 4 ? "hidden lg:table-cell" : ""}`}
                style={{ color: "var(--text-secondary)", paddingLeft: "0.75rem", paddingRight: "0.75rem", whiteSpace: "nowrap" }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {quotes.length === 0 && (
            <tr><td colSpan={6} className="py-12 text-center text-sm" style={{ color: "var(--text-secondary)" }}>{emptyMessage}</td></tr>
          )}
          {quotes.map((q) => {
            const pos = q.percent_change >= 0;
            return (
              <tr key={q.symbol}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-data font-bold text-sm text-white">{q.symbol}</span>
                </td>
                <td className="py-3 px-3 text-sm hidden md:table-cell" style={{ color: "var(--text-secondary)" }}>{q.name}</td>
                <td className="py-3 px-3 text-right font-data font-bold text-sm text-white whitespace-nowrap">
                  {q.symbol.includes("USD") || q.symbol === "USOIL" ? "$" : ""}{formatPrice(q.price)}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="font-data text-sm" style={{ color: pos ? "var(--bullish)" : "var(--bearish)" }}>
                    {pos ? "+" : ""}{q.percent_change.toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-data text-sm hidden lg:table-cell whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                  {formatPrice(q.high)}
                </td>
                <td className="py-3 px-3 text-right font-data text-sm hidden lg:table-cell whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
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

function TopMovers({ coins, gainersLabel, losersLabel }: { coins: CoinMarket[]; gainersLabel: string; losersLabel: string }) {
  if (!coins.length) return null;
  const sorted = [...coins].sort(
    (a, b) => Math.abs(b.price_change_percentage_24h_in_currency ?? 0) - Math.abs(a.price_change_percentage_24h_in_currency ?? 0)
  );
  const gainers = sorted.filter((c) => (c.price_change_percentage_24h_in_currency ?? 0) > 0).slice(0, 3);
  const losers = sorted.filter((c) => (c.price_change_percentage_24h_in_currency ?? 0) < 0).slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { label: gainersLabel, items: gainers, color: "var(--bullish)", bg: "rgba(20,241,149,0.05)", border: "rgba(20,241,149,0.15)" },
        { label: losersLabel,  items: losers,  color: "var(--bearish)", bg: "rgba(244,63,94,0.05)",  border: "rgba(244,63,94,0.15)" },
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
                  <p className="text-xs uppercase font-data" style={{ color: "var(--text-secondary)" }}>{c.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-data font-bold text-sm text-white">${formatPrice(c.current_price)}</p>
                <p className="font-data text-xs font-bold" style={{ color }}>
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

export default function MarchePage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>("crypto");
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [forexRates, setForexRates] = useState<ForexRate[]>([]);
  const [actionQuotes, setActionQuotes] = useState<Quote[]>([]);
  const [matieresQuotes, setMatieresQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const lastFetchTab = useRef<Tab | null>(null);

  const TABS: { id: Tab; label: string }[] = [
    { id: "crypto",   label: t("page.marche.tab.crypto") },
    { id: "forex",    label: t("page.marche.tab.forex") },
    { id: "actions",  label: t("page.marche.tab.actions") },
    { id: "matieres", label: t("page.marche.tab.matieres") },
  ];

  const forexColLabels = [
    t("page.marche.col.pair"),
    t("page.marche.col.desc"),
    t("page.marche.col.price"),
    t("page.marche.col.change"),
  ];
  const quotesColLabels = [
    t("page.marche.col.asset"),
    t("page.marche.col.name"),
    t("page.marche.col.price"),
    t("page.marche.col.change"),
    t("page.marche.col.high"),
    t("page.marche.col.low"),
  ];

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

  useEffect(() => {
    fetchTabData("crypto");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastFetchTab.current === activeTab) return;
    lastFetchTab.current = activeTab;
    fetchTabData(activeTab);
    setCountdown(REFRESH_INTERVAL);
  }, [activeTab, fetchTabData]);

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
            style={{ background: "rgba(20,241,149,0.1)", color: "var(--bullish)" }}>
            <Globe size={22} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-2xl text-white">{t("page.marche.title")}</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {t("page.marche.sub")}
            </p>
          </div>
        </div>
        <LiveBadge countdown={countdown} refreshLabel={t("page.marche.live.refresh")} />
      </div>

      {/* Top Movers */}
      {activeTab === "crypto" && coins.length > 0 && (
        <TopMovers
          coins={coins}
          gainersLabel={t("page.marche.gainers")}
          losersLabel={t("page.marche.losers")}
        />
      )}

      {/* Tabs */}
      <div className="card p-1.5 flex gap-1 w-full overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
            style={{
              background: activeTab === id ? "var(--bullish)" : "transparent",
              color: activeTab === id ? "white" : "var(--text-secondary)",
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
              <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" style={{ color: "var(--bullish)" }} />
              <path d="M14 3a11 11 0 0 1 11 11" stroke="var(--bullish)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{t("page.marche.loading")}</p>
          </div>
        ) : (
          <>
            {activeTab === "crypto" && <CryptoTable coins={coins} />}
            {activeTab === "forex" && (
              <ForexTable
                rates={forexRates}
                searchPlaceholder={t("page.marche.search")}
                colLabels={forexColLabels}
                emptyLabel={t("page.marche.empty")}
              />
            )}
            {activeTab === "actions" && (
              <QuotesTable
                quotes={actionQuotes}
                emptyMessage={t("page.marche.no.actions")}
                colLabels={quotesColLabels}
              />
            )}
            {activeTab === "matieres" && (
              <QuotesTable
                quotes={matieresQuotes}
                emptyMessage={t("page.marche.no.matieres")}
                colLabels={quotesColLabels}
              />
            )}
          </>
        )}
      </div>

      {/* Data sources */}
      <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
        {activeTab === "crypto" && t("page.marche.source.crypto")}
        {activeTab === "forex" && t("page.marche.source.forex")}
        {(activeTab === "actions" || activeTab === "matieres") && t("page.marche.source.quotes")}
      </p>
    </div>
  );
}
