"use client";

import { useState, useEffect } from "react";
import { sessions, isSessionOpen } from "@/lib/market-sessions";
import { useQuote } from "@/hooks/useQuote";
import type { Quote } from "@/lib/twelvedata";

function CryptoPrice({ symbol }: { symbol: string }) {
  const { quote, loading } = useQuote(symbol);

  if (loading || !quote) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 animate-pulse">
        <span className="section-label">{symbol.split("/")[0]}</span>
        <span className="skeleton h-2.5 w-14 rounded" />
      </div>
    );
  }

  return <CryptoPriceDisplay quote={quote} />;
}

function CryptoPriceDisplay({ quote }: { quote: Quote }) {
  const pos   = quote.percent_change >= 0;
  const color = pos ? "var(--bullish)" : "var(--bearish)";
  const arrow = pos ? "↑" : "↓";
  const sym   = quote.symbol.split("/")[0];

  const fmtPrice = (p: number) =>
    p >= 10000
      ? "$" + p.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : "$" + p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
      <span className="section-label">{sym}</span>
      <span className="font-data text-[10px] font-bold" style={{ color: "var(--text-primary)" }}>
        {fmtPrice(quote.price)}
      </span>
      <span className="font-data text-[10px] font-bold ticker-update" style={{ color }}>
        {arrow}{Math.abs(quote.percent_change).toFixed(1)}%
      </span>
    </div>
  );
}

export default function SessionTicker() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden md:flex items-center gap-6 px-6 py-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      style={{
        background: "var(--surface-low)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Sessions forex */}
      {sessions.map((session) => {
        const open = isSessionOpen(session);
        return (
          <div key={session.id} className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
            <span className="text-sm" aria-hidden="true">{session.flag}</span>
            <span className="section-label">{session.label}</span>
            <div className="flex items-center gap-1">
              {open ? (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: session.color }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-1.5 w-1.5"
                      style={{ background: session.color }}
                    />
                  </span>
                  <span className="font-data text-[9px] font-bold" style={{ color: session.color }}>
                    OUVERT
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: "var(--border-hover)" }}
                  />
                  <span className="section-label">FERMÉ</span>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Séparateur */}
      <div className="h-3 w-px flex-shrink-0" style={{ background: "var(--border)" }} />

      {/* Prix live */}
      <CryptoPrice symbol="BTC/USD" />
      <CryptoPrice symbol="ETH/USD" />

      {/* Heure Abidjan */}
      <div
        className="ml-auto flex-shrink-0 font-data text-[10px]"
        style={{ color: "var(--text-tertiary)" }}
      >
        {new Date().toLocaleTimeString("fr-FR", {
          timeZone: "Africa/Abidjan",
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}ABJ
      </div>
    </div>
  );
}
