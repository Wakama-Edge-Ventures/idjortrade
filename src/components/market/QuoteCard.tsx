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

function MiniSparkline({ positive }: { positive: boolean }) {
  const color = positive ? "var(--bullish)" : "var(--bearish)";
  const path  = positive
    ? "M0,16 C6,14 10,10 16,8 C22,6 26,4 32,2"
    : "M0,2 C6,4 10,8 16,10 C22,12 26,14 32,16";
  return (
    <svg width="32" height="18" viewBox="0 0 32 18" fill="none" className="opacity-60" aria-hidden="true">
      <path d={path} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function QuoteCardSkeleton() {
  return (
    <div className="card p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-2.5 w-28 rounded" />
        </div>
        <div className="skeleton h-4 w-16 rounded" />
      </div>
      <div className="skeleton h-6 w-24 rounded" />
      <div className="flex justify-between">
        <div className="skeleton h-2.5 w-16 rounded" />
        <div className="skeleton h-2.5 w-12 rounded" />
      </div>
    </div>
  );
}

export default function QuoteCard({ quote, loading = false }: QuoteCardProps) {
  if (loading || !quote) return <QuoteCardSkeleton />;

  const positive    = quote.percent_change >= 0;
  const changeColor = positive ? "var(--bullish)" : "var(--bearish)";
  const changeBg    = positive ? "var(--bullish-muted)" : "var(--bearish-muted)";
  const arrow       = positive ? "▲" : "▼";

  return (
    <div
      className="card quote-card p-4 space-y-3 cursor-default"
      data-positive={positive ? "true" : "false"}
    >
      {/* Top: symbol + badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-data font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            {quote.symbol}
          </p>
          <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
            {quote.name}
          </p>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold font-data flex-shrink-0"
          style={{ background: changeBg, color: changeColor }}
        >
          <span aria-hidden="true">{arrow}</span>
          <span>{Math.abs(quote.percent_change).toFixed(2)}%</span>
        </div>
      </div>

      {/* Prix + sparkline */}
      <div className="flex items-end justify-between">
        <p className="font-data font-bold text-lg leading-none" style={{ color: "var(--text-primary)" }}>
          ${formatPrice(quote.price)}
        </p>
        <MiniSparkline positive={positive} />
      </div>

      {/* Volume / H-L */}
      <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--text-secondary)" }}>
        {quote.volume > 0 ? (
          <span>Vol <span className="font-data">{formatVolume(quote.volume)}</span></span>
        ) : (
          <span>
            H <span className="font-data" style={{ color: "var(--text-primary)" }}>{formatPrice(quote.high)}</span>
            {" · "}
            L <span className="font-data" style={{ color: "var(--text-primary)" }}>{formatPrice(quote.low)}</span>
          </span>
        )}
        <span className="font-data" style={{ color: changeColor, opacity: 0.7 }}>
          {positive ? "+" : ""}
          {quote.change !== 0
            ? (positive ? "+" : "") + (quote.change >= 1 ? quote.change.toFixed(2) : quote.change.toFixed(5))
            : "0.00"}
        </span>
      </div>
    </div>
  );
}
