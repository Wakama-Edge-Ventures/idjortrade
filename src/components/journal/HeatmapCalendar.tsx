type TradePoint = { openedAt: Date | string; pnlFCFA: number | null; status: string };

/** Maps a performance value to its cell background color */
function cellColor(value: number): string {
  if (value === 0) return 'var(--surface-high)';
  if (value === -1) return 'rgba(244,63,94,0.5)';
  if (value === 1) return 'rgba(20,241,149,0.25)';
  if (value === 2) return 'rgba(20,241,149,0.55)';
  return 'var(--bullish)';
}

export default function HeatmapCalendar({ trades }: { trades: TradePoint[] }) {
  // Group closed trades by date
  const pnlByDate: Record<string, number> = {};
  trades
    .filter((t) => t.status === "closed" && t.pnlFCFA !== null)
    .forEach((t) => {
      const date = new Date(t.openedAt).toISOString().slice(0, 10);
      pnlByDate[date] = (pnlByDate[date] ?? 0) + (t.pnlFCFA ?? 0);
    });

  // Generate 91 days back from today
  function generateHeatmapData(): { day: number; value: number; date: string }[] {
    const data: { day: number; value: number; date: string }[] = [];
    const today = new Date();
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const pnl = pnlByDate[dateStr];
      let value = 0;
      if (pnl !== undefined) {
        if (pnl < 0) value = -1;
        else if (pnl < 10000) value = 1;
        else if (pnl < 30000) value = 2;
        else value = 3;
      }
      data.push({ day: i, value, date: dateStr });
    }
    return data;
  }

  const days = generateHeatmapData();
  const weeks = Array.from({ length: 13 }, (_, i) => days.slice(i * 7, i * 7 + 7));

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-base text-white">
          Calendrier de performance
        </h3>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          90 derniers jours
        </span>
      </div>

      {/* Heatmap grid — 13 columns (weeks) × 7 rows (days) */}
      <div className="flex gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((d) => (
              <div
                key={d.day}
                title={`${d.date} — ${d.value === 0 ? 'Pas de trade' : d.value === -1 ? 'Trade perdant' : 'Trade gagnant'}`}
                className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
                style={{ background: cellColor(d.value) }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>Moins</span>
        {[0, 1, 2, 3, -1].map((v, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ background: cellColor(v) }}
          />
        ))}
        <span>Plus</span>
        <span className="ml-2 flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(244,63,94,0.5)' }} />
          Perte
        </span>
      </div>
    </div>
  );
}
