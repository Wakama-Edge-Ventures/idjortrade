"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getT, type Lang, LANG_COOKIE } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "fr",
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_COOKIE) as Lang | null;
      if (stored === "fr" || stored === "en") setLangState(stored);
    } catch { /* ignore */ }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_COOKIE, l);
      document.cookie = `${LANG_COOKIE}=${l};path=/;max-age=31536000;SameSite=Lax`;
    } catch { /* ignore */ }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: getT(lang) }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
