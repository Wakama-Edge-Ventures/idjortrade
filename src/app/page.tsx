import Link from "next/link";
import {
  Brain, TrendingUp, Sparkles, BookOpen,
  Shield, Zap, Globe, BarChart3, ArrowRight, Check,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LiveTicker from "@/components/landing/LiveTicker";
import PromptAnimation from "@/components/landing/PromptAnimation";

/* ═══════════════════════════════════════════════════════════════════════════
   WICKOX — Landing Page (Server Component — zero onMouse* handlers)
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
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
        {/* Orbes de fond */}
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(153,69,255,0.10) 0%, transparent 65%)" }} />
        <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none" aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(20,241,149,0.07) 0%, transparent 65%)" }} />
        {/* Grille */}
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
                Rejoindre la communauté Wickox
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
              Wickox AI — Votre assistant
              <br className="hidden md:block" />
              <span className="text-gradient-sol"> trading intelligent</span>
              <br className="hidden md:block" />
              {" "}pour l&apos;Afrique
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Analyse ton graphique en 10 secondes. Signal Buy/Sell, Entry, SL, TP et taille de position.{" "}
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>En FCFA. En français.</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up stagger-2">
            <Link href="/register" className="btn-sol px-7 py-3.5 rounded-xl text-sm font-semibold">
              <Sparkles size={15} aria-hidden="true" />
              Essayer gratuitement
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/login" className="btn-outline px-7 py-3.5 rounded-xl text-sm font-semibold">
              Voir une démo
            </Link>
          </div>

          {/* Terminal animé */}
          <div className="flex justify-center animate-fade-in-up stagger-3">
            <PromptAnimation />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm animate-fade-in-up stagger-4"
            style={{ color: "var(--text-secondary)" }}>
            {[
              { value: "1 247", label: "traders actifs" },
              { value: "98%",   label: "satisfaction" },
              { value: "10s",   label: "par analyse" },
              { value: "FCFA",  label: "paiement local" },
            ].map(stat => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <span className="font-display font-semibold text-lg"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: 13 }}>{stat.label}</span>
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
            {[
              { num: "5",     label: "Marchés couverts",    sub: "Crypto · Forex · Indices · Matières · Actions" },
              { num: "3",     label: "Modes d'analyse",     sub: "Swing · Day · Scalp" },
              { num: "99.9%", label: "Uptime garanti",      sub: "Disponibilité 24h/24" },
              { num: "FCFA",  label: "Paiement nativement", sub: "Wave · Orange · Visa" },
            ].map(s => (
              <div key={s.num} className="space-y-1">
                <p className="font-display font-semibold" style={{ fontSize: "2rem", letterSpacing: "-0.03em" }}>
                  <span className="text-gradient-sol-static">{s.num}</span>
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{s.label}</p>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{s.sub}</p>
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
            <p className="section-label" style={{ color: "var(--sol-purple)" }}>WICKOX PRO — POUR LES PROFESSIONNELS</p>
            <h2 className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              Tout ce dont tu as besoin{" "}
              <span className="text-gradient-sol-static">pour trader mieux</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", fontSize: 15 }}>
              Notre IA analyse tes graphiques et te fournit un plan de trade complet en secondes.
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
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Analyse IA instantanée</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
                RSI, MACD, Bollinger, patterns de chandeliers, niveaux de support/résistance —
                notre IA lit tout automatiquement depuis ta capture d&apos;écran.
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
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Entry · SL · TP · R:R précis</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                Niveaux exacts avec taille de position calculée selon ton capital en FCFA.
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
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Wickox IA Coach</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                Ton conseiller en français. Pose toutes tes questions sur le trading 24h/24.
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
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Journal de trading intégré</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                Stats avancées, courbe d&apos;équité, heatmap des performances. Apprends de chaque trade.
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
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Tous les marchés</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                Crypto, Forex, Indices, Matières premières, Actions africaines.
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
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Données sécurisées</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                Vos analyses restent privées. Chiffrement de bout en bout.
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
                style={{ letterSpacing: "-0.02em" }}>10 secondes chrono</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
                Upload → Analyse complète en moins de 10 secondes. IA optimisée pour la vitesse.
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
            <p className="section-label" style={{ color: "var(--sol-green)" }}>COMMENT ÇA MARCHE</p>
            <h2 className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              3 étapes simples
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              Du graphique au plan de trade complet en moins de 10 secondes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              { num:"01", title:"Capture ton chart",    desc:"Prends une screenshot de ton graphique sur TradingView, Binance ou n'importe quelle plateforme.", color:"var(--sol-purple)", icon:<BarChart3 size={26}/>, step:1 },
              { num:"02", title:"Upload sur Wickox",    desc:"Glisse l'image. Sélectionne ton actif, timeframe et mode d'analyse (Swing / Day / Scalp).",         color:"var(--sol-cyan)",   icon:<Zap size={26}/>,      step:2 },
              { num:"03", title:"Reçois ton analyse",   desc:"Signal Buy/Sell, Entry, Stop-Loss, Take-Profit, taille de position — tout en FCFA.",                color:"var(--bullish)",    icon:<Sparkles size={26}/>, step:3 },
            ] as const).map(step => (
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
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{step.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{step.desc}</p>
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
            <p className="section-label" style={{ color: "var(--gold)" }}>TARIFS SIMPLES</p>
            <h2 className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              Choisissez votre{" "}
              <span className="text-gradient-warm">terminal</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              Wave · Orange Money · Visa · Mastercard · Crypto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name:"GRATUIT", price:"0",      tag:"Pour découvrir",        features:["3 analyses / jour","5 messages Wickox IA","Crypto uniquement","Journal basique"], cta:"Commencer gratuitement", highlight:false },
              { name:"BASIC",   price:"4 900",  tag:"Pour le trader régulier", features:["20 analyses / jour","30 messages Wickox IA","Forex + Crypto","Export CSV","Journal avancé"],      cta:"Choisir Basic",         highlight:false },
              { name:"PRO",     price:"14 900", tag:"Tout illimité",          features:["Analyses illimitées","Tous marchés","Alertes temps réel","API access","Support prioritaire"],         cta:"Choisir Pro",           highlight:true  },
            ].map(plan => (
              <div key={plan.name} className="relative rounded-2xl overflow-hidden"
                style={plan.highlight ? {
                  background: "var(--surface-glass)", backdropFilter: "blur(20px)",
                  border: "1px solid var(--gold-border)", boxShadow: "var(--shadow-lg),0 0 40px rgba(201,168,76,0.10)",
                } : {
                  background: "var(--surface-high)", border: "1px solid var(--border)",
                }}>
                {plan.highlight && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 text-center"
                    style={{ background: "var(--sol-gradient)" }}>
                    <span style={{ fontSize:10, fontWeight:800, color:"white", letterSpacing:"0.12em" }}>POPULAIRE</span>
                  </div>
                )}
                <div className={`p-7 space-y-6 ${plan.highlight ? "pt-11" : ""}`}>
                  <div>
                    <p className="section-label mb-3"
                      style={{ color: plan.highlight ? "var(--gold)" : "var(--text-tertiary)" }}>{plan.name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display font-semibold"
                        style={{ fontSize:"2.2rem", letterSpacing:"-0.03em", color:"var(--text-primary)" }}>
                        {plan.price === "0" ? "Gratuit" : plan.price}
                      </span>
                      {plan.price !== "0" && (
                        <span style={{ fontSize:12, color:"var(--text-tertiary)" }}>FCFA/mois</span>
                      )}
                    </div>
                    <p style={{ fontSize:12, color:"var(--text-secondary)", marginTop:4 }}>{plan.tag}</p>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3" style={{ fontSize:14, color:"var(--text-primary)" }}>
                        <Check size={15} style={{ color: plan.highlight ? "var(--gold)" : "var(--bullish)", flexShrink:0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/plans"
                    className={plan.highlight ? "btn-plan-pro py-3 rounded-xl text-sm font-bold" : "btn-ghost py-3 rounded-xl text-sm font-bold"}>
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/plans" className="link-sol">
              Voir le tableau complet des plans
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
                <p className="section-label" style={{ color: "var(--bullish)" }}>PARTENAIRE OFFICIEL</p>
                <h2 className="font-display font-semibold text-2xl md:text-3xl"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Trade sur <span className="text-gradient-sol-static">Weex</span>
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
                  Ouvre ton compte avec le code{" "}
                  <span className="font-bold font-data" style={{ color: "var(--bullish)" }}>0ajwh</span>
                  {" "}et bénéficie d&apos;avantages exclusifs pour les traders Wickox.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1">
                  {["0% frais maker", "App mobile", "Crypto + Forex"].map(tag => (
                    <span key={tag} className="font-data"
                      style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 5,
                        background: "rgba(20,241,149,0.10)", border: "1px solid rgba(20,241,149,0.22)",
                        color: "var(--bullish)", letterSpacing: "0.04em" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link href="https://weex.com/register?vipCode=0ajwh" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                  style={{ background: "var(--bullish)", color: "var(--surface)" }}>
                  Ouvrir un compte Weex
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
                <p className="section-label" style={{ color: "var(--gold)" }}>INTELLIGENCE ARTIFICIELLE</p>
                <h2 className="font-display font-semibold text-2xl md:text-3xl"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Idjor, ton coach IA personnel
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
                  Pose tes questions en français 24h/24. Il connaît ton profil et ta psychologie de trader.
                  Plus tu l&apos;utilises, plus ses conseils sont précis.
                </p>
                <Link href="/register"
                  className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-80"
                  style={{ color: "var(--gold)" }}>
                  Essayer Idjor gratuitement
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
              <p className="section-label" style={{ color: "var(--sol-cyan)" }}>INVESTISSEMENT PASSIF</p>
              <h2 className="font-display font-semibold"
                style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                Pas trader ?<br />
                <span style={{ color: "var(--sol-cyan)" }}>Investis intelligemment.</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8 }}>
                Investis régulièrement en crypto ou actions avec un petit budget.
                Même <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>5 000 FCFA/semaine</span> suffisent
                pour construire un patrimoine sur le long terme.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Automatise tes achats hebdomadaires",
                  "Lisse le risque sur la durée",
                  "Suivi de portefeuille en FCFA",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3" style={{ fontSize: 14, color: "var(--text-primary)" }}>
                    <Check size={15} style={{ color: "var(--sol-cyan)", flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: "rgba(3,225,255,0.12)", color: "var(--sol-cyan)", border: "1px solid rgba(3,225,255,0.25)" }}>
                Commencer à investir
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            {/* DCA visual */}
            <div className="rounded-2xl p-6 space-y-4"
              style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
              <p className="section-label">Simulation DCA — 12 mois</p>
              <div className="space-y-3">
                {[
                  { label: "Mise hebdo",      value: "5 000 FCFA",  color: "var(--text-primary)" },
                  { label: "Total investi",   value: "260 000 FCFA", color: "var(--text-primary)" },
                  { label: "Valeur estimée",  value: "~338 000 FCFA", color: "var(--bullish)" },
                  { label: "Performance",     value: "+30%",         color: "var(--bullish)" },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 px-4 rounded-xl"
                    style={{ background: "var(--surface-highest)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{row.label}</span>
                    <span className="font-data font-bold" style={{ fontSize: 14, color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                * Simulation indicative basée sur une performance historique Bitcoin moyenne.
                Pas une garantie de rendement.
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
            <p className="section-label" style={{ color: "var(--sol-purple)" }}>ILS NOUS FONT CONFIANCE</p>
            <h2 className="font-display font-semibold"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              Ce que disent les traders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Kouamé A.", location: "Abidjan", quote: "J'ai enfin compris le RSI grâce à Idjor. Il m'explique chaque signal en français, simplement.", stars: 5 },
              { name: "Fatou D.",  location: "Dakar",   quote: "Signal parfait, +2.3R sur SOL. J'ai suivi l'analyse Wickox à la lettre et ça a marché.", stars: 5 },
              { name: "Ibrahim K.", location: "Abidjan", quote: "Le meilleur outil pour trader en FCFA. Plus besoin de convertir en dollars pour comprendre mon risque.", stars: 5 },
            ].map(t => (
              <div key={t.name} className="rounded-2xl p-6 space-y-4"
                style={{ background: "var(--surface-high)", border: "1px solid var(--border)" }}>
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 1l1.5 4H13l-3.5 2.5 1.3 4L7 9 3.2 11.5l1.3-4L1 5h4.5L7 1z"
                        fill="var(--gold)" />
                    </svg>
                  ))}
                </div>
                {/* Quote */}
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.75, fontStyle: "italic" }}>
                  &quot;{t.quote}&quot;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: "rgba(153,69,255,0.15)", color: "var(--sol-purple)" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{t.location}</p>
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
                Essayez Wickox{" "}
                <span className="text-gradient-sol">15 jours gratuitement</span>
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
                Rejoins{" "}
                <span style={{ color:"var(--text-primary)", fontWeight:600 }}>1 247 traders</span>{" "}
                qui analysent plus vite et tradent mieux avec Wickox.
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="btn-sol px-8 py-3.5 rounded-xl text-sm font-bold">
                <Sparkles size={15} aria-hidden="true" />
                Rejoindre la période d&apos;essai
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <p className="relative text-xs" style={{ color: "var(--text-tertiary)" }}>
              Le trading comporte des risques de perte en capital. Tradez responsablement.
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
                Assistant trading IA pour les traders d&apos;Afrique de l&apos;Ouest.
              </p>
              <p style={{ fontSize:12, color:"var(--text-tertiary)" }}>
                © 2026 Wakama Edge Ventures Inc.<br />Abidjan, Côte d&apos;Ivoire
              </p>
            </div>

            {/* Colonnes de liens */}
            {[
              { title:"Produit",    links:["Fonctionnalités","Tarifs","Wickox Pro","Formation"] },
              { title:"Ressources", links:["Documentation","Blog","Changelog","Status"] },
              { title:"Légal",      links:["Conditions","Confidentialité","Mentions légales","Contact"] },
            ].map(col => (
              <div key={col.title} className="space-y-4">
                <p className="section-label">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="footer-link">{link}</a></li>
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
              Pas un conseil financier — Politique de confidentialité
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
