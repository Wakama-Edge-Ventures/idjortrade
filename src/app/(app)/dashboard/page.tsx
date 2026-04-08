import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PerformanceGrid from "@/components/dashboard/PerformanceGrid";
import ToolCard from "@/components/dashboard/ToolCard";
import IdjorBanner from "@/components/dashboard/IdjorBanner";
import RecentAnalysisItem from "@/components/dashboard/RecentAnalysisItem";
import TopMovers from "@/components/dashboard/TopMovers";
import WeexBanner from "@/components/shared/WeexBanner";

function calcStreak(tradeDates: Date[]): number {
  if (!tradeDates.length) return 0;
  const days = Array.from(
    new Set(tradeDates.map((d) => d.toISOString().slice(0, 10)))
  ).sort((a, b) => b.localeCompare(a));

  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let cursor = today;

  for (const day of days) {
    if (day === cursor) {
      streak++;
      const prev = new Date(cursor);
      prev.setDate(prev.getDate() - 1);
      cursor = prev.toISOString().slice(0, 10);
    } else {
      break;
    }
  }
  return streak;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [trades, analysesCount, recents] = await Promise.all([
    prisma.trade.findMany({
      where: { userId },
      select: { pnlFCFA: true, status: true, openedAt: true },
      orderBy: { openedAt: "desc" },
    }),
    prisma.analyse.count({ where: { userId } }),
    prisma.analyse.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, asset: true, signal: true, confidence: true, createdAt: true },
    }),
  ]);

  const closedTrades = trades.filter((t) => t.status === "closed" && t.pnlFCFA !== null);
  const winners = closedTrades.filter((t) => (t.pnlFCFA ?? 0) > 0);
  const pnlTotal = closedTrades.reduce((sum, t) => sum + (t.pnlFCFA ?? 0), 0);
  const winRate = closedTrades.length > 0
    ? Math.round((winners.length / closedTrades.length) * 100)
    : 0;

  const streak = calcStreak(trades.map((t) => new Date(t.openedAt)));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-8">

      {/* Weex Affiliation */}
      <WeexBanner />

      {/* 1. KPI Grid */}
      <PerformanceGrid
        pnlTarget={Math.max(0, pnlTotal)}
        winRateTarget={winRate}
        streakTarget={streak}
        analysesTarget={analysesCount}
      />

      {/* 2. Outils */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className="font-display font-semibold text-xl text-gradient-sol-static"
            style={{ letterSpacing: "-0.02em" }}
          >
            Outils d&apos;analyse
          </h2>
          <span className="section-label">3 modes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-1 animate-fade-in-up">
          <ToolCard
            title="Swing Trading"
            description="Tendances long-terme. Analyses multi-jours H4/D1."
            icon={
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M2 14 C5 14 5 8 8 8 C11 8 11 14 14 14 C17 14 17 8 20 8"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            accentColor="#03E1FF"
            badge="H4 · D1"
            href="/swing"
          />
          <ToolCard
            title="Scalp Trading"
            description="Précision intraday. Déséquilibres M1/M5 rapides."
            icon={
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <polyline points="2,16 6,8 10,13 14,4 18,9 22,4"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            accentColor="#C9A84C"
            badge="M1 · M15"
            href="/scalp"
          />
          <ToolCard
            title="Forecasting PRO"
            description="IA prédictive sur les 12 prochaines bougies."
            icon={
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="2"/>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
                <line x1="11" y1="1" x2="11" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="11" y1="18" x2="11" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            accentColor="#9945FF"
            badge="PRO"
            href="/plans"
          />
        </div>
      </section>

      {/* 3. Banner Idjor IA */}
      <IdjorBanner />

      {/* 4. Analyses + Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Analyses récentes */}
        <section className="lg:col-span-3 space-y-3 animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between">
            <h3
              className="font-display font-semibold text-lg text-gradient-sol-static"
              style={{ letterSpacing: "-0.02em" }}
            >
              Analyses Récentes
            </h3>
            <Link
              href="/historique"
              className="text-xs font-semibold transition-colors duration-150 hover:underline"
              style={{ color: "var(--sol-purple)" }}
            >
              Voir tout →
            </Link>
          </div>

          <div className="space-y-2">
            {recents.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Upload ton premier chart pour commencer
                </p>
                <Link href="/swing"
                  className="inline-block mt-3 text-xs font-bold"
                  style={{ color: "var(--bullish)" }}>
                  Analyser →
                </Link>
              </div>
            ) : (
              recents.map((a) => (
                <RecentAnalysisItem
                  key={a.id}
                  asset={a.asset}
                  signal={a.signal as "BUY" | "SELL" | "NEUTRE"}
                  score={a.confidence}
                  time={new Date(a.createdAt).toLocaleString("fr-FR", {
                    day: "2-digit", month: "short",
                    hour: "2-digit", minute: "2-digit",
                  })}
                  href={`/resultat/${a.id}`}
                />
              ))
            )}
          </div>
        </section>

        {/* Top Movers */}
        <section className="lg:col-span-2 space-y-3 animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between">
            <h3
              className="font-display font-semibold text-lg text-gradient-sol-static"
              style={{ letterSpacing: "-0.02em" }}
            >
              Top Movers
            </h3>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full font-data"
              style={{
                background: "rgba(153,69,255,0.12)",
                color: "var(--sol-purple)",
                border: "1px solid rgba(153,69,255,0.25)",
              }}
            >
              LIVE
            </span>
          </div>
          <div className="card overflow-hidden">
            <TopMovers />
          </div>
        </section>

      </div>
    </div>
  );
}
