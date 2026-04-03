type TradeEntry = {
  id: string;
  date: string;
  asset: string;
  direction: 'BUY' | 'SELL';
  entry: number;
  exit: number | null;
  pnlFCFA: number | null;
  rRealized: number | null;
  source: 'IA' | 'Manuel';
  status: 'closed' | 'open';
};

/** Mobile card list — shown on small screens, hidden on md+ (complement to TradeTable) */
export default function TradeCards({ trades }: { trades: TradeEntry[] }) {
  return (
    <div className="space-y-3 md:hidden">
      {trades.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm" style={{ color: 'var(--on-surface-dim)' }}>
            Aucun trade pour l'instant. Fais ta première analyse sur{" "}
            <a href="/swing" style={{ color: '#00FF88' }}>Swing Trading</a>
          </p>
        </div>
      )}
      {trades.map((trade) => (
        <div key={trade.id} className="card p-4 flex items-center gap-4">
          {/* Asset abbreviation icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 font-mono-data"
            style={{ background: 'var(--surface-highest)', color: 'var(--on-surface)' }}
          >
            {trade.asset.split('/')[0].slice(0, 3)}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{trade.asset}</span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={
                  trade.direction === 'BUY'
                    ? { background: 'rgba(0,255,136,0.12)', color: '#00FF88' }
                    : { background: 'rgba(255,59,92,0.12)', color: '#FF3B5C' }
                }
              >
                {trade.direction === 'BUY' ? 'ACHAT' : 'VENTE'}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>{trade.date}</p>
          </div>

          {/* P&L */}
          <div className="text-right">
            {trade.pnlFCFA !== null ? (
              <>
                <p
                  className="font-mono-data text-base font-bold"
                  style={{ color: trade.pnlFCFA >= 0 ? '#00FF88' : '#FF3B5C' }}
                >
                  {trade.pnlFCFA >= 0 ? '+' : ''}{trade.pnlFCFA.toLocaleString('fr-FR')}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--on-surface-dim)' }}>FCFA</p>
              </>
            ) : (
              <p className="text-xs font-semibold" style={{ color: '#F5A623' }}>En cours</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
