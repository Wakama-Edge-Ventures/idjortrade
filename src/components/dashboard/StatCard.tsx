interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  accentColor?: string;
}

export default function StatCard({
  label,
  value,
  unit,
  trend,
  trendUp,
  accentColor = "var(--sol-purple)",
}: StatCardProps) {
  const trendColor =
    trendUp === undefined
      ? "var(--text-tertiary)"
      : trendUp
      ? "var(--bullish)"
      : "var(--bearish)";

  return (
    <div
      className="card card-interactive min-w-[160px] flex-shrink-0 p-4 flex flex-col gap-2"
      style={{ borderLeft: `2px solid ${accentColor}` }}
    >
      <p className="section-label">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span
          className="font-data font-bold text-2xl"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <p className="text-xs font-medium" style={{ color: trendColor }}>
          {trend}
        </p>
      )}
    </div>
  );
}
