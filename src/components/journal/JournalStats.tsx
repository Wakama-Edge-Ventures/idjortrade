interface JournalStatsProps {
  stats: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    totalPnlFCFA: number;
    bestTradeFCFA: number;
    bestTradeAsset: string;
  };
}

export default function JournalStats({ stats }: JournalStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

      {/* P&L Total — spans 2 columns */}
      <div
        className="col-span-2 relative overflow-hidden rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, #0A1A0F 0%, #0E1320 100%)',
          border: '1px solid rgba(0,255,136,0.15)',
        }}
      >
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
          style={{ background: 'rgba(0,255,136,0.08)' }}
        />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-1"
          style={{ color: 'var(--on-surface-dim)' }}>
          P&amp;L Total
        </p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-mono-data text-4xl font-bold" style={{ color: '#00FF88' }}>
            +{stats.totalPnlFCFA.toLocaleString('fr-FR')}
          </span>
          <span className="text-base" style={{ color: 'var(--on-surface-dim)' }}>FCFA</span>
        </div>
        {/* Mini sparkline */}
        <svg width="120" height="30" viewBox="0 0 120 30" className="mb-2">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,25 L20,20 L40,22 L60,15 L80,10 L100,5 L120,2"
            fill="none" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round"
          />
          <path
            d="M0,25 L20,20 L40,22 L60,15 L80,10 L100,5 L120,2 L120,30 L0,30 Z"
            fill="url(#sparkGrad)"
          />
        </svg>
        <p className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>
          <span className="font-bold" style={{ color: '#00FF88' }}>{stats.totalTrades}</span> trades clôturés
        </p>
      </div>

      {/* Win Rate */}
      <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: '#0E1320' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--on-surface-dim)' }}>
            Win Rate
          </span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ border: '1.5px solid rgba(0,255,136,0.3)', color: '#00FF88' }}
          >
            %
          </div>
        </div>
        <div>
          <span className="font-mono-data text-4xl font-bold" style={{ color: '#00FF88' }}>
            {stats.winRate}
          </span>
          <span className="text-xl" style={{ color: 'var(--on-surface-dim)' }}>%</span>
          <p className="text-xs mt-1" style={{ color: 'var(--on-surface-dim)' }}>
            Profit Factor: <span className="font-bold text-white">{stats.profitFactor}</span>
          </p>
        </div>
      </div>

      {/* Meilleur trade */}
      <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: '#0E1320' }}>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--on-surface-dim)' }}>
          Meilleur Trade
        </p>
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-mono-data text-2xl font-bold" style={{ color: '#00FF88' }}>
              +{stats.bestTradeFCFA.toLocaleString('fr-FR')}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>FCFA</p>
          <p
            className="text-xs font-semibold mt-2 font-mono-data"
            style={{ color: 'var(--on-surface)' }}
          >
            {stats.bestTradeAsset}
          </p>
        </div>
      </div>

    </div>
  );
}
