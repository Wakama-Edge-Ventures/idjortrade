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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SessionTicker from "./SessionTicker";
import { useSession, signOut } from "next-auth/react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  color?: string;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "OUTILS",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Swing Trading", href: "/swing", icon: TrendingUp },
      { label: "Day Trading", href: "/day", icon: Sun },
      { label: "Scalp Trading", href: "/scalp", icon: Zap },
      { label: "Marché", href: "/marche", icon: Globe },
      { label: "Calendrier", href: "/calendrier", icon: CalendarDays },
    ],
  },
  {
    title: "APPRENDRE",
    items: [
      {
        label: "Idjor IA",
        href: "/idjor",
        icon: Sparkles,
        color: "#F5A623",
        badge: "NEW",
      },
      { label: "Formation", href: "/formation", icon: GraduationCap },
      { label: "Journal", href: "/journal", icon: BookOpen },
      { label: "Historique", href: "/historique", icon: History },
    ],
  },
  {
    title: "COMPTE",
    items: [
      { label: "Plans", href: "/plans", icon: CreditCard },
      { label: "Paramètres", href: "/parametres", icon: Settings },
    ],
  },
];

const analyseMenuItems = [
  { label: "Swing", href: "/swing", icon: TrendingUp, color: "#00FF88" },
  { label: "Day", href: "/day", icon: Sun, color: "#0EA5E9" },
  { label: "Scalp", href: "/scalp", icon: Zap, color: "#F5A623" },
];

const mobileNavItems = [
  { label: "Accueil", href: "/dashboard", icon: Home },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "Idjor", href: "/idjor", icon: Sparkles },
  { label: "Profil", href: "/parametres", icon: User },
];

function getAbidjanTime(): string {
  return new Date().toLocaleDateString("fr-FR", {
    timeZone: "Africa/Abidjan",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

interface AppShellProps {
  children: React.ReactNode;
  activePage: string;
}

const PLAN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  FREE:   { label: "Gratuit", color: "#717584", bg: "rgba(255,255,255,0.05)" },
  BASIC:  { label: "Basic",   color: "#00FF88", bg: "rgba(0,255,136,0.10)" },
  PRO:    { label: "Pro",     color: "#F5A623", bg: "rgba(245,166,35,0.15)" },
  TRADER: { label: "Trader",  color: "#FF3B5C", bg: "rgba(255,59,92,0.10)" },
};

export default function AppShell({
  children,
  activePage,
}: AppShellProps) {
  const { data: session } = useSession();
  const prenom = session?.user?.prenom ?? "Trader";
  const plan = (session?.user?.plan as string) ?? "FREE";
  const planConfig = PLAN_LABELS[plan] ?? PLAN_LABELS.FREE;
  const [analyseMenuOpen, setAnalyseMenuOpen] = useState(false);

  const planBadgeStyle: React.CSSProperties = {
    background: planConfig.bg,
    color: planConfig.color,
  };

  const isActive = (href: string) =>
    activePage === href || activePage.startsWith(href + "/");

  const analyseIsActive = ["/swing", "/day", "/scalp"].some(h => isActive(h));

  return (
    <div className="min-h-screen flex">
      {/* ── Sidebar desktop ── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] border-r"
        style={{
          background: "var(--surface-low)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-baseline gap-0.5">
            <span
              className="font-headline text-2xl font-bold"
              style={{ color: "#00FF88" }}
            >
              Idjor
            </span>
            <span className="font-headline text-2xl font-bold text-white">
              Trade
            </span>
          </div>
          <p
            className="text-[10px] font-semibold tracking-widest mt-0.5"
            style={{ color: "var(--on-surface-dim)" }}
          >
            TERMINAL IA
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p
                className="text-[10px] font-semibold tracking-widest px-3 mb-1.5"
                style={{ color: "var(--on-surface-dim)" }}
              >
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors"
                        style={{
                          color: active
                            ? "#00FF88"
                            : item.color
                            ? item.color
                            : "var(--on-surface-dim)",
                          background: active
                            ? "rgba(0,255,136,0.06)"
                            : "transparent",
                          borderLeft: active
                            ? "2px solid #00FF88"
                            : "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.color = "white";
                            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLElement).style.color =
                              item.color || "var(--on-surface-dim)";
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                          }
                        }}
                      >
                        <Icon size={16} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: "rgba(245,166,35,0.15)",
                              color: "#F5A623",
                            }}
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

        {/* User footer */}
        <div
          className="px-4 py-4 border-t space-y-2"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "rgba(0,255,136,0.15)", color: "#00FF88" }}
            >
              {prenom.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{prenom}</p>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={planBadgeStyle}
              >
                {plan}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ color: "var(--on-surface-dim)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#FF3B5C"; (e.currentTarget as HTMLElement).style.background = "rgba(255,59,92,0.06)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--on-surface-dim)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <LogOut size={13} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col md:ml-[220px]">
        {/* Session ticker — desktop only, above top bar */}
        <SessionTicker />
        {/* Top bar desktop */}
        <header
          className="hidden md:flex items-center justify-between px-6 py-3 sticky top-0 z-10 border-b"
          style={{
            background: "rgba(10,14,26,0.85)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div>
            <p className="text-sm font-medium text-white">
              Bonjour, {prenom} 👋
            </p>
            <p
              className="text-xs capitalize"
              style={{ color: "var(--on-surface-dim)" }}
            >
              {getAbidjanTime()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "#00FF88" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "#00FF88" }}
                />
              </span>
              <span className="text-xs" style={{ color: "#00FF88" }}>
                Marché ouvert
              </span>
            </div>
            <button
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: "var(--on-surface-dim)" }}
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Top bar mobile */}
        <header
          className="flex md:hidden items-center justify-between px-4 py-3 sticky top-0 z-10 border-b"
          style={{
            background: "rgba(10,14,26,0.9)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-baseline gap-0.5">
            <span
              className="font-headline text-xl font-bold"
              style={{ color: "#00FF88" }}
            >
              Idjor
            </span>
            <span className="font-headline text-xl font-bold text-white">
              Trade
            </span>
          </div>
          <button
            className="relative p-2 rounded-lg"
            style={{ color: "var(--on-surface-dim)" }}
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-20 md:pb-8">{children}</main>
      </div>

      {/* ── Bottom nav mobile ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden items-center h-16 border-t z-20"
        style={{
          background: "rgba(14,19,32,0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        {/* Analyser menu popup */}
        {analyseMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setAnalyseMenuOpen(false)}
            />
            {/* Popup */}
            <div
              className="absolute bottom-[68px] left-1/2 -translate-x-1/2 z-20 rounded-2xl p-2 flex gap-1 shadow-2xl"
              style={{
                background: "var(--surface-high)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {analyseMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAnalyseMenuOpen(false)}
                    className="flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl transition-colors"
                    style={{ color: item.color }}
                  >
                    <Icon size={18} />
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Left items */}
        {mobileNavItems.slice(0, 2).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
              style={{ color: active ? "#00FF88" : "#717584" }}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Analyser button — centre */}
        <button
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
          style={{ color: analyseIsActive || analyseMenuOpen ? "#00FF88" : "#717584" }}
          onClick={() => setAnalyseMenuOpen(v => !v)}
        >
          <div className="relative">
            <ScanLine size={20} />
          </div>
          <span className="text-[10px] font-medium flex items-center gap-0.5">
            Analyser
            <ChevronUp size={9} style={{ transform: analyseMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </span>
        </button>

        {/* Right items */}
        {mobileNavItems.slice(2).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2"
              style={{ color: active ? "#00FF88" : "#717584" }}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
