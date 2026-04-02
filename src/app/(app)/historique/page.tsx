import Link from "next/link";
import { Lock } from "lucide-react";
import AnalysisHistoryCard from "@/components/historique/AnalysisHistoryCard";
import { mockAnalyses } from "@/lib/mock-historique";

const visible = mockAnalyses.filter((a) => !a.locked);
const locked = mockAnalyses.filter((a) => a.locked);

const stats = [
  { label: "Analyses ce mois", value: "6" },
  { label: "Signaux BUY", value: "67%" },
  { label: "Win rate suivi", value: "63%" },
];

export default function HistoriquePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline font-bold text-2xl text-white">Historique</h1>
          <p className="text-xs mt-1" style={{ color: "var(--on-surface-dim)" }}>
            Toutes vos analyses précédentes
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="font-mono-data text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--on-surface-dim)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Free tier notice */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{
          background: "rgba(245,166,35,0.05)",
          border: "1px solid rgba(245,166,35,0.15)",
        }}
      >
        <p className="text-xs" style={{ color: "var(--on-surface-dim)" }}>
          Plan Gratuit · 7 jours d&apos;historique seulement
        </p>
        <Link href="/plans" className="text-xs font-bold" style={{ color: "#F5A623" }}>
          Upgrader →
        </Link>
      </div>

      {/* Analyses visibles */}
      <section className="space-y-3">
        <h2 className="font-headline font-bold text-lg text-white">Analyses récentes</h2>
        {visible.map((a) => (
          <AnalysisHistoryCard key={a.id} analysis={a} />
        ))}
      </section>

      {/* Analyses locked */}
      {locked.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-headline font-bold text-lg" style={{ color: "var(--on-surface-dim)" }}>
            Analyses précédentes (verrouillées)
          </h2>
          {locked.map((a) => (
            <AnalysisHistoryCard key={a.id} analysis={a} />
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
          <p className="text-xs mt-0.5" style={{ color: "var(--on-surface-dim)" }}>
            Passez au plan Basic ou Pro pour débloquer 90 jours à l&apos;illimité d&apos;historique.
          </p>
        </div>
        <Link
          href="/plans"
          className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#F5A623", color: "#0A0E1A" }}
        >
          Voir les plans
        </Link>
      </div>

    </div>
  );
}
