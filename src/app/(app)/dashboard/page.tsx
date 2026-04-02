import Link from "next/link";

import PerformanceGrid from "@/components/dashboard/PerformanceGrid";
import ToolCard from "@/components/dashboard/ToolCard";
import IdjorBanner from "@/components/dashboard/IdjorBanner";
import RecentAnalysisItem from "@/components/dashboard/RecentAnalysisItem";
import TopMovers from "@/components/dashboard/TopMovers";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

      {/* 1. Performance Grid */}
      <PerformanceGrid />

      {/* 2. Tools Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ToolCard
          title="Swing Trading"
          description="Tendances long-terme. Analyses multi-jours H4/D1."
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 14 C5 14 5 8 8 8 C11 8 11 14 14 14 C17 14 17 8 20 8"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
          accentColor="#0EA5E9"
          badge="H4 · D1"
          href="/swing"
        />
        <ToolCard
          title="Scalp Trading"
          description="Précision intraday. Déséquilibres M1/M5 rapides."
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <polyline points="2,16 6,8 10,13 14,4 18,9 22,4"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round"/>
            </svg>
          }
          accentColor="#F5A623"
          badge="M1 · M15"
          href="/scalp"
        />
        <ToolCard
          title="Forecasting PRO"
          description="IA prédictive sur les 12 prochaines bougies."
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="11" cy="11" r="7" stroke="currentColor"
                strokeWidth="1.5" strokeDasharray="2 2"/>
              <line x1="11" y1="1" x2="11" y2="4" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round"/>
              <line x1="11" y1="18" x2="11" y2="21" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
          accentColor="#00FF88"
          badge="PRO"
          href="/plans"
        />
      </section>

      {/* 3. Idjor Banner */}
      <IdjorBanner />

      {/* 4. Split: Analyses récentes + Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Analyses récentes — 3 col */}
        <section className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-xl text-white">
              Analyses Récentes
            </h3>
            <Link
              href="/historique"
              className="text-xs font-semibold hover:underline"
              style={{ color: "#00FF88" }}
            >
              Voir tout →
            </Link>
          </div>
          <RecentAnalysisItem
            asset="SOL/USDT"
            signal="BUY"
            score={78}
            time="01 Avr · 18:32"
            href="/resultat"
          />
          <RecentAnalysisItem
            asset="BTC/USDT"
            signal="SELL"
            score={62}
            time="31 Mar · 11:05"
            href="/resultat"
          />
          <RecentAnalysisItem
            asset="EUR/USD"
            signal="BUY"
            score={88}
            time="30 Mar · 18:15"
            href="/resultat"
          />
        </section>

        {/* Top Movers — 2 col */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-xl text-white">
              Top Movers
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,255,136,0.08)", color: "#00FF88", border: "1px solid rgba(0,255,136,0.15)" }}>
              Crypto
            </span>
          </div>
          <TopMovers />
        </section>
      </div>

    </div>
  );
}
