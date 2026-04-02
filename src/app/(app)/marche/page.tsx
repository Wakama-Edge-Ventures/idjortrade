import { Globe } from "lucide-react";
import MarketTabs from "@/components/market/MarketTabs";
import { fetchMultipleQuotes } from "@/lib/twelvedata";

async function MarketLeaders() {
  const quotes = await fetchMultipleQuotes(["BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD"]);
  const leaders = Object.values(quotes);

  const fmtPrice = (p: number) =>
    p >= 1000 ? p.toLocaleString("en-US", { maximumFractionDigits: 0 }) : p.toFixed(2);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {leaders.map((q) => {
        const pos = q.percent_change >= 0;
        const color = pos ? "#00FF88" : "#FF3B5C";
        const bg = pos ? "rgba(0,255,136,0.05)" : "rgba(255,59,92,0.05)";
        return (
          <div key={q.symbol} className="card p-4 space-y-2" style={{ background: bg }}>
            <div className="flex items-center justify-between">
              <span className="font-mono-data font-bold text-xs text-white">
                {q.symbol.split("/")[0]}
              </span>
              <span className="text-[10px] font-bold font-mono-data" style={{ color }}>
                {pos ? "+" : ""}{q.percent_change.toFixed(2)}%
              </span>
            </div>
            <p className="font-mono-data font-bold text-xl text-white">${fmtPrice(q.price)}</p>
            <p className="text-[10px]" style={{ color: "var(--on-surface-dim)" }}>{q.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function MarchePage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

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

      <section className="space-y-3">
        <h2 className="font-headline font-bold text-sm text-white uppercase tracking-widest">
          Leaders du marché
        </h2>
        <MarketLeaders />
      </section>

      <section>
        <MarketTabs />
      </section>

    </div>
  );
}
