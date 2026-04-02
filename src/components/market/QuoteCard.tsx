import type { Quote } from "@/lib/twelvedata";

interface QuoteCardProps {
  quote?: Quote;
  loading?: boolean;
}

function formatPrice(price: number): string {
  if (price >= 10000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 100)   return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1)     return price.toFixed(4);
  return price.toFixed(6);
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(1)}B`;
  if (vol >= 1_000_000)     return `${(vol / 1_000_000).toFixed(0)}M`;
  if (vol >= 1_000)         return `${(vol / 1_000).toFixed(0)}K`;
  return vol > 0 ? vol.toString() : "—";
}

// Decorative mini sparkline — purely visual, not real data
function MiniSparkline({ positive }: { positive: boolean }) {
  const color = positive ? "#00FF88" : "#FF3B5C";
  const path = positive
    ? "M0,16 C6,14 10,10 16,8 C22,6 26,4 32,2"
    : "M0,2 C6,4 10,8 16,10 C22,12 26,14 32,16";
  return (
    <svg width="32" height="18" viewBox="0 0 32 18" fill="none" className="opacity-60">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Skeleton loading state
function QuoteCardSkeleton() {
  return (
    <div className="card p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded" style={{ background: "var(--surface-highest)" }} />
          <div className="h-2.5 w-28 rounded" style={{ background: "var(--surface-highest)" }} />
        </div>
        <div className="h-4 w-16 rounded" style={{ background: "var(--surface-highest)" }} />
      </div>
      <div className="h-6 w-24 rounded" style={{ background: "var(--surface-highest)" }} />
      <div className="flex justify-between">
        <div className="h-2.5 w-16 rounded" style={{ background: "var(--surface-highest)" }} />
        <div className="h-2.5 w-12 rounded" style={{ background: "var(--surface-highest)" }} />
      </div>
    </div>
  );
}

export default function QuoteCard({ quote, loading = false }: QuoteCardProps) {
  if (loading || !quote) return <QuoteCardSkeleton />;

  const positive = quote.percent_change >= 0;
  const changeColor = positive ? "#00FF88" : "#FF3B5C";
  const changeBg = positive ? "rgba(0,255,136,0.08)" : "rgba(255,59,92,0.08)";
  const arrow = positive ? "▲" : "▼";
  const shortSymbol = quote.symbol.split("/")[0];

  return (
    <div
      className="card p-4 space-y-3 transition-all cursor-default"
      style={{ borderColor: "var(--outline)" }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = positive ? "rgba(0,255,136,0.25)" : "rgba(255,59,92,0.2)")}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "var(--outline)")}
    >
      {/* Top row: symbol + change badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono-data font-bold text-sm text-white">{quote.symbol}</p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--on-surface-dim)" }}>{quote.name}</p>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold font-mono-data flex-shrink-0"
          style={{ background: changeBg, color: changeColor }}
        >
          <span>{arrow}</span>
          <span>{Math.abs(quote.percent_change).toFixed(2)}%</span>
        </div>
      </div>

      {/* Price + sparkline */}
      <div className="flex items-end justify-between">
        <p className="font-mono-data font-bold text-lg text-white leading-none">
          ${formatPrice(quote.price)}
        </p>
        <MiniSparkline positive={positive} />
      </div>

      {/* Bottom row: volume + H/L */}
      <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--on-surface-dim)" }}>
        {quote.volume > 0 ? (
          <span>Vol <span className="font-mono-data">{formatVolume(quote.volume)}</span></span>
        ) : (
          <span>
            H <span className="font-mono-data text-white">{formatPrice(quote.high)}</span>
            {" · "}
            L <span className="font-mono-data text-white">{formatPrice(quote.low)}</span>
          </span>
        )}
        <span
          className="font-mono-data"
          style={{ color: positive ? "rgba(0,255,136,0.6)" : "rgba(255,59,92,0.6)" }}
        >
          {positive ? "+" : ""}{quote.change > 0 || quote.change < 0 ? (positive ? "+" : "") + (quote.change >= 1 ? quote.change.toFixed(2) : quote.change.toFixed(5)) : "0.00"}
        </span>
      </div>
    </div>
  );
}
