"use client";

import Link from "next/link";

/** Navigation bar for the public landing page. */
export default function LandingNavbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(10,14,26,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-baseline gap-0.5">
        <span className="font-headline text-xl font-bold" style={{ color: "#00FF88" }}>Idjor</span>
        <span className="font-headline text-xl font-bold text-white">Trade</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {["Fonctionnalités", "Formation", "Tarifs"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "var(--on-surface-dim)" }}
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="hidden md:block px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ border: "1px solid rgba(0,255,136,0.3)", color: "#00FF88" }}
        >
          Connexion
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg text-sm font-bold"
          style={{ background: "#00FF88", color: "#0A0E1A" }}
        >
          Commencer
        </Link>
      </div>
    </nav>
  );
}
