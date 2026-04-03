type TradePoint = { asset: string; pnlFCFA: number | null; status: string };

/** Bar chart showing P&L per trading asset — calculated from real trades */
export default function AssetPerf({ trades }: { trades: TradePoint[] }) {
  // Group P&L by asset for closed trades
  const byAsset: Record<string, number> = {};
  trades
    .filter((t) => t.status === "closed")
    .forEach((t) => {
      byAsset[t.asset] = (byAsset[t.asset] ?? 0) + (t.pnlFCFA ?? 0);
    });

  const assetData = Object.entries(byAsset)
    .map(([symbol, pnl]) => ({ symbol, pnl }))
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 5);

  if (assetData.length === 0) {
    return (
      <div className="card p-5 flex items-center justify-center">
        <p className="text-xs text-center" style={{ color: 'var(--on-surface-dim)' }}>Aucune donnée</p>
      </div>
    );
  }

  const maxAbs = Math.max(...assetData.map((d) => Math.abs(d.pnl)));

  return (
    <div className="card p-5 space-y-4">
      <h3 className="font-headline font-bold text-base text-white">
        Performance par actif
      </h3>
      <div className="space-y-3">
        {assetData.map((item) => {
          const pct = maxAbs > 0 ? (Math.abs(item.pnl) / maxAbs) * 100 : 0;
          const color = item.pnl > 0 ? '#00FF88' : item.pnl < 0 ? '#FF3B5C' : 'var(--surface-highest)';
          return (
            <div key={item.symbol} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-mono-data font-semibold" style={{ color: 'var(--on-surface)' }}>
                  {item.symbol}
                </span>
                <span className="font-mono-data font-bold" style={{ color }}>
                  {item.pnl === 0 ? '—' : `${item.pnl > 0 ? '+' : ''}${item.pnl.toLocaleString('fr-FR')} F`}
                </span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-highest)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: color, opacity: item.pnl === 0 ? 0.3 : 1 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
