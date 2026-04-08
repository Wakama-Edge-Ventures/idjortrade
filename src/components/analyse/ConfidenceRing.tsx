interface ConfidenceRingProps {
  confidence: number;
  size?: number;
}

export default function ConfidenceRing({ confidence, size = 100 }: ConfidenceRingProps) {
  const r = size * 0.42;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - confidence / 100);
  const color =
    confidence >= 75 ? "var(--bullish)" : confidence >= 50 ? "#F5A623" : "var(--bearish)";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="var(--bullish-muted)"
          strokeWidth={size * 0.08}
        />
        {/* Progress */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.08}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        {/* Value */}
        <text
          x={cx}
          y={cx}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontFamily="JetBrains Mono, monospace"
          fontSize={size * 0.2}
          fontWeight="700"
        >
          {confidence}%
        </text>
      </svg>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        Confiance IA
      </p>
    </div>
  );
}
