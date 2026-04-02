// Heatmap des 90 derniers jours — données hardcodées représentatives
type DayData = { day: number; value: number }; // value: -1 perte, 0 vide, 1-3 gain intensité

function generateHeatmapData(): DayData[] {
  // 13 semaines × 7 jours = 91 jours
  const data: DayData[] = [];
  const pattern = [0, 2, -1, 1, 0, 3, 1, 0, -1, 2, 1, 0, 2, -1, 0, 1, 3, 0, -1, 1, 2];
  for (let i = 0; i < 91; i++) {
    data.push({ day: i, value: pattern[i % pattern.length] });
  }
  return data;
}

/** Maps a performance value to its cell background color */
function cellColor(value: number): string {
  if (value === 0) return 'var(--surface-high)';
  if (value === -1) return 'rgba(255,59,92,0.5)';
  if (value === 1) return 'rgba(0,255,136,0.25)';
  if (value === 2) return 'rgba(0,255,136,0.55)';
  return '#00FF88';
}

const days = generateHeatmapData();

export default function HeatmapCalendar() {
  const weeks = Array.from({ length: 13 }, (_, i) => days.slice(i * 7, i * 7 + 7));

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-bold text-base text-white">
          Calendrier de performance
        </h3>
        <span className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>
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
                title={d.value === 0 ? 'Pas de trade' : d.value === -1 ? 'Trade perdant' : 'Trade gagnant'}
                className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
                style={{ background: cellColor(d.value) }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--on-surface-dim)' }}>
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
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(255,59,92,0.5)' }} />
          Perte
        </span>
      </div>
    </div>
  );
}
