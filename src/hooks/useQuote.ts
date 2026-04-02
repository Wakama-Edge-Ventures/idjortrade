"use client";

import { useState, useEffect, useCallback } from "react";
import type { Quote } from "@/lib/twelvedata";

type UseQuoteResult = {
  quote: Quote | null;
  loading: boolean;
  error: string | null;
};

export function useQuote(symbol: string): UseQuoteResult {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/market/quote?symbol=${encodeURIComponent(symbol)}`);
      if (!res.ok) throw new Error("Erreur API");
      const data: Quote = await res.json();
      setQuote(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetch_(true);
    const interval = setInterval(() => fetch_(false), 15_000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { quote, loading, error };
}
