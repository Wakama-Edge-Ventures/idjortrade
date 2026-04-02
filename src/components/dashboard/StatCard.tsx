interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  trendUp?: boolean;
  borderColor?: string;
}

export default function StatCard({
  label,
  value,
  unit,
  trend,
  trendUp,
  borderColor = "rgba(255,255,255,0.1)",
}: StatCardProps) {
  return (
    <div
      className="card min-w-[160px] flex-shrink-0 p-4 flex flex-col gap-2"
      style={{ borderLeft: `2px solid ${borderColor}` }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--on-surface-dim)" }}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono-data text-2xl font-bold text-white">
          {value}
        </span>
        {unit && (
          <span
            className="text-xs font-medium"
            style={{ color: "var(--on-surface-dim)" }}
          >
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <p
          className="text-xs font-medium"
          style={{
            color:
              trendUp === undefined
                ? "var(--on-surface-dim)"
                : trendUp
                ? "#00FF88"
                : "#FF3B5C",
          }}
        >
          {trend}
        </p>
      )}
    </div>
  );
}
