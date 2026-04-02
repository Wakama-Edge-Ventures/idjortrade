interface TopMoverItemProps {
  symbol: string;
  price: string;
  change: number;
}

export default function TopMoverItem({ symbol, price, change }: TopMoverItemProps) {
  const positive = change >= 0;
  const color = positive ? "#00FF88" : "#FF3B5C";

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Symbol */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
        style={{ background: "var(--surface-highest)", color: "var(--on-surface)" }}
      >
        {symbol.slice(0, 3)}
      </div>

      <span className="text-sm font-semibold text-white flex-1">{symbol}</span>

      <span
        className="font-mono-data text-sm text-right"
        style={{ color: "var(--on-surface-dim)", minWidth: "72px" }}
      >
        {price}
      </span>

      <span
        className="font-mono-data text-sm font-bold text-right"
        style={{ color, minWidth: "56px" }}
      >
        {positive ? "+" : ""}
        {change.toFixed(1)}%
      </span>
    </div>
  );
}
