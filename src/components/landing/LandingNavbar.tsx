"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Accueil",         href: "#hero" },
  { label: "Wickox Pro",      href: "#features" },
  { label: "Fonctionnalités", href: "#how" },
  { label: "Tarifs",          href: "#pricing" },
  { label: "À propos",        href: "#footer" },
];

export default function LandingNavbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(7,9,15,0.92)" : "rgba(7,9,15,0.60)",
          backdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Icon mark */}
            <div
              style={{
                width: 30, height: 30,
                borderRadius: 8,
                background: "var(--sol-gradient)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(153,69,255,0.35)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 12L8 4l5 8H3z" fill="white" fillOpacity="0.9"/>
                <circle cx="8" cy="9" r="2" fill="white" fillOpacity="0.6"/>
              </svg>
            </div>
            <span
              className="font-display font-semibold text-xl"
              style={{
                background: "var(--sol-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}
            >
              Wickox
            </span>
          </Link>

          {/* ── Nav desktop ── */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150 hover:text-white"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:block px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150 cursor-pointer"
              style={{
                background: "var(--sol-gradient)",
                color: "white",
                boxShadow: "0 0 16px rgba(153,69,255,0.35)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(153,69,255,0.55)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(153,69,255,0.35)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              Get Started
            </Link>

            {/* Menu mobile */}
            <button
              className="flex md:hidden p-2 rounded-lg cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Menu mobile drawer ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-[60px] animate-fade-in"
          style={{ background: "rgba(7,9,15,0.97)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex flex-col gap-1 px-6 py-6">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="py-3 text-lg font-semibold border-b"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl text-center font-semibold"
                style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}
                onClick={() => setMobileOpen(false)}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="w-full py-3 rounded-xl text-center font-bold text-white"
                style={{ background: "var(--sol-gradient)" }}
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
