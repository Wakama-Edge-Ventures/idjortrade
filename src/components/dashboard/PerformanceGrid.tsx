"use client";

import { useEffect, useState } from "react";

/* ── Hook count-up ──────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, delay = 200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return value;
}

/* ── Sparkline mini ─────────────────────────────────────────────────────────── */
function Sparkline({ color = "#14F195" }: { color?: string }) {
  return (
    <svg width="64" height="28" viewBox="0 0 64 28" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-fill-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 22 C8 22 8 18 16 14 C24 10 24 16 32 12 C40 8 40 14 48 6 C56 2 60 4 64 2"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 22 C8 22 8 18 16 14 C24 10 24 16 32 12 C40 8 40 14 48 6 C56 2 60 4 64 2 L64 28 L0 28Z"
        fill={`url(#spark-fill-${color.replace("#","")})`}
      />
    </svg>
  );
}

/* ── ProgressBar ────────────────────────────────────────────────────────────── */
function WinLossBar({ win, loss }: { win: number; loss: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(win), 400);
    return () => clearTimeout(t);
  }, [win]);

  return (
    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden max-w-[180px]">
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: "var(--sol-green)",
          transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <div
        className="h-full rounded-full"
        style={{
          width: `${100 - width}%`,
          background: "var(--bearish)",
          opacity: 0.7,
          transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}

/* ── StreakDots ─────────────────────────────────────────────────────────────── */
function StreakDots({ count }: { count: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: i < count ? 8 : 6,
            height: i < count ? 8 : 6,
            background: i < count ? "var(--gold)" : "var(--surface-highest)",
            border: i < count ? "none" : "1px solid var(--border-hover)",
            transition: `all 0.3s ease ${i * 0.07}s`,
            boxShadow: i < count ? "0 0 6px rgba(201,168,76,0.5)" : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ── Component principal ────────────────────────────────────────────────────── */
interface PerformanceGridProps {
  pnlTarget: number;
  winRateTarget: number;
  streakTarget: number;
  analysesTarget: number;
}

export default function PerformanceGrid({
  pnlTarget,
  winRateTarget,
  streakTarget,
  analysesTarget,
}: PerformanceGridProps) {
  const pnl      = useCountUp(pnlTarget, 1400, 300);
  const winRate  = useCountUp(winRateTarget, 900, 500);
  const streak   = useCountUp(streakTarget, 600, 700);
  const analyses = useCountUp(analysesTarget, 800, 400);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* ── Carte P&L principale — 2 colonnes ── */}
      <div
        className="col-span-2 relative overflow-hidden rounded-2xl p-6 animate-fade-in-up"
        style={{
          background: "linear-gradient(135deg, #0A0518 0%, #0F0D22 60%, #091A14 100%)",
          border: "1px solid rgba(153,69,255,0.20)",
          boxShadow: "0 0 40px rgba(153,69,255,0.10), var(--shadow-md)",
        }}
      >
        {/* Orbes décoratifs */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(153,69,255,0.12) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-6 left-8 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(20,241,149,0.08) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Header */}
        <p className="section-label mb-2 relative">Performance Globale</p>

        {/* Valeur P&L */}
        <div className="flex items-baseline gap-2 mb-4 relative">
          <span
            className="font-display font-semibold text-gradient-sol-static"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            +{pnl.toLocaleString("fr-FR")}
          </span>
          <span className="text-base font-medium" style={{ color: "var(--text-secondary)" }}>
            FCFA
          </span>
        </div>

        {/* Barre win/loss */}
        <WinLossBar win={winRate} loss={100 - winRate} />
        <div className="flex gap-5 mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>
          <span>
            <span className="font-data font-bold" style={{ color: "var(--bullish)" }}>{winRate}%</span>
            {" "}gagnants
          </span>
          <span>
            <span className="font-data font-bold" style={{ color: "var(--bearish)" }}>{100 - winRate}%</span>
            {" "}perdants
          </span>
        </div>

        {/* Sparkline + label */}
        <div
          className="absolute bottom-4 right-5 flex flex-col items-end gap-1"
          aria-hidden="true"
        >
          <Sparkline color="#14F195" />
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>ce mois</span>
        </div>
      </div>

      {/* ── Win Rate ── */}
      <div
        className="rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden animate-fade-in-up stagger-2"
        style={{
          background: "var(--surface-high)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle at top right, rgba(20,241,149,0.06) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Win Rate</p>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "var(--bullish-muted)",
              border: "1px solid rgba(20,241,149,0.25)",
              color: "var(--bullish)",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            %
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span
              className="font-data font-bold"
              style={{ fontSize: "2.6rem", lineHeight: 1, color: "var(--bullish)", letterSpacing: "-0.03em" }}
            >
              {winRate}
            </span>
            <span className="text-lg" style={{ color: "var(--text-secondary)" }}>%</span>
          </div>
          <p className="text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>
            Sur vos trades clôturés
          </p>
        </div>
      </div>

      {/* ── Streak + Analyses — stacked ── */}
      <div className="flex flex-col gap-4">

        {/* Streak */}
        <div
          className="flex-1 rounded-2xl p-4 flex flex-col gap-3 animate-fade-in-up stagger-3"
          style={{
            background: "var(--surface-high)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="section-label">Streak</p>
          <div className="flex items-baseline gap-1">
            <span
              className="font-data font-bold"
              style={{ fontSize: "1.8rem", lineHeight: 1, color: "var(--gold)", letterSpacing: "-0.03em" }}
            >
              {streak}
            </span>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>jours</span>
          </div>
          <StreakDots count={streak} />
        </div>

        {/* Analyses */}
        <div
          className="flex-1 rounded-2xl p-4 flex flex-col gap-2 animate-fade-in-up stagger-4"
          style={{
            background: "var(--surface-high)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center justify-between">
            <p className="section-label">Analyses</p>
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>ce mois</span>
          </div>
          <span
            className="font-data font-bold"
            style={{ fontSize: "1.8rem", lineHeight: 1, color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            {analyses}
          </span>
          {/* Barres de quota */}
          <div className="flex flex-col gap-1 mt-1">
            {[100, 75, 45].map((w, i) => (
              <div
                key={i}
                className="h-1 rounded-full"
                style={{
                  width: `${w}%`,
                  background: "var(--sol-gradient)",
                  opacity: 1 - i * 0.25,
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
