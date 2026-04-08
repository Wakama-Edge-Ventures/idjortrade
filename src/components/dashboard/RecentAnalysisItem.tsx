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
  BUY:    { bg: "rgba(20,241,149,0.10)",  color: "var(--bullish)", label: "ACHAT" },
  SELL:   { bg: "rgba(244,63,94,0.10)",   color: "#F43F5E", label: "VENTE" },
  NEUTRE: { bg: "rgba(100,116,139,0.10)", color: "#64748B", label: "NEUTRE" },
};

function scoreColor(score: number): string {
  if (score > 75) return "#14F195";
  if (score > 50) return "#C9A84C";
  return "#F43F5E";
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
      className="card card-interactive flex items-center gap-4 px-4 py-3"
      style={{ borderRadius: "10px" }}
    >
      {/* Asset logo */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 font-data"
        style={{
          background: "var(--surface-highest)",
          color: "var(--text-secondary)",
        }}
      >
        {base.slice(0, 3)}
      </div>

      {/* Name + date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{asset}</p>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{time}</p>
      </div>

      {/* Signal badge */}
      <span
        className="text-[10px] font-bold px-2.5 py-1 rounded-md flex-shrink-0 font-data"
        style={{
          background: sig.bg,
          color: sig.color,
          border: `1px solid ${sig.color}30`,
          letterSpacing: "0.04em",
        }}
      >
        {sig.label}
      </span>

      {/* Score IA */}
      <div className="text-right flex-shrink-0 w-12">
        <p className="font-data text-sm font-bold" style={{ color: scoreColor(score) }}>
          {score}
        </p>
        <p className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>score IA</p>
      </div>
    </Link>
  );
}
