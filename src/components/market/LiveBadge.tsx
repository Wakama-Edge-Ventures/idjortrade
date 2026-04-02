"use client";

import { useState, useEffect } from "react";

interface LiveBadgeProps {
  refreshInterval?: number; // seconds, default 30
}

export default function LiveBadge({ refreshInterval = 30 }: LiveBadgeProps) {
  const [countdown, setCountdown] = useState(refreshInterval);

  useEffect(() => {
    setCountdown(refreshInterval);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) return refreshInterval;
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const isLive = countdown > refreshInterval - 3;

  return (
    <div className="flex items-center gap-1.5">
      {isLive ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#00FF88" }} />
            <span className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "#00FF88" }} />
          </span>
          <span className="text-[10px] font-bold tracking-wider" style={{ color: "#00FF88" }}>
            LIVE
          </span>
        </>
      ) : (
        <>
          <span className="inline-flex rounded-full h-2 w-2"
            style={{ background: "var(--outline)" }} />
          <span className="text-[10px] font-semibold font-mono-data"
            style={{ color: "var(--on-surface-dim)" }}>
            {countdown}s
          </span>
        </>
      )}
    </div>
  );
}
