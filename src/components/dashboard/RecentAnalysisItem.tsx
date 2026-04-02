import Link from "next/link";

type Signal = "BUY" | "SELL" | "NEUTRE";

interface RecentAnalysisItemProps {
  asset: string;
  signal: Signal;
  score: number;
  time: string;
  href: string;
}

const signalStyles: Record<Signal, { bg: string; color: string; label: string }> = {
  BUY: { bg: "rgba(0,255,136,0.12)", color: "#00FF88", label: "ACHAT" },
  SELL: { bg: "rgba(255,59,92,0.12)", color: "#FF3B5C", label: "VENTE" },
  NEUTRE: { bg: "rgba(167,170,187,0.1)", color: "#A7AABB", label: "NEUTRE" },
};

function scoreColor(score: number): string {
  if (score > 75) return "#00FF88";
  if (score > 50) return "#F5A623";
  return "#FF3B5C";
}

export default function RecentAnalysisItem({
  asset,
  signal,
  score,
  time,
  href,
}: RecentAnalysisItemProps) {
  const sig = signalStyles[signal];
  const [base] = asset.split("/");

  return (
    <Link
      href={href}
      className="card flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-high"
      style={{ borderRadius: "10px" }}
    >
      {/* Asset logo */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{
          background: "var(--surface-highest)",
          color: "var(--on-surface)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {base.slice(0, 3)}
      </div>

      {/* Name + date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{asset}</p>
        <p className="text-xs" style={{ color: "var(--on-surface-dim)" }}>
          {time}
        </p>
      </div>

      {/* Signal badge */}
      <span
        className="text-[10px] font-bold px-2 py-1 rounded-md flex-shrink-0"
        style={{ background: sig.bg, color: sig.color }}
      >
        {sig.label}
      </span>

      {/* Score IA */}
      <div className="text-right flex-shrink-0 w-12">
        <p
          className="font-mono-data text-sm font-bold"
          style={{ color: scoreColor(score) }}
        >
          {score}
        </p>
        <p className="text-[9px]" style={{ color: "var(--on-surface-dim)" }}>
          score IA
        </p>
      </div>
    </Link>
  );
}
