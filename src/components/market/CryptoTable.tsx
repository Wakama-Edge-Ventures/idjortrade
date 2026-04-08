"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { CoinMarket } from "@/lib/coingecko";

// ─── Utilities ────────────────────────────────────────────────────────────────

export function formatLargeNumber(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
}

export function formatPrice(p: number): string {
  if (p >= 1000) return p.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (p >= 1) return p.toFixed(2);
  if (p >= 0.01) return p.toFixed(4);
  return p.toFixed(6);
}

// ─── Mini Sparkline ───────────────────────────────────────────────────────────

function Sparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
  if (!prices || prices.length < 2) return <span style={{ color: "var(--text-secondary)" }}>—</span>;

  const w = 80;
  const h = 32;
  const pad = 2;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const pts = prices.map((p, i) => {
    const x = pad + (i / (prices.length - 1)) * (w - pad * 2);
    const y = h - pad - ((p - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const pathD = "M " + pts.join(" L ");

  const color = positive ? "var(--bullish)" : "var(--bearish)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Pct Cell ─────────────────────────────────────────────────────────────────

function PctCell({ value }: { value: number | null }) {
  if (value === null || value === undefined) {
    return <span style={{ color: "var(--text-secondary)" }}>—</span>;
  }
  const pos = value >= 0;
  return (
    <span style={{ color: pos ? "var(--bullish)" : "var(--bearish)" }} className="font-data text-sm">
      {pos ? "+" : ""}{value.toFixed(2)}%
    </span>
  );
}

// ─── CryptoTable ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

interface CryptoTableProps {
  coins: CoinMarket[];
}

export default function CryptoTable({ coins }: CryptoTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return coins;
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [coins, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-secondary)" }}
        >
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher une crypto…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full text-sm rounded-xl pl-9 pr-4 py-2.5"
          style={{
            background: "var(--surface-highest)",
            border: "1px solid var(--border)",
            color: "white",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(153,69,255,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["#", "Monnaie", "Cours", "1h%", "24h%", "7j%", "Volume 24h", "Cap. Boursière", "7 jours"].map(
                (col) => (
                  <th
                    key={col}
                    className={`text-xs font-semibold uppercase tracking-widest py-3 ${col === "Monnaie" ? "text-left" : "text-right"} ${["1h%", "7j%", "Volume 24h", "7 jours"].includes(col) ? "hidden md:table-cell" : ""}`}
                    style={{ color: "var(--text-secondary)", paddingLeft: col === "#" ? "0" : "0.75rem", paddingRight: col === "7 jours" ? "0" : "0.75rem", whiteSpace: "nowrap" }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.map((coin) => {
              const pos7d = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;
              return (
                <tr
                  key={coin.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  className="hover:bg-white/5 transition-colors"
                >
                  {/* Rank */}
                  <td className="py-3 pr-3 text-right font-data text-sm" style={{ color: "var(--text-secondary)", minWidth: "2.5rem" }}>
                    {coin.market_cap_rank ?? "—"}
                  </td>

                  {/* Name */}
                  <td className="py-3 px-3" style={{ minWidth: "180px" }}>
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={28}
                        height={28}
                        className="rounded-full flex-shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                      <div>
                        <p className="text-sm font-bold text-white leading-tight">{coin.name}</p>
                        <p className="text-xs uppercase font-data" style={{ color: "var(--text-secondary)" }}>{coin.symbol}</p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 text-right font-data font-bold text-sm text-white whitespace-nowrap">
                    ${formatPrice(coin.current_price)}
                  </td>

                  {/* 1h% — hidden on mobile */}
                  <td className="py-3 px-3 text-right hidden md:table-cell">
                    <PctCell value={coin.price_change_percentage_1h_in_currency} />
                  </td>

                  {/* 24h% */}
                  <td className="py-3 px-3 text-right">
                    <PctCell value={coin.price_change_percentage_24h_in_currency} />
                  </td>

                  {/* 7d% — hidden on mobile */}
                  <td className="py-3 px-3 text-right hidden md:table-cell">
                    <PctCell value={coin.price_change_percentage_7d_in_currency} />
                  </td>

                  {/* Volume — hidden on mobile */}
                  <td className="py-3 px-3 text-right font-data text-sm hidden md:table-cell whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                    ${formatLargeNumber(coin.total_volume)}
                  </td>

                  {/* Market Cap */}
                  <td className="py-3 px-3 text-right font-data text-sm whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                    ${formatLargeNumber(coin.market_cap)}
                  </td>

                  {/* Sparkline — hidden on mobile */}
                  <td className="py-3 pl-3 text-right hidden md:table-cell" style={{ minWidth: "90px" }}>
                    <Sparkline
                      prices={coin.sparkline_in_7d?.price ?? []}
                      positive={pos7d}
                    />
                  </td>
                </tr>
              );
            })}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Aucun résultat pour « {search} »
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {filtered.length} cryptos — page {page}/{totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "var(--surface-highest)",
                color: page === 1 ? "var(--text-secondary)" : "white",
                border: "1px solid var(--border)",
                opacity: page === 1 ? 0.4 : 1,
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Préc.
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: pageNum === page ? "var(--bullish)" : "var(--surface-highest)",
                    color: pageNum === page ? "white" : "white",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "var(--surface-highest)",
                color: page === totalPages ? "var(--text-secondary)" : "white",
                border: "1px solid var(--border)",
                opacity: page === totalPages ? 0.4 : 1,
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Suiv. →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
