"use client";

import { createContext, useContext, useState } from "react";

interface PricingContextValue {
  isAnnual: boolean;
  setIsAnnual: (v: boolean) => void;
}

const PricingContext = createContext<PricingContextValue>({
  isAnnual: false,
  setIsAnnual: () => {},
});

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <PricingContext.Provider value={{ isAnnual, setIsAnnual }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  return useContext(PricingContext);
}
