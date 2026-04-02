"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
            style={{
              background: open === i ? "var(--surface-high)" : "var(--surface-mid)",
            }}
          >
            <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
            <div className="flex-shrink-0" style={{ color: open === i ? "#00FF88" : "var(--on-surface-dim)" }}>
              {open === i ? <X size={16} /> : <Plus size={16} />}
            </div>
          </button>

          <div
            className="overflow-hidden transition-all"
            style={{
              maxHeight: open === i ? "200px" : "0",
              transition: "max-height 0.3s ease",
            }}
          >
            <p
              className="px-5 py-4 text-sm leading-relaxed"
              style={{
                color: "var(--on-surface-dim)",
                background: "var(--surface-mid)",
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
