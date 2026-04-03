type TradePoint = { openedAt: Date | string; pnlFCFA: number | null; status: string };

export default function EquityCurve({ trades }: { trades: TradePoint[] }) {
  // Filter to closed trades with a pnlFCFA value, sorted by date
  const closed = trades
    .filter((t) => t.status === "closed" && t.pnlFCFA !== null)
    .sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());

  if (closed.length === 0) {
    return (
      <div className="card p-5 h-full flex items-center justify-center">
        <p className="text-sm text-center" style={{ color: 'var(--on-surface-dim)' }}>
          Aucune donnée — clôture tes premiers trades pour voir la courbe
        </p>
      </div>
    );
  }

  // Calculate cumulative P&L points
  let cumulative = 0;
  const points = closed.map((t) => {
    cumulative += (t.pnlFCFA ?? 0);
    return cumulative;
  });

  const min = Math.min(0, ...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  // Generate SVG path points
  const svgPoints = points.map((p, i) => {
    const x = (i / Math.max(points.length - 1, 1)) * 500;
    const y = 110 - ((p - min) / range) * 100;
    return `${x},${y}`;
  });
  const pathD = `M${svgPoints.join(" L")}`;
  const areaD = `M${svgPoints.join(" L")} L500,120 L0,120 Z`;

  // Determine color based on final P&L
  const finalPnl = points[points.length - 1] ?? 0;
  const lineColor = finalPnl >= 0 ? '#00FF88' : '#FF3B5C';

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline font-bold text-base text-white">
          Courbe d&apos;équité
        </h3>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-lg font-mono-data"
          style={{
            background: 'var(--surface-highest)',
            color: finalPnl >= 0 ? '#00FF88' : '#FF3B5C',
          }}
        >
          {finalPnl >= 0 ? '+' : ''}{finalPnl.toLocaleString('fr-FR')} F
        </span>
      </div>

      <svg
        viewBox="0 0 500 120"
        className="w-full"
        style={{ height: '120px' }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[30, 60, 90].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="500"
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* Area fill under curve */}
        <path d={areaD} fill="url(#equityGrad)" />

        {/* Equity line */}
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
