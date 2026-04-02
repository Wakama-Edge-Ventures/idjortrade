import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function IdjorBanner() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6"
      style={{
        background: "linear-gradient(135deg, #1A1200, #1A1208)",
        border: "1px solid rgba(245,166,35,0.2)",
      }}
    >
      {/* Left content */}
      <div className="flex-1 space-y-3">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
          style={{
            background: "rgba(245,166,35,0.15)",
            color: "#F5A623",
            border: "1px solid rgba(245,166,35,0.25)",
          }}
        >
          <Sparkles size={11} />
          Nouveau
        </span>

        <h2 className="font-headline text-xl md:text-2xl font-bold text-white leading-snug">
          Idjor IA te coach gratuitement.
        </h2>

        <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-dim)" }}>
          Pose tes questions en français sur le trading, les stratégies,
          la lecture de graphiques. Ton assistant IA personnel, disponible 24h/24.
        </p>

        <Link
          href="/idjor-ia"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: "#F5A623",
            color: "#0A0E1A",
          }}
        >
          <Sparkles size={14} />
          Discuter avec Idjor
        </Link>
      </div>

      {/* Right avatar */}
      <div className="flex-shrink-0 hidden sm:block">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center glow-amber"
          style={{
            background: "linear-gradient(135deg, #F5A623, #D4870A)",
          }}
        >
          <Sparkles size={36} color="white" />
        </div>
      </div>
    </div>
  );
}
