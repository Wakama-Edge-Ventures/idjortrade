import Link from "next/link";
import { Lock } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AnalysisHistoryCard from "@/components/historique/AnalysisHistoryCard";
import type { AnalysisEntry } from "@/types/analyse";

export default async function HistoriquePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const plan = session.user.plan as string;

  // Determine history window by plan
  let createdAfter: Date | undefined;
  if (plan === "FREE") {
    createdAfter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  } else if (plan === "BASIC") {
    createdAfter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  }

  const analyses = await prisma.analyse.findMany({
    where: {
      userId: session.user.id,
      ...(createdAfter ? { createdAt: { gte: createdAfter } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // For FREE: show 3 max + lock the rest
  const visibleRaw = plan === "FREE" ? analyses.slice(0, 3) : analyses;
  const lockedRaw = plan === "FREE" ? analyses.slice(3) : [];

  // Map to AnalysisEntry shape for AnalysisHistoryCard
  const toEntry = (a: typeof analyses[0], isLocked: boolean): AnalysisEntry => ({
    id: a.id,
    asset: a.asset,
    timeframe: a.timeframe,
    mode: a.mode as "swing" | "scalp",
    signal: a.signal as "BUY" | "SELL" | "NEUTRE",
    confidence: a.confidence,
    date: new Date(a.createdAt).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    rRealized: null,
    tracked: false,
    locked: isLocked,
  });

  // Calculate real stats
  const thisMonth = analyses.filter(
    (a) => new Date(a.createdAt).getMonth() === new Date().getMonth()
  );
  const buyCount = analyses.filter((a) => a.signal === "BUY").length;
  const buyPct = analyses.length > 0 ? Math.round((buyCount / analyses.length) * 100) : 0;

  const stats = [
    { label: "Analyses ce mois", value: String(thisMonth.length) },
    { label: "Signaux BUY", value: `${buyPct}%` },
    { label: "Win rate suivi", value: "—" },
  ];

  // Empty state
  if (analyses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div>
          <h1 className="font-display font-semibold text-2xl text-white">Historique</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Toutes vos analyses précédentes
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Aucune analyse pour l'instant.
          </p>
          <Link
            href="/swing"
            className="px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "var(--sol-gradient)", color: "white" }}
          >
            Faire ma première analyse →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-semibold text-2xl text-white">Historique</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Toutes vos analyses précédentes
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="font-data text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Free tier notice */}
      {plan === "FREE" && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{
            background: "rgba(245,166,35,0.05)",
            border: "1px solid rgba(245,166,35,0.15)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Plan Gratuit · 7 jours d&apos;historique seulement
          </p>
          <Link href="/plans" className="text-xs font-bold" style={{ color: "#F5A623" }}>
            Upgrader →
          </Link>
        </div>
      )}

      {/* Analyses visibles */}
      <section className="space-y-3">
        <h2 className="font-display font-semibold text-lg text-white">Analyses récentes</h2>
        {visibleRaw.map((a) => (
          <AnalysisHistoryCard key={a.id} analysis={toEntry(a, false)} />
        ))}
      </section>

      {/* Analyses locked */}
      {lockedRaw.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display font-semibold text-lg" style={{ color: "var(--text-secondary)" }}>
            Analyses précédentes (verrouillées)
          </h2>
          {lockedRaw.map((a) => (
            <AnalysisHistoryCard key={a.id} analysis={toEntry(a, true)} />
          ))}
        </section>
      )}

      {/* CTA upgrade */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
        style={{
          border: "2px dashed rgba(245,166,35,0.25)",
          background: "rgba(245,166,35,0.03)",
        }}
      >
        <div className="flex-shrink-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(245,166,35,0.1)" }}
          >
            <Lock size={22} style={{ color: "#F5A623" }} />
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-white">
            Accédez à tout votre historique
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Passez au plan Basic ou Pro pour débloquer 90 jours à l&apos;illimité d&apos;historique.
          </p>
        </div>
        <Link
          href="/plans"
          className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#F5A623", color: "white" }}
        >
          Voir les plans
        </Link>
      </div>

    </div>
  );
}
