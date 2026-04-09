"use client";

import Link from "next/link";
import {
  Brain, TrendingUp, Sparkles, BookOpen,
  Shield, Zap, Globe, BarChart3, ArrowRight, Check,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LiveTicker from "@/components/landing/LiveTicker";
import PromptAnimation from "@/components/landing/PromptAnimation";
import { useTranslation } from "@/hooks/useTranslation";

export default function LandingPage() {
  const { t } = useTranslation();

  const heroStats = [
    { value: "1 247", labelKey: "landing.hero.stat.traders" },
    { value: "98%",   labelKey: "landing.hero.stat.satisfaction" },
    { value: "10s",   labelKey: "landing.hero.stat.speed" },
    { value: "FCFA",  labelKey: "landing.hero.stat.payment" },
  ];

  const statsBar = [
    { num: "5",     labelKey: "landing.stats.markets.label", subKey: "landing.stats.markets.sub" },
    { num: "3",     labelKey: "landing.stats.modes.label",   subKey: "landing.stats.modes.sub" },
    { num: "99.9%", labelKey: "landing.stats.uptime.label",  subKey: "landing.stats.uptime.sub" },
    { num: "FCFA",  labelKey: "landing.stats.payment.label", subKey: "landing.stats.payment.sub" },
  ];

  const howSteps = [
    { num: "01", step: 1, color: "var(--sol-purple)", icon: <BarChart3 size={26}/>, titleKey: "landing.how.step1.title", descKey: "landing.how.step1.desc" },
    { num: "02", step: 2, color: "var(--sol-cyan)",   icon: <Zap size={26}/>,      titleKey: "landing.how.step2.title", descKey: "landing.how.step2.desc" },
    { num: "03", step: 3, color: "var(--bullish)",    icon: <Sparkles size={26}/>, titleKey: "landing.how.step3.title", descKey: "landing.how.step3.desc" },
  ] as const;

  const plans = [
    {
      nameKey: "landing.pricing.plan.free.name",
      price: "0",
      tagKey: "landing.pricing.plan.free.tag",
      featureKeys: ["landing.pricing.plan.free.f1","landing.pricing.plan.free.f2","landing.pricing.plan.free.f3","landing.pricing.plan.free.f4"],
      ctaKey: "landing.pricing.plan.free.cta",
      highlight: false,
    },
    {
      nameKey: "landing.pricing.plan.basic.name",
      price: "4 900",
      tagKey: "landing.pricing.plan.basic.tag",
      featureKeys: ["landing.pricing.plan.basic.f1","landing.pricing.plan.basic.f2","landing.pricing.plan.basic.f3","landing.pricing.plan.basic.f4","landing.pricing.plan.basic.f5"],
      ctaKey: "landing.pricing.plan.basic.cta",
      highlight: false,
    },
    {
      nameKey: "landing.pricing.plan.pro.name",
      price: "14 900",
      tagKey: "landing.pricing.plan.pro.tag",
      featureKeys: ["landing.pricing.plan.pro.f1","landing.pricing.plan.pro.f2","landing.pricing.plan.pro.f3","landing.pricing.plan.pro.f4","landing.pricing.plan.pro.f5"],
      ctaKey: "landing.pricing.plan.pro.cta",
      highlight: true,
    },
  ];

  const footerCols = [
    {
      titleKey: "landing.footer.col1",
      links: ["landing.footer.col1.l1","landing.footer.col1.l2","landing.footer.col1.l3","landing.footer.col1.l4"],
    },
    {
      titleKey: "landing.footer.col2",
      links: ["landing.footer.col2.l1","landing.footer.col2.l2","landing.footer.col2.l3","landing.footer.col2.l4"],
    },
    {
      titleKey: "landing.footer.col3",
      links: ["landing.footer.col3.l1","landing.footer.col3.l2","landing.footer.col3.l3","landing.footer.col3.l4"],
    },
  ];

  const testimonials = [
    { name: "Kouamé A.", location: "Abidjan", quote: "J'ai enfin compris le RSI grâce à Idjor. Il m'explique chaque signal en français, simplement.", stars: 5 },
    { name: "Fatou D.",  location: "Dakar",   quote: "Signal parfait, +2.3R sur SOL. J'ai suivi l'analyse Wickox à la lettre et ça a marché.", stars: 5 },
    { name: "Ibrahim K.", location: "Abidjan", quote: "Le meilleur outil pour trader en FCFA. Plus besoin de convertir en dollars pour comprendre mon risque.", stars: 5 },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>

      {/* ── Ticker + Navbar (fixés en haut) ── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <LiveTicker />
        <LandingNavbar />
      </div>

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{ paddingTop: 160, paddingBottom: 80 }}
      >
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(153,69,255,0.10) 0%, transparent 65%)" }} />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(20,241,149,0.07) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        <div className="max-w-5xl mx-auto w-full relative space-y-10 text-center">

          {/* Badge */}
          <div className="flex justify-center animate-fade-in">
            <a href="#" className="badge-community">
              <span className="live-dot" style={{ transform: "scale(0.8)" }} />
              <span style={{ color: "var(--sol-purple)" }}>
                {t("landing.hero.badge")}
              </span>
              <span style={{ color: "var(--border-hover)" }}>›</span>
            </a>
          </div>

          {/* Titre */}
          <div className="space-y-4 animate-fade-in-up stagger-1">
            <h1
              className="font-display font-semibold leading-tight"
              style={{ fontSize: "clamp(2.4rem,7vw,5.2rem)", letterSpacing: "-0.03em", color: "var(--text-primary)" }}
            >
              {t("landing.hero.title1")}
              <br className="hidden md:block" />
              <span className="text-gradient-sol"> {t("landing.hero.title2")}</span>
              <br className="hidden md:block" />
              {" "}{t("landing.hero.title3")}
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {t("landing.hero.subtitle")}{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{t("landing.hero.subtitle.highlight")}</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up stagger-2">
            <Link href="/register" className="btn-sol px-7 py-3.5 rounded-xl text-sm font-semibold">
              <Sparkles size={15} aria-hidden="true" />
              {t("landing.hero.cta.primary")}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/login" className="btn-outline px-7 py-3.5 rounded-xl text-sm font-semibold">
              {t("landing.hero.cta.secondary")}
            </Link>
          </div>

          {/* Terminal animé */}
          <div className="flex justify-center animate-fade-in-up stagger-3">
            <PromptAnimation />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm animate-fade-in-up stagger-4"
            style={{ color: "var(--text-secondary)" }}>
            {heroStats.map(stat => (
              <div key={stat.labelKey} className="flex items-baseline gap-1.5">
                <span className="font-display font-semibold text-lg"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: 13 }}>{t(stat.labelKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════════════ */}
      <div style={{ background: "var(--surface-low)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "28px 24px" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {statsBar.map(s => (
              <div key={s.num} className="space-y-1">
                <p className="font-display font-semibold" style={{ fontSize: "2rem", letterSpacing: "-0.03em" }}>
                  <span className="text-gradient-sol-static">{s.num}</span>
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{t(s.labelKey)}</p>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{t(s.subKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          FEATURES — Bento grid
      ════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-14">

          <div className="text-center space-y-4">
            <p className="section-label" style={{ color: "var(--sol-purple)" }}>{t("landing.features.label")}</p>
            <h2 className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              {t("landing.features.title")}{" "}
              <span className="text-gradient-sol-static">{t("landing.features.title.hl")}</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", fontSize: 15 }}>
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* Grande carte — Analyse IA */}
            <div className="md:col-span-7 relative overflow-hidden rounded-2xl p-8 space-y-4"
              style={{ background: "linear-gradient(135deg,#0E0520 0%,#0D1A0C 100%)", border: "1px solid rgba(153,69,255,0.20)" }}>
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none" aria-hidden="true"
                style={{ background: "radial-gradient(circle,rgba(153,69,255,0.15) 0%,transparent 65%)" }} />
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(153,69,255,0.15)", color: "var(--sol-purple)" }}>
                <Brain size={22} />
              </div>
              <h3 className="font-display font-semibold text-xl"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{t("landing.features.ai.title")}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
                {t("landing.features.ai.desc")}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["RSI","MACD","EMA","S/R","Patterns","Volume"].map(tag => (
                  <span key={tag} className="font-data"
                    style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:5,
                      background:"rgba(153,69,255,0.12)", border:"1px solid rgba(153,69,255,0.25)",
                      color:"var(--sol-purple)", letterSpacing:"0.04em" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Entry/SL/TP */}
            <div className="md:col-span-5 rounded-2xl p-6 space-y-4"
              style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(20,241,149,0.10)", color: "var(--bullish)" }}>
                <TrendingUp size={22} />
              </div>
              <h3 className="font-display font-semibold text-lg"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{t("landing.features.entry.title")}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                {t("landing.features.entry.desc")}
              </p>
            </div>

            {/* Wickox IA Coach */}
            <div className="md:col-span-5 rounded-2xl p-6 space-y-4"
              style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.12)", color: "var(--gold)" }}>
                <Sparkles size={22} />
              </div>
              <h3 className="font-display font-semibold text-lg"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{t("landing.features.coach.title")}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                {t("landing.features.coach.desc")}
              </p>
            </div>

            {/* Journal */}
            <div className="md:col-span-7 rounded-2xl p-6 space-y-4"
              style={{ background: "linear-gradient(135deg,#07120A 0%,#0B0E18 100%)", border: "1px solid rgba(20,241,149,0.15)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(20,241,149,0.08)", color: "var(--bullish)" }}>
                <BookOpen size={22} />
              </div>
              <h3 className="font-display font-semibold text-lg"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{t("landing.features.journal.title")}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                {t("landing.features.journal.desc")}
              </p>
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[{ label:"Win Rate",value:"67%"},{ label:"R:R Moyen",value:"1.8"},{ label:"Streak",value:"5j"}].map(m => (
                  <div key={m.label} style={{ background:"var(--surface-highest)", borderRadius:8, padding:"10px 12px" }}>
                    <p className="font-data font-bold" style={{ fontSize:18, color:"var(--bullish)", letterSpacing:"-0.02em" }}>{m.value}</p>
                    <p style={{ fontSize:10, color:"var(--text-tertiary)", marginTop:2 }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Marchés */}
            <div className="md:col-span-4 rounded-2xl p-6 space-y-4"
              style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(3,225,255,0.10)", color: "var(--sol-cyan)" }}>
                <Globe size={22} />
              </div>
              <h3 className="font-display font-semibold text-lg"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{t("landing.features.markets.title")}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                {t("landing.features.markets.desc")}
              </p>
            </div>

            {/* Sécurité */}
            <div className="md:col-span-4 rounded-2xl p-6 space-y-4"
              style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.10)", color: "var(--gold)" }}>
                <Shield size={22} />
              </div>
              <h3 className="font-display font-semibold text-lg"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{t("landing.features.security.title")}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                {t("landing.features.security.desc")}
              </p>
            </div>

            {/* Vitesse */}
            <div className="md:col-span-4 rounded-2xl p-6 space-y-4"
              style={{ background: "linear-gradient(135deg,rgba(153,69,255,0.08),rgba(20,241,149,0.05))", border: "1px solid var(--border-sol)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "var(--sol-gradient-soft)", color: "var(--sol-green)" }}>
                <Zap size={22} />
              </div>
              <h3 className="font-display font-semibold text-lg text-gradient-sol-static"
                style={{ letterSpacing: "-0.02em" }}>{t("landing.features.speed.title")}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                {t("landing.features.speed.desc")}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE
      ════════════════════════════════════════════════════════════ */}
      <section id="how" className="py-24 px-6"
        style={{ background: "var(--surface-low)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <p className="section-label" style={{ color: "var(--sol-green)" }}>{t("landing.how.label")}</p>
            <h2 className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              {t("landing.how.title")}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              {t("landing.how.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howSteps.map(step => (
              <div key={step.num} className="relative rounded-2xl p-7 space-y-5 overflow-hidden"
                style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
                <span className="absolute top-3 right-4 font-display font-black select-none pointer-events-none" aria-hidden="true"
                  style={{ fontSize:"5rem", lineHeight:1, color:"rgba(255,255,255,0.025)", letterSpacing:"-0.04em" }}>
                  {step.num}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-data flex-shrink-0"
                    style={{ background: step.color, color: "var(--surface)" }}>
                    {step.step}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${step.color} 15%, transparent)`, color: step.color }}>
                  {step.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-lg"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{t(step.titleKey)}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <p className="section-label" style={{ color: "var(--gold)" }}>{t("landing.pricing.label")}</p>
            <h2 className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              {t("landing.pricing.title")}{" "}
              <span className="text-gradient-warm">{t("landing.pricing.title.hl")}</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              {t("landing.pricing.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(plan => (
              <div key={plan.nameKey} className="relative rounded-2xl overflow-hidden"
                style={plan.highlight ? {
                  background: "var(--surface-glass)", backdropFilter: "blur(20px)",
                  border: "1px solid var(--gold-border)", boxShadow: "var(--shadow-lg),0 0 40px rgba(201,168,76,0.10)",
                } : {
                  background: "var(--surface-high)", border: "1px solid var(--border)",
                }}>
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 text-center"
                    style={{ background: "var(--sol-gradient)" }}>
                    <span style={{ fontSize:10, fontWeight:800, color:"white", letterSpacing:"0.12em" }}>{t("landing.pricing.popular")}</span>
                  </div>
                )}
                <div className={`p-7 space-y-6 ${plan.highlight ? "pt-11" : ""}`}>
                  <div>
                    <p className="section-label mb-3"
                      style={{ color: plan.highlight ? "var(--gold)" : "var(--text-tertiary)" }}>{t(plan.nameKey)}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display font-semibold"
                        style={{ fontSize:"2.2rem", letterSpacing:"-0.03em", color:"var(--text-primary)" }}>
                        {plan.price === "0" ? t("landing.pricing.free") : plan.price}
                      </span>
                      {plan.price !== "0" && (
                        <span style={{ fontSize:12, color:"var(--text-tertiary)" }}>{t("landing.pricing.month")}</span>
                      )}
                    </div>
                    <p style={{ fontSize:12, color:"var(--text-secondary)", marginTop:4 }}>{t(plan.tagKey)}</p>
                  </div>
                  <ul className="space-y-3">
                    {plan.featureKeys.map(fKey => (
                      <li key={fKey} className="flex items-center gap-3" style={{ fontSize:14, color:"var(--text-primary)" }}>
                        <Check size={15} style={{ color: plan.highlight ? "var(--gold)" : "var(--bullish)", flexShrink:0 }} />
                        {t(fKey)}
                      </li>
                    ))}
                  </ul>
                  <Link href="/plans"
                    className={plan.highlight ? "btn-plan-pro py-3 rounded-xl text-sm font-bold" : "btn-ghost py-3 rounded-xl text-sm font-bold"}>
                    {t(plan.ctaKey)}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/plans" className="link-sol">
              {t("landing.pricing.seeAll")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WEEX PARTNER
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6"
        style={{ background: "var(--surface-low)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-10"
            style={{
              background: "linear-gradient(135deg,#051209 0%,#071A0E 100%)",
              border: "1px solid rgba(20,241,149,0.22)",
              boxShadow: "0 0 40px rgba(20,241,149,0.06)",
            }}>
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none" aria-hidden="true"
              style={{ background: "radial-gradient(circle,rgba(20,241,149,0.10) 0%,transparent 65%)" }} />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-3 text-center md:text-left">
                <p className="section-label" style={{ color: "var(--bullish)" }}>{t("landing.weex.label")}</p>
                <h2 className="font-display font-semibold text-2xl md:text-3xl"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {t("landing.weex.title")} <span className="text-gradient-sol-static">Weex</span>
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
                  {t("landing.weex.desc")}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1">
                  {(["landing.weex.tag1","landing.weex.tag2","landing.weex.tag3"] as const).map(key => (
                    <span key={key} className="font-data"
                      style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 5,
                        background: "rgba(20,241,149,0.10)", border: "1px solid rgba(20,241,149,0.22)",
                        color: "var(--bullish)", letterSpacing: "0.04em" }}>
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link href="https://weex.com/register?vipCode=0ajwh" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                  style={{ background: "var(--bullish)", color: "var(--surface)" }}>
                  {t("landing.weex.cta")}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          IDJOR IA COACH
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-10"
            style={{
              background: "linear-gradient(135deg,#120C01 0%,#1A1000 100%)",
              border: "1px solid rgba(201,168,76,0.22)",
              boxShadow: "0 0 40px rgba(201,168,76,0.06)",
            }}>
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none" aria-hidden="true"
              style={{ background: "radial-gradient(circle,rgba(201,168,76,0.12) 0%,transparent 65%)" }} />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>
                <Sparkles size={30} />
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                <p className="section-label" style={{ color: "var(--gold)" }}>{t("landing.coach.label")}</p>
                <h2 className="font-display font-semibold text-2xl md:text-3xl"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {t("landing.coach.title")}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
                  {t("landing.coach.desc")}
                </p>
                <Link href="/register"
                  className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-80"
                  style={{ color: "var(--gold)" }}>
                  {t("landing.coach.cta")}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          DCA
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6"
        style={{ background: "var(--surface-low)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <p className="section-label" style={{ color: "var(--sol-cyan)" }}>{t("landing.dca.label")}</p>
              <h2 className="font-display font-semibold"
                style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                {t("landing.dca.title1")}<br />
                <span style={{ color: "var(--sol-cyan)" }}>{t("landing.dca.title2")}</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8 }}>
                {t("landing.dca.desc")}
              </p>
              <ul className="space-y-2.5">
                {(["landing.dca.item1","landing.dca.item2","landing.dca.item3"] as const).map(key => (
                  <li key={key} className="flex items-center gap-3" style={{ fontSize: 14, color: "var(--text-primary)" }}>
                    <Check size={15} style={{ color: "var(--sol-cyan)", flexShrink: 0 }} />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: "rgba(3,225,255,0.12)", color: "var(--sol-cyan)", border: "1px solid rgba(3,225,255,0.25)" }}>
                {t("landing.dca.cta")}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {/* DCA visual */}
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
              <p className="section-label">{t("landing.dca.sim.title")}</p>
              <div className="space-y-3">
                {[
                  { labelKey: "landing.dca.sim.weekly", value: "5 000 FCFA",    color: "var(--text-primary)" },
                  { labelKey: "landing.dca.sim.total",  value: "260 000 FCFA",  color: "var(--text-primary)" },
                  { labelKey: "landing.dca.sim.value",  value: "~338 000 FCFA", color: "var(--bullish)" },
                  { labelKey: "landing.dca.sim.perf",   value: "+30%",          color: "var(--bullish)" },
                ].map(row => (
                  <div key={row.labelKey} className="flex items-center justify-between py-2.5 px-4 rounded-xl"
                    style={{ background: "var(--surface-highest)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{t(row.labelKey)}</span>
                    <span className="font-data font-bold" style={{ fontSize: 14, color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                {t("landing.dca.sim.note")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TÉMOIGNAGES
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="section-label" style={{ color: "var(--sol-purple)" }}>{t("landing.reviews.label")}</p>
            <h2 className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              {t("landing.reviews.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(item => (
              <div key={item.name} className="rounded-2xl p-6 space-y-4"
                style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
                <div className="flex gap-1">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 1l1.5 4H13l-3.5 2.5 1.3 4L7 9 3.2 11.5l1.3-4L1 5h4.5L7 1z" fill="var(--gold)" />
                    </svg>
                  ))}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, fontStyle: "italic" }}>
                  &quot;{item.quote}&quot;
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: "rgba(153,69,255,0.15)", color: "var(--sol-purple)" }}>
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA FINAL
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6"
        style={{ background: "var(--surface-low)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden p-10 md:p-14 text-center space-y-6"
            style={{
              background: "linear-gradient(135deg,#0E0520 0%,#0B1A28 50%,#070D18 100%)",
              border: "1px solid rgba(153,69,255,0.25)",
              boxShadow: "0 0 80px rgba(153,69,255,0.12)",
            }}>
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none" aria-hidden="true"
              style={{ background: "radial-gradient(circle,rgba(153,69,255,0.12) 0%,transparent 65%)" }} />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full pointer-events-none" aria-hidden="true"
              style={{ background: "radial-gradient(circle,rgba(20,241,149,0.10) 0%,transparent 65%)" }} />
            <div className="absolute top-0 left-0 right-0 h-px pointer-events-none" aria-hidden="true"
              style={{ background: "var(--sol-gradient)", opacity: 0.6 }} />

            <div className="relative space-y-4">
              <h2 className="font-display font-semibold"
                style={{ fontSize:"clamp(1.75rem,4vw,2.5rem)", letterSpacing:"-0.02em", color:"var(--text-primary)" }}>
                {t("landing.cta.title")}{" "}
                <span className="text-gradient-sol">{t("landing.cta.title.hl")}</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                {t("landing.cta.desc")}
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="btn-sol px-8 py-3.5 rounded-xl text-sm font-bold">
                <Sparkles size={15} aria-hidden="true" />
                {t("landing.cta.btn")}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <p className="relative text-xs" style={{ color: "var(--text-tertiary)" }}>
              {t("landing.cta.risk")}
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════ */}
      <footer id="footer" style={{ borderTop: "1px solid var(--border)", padding: "40px 24px 32px" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div style={{ width:28, height:28, borderRadius:7, background:"var(--sol-gradient)",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 12L8 4l5 8H3z" fill="white" fillOpacity="0.9"/>
                    <circle cx="8" cy="9" r="2" fill="white" fillOpacity="0.6"/>
                  </svg>
                </div>
                <span className="font-display font-semibold text-lg text-gradient-sol-static"
                  style={{ letterSpacing:"-0.02em" }}>Wickox</span>
              </div>
              <p style={{ fontSize:13, color:"var(--text-tertiary)", lineHeight:1.7 }}>
                {t("landing.footer.brand.desc")}
              </p>
              <p style={{ fontSize:12, color:"var(--text-tertiary)" }}>
                {t("landing.footer.brand.copy")}<br />{t("landing.footer.brand.city")}
              </p>
            </div>

            {/* Colonnes de liens */}
            {footerCols.map(col => (
              <div key={col.titleKey} className="space-y-4">
                <p className="section-label">{t(col.titleKey)}</p>
                <ul className="space-y-2.5">
                  {col.links.map(linkKey => (
                    <li key={linkKey}><a href="#" className="footer-link">{t(linkKey)}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex flex-wrap gap-5">
              {["Twitter","LinkedIn","Facebook"].map(s => (
                <a key={s} href="#" className="social-link">{s}</a>
              ))}
            </div>
            <p style={{ fontSize:12, color:"var(--text-tertiary)", textAlign:"center" }}>
              {t("landing.footer.legal")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
