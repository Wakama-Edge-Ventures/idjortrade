export default function PerformanceGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

      {/* Grande carte P&L — prend 2 colonnes */}
      <div className="col-span-2 relative overflow-hidden rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, #0A1A0F 0%, #0E1320 100%)',
          border: '1px solid rgba(0,255,136,0.15)'
        }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
          style={{ background: 'rgba(0,255,136,0.08)' }} />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-1"
          style={{ color: 'var(--on-surface-dim)' }}>
          Performance Globale
        </p>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-5xl font-bold font-mono-data"
            style={{ color: 'var(--primary)' }}>
            +127 500
          </span>
          <span className="text-lg" style={{ color: 'var(--on-surface-dim)' }}>FCFA</span>
        </div>
        <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mb-3 max-w-[200px]">
          <div className="h-full rounded-full" style={{ width: '63%', background: 'var(--primary)' }} />
          <div className="h-full rounded-full" style={{ width: '37%', background: 'var(--bearish)' }} />
        </div>
        <div className="flex gap-4 text-xs" style={{ color: 'var(--on-surface-dim)' }}>
          <span><span className="font-bold" style={{ color: 'var(--primary)' }}>63%</span> gagnants</span>
          <span><span className="font-bold" style={{ color: 'var(--bearish)' }}>37%</span> perdants</span>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs"
          style={{ color: 'var(--primary)' }}>
          <svg width="40" height="20" viewBox="0 0 40 20">
            <polyline points="0,18 10,12 20,14 30,6 40,2"
              fill="none" stroke="#00FF88" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          ce mois
        </div>
      </div>

      {/* Win Rate */}
      <div className="rounded-2xl p-5 flex flex-col justify-between"
        style={{ background: '#0E1320' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--on-surface-dim)' }}>
            Win Rate
          </span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ border: '1.5px solid rgba(0,255,136,0.3)', color: 'var(--primary)' }}>
            %
          </div>
        </div>
        <div>
          <span className="text-4xl font-bold font-mono-data" style={{ color: 'var(--primary)' }}>67</span>
          <span className="text-xl" style={{ color: 'var(--on-surface-dim)' }}>%</span>
          <p className="text-xs mt-1" style={{ color: 'var(--on-surface-dim)' }}>↑ +4pts ce mois</p>
        </div>
      </div>

      {/* Streak + Analyses — stacked */}
      <div className="flex flex-col gap-3">
        <div className="flex-1 rounded-2xl p-4 flex items-center justify-between"
          style={{ background: '#0E1320' }}>
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--on-surface-dim)' }}>
              Streak
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono-data" style={{ color: '#F5A623' }}>5</span>
              <span className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>jours</span>
            </div>
          </div>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{ background: '#F5A623', opacity: i * 0.18 + 0.1 }} />
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-2xl p-4 flex items-center justify-between"
          style={{ background: '#0E1320' }}>
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--on-surface-dim)' }}>
              Analyses
            </p>
            <span className="text-2xl font-bold font-mono-data text-white">23</span>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <div className="h-1 w-8 rounded-full" style={{ background: 'var(--primary)' }} />
            <div className="h-1 w-6 rounded-full" style={{ background: 'var(--primary)', opacity: 0.6 }} />
            <div className="h-1 w-4 rounded-full" style={{ background: 'var(--primary)', opacity: 0.3 }} />
            <p className="text-[10px] mt-1" style={{ color: 'var(--on-surface-dim)' }}>3/3 quota</p>
          </div>
        </div>
      </div>

    </div>
  );
}
