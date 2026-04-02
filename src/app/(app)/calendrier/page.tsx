import CalendarFilter from "@/components/calendrier/CalendarFilter";
import EventRow from "@/components/calendrier/EventRow";
import ImpactBadge from "@/components/calendrier/ImpactBadge";
import { mockEvents } from "@/lib/economic-calendar";

// Reference dates for label formatting
const today = "2026-04-02";
const tomorrow = "2026-04-03";

// Group events by date
const grouped = mockEvents.reduce<Record<string, typeof mockEvents>>((acc, e) => {
  if (!acc[e.date]) acc[e.date] = [];
  acc[e.date].push(e);
  return acc;
}, {});

const highImpactToday = mockEvents.filter((e) => e.date === today && e.impact === "high").length;

function formatDateLabel(date: string): string {
  // Use noon UTC to avoid timezone-induced off-by-one on the day
  const d = new Date(date + "T12:00:00Z");
  if (date === today) {
    return `Aujourd'hui — ${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`;
  }
  if (date === tomorrow) {
    return `Demain — ${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`;
  }
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function CalendrierPage() {
  const dates = Object.keys(grouped).sort();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline font-bold text-2xl text-white">Calendrier Économique</h1>
          <p className="text-xs mt-1" style={{ color: "var(--on-surface-dim)" }}>
            Événements macroéconomiques impactant vos marchés
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: "var(--surface-highest)", color: "var(--on-surface-dim)" }}>
          Via Forex Factory
        </span>
      </div>

      {/* High-impact alert banner */}
      {highImpactToday > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "rgba(255,59,92,0.06)", border: "1px solid rgba(255,59,92,0.2)" }}>
          <ImpactBadge impact="high" />
          <p className="text-sm font-semibold" style={{ color: "#FF3B5C" }}>
            ⚠️ {highImpactToday} événement{highImpactToday > 1 ? "s" : ""} à fort impact {"aujourd'hui"} — Soyez prudents sur vos positions
          </p>
        </div>
      )}

      {/* Filters */}
      <CalendarFilter />

      {/* Events grouped by date */}
      {dates.map((date) => (
        <div key={date} className="space-y-3">
          {/* Date separator */}
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold capitalize" style={{ color: date === today ? "#00FF88" : "var(--on-surface-dim)" }}>
              {formatDateLabel(date)}
            </h2>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            <span className="text-xs" style={{ color: "var(--on-surface-dim)" }}>
              {grouped[date].length} événement{grouped[date].length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Desktop table */}
          <div className="card overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Heure", "Devise", "Événement", "Impact", "Prévision", "Précédent", "Actuel"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--on-surface-dim)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grouped[date].map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {grouped[date].map((event) => (
              <div key={event.id} className="card px-4 py-3 flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                  <span className="font-mono-data text-xs font-bold text-white">{event.time}</span>
                  <ImpactBadge impact={event.impact} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span>{event.flag}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--on-surface)" }}>{event.country}</span>
                  </div>
                  <p className="text-sm text-white leading-snug">{event.event}</p>
                  <div className="flex gap-3 mt-1 text-xs" style={{ color: "var(--on-surface-dim)" }}>
                    {event.forecast && <span>Prev: <span className="text-white">{event.forecast}</span></span>}
                    {event.previous && <span>Préc: {event.previous}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer note */}
      <p className="text-xs text-center" style={{ color: "var(--on-surface-dim)" }}>
        {"Les heures sont affichées en GMT+0 (heure d'Abidjan). Source: Forex Factory · Actualisation automatique."}
      </p>

    </div>
  );
}
