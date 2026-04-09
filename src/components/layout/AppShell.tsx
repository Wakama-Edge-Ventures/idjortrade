"use client";

import {
  LayoutDashboard,
  TrendingUp,
  Zap,
  Globe,
  Sparkles,
  BookOpen,
  History,
  CreditCard,
  Settings,
  Home,
  ScanLine,
  User,
  Bell,
  GraduationCap,
  CalendarDays,
  LogOut,
  Sun,
  ChevronUp,
  BellDot,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import SessionTicker from "./SessionTicker";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Lang } from "@/lib/i18n";

/* ── Types ──────────────────────────────────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: "new" | "pro";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

/* ── Config nav (dynamic) ───────────────────────────────────────────────────── */
function buildNavGroups(t: (key: string) => string): NavGroup[] {
  return [
    {
      title: t("nav.group.outils"),
      items: [
        { label: t("nav.dashboard"),  href: "/dashboard",  icon: LayoutDashboard },
        { label: t("nav.swing"),      href: "/swing",       icon: TrendingUp },
        { label: t("nav.day"),        href: "/day",         icon: Sun },
        { label: t("nav.scalp"),      href: "/scalp",       icon: Zap },
        { label: t("nav.marche"),     href: "/marche",      icon: Globe },
        { label: t("nav.calendrier"), href: "/calendrier",  icon: CalendarDays },
        { label: t("nav.dca"),        href: "/dca",          icon: TrendingUp },
      ],
    },
    {
      title: t("nav.group.apprendre"),
      items: [
        { label: t("nav.idjor"),      href: "/idjor",      icon: Sparkles, badge: "NEW", badgeType: "new" },
        { label: t("nav.formation"),  href: "/formation",   icon: GraduationCap },
        { label: t("nav.journal"),    href: "/journal",     icon: BookOpen },
        { label: t("nav.historique"), href: "/historique",  icon: History },
      ],
    },
    {
      title: t("nav.group.compte"),
      items: [
        { label: t("nav.plans"),      href: "/plans",       icon: CreditCard },
        { label: t("nav.parrainage"), href: "/affiliation", icon: Gift },
        { label: t("nav.parametres"), href: "/parametres",  icon: Settings },
      ],
    },
  ];
}

function buildAnalyseItems(t: (key: string) => string) {
  return [
    { label: "Swing", href: "/swing", icon: TrendingUp },
    { label: "Day",   href: "/day",   icon: Sun },
    { label: "Scalp", href: "/scalp", icon: Zap },
  ];
}

function buildMobileNavItems(t: (key: string) => string) {
  return [
    { label: t("nav.accueil"), href: "/dashboard", icon: Home },
    { label: t("nav.journal"), href: "/journal",   icon: BookOpen },
    { label: t("nav.idjor"),   href: "/idjor",     icon: Sparkles },
    { label: t("nav.profil"),  href: "/parametres",icon: User },
  ];
}

const PLAN_CONFIG: Record<string, { label: string; style: React.CSSProperties }> = {
  FREE:   { label: "FREE",   style: { background: "rgba(255,255,255,0.06)", color: "#64748B" } },
  BASIC:  { label: "BASIC",  style: { background: "rgba(20,241,149,0.12)", color: "var(--bullish)" } },
  PRO:    { label: "PRO",    style: { background: "rgba(153,69,255,0.18)", color: "var(--sol-purple)" } },
  TRADER: { label: "TRADER", style: { background: "rgba(201,168,76,0.15)", color: "#C9A84C" } },
};

