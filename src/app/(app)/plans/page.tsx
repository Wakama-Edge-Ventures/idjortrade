import Link from "next/link";
import { PricingProvider } from "@/context/PricingContext";
import PricingToggle from "@/components/plans/PricingToggle";
import PlanCard from "@/components/plans/PlanCard";
import PaymentBadges from "@/components/plans/PaymentBadges";
import FaqAccordion from "@/components/plans/FaqAccordion";
import ComparisonTable from "@/components/plans/ComparisonTable";
import { plans, faqItems } from "@/lib/mock-plans";

export default function PlansPage() {
  return (
    <PricingProvider>
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-16">

        {/* Hero */}
        <div className="text-center space-y-5">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: "var(--bullish-muted)",
              color: "var(--bullish)",
              border: "1px solid rgba(20,241,149,0.15)",
            }}
          >
            💳 Paiement local
          </span>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-white">
            Choisissez votre Terminal
          </h1>
          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Wave · Orange Money · Visa · Mastercard · Crypto — 100% en FCFA
          </p>
          <div className="flex justify-center">
            <PricingToggle />
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Payment badges */}
        <PaymentBadges />

        {/* Comparison table */}
        <section className="space-y-5">
          <h2 className="font-display font-semibold text-2xl text-white text-center">
            Comparaison détaillée
          </h2>
          <ComparisonTable />
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto space-y-5">
          <h2 className="font-display font-semibold text-2xl text-white text-center">
            Questions fréquentes
          </h2>
          <FaqAccordion items={faqItems} />
        </section>

        {/* CTA bottom */}
        <div
          className="rounded-2xl p-8 text-center space-y-4"
          style={{
            background: "linear-gradient(135deg, #0A1A0F 0%, #0E1320 100%)",
            border: "1px solid rgba(20,241,149,0.15)",
          }}
        >
          <h3 className="font-display font-semibold text-xl text-white">
            Pas encore prêt à passer Pro ?
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Le plan Gratuit est disponible sans limite de temps.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
            style={{ background: "var(--sol-gradient)", color: "white" }}
          >
            Démarrer avec le plan Gratuit
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs pb-4" style={{ color: "var(--text-secondary)" }}>
          ⚠️ Le trading de crypto-monnaies et de Forex comporte des risques de perte en capital.
          Wickox est un outil d&apos;aide à la décision et ne constitue pas un conseil financier.
        </p>

      </div>
    </PricingProvider>
  );
}
