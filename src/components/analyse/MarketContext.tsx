"use client";

import { useEffect, useState } from "react";
import type { MarketContext as MarketContextData, Candle } from "@/lib/market-context";
import { isCryptoAsset } from "@/lib/market-context";

interface MarketContextProps {
  asset: string;
  productType?: "spot" | "futures";
}

function formatVolume(v: number): string {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + "B";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + "K";
  return v.toFixed(0);
}

function formatPrice(p: number): string {
  if (!p) return "—";
  if (p >= 10000) return p.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  if (p >= 1) return p.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return p.toLocaleString("fr-FR", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function MiniCandles({ candles }: { candles: Candle[] }) {
  const last8 = candles.slice(-8);
  if (last8.length < 2) return null;

  const allPrices = last8.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP || 1;

  const H = 32;
  const candleW = 6;
  const gap = 2;
  const totalW = last8.length * (candleW + gap) - gap;

  function yOf(price: number) {
    return H - ((price - minP) / range) * H;
  }

  return (
    <svg width={totalW} height={H} viewBox={`0 0 ${totalW} ${H}`} style={{ overflow: "visible" }}>
      {last8.map((c, i) => {
        const x = i * (candleW + gap);
        const isBull = c.close >= c.open;
        const color = isBull ? "#00FF88" : "#FF3B5C";
        const bodyTop = yOf(Math.max(c.open, c.close));
        const bodyBottom = yOf(Math.min(c.open, c.close));
        const bodyH = Math.max(1, bodyBottom - bodyTop);
        return (
          <g key={i}>
            <line x1={x + candleW / 2} y1={yOf(c.high)} x2={x + candleW / 2} y2={yOf(c.low)}
              stroke={color} strokeWidth={1} />
            <rect x={x} y={bodyTop} width={candleW} height={bodyH} fill={color} rx={1} />
          </g>
        );
      })}
    </svg>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 rounded w-1/2" style={{ background: "var(--surface-highest)" }} />
      <div className="h-10 rounded w-3/4" style={{ background: "var(--surface-highest)" }} />
      <div className="h-3 rounded w-full" style={{ background: "var(--surface-highest)" }} />
      <div className="h-3 rounded w-5/6" style={{ background: "var(--surface-highest)" }} />
      <div className="h-3 rounded w-4/6" style={{ background: "var(--surface-highest)" }} />
    </div>
  );
}

export default function MarketContext({ asset, productType }: MarketContextProps) {
  const [data, setData] = useState<MarketContextData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notSupported, setNotSupported] = useState(false);

  useEffect(() => {
    const trimmed = asset.trim().toUpperCase();
    if (!trimmed || trimmed.length < 3) {
      setData(null);
      setNotSupported(false);
      return;
    }

    if (!isCryptoAsset(trimmed)) {
      setData(null);
      setNotSupported(true);
      return;
    }

    setNotSupported(false);
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/market/context?asset=${encodeURIComponent(trimmed)}`);
        if (!res.ok) { setData(null); setNotSupported(true); return; }
        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [asset]);

  const sentimentColors = {
    bullish: "#00FF88",
    bearish: "#FF3B5C",
    neutral: "#F5A623",
  };
  const sentimentLabels = {
    bullish: "HAUSSIER",
    bearish: "BAISSIER",
    neutral: "NEUTRE",
  };

  if (!asset.trim() || asset.trim().length < 3) {
    return (
      <div className="card p-5 flex items-center justify-center" style={{ minHeight: 160 }}>
        <p className="text-xs text-center" style={{ color: "var(--on-surface-dim)" }}>
          Renseignez l&apos;actif pour voir le contexte marché
        </p>
      </div>
    );
  }

  if (notSupported) {
    return (
      <div className="card p-5 flex items-center justify-center" style={{ minHeight: 160 }}>
        <p className="text-xs text-center" style={{ color: "var(--on-surface-dim)" }}>
          Données non disponibles pour cet asset — vérifiez le symbole ou utilisez le format <span className="font-mono-data text-white">SOL/USDT</span>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-5">
        <Skeleton />
      </div>
    );
  }

  if (!data) return null;

  const changePositive = data.change24h >= 0;
  const priceColor = changePositive ? "#00FF88" : "#FF3B5C";
  const sentimentColor = sentimentColors[data.marketSentiment];

  return (
    <div className="card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-widest" style={{ color: "var(--on-surface-dim)" }}>
          CONTEXTE MARCHÉ
        </p>
        {productType === "futures" && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{ background: "rgba(245,166,35,0.15)", color: "#F5A623" }}>
            FUTURES
          </span>
        )}
      </div>

      {/* Prix actuel */}
      <div>
        <p className="font-mono-data font-bold text-2xl leading-tight" style={{ color: priceColor }}>
          ${formatPrice(data.currentPrice)}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-semibold" style={{ color: priceColor }}>
            {changePositive ? "▲" : "▼"} {Math.abs(data.change24h).toFixed(2)}%
          </span>
          <span className="text-xs" style={{ color: "var(--on-surface-dim)" }}>24h</span>
        </div>
      </div>

      {/* Sentiment */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
          style={{ background: `${sentimentColor}15`, color: sentimentColor, border: `1px solid ${sentimentColor}30` }}>
          {sentimentLabels[data.marketSentiment]}
        </span>
        <span className="text-xs" style={{ color: "var(--on-surface-dim)" }}>
          Vol: {formatVolume(data.volume24h)}
        </span>
      </div>

      {/* High / Low */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg px-3 py-2" style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)" }}>
          <p style={{ color: "var(--on-surface-dim)" }}>Haut 24h</p>
          <p className="font-mono-data font-semibold text-white">${formatPrice(data.high24h)}</p>
        </div>
        <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,59,92,0.04)", border: "1px solid rgba(255,59,92,0.1)" }}>
          <p style={{ color: "var(--on-surface-dim)" }}>Bas 24h</p>
          <p className="font-mono-data font-semibold text-white">${formatPrice(data.low24h)}</p>
        </div>
      </div>

      {/* Supports / Résistances */}
      {(data.supportLevels.length > 0 || data.resistanceLevels.length > 0) && (
        <div className="space-y-1.5">
          {data.resistanceLevels.length > 0 && (
            <div>
              <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color: "#FF3B5C" }}>
                RÉSISTANCES
              </p>
              <div className="flex gap-1 flex-wrap">
                {data.resistanceLevels.map((r, i) => (
                  <span key={i} className="text-[10px] font-mono-data px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(255,59,92,0.1)", color: "#FF3B5C" }}>
                    ${formatPrice(r)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.supportLevels.length > 0 && (
            <div>
              <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color: "#00FF88" }}>
                SUPPORTS
              </p>
              <div className="flex gap-1 flex-wrap">
                {data.supportLevels.map((s, i) => (
                  <span key={i} className="text-[10px] font-mono-data px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(0,255,136,0.1)", color: "#00FF88" }}>
                    ${formatPrice(s)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mini candles */}
      {data.recentCandles.length >= 2 && (
        <div>
          <p className="text-[9px] font-bold tracking-widest mb-2" style={{ color: "var(--on-surface-dim)" }}>
            BOUGIES 1H (8 dernières)
          </p>
          <MiniCandles candles={data.recentCandles} />
        </div>
      )}
    </div>
  );
}
