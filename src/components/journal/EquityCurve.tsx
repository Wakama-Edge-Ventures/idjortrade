export default function EquityCurve() {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline font-bold text-base text-white">
          Courbe d&apos;équité
        </h3>
        <span
          className="text-xs font-semibold px-2 py-1 rounded-lg"
          style={{ background: 'var(--surface-highest)', color: 'var(--on-surface-dim)' }}
        >
          Fév — Avr 2026
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
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[30, 60, 90].map((y) => (
          <line key={y} x1="0" y1={y} x2="500" y2={y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* Area fill under curve */}
        <path
          d="M0,100 C30,95 50,90 80,82 C110,74 130,78 160,68 C190,58 210,62 240,50 C270,38 290,42 320,32 C350,22 380,26 410,16 C440,10 470,8 500,4 L500,120 L0,120 Z"
          fill="url(#equityGrad)"
        />

        {/* Equity line */}
        <path
          d="M0,100 C30,95 50,90 80,82 C110,74 130,78 160,68 C190,58 210,62 240,50 C270,38 290,42 320,32 C350,22 380,26 410,16 C440,10 470,8 500,4"
          fill="none"
          stroke="#00FF88"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Month labels */}
        {[
          { x: 40, label: 'Fév' },
          { x: 210, label: 'Mar' },
          { x: 420, label: 'Avr' },
        ].map(({ x, label }) => (
          <text
            key={label}
            x={x}
            y={115}
            textAnchor="middle"
            fill="var(--on-surface-dim)"
            fontSize="10"
            fontFamily="DM Sans, sans-serif"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