function getLocalDate(locale: string): string {
  return new Date().toLocaleDateString(locale, {
    timeZone: "Africa/Abidjan",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/* ── Component ──────────────────────────────────────────────────────────────── */
interface AppShellProps {
  children: React.ReactNode;
  activePage: string;
}

export default function AppShell({ children, activePage }: AppShellProps) {
  const { data: session } = useSession();
  const { t, lang, setLang } = useTranslation();

  const prenom   = session?.user?.prenom ?? "Trader";
  const plan     = (session?.user?.plan as string) ?? "FREE";
  const planCfg  = PLAN_CONFIG[plan] ?? PLAN_CONFIG.FREE;

  const navGroups      = buildNavGroups(t);
  const analyseItems   = buildAnalyseItems(t);
  const mobileNavItems = buildMobileNavItems(t);

  const [analyseOpen, setAnalyseOpen] = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [hasNotif, setHasNotif]       = useState(true);

  useEffect(() => { setMounted(true); }, []);

  const isActive = (href: string) =>
    activePage === href || activePage.startsWith(href + "/");

  const analyseActive = ["/swing", "/day", "/scalp"].some(h => isActive(h));

  const initial = prenom.charAt(0).toUpperCase();
  const dateLocale = lang === "en" ? "en-GB" : "fr-FR";

  return (
    <div className="min-h-screen flex" style={{ background: "var(--surface)" }}>

      {/* ══════════════════════════════════════════════════════════
          SIDEBAR DESKTOP
      ══════════════════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30"
        style={{
          width: 240,
          background: "var(--surface-low)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* ── Logo ── */}
        <div className="px-6 pt-7 pb-5">
          <Link href="/dashboard" className="block group">
            <div className="flex items-baseline gap-0 mb-1">
              <span
                className="font-display text-2xl font-semibold text-gradient-sol-static"
                style={{ letterSpacing: "-0.02em" }}
              >
                Idjor
              </span>
              <span
                className="font-display text-2xl font-semibold"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                Trade
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-0.5 rounded-full"
                style={{
                  width: 32,
                  background: "var(--sol-gradient)",
                }}
              />
              <p className="section-label" style={{ fontSize: 9 }}>
                TERMINAL IA
              </p>
            </div>
          </Link>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 overflow-y-auto space-y-6 py-2">
          {navGroups.map((group, gi) => (
            <div
              key={group.title}
              className={mounted ? "animate-fade-in-right" : ""}
              style={{ animationDelay: `${gi * 0.06}s` }}
            >
              <p className="section-label px-3 mb-2">{group.title}</p>
              <ul className="space-y-0.5">
                {group.items.map((item, ii) => {
                  const active = isActive(item.href);
                  const Icon   = item.icon;
                  return (
                    <li
                      key={item.href}
                      className={mounted ? "animate-fade-in-right" : ""}
                      style={{ animationDelay: `${gi * 0.06 + ii * 0.04 + 0.1}s` }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
                        style={{
                          color:      active ? "var(--sol-green)"  : "var(--text-secondary)",
                          background: active ? "rgba(20,241,149,0.07)" : "transparent",
                          borderLeft: active ? "2px solid var(--sol-green)" : "2px solid transparent",
                          paddingLeft: active ? "10px" : "12px",
                        }}
                        onMouseEnter={e => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                          }
                        }}
                      >
                        <Icon
                          size={16}
                          style={{ color: active ? "var(--sol-green)" : undefined, flexShrink: 0 }}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badgeType === "new" && (
                          <span className="badge-new" style={{ color: "var(--sol-purple)" }}>
                            {item.badge}
                          </span>
                        )}
                        {item.badge && item.badgeType === "pro" && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: "var(--gold-muted)", color: "var(--gold)" }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── User footer ── */}
        <div
          className="px-4 py-4 space-y-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Avatar + nom */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "var(--sol-gradient)",
                  padding: 1.5,
                }}
              />
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: "var(--surface-highest)",
                  color: "var(--sol-green)",
                  border: "2px solid transparent",
                  backgroundClip: "padding-box",
                  boxShadow: "0 0 0 2px var(--surface-low), 0 0 0 3.5px var(--sol-purple)",
                }}
              >
                {initial}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {prenom}
              </p>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={planCfg.style}
              >
                {planCfg.label}
              </span>
            </div>
          </div>

          {/* Déconnexion */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer"
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = "var(--bearish)";
              (e.currentTarget as HTMLElement).style.background = "rgba(244,63,94,0.07)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <LogOut size={13} />
            {t("btn.deconnexion")}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════
          ZONE PRINCIPALE
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: 0 }} id="main-content">
        <style>{`@media (min-width: 768px) { #main-content { margin-left: 240px; } }`}</style>

        {/* Ticker de session — desktop */}
        <SessionTicker />

        {/* ── Header desktop ── */}
        <header
          className="hidden md:flex items-center justify-between px-8 py-3.5 sticky top-0 z-20"
          style={{
            background: "rgba(7,9,15,0.82)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Salutation */}
          <div>
            <p className="font-display text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              {t("header.greeting")}{" "}
              <span className="text-gradient-sol-static">{prenom}</span>
            </p>
            <p className="text-xs capitalize" style={{ color: "var(--text-tertiary)" }}>
              {mounted ? getLocalDate(dateLocale) : ""}
            </p>
          </div>

          {/* Droite */}
          <div className="flex items-center gap-4">
            {/* Statut marché */}
            <div className="flex items-center gap-2">
              <span className="live-dot" aria-hidden="true" />
              <span className="text-xs font-medium" style={{ color: "var(--bullish)" }}>
                {t("header.market.open")}
              </span>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 20, background: "var(--border)" }} />

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

            {/* Divider */}
            <div style={{ width: 1, height: 20, background: "var(--border)" }} />

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg transition-colors duration-150 cursor-pointer"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Notifications"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              {hasNotif ? <BellDot size={18} /> : <Bell size={18} />}
              {hasNotif && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: "var(--sol-purple)" }}
                />
              )}
            </button>

            {/* Mini avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{
                background: "rgba(153,69,255,0.15)",
                color: "var(--sol-purple)",
                boxShadow: "0 0 0 2px rgba(153,69,255,0.30)",
              }}
            >
              {initial}
            </div>
          </div>
        </header>

        {/* ── Header mobile ── */}
        <header
          className="flex md:hidden items-center justify-between px-4 py-3.5 sticky top-0 z-20"
          style={{
            background: "rgba(7,9,15,0.90)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="flex items-baseline gap-0">
            <span className="font-display text-xl font-semibold text-gradient-sol-static">
              Idjor
            </span>
            <span className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Trade
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Lang toggle mobile */}
            <div
              className="flex items-center rounded-full flex-shrink-0"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.15)",
                overflow: "hidden",
                minWidth: 70,
              }}
            >
              {(["fr", "en"] as Lang[]).map((l, i) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="cursor-pointer transition-all duration-150 flex-1 text-center"
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
            <div className="flex items-center gap-1.5">
              <span className="live-dot" aria-hidden="true" style={{ transform: "scale(0.8)" }} />
            </div>
            <button
              className="relative p-2 rounded-lg"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {hasNotif && (
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--sol-purple)" }}
                />
              )}
            </button>
          </div>
        </header>

        {/* ── Contenu ── */}
        <main
          className={`flex-1 pb-24 md:pb-10 ${mounted ? "animate-fade-in" : ""}`}
          style={{ animationDuration: "0.4s" }}
        >
          {children}
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM NAV MOBILE
      ══════════════════════════════════════════════════════════ */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden items-center h-[60px] z-30"
        style={{
          background: "rgba(11,14,24,0.95)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid var(--border)",
        }}
      >
        {/* Analyse popup */}
        {analyseOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setAnalyseOpen(false)} />
            <div
              className="absolute bottom-[68px] left-1/2 -translate-x-1/2 z-20 rounded-2xl p-2 flex gap-1 animate-scale-in"
              style={{
                background: "var(--surface-highest)",
                border: "1px solid var(--border-sol)",
                boxShadow: "var(--shadow-sol), var(--shadow-lg)",
              }}
            >
              {analyseItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAnalyseOpen(false)}
                    className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl transition-all duration-150 cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(153,69,255,0.10)";
                      (e.currentTarget as HTMLElement).style.color = "var(--sol-purple)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    <Icon size={18} />
                    <span className="text-[10px] font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Gauche */}
        {mobileNavItems.slice(0, 2).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-150"
              style={{ color: active ? "var(--sol-green)" : "var(--text-tertiary)" }}
            >
              <Icon size={19} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Bouton Analyser — centre */}
        <button
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 cursor-pointer transition-colors duration-150"
          style={{ color: analyseActive || analyseOpen ? "var(--sol-purple)" : "var(--text-tertiary)" }}
          onClick={() => setAnalyseOpen(v => !v)}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: analyseOpen
                ? "var(--sol-gradient)"
                : "rgba(153,69,255,0.10)",
              transform: analyseOpen ? "scale(1.05)" : "scale(1)",
            }}
          >
            <ScanLine size={18} style={{ color: analyseOpen ? "white" : "var(--sol-purple)" }} />
          </div>
          <span className="text-[10px] font-medium flex items-center gap-0.5">
            {t("nav.analyser")}
            <ChevronUp
              size={9}
              style={{
                transform: analyseOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.2s ease",
              }}
            />
          </span>
        </button>

        {/* Droite */}
        {mobileNavItems.slice(2).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors duration-150"
              style={{ color: active ? "var(--sol-green)" : "var(--text-tertiary)" }}
            >
              <Icon size={19} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
