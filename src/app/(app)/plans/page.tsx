import Link from "next/link";
import { cookies } from "next/headers";
import { PricingProvider } from "@/context/PricingContext";
import PricingToggle from "@/components/plans/PricingToggle";
import PlanCard from "@/components/plans/PlanCard";
import PaymentBadges from "@/components/plans/PaymentBadges";
import FaqAccordion from "@/components/plans/FaqAccordion";
import ComparisonTable from "@/components/plans/ComparisonTable";
import { plans } from "@/lib/mock-plans";
import { getT, LANG_COOKIE, type Lang } from "@/lib/i18n";

export default async function PlansPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get(LANG_COOKIE)?.value ?? "fr") as Lang;
  const t = getT(lang);

  const faqItems = Array.from({ length: 7 }, (_, i) => ({
    q: t(`faq.${i}.q`),
    a: t(`faq.${i}.a`),
  }));

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
            {t("plans.hero.badge")}
          </span>
          <h1 className="font-display font-semibold text-3xl md:text-4xl text-white">
            {t("plans.hero.title")}
          </h1>
          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            {t("plans.hero.sub")}
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
            {t("plans.comparison.title")}
          </h2>
          <ComparisonTable />
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto space-y-5">
          <h2 className="font-display font-semibold text-2xl text-white text-center">
            {t("plans.faq.title")}
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
            {t("plans.cta.title")}
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {t("plans.cta.sub")}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
            style={{ background: "var(--sol-gradient)", color: "white" }}
          >
            {t("plans.cta.btn")}
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs pb-4" style={{ color: "var(--text-secondary)" }}>
          ⚠️ {t("plans.disclaimer")}
        </p>

      </div>
    </PricingProvider>
  );
}
