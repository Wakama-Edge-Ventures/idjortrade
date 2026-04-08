interface TopMoverItemProps {
  symbol: string;
  price: string;
  change: number;
}

export default function TopMoverItem({ symbol, price, change }: TopMoverItemProps) {
  const positive = change >= 0;
  const color = positive ? "var(--bullish)" : "var(--bearish)";
  const base  = symbol.replace(/USDT|BUSD|USD/, "").slice(0, 3);

  return (
    <div className="top-mover-row flex items-center gap-3 px-4 py-3 rounded-lg">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-data"
        style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}
      >
        {base}
      </div>

      <span className="text-sm font-semibold flex-1" style={{ color: "var(--text-primary)" }}>
        {symbol}
      </span>

      <span className="font-data text-sm text-right" style={{ color: "var(--text-secondary)", minWidth: 72 }}>
        {price}
      </span>

      <span className="font-data text-sm font-bold text-right" style={{ color, minWidth: 56 }}>
        {positive ? "+" : ""}{change.toFixed(1)}%
      </span>
    </div>
  );
}
