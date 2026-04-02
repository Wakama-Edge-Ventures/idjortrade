"use client";

import { useState } from "react";
import QuoteCard from "./QuoteCard";
import LiveBadge from "./LiveBadge";
import { useMarketData } from "@/hooks/useMarketData";
import type { Category } from "@/lib/twelvedata";

const TABS: { id: Category; label: string; icon: string }[] = [
  { id: "crypto",   label: "Crypto",       icon: "₿" },
  { id: "forex",    label: "Forex",        icon: "💱" },
  { id: "actions",  label: "Actions",      icon: "📊" },
  { id: "matieres", label: "Matières 1ères", icon: "🥇" },
];

function isMarketClosed(category: Category): boolean {
  // Crypto always open; others check weekend
  if (category === "crypto") return false;
  const day = new Date().getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export default function MarketTabs() {
  const [activeTab, setActiveTab] = useState<Category>("crypto");
  const { quotes, loading, error } = useMarketData(activeTab);

  const closed = isMarketClosed(activeTab);
  const quoteList = Object.values(quotes);

  return (
    <div className="space-y-4">
      {/* Tab bar + status */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--surface-high)" }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={
                  active
                    ? { background: "rgba(0,255,136,0.12)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.25)" }
                    : { color: "var(--on-surface-dim)", border: "1px solid transparent" }
                }
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {closed && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(245,166,35,0.1)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.2)" }}
            >
              Hors marché
            </span>
          )}
          {!loading && !error && <LiveBadge refreshInterval={30} />}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs px-3 py-2 rounded-lg"
          style={{ background: "rgba(255,59,92,0.08)", color: "#FF3B5C", border: "1px solid rgba(255,59,92,0.15)" }}>
          {error}
        </p>
      )}

      {/* Quote grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <QuoteCard key={i} loading />)
          : quoteList.length > 0
            ? quoteList.map((q) => <QuoteCard key={q.symbol} quote={q} />)
            : Array.from({ length: 4 }).map((_, i) => <QuoteCard key={i} loading />)
        }
      </div>
    </div>
  );
}
