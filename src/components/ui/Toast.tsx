"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

/* ── Types ─────────────────────────────────────────────────────────────────── */
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error:   (title: string, description?: string) => void;
  info:    (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

/* ── Context ────────────────────────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null);

/* ── Icons inline ───────────────────────────────────────────────────────────── */
const icons: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  info:    "i",
  warning: "!",
};

/* ── Provider ───────────────────────────────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(Toast & { exiting?: boolean })[]>([]);

  const dismiss = useCallback((id: string) => {
    // Marquer comme en sortie pour déclencher l'animation
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 280);
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = opts.duration ?? 4000;
    setToasts(prev => [...prev, { ...opts, id }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const success = useCallback((title: string, description?: string) =>
    toast({ type: "success", title, description }), [toast]);
  const error = useCallback((title: string, description?: string) =>
    toast({ type: "error", title, description }), [toast]);
  const info = useCallback((title: string, description?: string) =>
    toast({ type: "info", title, description }), [toast]);
  const warning = useCallback((title: string, description?: string) =>
    toast({ type: "warning", title, description }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite" suppressHydrationWarning>
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast toast-${t.type}${t.exiting ? " toast-exit" : ""}`}
            onClick={() => dismiss(t.id)}
            role="alert"
          >
            <span className="toast-icon" aria-hidden="true">
              {icons[t.type]}
            </span>
            <div className="toast-body">
              <p className="toast-title">{t.title}</p>
              {t.description && (
                <p className="toast-desc">{t.description}</p>
              )}
            </div>
            <button
              onClick={e => { e.stopPropagation(); dismiss(t.id); }}
              aria-label="Fermer"
              style={{
                background: "none",
                border: "none",
                color: "var(--text-tertiary)",
                fontSize: 16,
                cursor: "pointer",
                lineHeight: 1,
                padding: "0 0 0 4px",
                alignSelf: "flex-start",
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ── Hook ───────────────────────────────────────────────────────────────────── */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
