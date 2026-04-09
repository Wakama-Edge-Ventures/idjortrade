"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Lang } from "@/lib/i18n";

export default function LandingNavbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang, setLang } = useTranslation();

  const NAV_LINKS = [
    { label: t("landing.nav.home"),     href: "#hero" },
    { label: t("landing.nav.pro"),      href: "#features" },
    { label: t("landing.nav.features"), href: "#how" },
    { label: t("landing.nav.pricing"),  href: "#pricing" },
    { label: t("landing.nav.about"),    href: "#footer" },
  ];

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
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150"
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

            {/* Lang toggle */}
            <div
              className="flex items-center rounded-full flex-shrink-0"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.15)",
                overflow: "hidden",
              }}
            >
              {(["fr", "en"] as Lang[]).map((l, i) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="cursor-pointer transition-all duration-150"
                  style={{
                    padding: "4px 8px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: lang === l ? "white" : "rgba(255,255,255,0.7)",
                    background: lang === l ? "var(--sol-purple)" : "transparent",
                    borderRight: i === 0 ? "1px solid rgba(255,255,255,0.2)" : "none",
                    lineHeight: 1.4,
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

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
              {t("landing.nav.login")}
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
              {t("landing.nav.cta")}
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
                key={link.href}
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
                {t("landing.nav.login")}
              </Link>
              <Link
                href="/register"
                className="w-full py-3 rounded-xl text-center font-bold text-white"
                style={{ background: "var(--sol-gradient)" }}
                onClick={() => setMobileOpen(false)}
              >
                {t("landing.nav.cta")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
