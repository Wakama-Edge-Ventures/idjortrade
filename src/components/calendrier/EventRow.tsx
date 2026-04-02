import ImpactBadge from "./ImpactBadge";
import type { EconomicEvent } from "@/lib/economic-calendar";

/** Shows the actual value colored by whether it beat or missed the forecast */
function ActualCell({ actual, forecast }: { actual: string | null; forecast: string | null }) {
  if (!actual) return <span style={{ color: "var(--on-surface-dim)" }}>—</span>;
  if (!forecast) return <span className="text-white">{actual}</span>;
  // String comparison is sufficient for the mock data values
  const color = actual > forecast ? "#00FF88" : actual < forecast ? "#FF3B5C" : "var(--on-surface)";
  return <span className="font-bold" style={{ color }}>{actual}</span>;
}

export default function EventRow({ event }: { event: EconomicEvent }) {
  const isHighImpact = event.impact === 'high';

  return (
    <tr
      className="transition-colors"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        background: isHighImpact ? "rgba(255,59,92,0.02)" : "transparent",
      }}
    >
      <td className="px-4 py-3 font-mono-data text-xs" style={{ color: "var(--on-surface-dim)" }}>
        {event.time}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span>{event.flag}</span>
          <span className="text-xs font-bold" style={{ color: "var(--on-surface)" }}>{event.country}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: "var(--on-surface)" }}>
        {event.event}
      </td>
      <td className="px-4 py-3">
        <ImpactBadge impact={event.impact} />
      </td>
      <td className="px-4 py-3 font-mono-data text-xs text-white">
        {event.forecast || <span style={{ color: "var(--on-surface-dim)" }}>—</span>}
      </td>
      <td className="px-4 py-3 font-mono-data text-xs" style={{ color: "var(--on-surface-dim)" }}>
        {event.previous || "—"}
      </td>
      <td className="px-4 py-3 font-mono-data text-xs">
        <ActualCell actual={event.actual} forecast={event.forecast} />
      </td>
    </tr>
  );
}
