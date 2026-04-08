"use client";

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

/** Formats a price number based on its magnitude */
function formatPrice(price: number): string {
  if (price > 1000) return price.toLocaleString('fr-FR');
  if (price > 10) return price.toFixed(2);
  return price.toFixed(4);
}

export default function TradeTable({ trades }: { trades: TradeEntry[] }) {
  return (
    <div className="card overflow-hidden hidden md:block">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['Date', 'Actif', 'Direction', 'Entrée', 'Sortie', 'P&L', 'R', 'Source'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-secondary)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                Aucun trade pour l'instant. Fais ta première analyse sur{" "}
                <a href="/swing" style={{ color: 'var(--bullish)' }}>Swing Trading</a>
              </td>
            </tr>
          )}
          {trades.map((trade) => (
            <tr
              key={trade.id}
              className="transition-colors"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--surface-high)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {trade.date}
              </td>
              <td className="px-4 py-3 font-data text-xs font-semibold text-white">
                {trade.asset}
              </td>
              <td className="px-4 py-3">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                  style={
                    trade.direction === 'BUY'
                      ? { background: 'rgba(20,241,149,0.12)', color: 'var(--bullish)' }
                      : { background: 'rgba(244,63,94,0.12)', color: 'var(--bearish)' }
                  }
                >
                  {trade.direction === 'BUY' ? 'ACHAT' : 'VENTE'}
                </span>
              </td>
              <td className="px-4 py-3 font-data text-xs text-white">
                {formatPrice(trade.entry)}
              </td>
              <td className="px-4 py-3 font-data text-xs" style={{ color: 'var(--text-secondary)' }}>
                {trade.exit !== null ? formatPrice(trade.exit) : (
                  <span style={{ color: '#F5A623' }}>En cours</span>
                )}
              </td>
              <td className="px-4 py-3 font-data text-xs font-bold">
                {trade.pnlFCFA !== null ? (
                  <span style={{ color: trade.pnlFCFA >= 0 ? 'var(--bullish)' : 'var(--bearish)' }}>
                    {trade.pnlFCFA >= 0 ? '+' : ''}{trade.pnlFCFA.toLocaleString('fr-FR')} F
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>—</span>
                )}
              </td>
              <td className="px-4 py-3 font-data text-xs font-bold">
                {trade.rRealized !== null ? (
                  <span style={{ color: trade.rRealized >= 0 ? '#00CC6A' : 'var(--bearish)' }}>
                    {trade.rRealized >= 0 ? '+' : ''}{trade.rRealized}R
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  style={
                    trade.source === 'IA'
                      ? { background: 'rgba(20,241,149,0.1)', color: '#00CC6A' }
                      : { background: 'var(--surface-highest)', color: 'var(--text-secondary)' }
                  }
                >
                  {trade.source}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
