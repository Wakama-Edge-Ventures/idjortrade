"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import PreferencesForm from "./PreferencesForm";
import Link from "next/link";
import { CreditCard } from "lucide-react";

type Tab = "profil" | "preferences" | "abonnement";
const tabs: { id: Tab; label: string }[] = [
  { id: "profil", label: "Profil" },
  { id: "preferences", label: "Préférences" },
  { id: "abonnement", label: "Abonnement" },
];

const mockPayments = [
  { date: "01/02/26", montant: 4900, plan: "BASIC", statut: "Remboursé" },
  { date: "01/01/26", montant: 4900, plan: "BASIC", statut: "Payé" },
  { date: "01/12/25", montant: 4900, plan: "BASIC", statut: "Payé" },
];

export default function SettingsTabs() {
  const [active, setActive] = useState<Tab>("profil");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="px-5 py-3 text-sm font-semibold transition-colors relative"
            style={{
              color: active === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
            }}
          >
            {tab.label}
            {active === tab.id && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "var(--sol-gradient)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {active === "profil" && <ProfileForm />}
      {active === "preferences" && <PreferencesForm />}
      {active === "abonnement" && (
        <div className="space-y-6 max-w-lg">
          {/* Plan actuel */}
          <div className="card p-5 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--surface-highest)" }}
            >
              <CreditCard size={20} style={{ color: "var(--text-secondary)" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-white">Plan actuel</p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded"
                  style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}
                >
                  GRATUIT
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                3 analyses restantes aujourd&apos;hui
              </p>
            </div>
            <Link
              href="/plans"
              className="px-4 py-2 rounded-lg text-sm font-bold flex-shrink-0"
              style={{ background: "var(--sol-gradient)", color: "white" }}
            >
              Upgrader
            </Link>
          </div>

          {/* Historique paiements */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Historique des paiements</h3>
            <div className="card overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Date", "Montant", "Plan", "Statut"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold uppercase tracking-widest"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{p.date}</td>
                      <td className="px-4 py-3 font-data font-semibold text-white">
                        {p.montant.toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="font-bold px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(20,241,149,0.1)", color: "#00CC6A" }}
                        >
                          {p.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: p.statut === "Remboursé" ? "#F5A623" : "var(--text-secondary)" }}>
                          {p.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cancel */}
          <button
            disabled
            className="px-4 py-2.5 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ border: "1px solid var(--bearish)", color: "var(--bearish)" }}
          >
            Annuler l&apos;abonnement
          </button>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Désactivé sur le plan Gratuit.
          </p>
        </div>
      )}
    </div>
  );
}
