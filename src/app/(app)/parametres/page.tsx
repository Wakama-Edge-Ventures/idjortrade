import { CreditCard } from "lucide-react";
import Link from "next/link";
import SettingsTabs from "@/components/parametres/SettingsTabs";

export default function ParametresPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-headline font-bold text-2xl text-white">Paramètres</h1>
        <p className="text-xs mt-1" style={{ color: "var(--on-surface-dim)" }}>
          Gérez votre profil, préférences et abonnement
        </p>
      </div>

      {/* Card plan actuel (sticky) */}
      <div
        className="flex items-center justify-between px-5 py-3.5 rounded-2xl"
        style={{
          background: "var(--surface-high)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <CreditCard size={16} style={{ color: "var(--on-surface-dim)" }} />
          <span className="text-sm text-white font-semibold">Plan Gratuit</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ background: "var(--surface-highest)", color: "var(--on-surface-dim)" }}
          >
            3 analyses restantes
          </span>
        </div>
        <Link
          href="/plans"
          className="text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(0,255,136,0.12)", color: "#00FF88" }}
        >
          Upgrader
        </Link>
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <SettingsTabs />
      </div>

    </div>
  );
}
