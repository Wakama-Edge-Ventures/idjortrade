"use client";

import { comparisonRows } from "@/lib/mock-plans";
import { useLang } from "@/lib/LangContext";

function Cell({ value, isProCol }: { value: string | boolean; isProCol?: boolean }) {
  if (typeof value === "boolean") {
    return (
      <span style={{ color: value ? "var(--bullish)" : "var(--border)" }}>
        {value ? "✓" : "✗"}
      </span>
    );
  }
  return <span style={{ color: isProCol ? "var(--bullish)" : "var(--text-primary)" }}>{value}</span>;
}

// Map raw values to i18n keys
const VALUE_KEYS: Record<string, string> = {
  "Illimité": "cmp.val.unlimited",
  "3 cours": "cmp.val.3courses",
  "5 max": "cmp.val.5max",
  "90 jours": "cmp.val.90d",
  "1 (signal)": "cmp.val.signal",
};

export default function ComparisonTable() {
  const { t } = useLang();

  const cols = ["", t("plan.free.f6") === "Analysis history" ? "FREE" : "GRATUIT", "STARTER", "BASIC", "PRO", "TRADER"];
  // Simpler: just use plan name labels directly
  const colLabels = ["", "GRATUIT", "STARTER", "BASIC", "PRO", "TRADER"];

  const translatedRows = comparisonRows.map((row, i) => ({
    ...row,
    feature: t(`cmp.row${i}`),
  }));

  function translateValue(val: string | boolean): string | boolean {
    if (typeof val === "boolean") return val;
    return VALUE_KEYS[val] ? t(VALUE_KEYS[val]) : val;
  }

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <table className="w-full min-w-[750px] text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {colLabels.map((col, i) => (
              <th
                key={col + i}
                className="px-4 py-4 text-left text-xs font-bold tracking-widest"
                style={{
                  background: i === 4 ? "rgba(20,241,149,0.04)" : "var(--surface-mid)",
                  color: i === 4 ? "var(--bullish)" : i === 2 ? "#0EA5E9" : "var(--text-secondary)",
                  borderRight: i < colLabels.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {translatedRows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                background: ri % 2 === 0 ? "var(--surface-mid)" : "var(--surface-low)",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <td className="px-4 py-3 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                {row.feature}
              </td>
              {(["free", "starter", "basic", "pro", "trader"] as const).map((key, i) => (
                <td
                  key={key}
                  className="px-4 py-3 text-center text-xs font-semibold"
                  style={{
                    background: key === "pro" ? "rgba(20,241,149,0.04)" : "transparent",
                    borderRight: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <Cell value={translateValue(row[key])} isProCol={key === "pro"} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
