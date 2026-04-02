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
        <span className="text-[10px] font-mono font-bold" style={{ color: "var(--on-surface-dim)" }}>
          {symbol.split("/")[0]}
        </span>
        <span className="h-2.5 w-14 rounded" style={{ background: "var(--surface-highest)" }} />
      </div>
    );
  }

  return <CryptoPriceDisplay quote={quote} />;
}

function CryptoPriceDisplay({ quote }: { quote: Quote }) {
  const pos = quote.percent_change >= 0;
  const color = pos ? "#00FF88" : "#FF3B5C";
  const arrow = pos ? "↑" : "↓";
  const sym = quote.symbol.split("/")[0];

  const fmtPrice = (p: number) =>
    p >= 10000
      ? "$" + p.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : "$" + p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
      <span className="text-[10px] font-bold font-mono" style={{ color: "var(--on-surface-dim)" }}>
        {sym}
      </span>
      <span className="text-[10px] font-bold font-mono-data text-white">
        {fmtPrice(quote.price)}
      </span>
      <span className="text-[10px] font-bold font-mono-data" style={{ color }}>
        {arrow}{Math.abs(quote.percent_change).toFixed(1)}%
      </span>
    </div>
  );
}

export default function SessionTicker() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="hidden md:flex items-center gap-6 px-6 py-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
      style={{
        background: "var(--surface-low)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Forex sessions */}
      {sessions.map((session) => {
        const open = isSessionOpen(session);
        return (
          <div key={session.id} className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
            <span className="text-sm">{session.flag}</span>
            <span className="text-xs font-medium" style={{ color: "var(--on-surface-dim)" }}>
              {session.label}
            </span>
            <div className="flex items-center gap-1">
              {open ? (
                <>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: session.color }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                      style={{ background: session.color }} />
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: session.color }}>
                    OUVERT
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex rounded-full h-1.5 w-1.5"
                    style={{ background: "var(--outline)" }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--on-surface-dim)" }}>
                    FERMÉ
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Separator */}
      <div className="h-3 w-px flex-shrink-0" style={{ background: "var(--outline)" }} />

      {/* BTC + ETH live prices */}
      <CryptoPrice symbol="BTC/USD" />
      <CryptoPrice symbol="ETH/USD" />

      {/* Abidjan time */}
      <div className="ml-auto flex-shrink-0 text-[10px] font-mono" style={{ color: "var(--on-surface-dim)" }}>
        {new Date().toLocaleTimeString("fr-FR", { timeZone: "Africa/Abidjan", hour: "2-digit", minute: "2-digit" })} ABJ
      </div>
    </div>
  );
}
