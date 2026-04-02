"use client";

import { useState, useEffect, useCallback } from "react";
import type { Quote, Category } from "@/lib/twelvedata";

type UseMarketDataResult = {
  quotes: Record<string, Quote>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useMarketData(category: Category = "crypto"): UseMarketDataResult {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/market/quotes?category=${category}`);
      if (!res.ok) throw new Error("Erreur API marché");
      const data: Record<string, Quote> = await res.json();
      setQuotes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetch_(true);
    const interval = setInterval(() => fetch_(false), 30_000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { quotes, loading, error, refresh: () => fetch_(false) };
}
