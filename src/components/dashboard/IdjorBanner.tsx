"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function IdjorBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 ${mounted ? "animate-fade-in-up" : ""}`}
      style={{
        /* Gradient Solana diagonal */
        background: "linear-gradient(135deg, #0E0520 0%, #110D28 40%, #071A12 100%)",
        border: "1px solid rgba(153,69,255,0.25)",
        boxShadow: "0 0 60px rgba(153,69,255,0.10), 0 0 30px rgba(20,241,149,0.05)",
      }}
    >
      {/* ── Orbes décoratifs ── */}
      <div
        className="absolute -top-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(153,69,255,0.15) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 right-24 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(20,241,149,0.10) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      {/* Ligne gradient top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: "var(--sol-gradient)", opacity: 0.5 }}
        aria-hidden="true"
      />

      {/* ── Contenu gauche ── */}
      <div className="flex-1 space-y-4 relative z-10">
        {/* Badge NEW */}
        <span
          className="badge-new inline-flex items-center gap-1.5"
          style={{ color: "var(--sol-purple)" }}
        >
          <Sparkles size={10} aria-hidden="true" />
          Nouveau
        </span>

        {/* Titre gradient */}
        <h2
          className="font-display font-semibold text-gradient-sol-static leading-tight"
          style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", letterSpacing: "-0.02em" }}
        >
          Idjor IA te coach gratuitement.
        </h2>

        <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-secondary)" }}>
          Pose tes questions en français sur le trading, les stratégies,
          la lecture de graphiques. Ton assistant IA, disponible 24h/24.
        </p>

        {/* CTA */}
        <Link
          href="/idjor"
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer group"
          style={{
            background: "var(--sol-gradient)",
            color: "white",
            boxShadow: "0 0 20px rgba(153,69,255,0.35)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(153,69,255,0.55)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(153,69,255,0.35)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          <Sparkles size={15} />
          Discuter avec Idjor
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* ── Icône droite ── */}
      <div className="flex-shrink-0 hidden sm:block relative z-10">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "var(--sol-gradient)",
            boxShadow: "0 0 40px rgba(153,69,255,0.40), 0 0 20px rgba(20,241,149,0.20)",
          }}
        >
          <Sparkles size={36} color="white" />
        </div>
        {/* Ring animé */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "1.5px solid rgba(153,69,255,0.5)",
            animation: "ping-sol 2.5s ease-out infinite",
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
