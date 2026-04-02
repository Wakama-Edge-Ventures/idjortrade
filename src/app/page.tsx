import Link from "next/link";
import { Sparkles, Upload, TrendingUp, BookOpen, Brain } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>
      <LandingNavbar />

      {/* HERO */}
      <section className="relative circuit-bg pt-32 pb-20 px-6 overflow-hidden">
        {/* Glows */}
        <div
          className="absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(0,255,136,0.06)" }}
        />
        <div
          className="absolute bottom-0 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(245,166,35,0.05)" }}
        />

        <div className="max-w-4xl mx-auto text-center relative space-y-6">
          {/* Badge */}
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(0,255,136,0.08)",
                color: "#00FF88",
                border: "1px solid rgba(0,255,136,0.15)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#00FF88" }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#00FF88" }} />
              </span>
              Propulsé par Claude AI · Fait pour l&apos;Afrique
            </span>
          </div>

          {/* Titre */}
          <h1 className="font-headline font-black text-4xl md:text-6xl text-white leading-tight">
            Analyse ton chart en{" "}
            <em className="not-italic" style={{ color: "#00FF88" }}>10 secondes.</em>
          </h1>

          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--on-surface-dim)" }}>
            Upload une capture d&apos;écran. Reçois signal Buy/Sell, entrée, Stop-Loss et Take-Profit.{" "}
            <span className="text-white font-semibold">En FCFA. En français.</span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-headline font-bold text-base"
              style={{ background: "#00FF88", color: "#0A0E1A" }}
            >
              Essayer gratuitement →
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)" }}
            >
              Voir une démo
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-xs" style={{ color: "var(--on-surface-dim)" }}>
            <span><span className="font-bold text-white">1 247</span> traders actifs</span>
            <span style={{ color: "var(--outline)" }}>·</span>
            <span><span className="font-bold text-white">98%</span> satisfaction</span>
            <span style={{ color: "var(--outline)" }}>·</span>
            <span>Paiement en <span className="font-bold text-white">FCFA</span></span>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-headline font-bold text-3xl text-white">Comment ça marche</h2>
            <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>3 étapes simples pour obtenir ton analyse</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "Capture ton chart",
                desc: "Prends une screenshot de ton graphique sur TradingView, Binance ou n'importe quelle plateforme.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="3" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 10h4M3 18h4M21 10h4M21 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                num: "02",
                title: "Upload sur IdjorTrade",
                desc: "Glisse l'image dans l'analyseur. Sélectionne ton actif, timeframe et mode d'analyse.",
                icon: <Upload size={28} />,
              },
              {
                num: "03",
                title: "Reçois ton analyse IA",
                desc: "Signal Buy/Sell, Entry, Stop-Loss, Take-Profit, taille de position — tout en FCFA.",
                icon: <Sparkles size={28} />,
              },
            ].map((step) => (
              <div key={step.num} className="card p-6 relative overflow-hidden space-y-4">
                <span
                  className="absolute top-4 right-4 font-mono-data text-5xl font-black select-none pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.03)", lineHeight: 1 }}
                >
                  {step.num}
                </span>
                <div style={{ color: "#00FF88" }}>{step.icon}</div>
                <h3 className="font-headline font-bold text-lg text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-dim)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6" style={{ background: "var(--surface-low)" }}>
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-headline font-bold text-3xl text-white">Tout ce dont tu as besoin</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: <Brain size={22} />,
                color: "#00FF88",
                title: "Analyse IA instantanée",
                desc: "RSI, MACD, Bollinger, patterns de chandeliers — notre IA lit tout automatiquement.",
              },
              {
                icon: <TrendingUp size={22} />,
                color: "#0EA5E9",
                title: "Entry / SL / TP / R:R précis",
                desc: "Reçois des niveaux exacts avec la taille de position calculée selon ton capital en FCFA.",
              },
              {
                icon: <Sparkles size={22} />,
                color: "#F5A623",
                title: "Idjor IA Coach",
                desc: "Ton conseiller IA personnel en français. Pose toutes tes questions sur le trading 24h/24.",
              },
              {
                icon: <BookOpen size={22} />,
                color: "#00CC6A",
                title: "Journal de trading intégré",
                desc: "Stats, courbe d'équité, heatmap des performances. Apprends de chaque trade.",
              },
            ].map((f) => (
              <div key={f.title} className="card p-6 flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-white mb-1.5">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-dim)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-headline font-bold text-3xl text-white">Choisissez votre Terminal</h2>
            <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>
              Wave · Orange Money · Visa · Mastercard · Crypto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "GRATUIT", price: "0", tag: "Pour découvrir", features: ["3 analyses/jour", "5 msg Idjor IA", "Crypto uniquement"], cta: "Commencer", style: "ghost" as const },
              { name: "BASIC", price: "4 900", tag: "Pour le régulier", features: ["20 analyses/jour", "30 msg Idjor IA", "Export CSV"], cta: "Choisir Basic", style: "outline" as const },
              { name: "PRO", price: "14 900", tag: "Tout illimité", features: ["Analyses illimitées", "Tous marchés", "Alertes temps réel"], cta: "Choisir Pro", style: "primary" as const, highlight: true },
            ].map((p) => (
              <div
                key={p.name}
                className="rounded-2xl p-6 space-y-5"
                style={{
                  background: p.highlight ? "linear-gradient(135deg, #0A1A0F, #0E1320)" : "var(--surface-mid)",
                  border: p.highlight ? "1px solid rgba(0,255,136,0.25)" : "1px solid rgba(255,255,255,0.05)",
                  boxShadow: p.highlight ? "0 0 30px rgba(0,255,136,0.1)" : "none",
                }}
              >
                <div>
                  <p className="text-xs font-bold tracking-widest mb-2" style={{ color: p.highlight ? "#00FF88" : "var(--on-surface-dim)" }}>
                    {p.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono-data text-3xl font-bold text-white">{p.price === "0" ? "Gratuit" : p.price}</span>
                    {p.price !== "0" && <span className="text-xs" style={{ color: "var(--on-surface-dim)" }}>FCFA/mois</span>}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--on-surface-dim)" }}>{p.tag}</p>
                </div>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--on-surface)" }}>
                      <span style={{ color: "#00FF88" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/plans"
                  className="w-full block text-center py-3 rounded-xl text-sm font-bold"
                  style={
                    p.style === "primary"
                      ? { background: "#00FF88", color: "#0A0E1A" }
                      : p.style === "outline"
                      ? { border: "1px solid rgba(0,255,136,0.3)", color: "#00FF88" }
                      : { border: "1px solid rgba(255,255,255,0.08)", color: "var(--on-surface-dim)" }
                  }
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/plans" className="text-sm font-semibold" style={{ color: "#00FF88" }}>
              Voir tous les plans →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div
            className="rounded-2xl p-10 space-y-5"
            style={{
              background: "linear-gradient(135deg, #0A1A0F 0%, #0E1320 100%)",
              border: "1px solid rgba(0,255,136,0.15)",
            }}
          >
            <h2 className="font-headline font-bold text-2xl text-white">
              Prêt à trader plus intelligemment ?
            </h2>
            <p className="text-sm" style={{ color: "var(--on-surface-dim)" }}>
              Rejoins <span className="font-bold text-white">1 247 traders</span> qui utilisent IdjorTrade.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-headline font-bold"
              style={{ background: "#00FF88", color: "#0A0E1A" }}
            >
              Commencer gratuitement
            </Link>
            <p className="text-xs" style={{ color: "var(--on-surface-dim)" }}>
              ⚠️ Le trading comporte des risques de perte en capital.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-8 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-0.5">
            <span className="font-headline font-bold text-base" style={{ color: "#00FF88" }}>Idjor</span>
            <span className="font-headline font-bold text-base text-white">Trade</span>
          </div>
          <p className="text-xs text-center" style={{ color: "var(--on-surface-dim)" }}>
            © 2026 Wakama Edge Ventures Inc. · Abidjan, CI
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs" style={{ color: "var(--on-surface-dim)" }}>
            {["Plans", "Formation", "Idjor IA", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: "var(--on-surface-dim)" }}>
          ⚠️ Pas un conseil financier — Tradez responsablement
        </p>
      </footer>
    </div>
  );
}
