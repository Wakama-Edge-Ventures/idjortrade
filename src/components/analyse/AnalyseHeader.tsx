interface AnalyseHeaderProps {
  title: string;
  subtitle: string;
  mode: "swing" | "scalp";
  accentColor: string;
}

export default function AnalyseHeader({
  title,
  subtitle,
  mode,
  accentColor,
}: AnalyseHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-start gap-4">
        {/* Icône SVG custom */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}15`, color: accentColor }}>
          {mode === "swing" ? (
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
              <path d="M2 14 C5 14 5 8 8 8 C11 8 11 14 14 14 C17 14 17 8 20 8"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
              <polyline points="2,16 6,8 10,13 14,4 18,9 22,4"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-headline text-2xl font-bold text-white">{title}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(0,255,136,0.12)",
                color: "#00FF88",
                border: "1px solid rgba(0,255,136,0.2)",
              }}>
              ACTIF
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>{subtitle}</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl self-start sm:flex-shrink-0"
        style={{
          background: "rgba(245,166,35,0.06)",
          border: "1px solid rgba(245,166,35,0.15)",
        }}>
        <span style={{ color: "#F5A623" }}>⚠</span>
        <p className="text-[11px]" style={{ color: "var(--on-surface-dim)" }}>
          Pas un conseil financier
        </p>
      </div>
    </div>
  );
}
