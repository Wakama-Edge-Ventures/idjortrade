"use client";

import { useEffect, useState, useRef } from "react";

/* ── Données de marché mockées (look live avec micro-variation CSS) ──────────── */
interface Asset {
  id: string;
  label: string;
  price: string;
  change: number;
  icon: React.ReactNode;
}

const ASSETS: Asset[] = [
  {
    id: "btc",
    label: "BTC/USDT",
    price: "87 234",
    change: 2.14,
    icon: (
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#F7931A"/>
        <path d="M22.3 13.7c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.6-1.7-.4-.7 2.7c-.4-.1-.7-.2-1-.2l-2.4-.6-.5 1.8s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.3c.1 0 .2.1.3.1-.1 0-.2-.1-.3-.1l-1.1 4.5c-.1.2-.3.5-.7.4 0 0-1.2-.3-1.2-.3l-.9 2 2.3.6c.4.1.9.2 1.3.3l-.7 2.8 1.7.4.7-2.8c.5.1.9.2 1.4.3l-.7 2.7 1.7.4.7-2.8c2.9.5 5 .3 5.9-2.3.7-2.1 0-3.3-1.5-4.1 1.1-.3 2-1 2.2-2.4zm-3.9 5.5c-.5 2.1-3.9 1-5 .7l.9-3.5c1.1.3 4.6.8 4.1 2.8zm.5-5.5c-.5 1.9-3.3 1-4.2.7l.8-3.2c.9.2 3.9.6 3.4 2.5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "eth",
    label: "ETH/USDT",
    price: "2 087",
    change: 1.38,
    icon: (
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#627EEA"/>
        <path d="M16 6L9 16.5l7 4 7-4L16 6z" fill="white" fillOpacity="0.9"/>
        <path d="M9 16.5L16 26l7-9.5-7 4-7-4z" fill="white" fillOpacity="0.7"/>
      </svg>
    ),
  },
  {
    id: "sol",
    label: "SOL/USDT",
    price: "132.40",
    change: -0.87,
    icon: (
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#9945FF"/>
        <path d="M9 20h11.5a.5.5 0 00.35-.85L9.35 9.15A.5.5 0 009 9H8v11a.5.5 0 00.5.5H9z" fill="white"/>
        <path d="M23 12H11.5a.5.5 0 00-.35.85l11.5 10a.5.5 0 00.85-.35V13a.5.5 0 00-.5-.5V12z" fill="#14F195"/>
      </svg>
    ),
  },
  {
    id: "bnb",
    label: "BNB/USDT",
    price: "605.22",
    change: 0.54,
    icon: (
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
        <path d="M16 9l-4 4 1.5 1.5L16 12l2.5 2.5L20 13l-4-4z" fill="white"/>
        <path d="M10 13.5L11.5 15 10 16.5 8.5 15 10 13.5zM22 13.5L23.5 15 22 16.5 20.5 15 22 13.5z" fill="white"/>
        <path d="M16 13.5L19 16.5l-3 3-3-3 3-3z" fill="white"/>
        <path d="M16 20l-2.5-2.5L12 19l4 4 4-4-1.5-1.5L16 20z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "eurusd",
    label: "EUR/USD",
    price: "1.0842",
    change: -0.12,
    icon: (
      <div
        style={{
          width: 14, height: 14,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #003399, #FFCC00)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, fontWeight: 900, color: "white",
          fontFamily: "monospace",
        }}
      >€</div>
    ),
  },
  {
    id: "gbpusd",
    label: "GBP/USD",
    price: "1.2914",
    change: 0.08,
    icon: (
      <div
        style={{
          width: 14, height: 14,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #012169, #C8102E)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, fontWeight: 900, color: "white",
          fontFamily: "monospace",
        }}
      >£</div>
    ),
  },
  {
    id: "gold",
    label: "XAU/USD",
    price: "3 116",
    change: 0.31,
    icon: (
      <div
        style={{
          width: 14, height: 14,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #C9A84C, #F5D98E)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, fontWeight: 900, color: "#5A3800",
          fontFamily: "monospace",
        }}
      >Au</div>
    ),
  },
  {
    id: "oil",
    label: "WTI/USD",
    price: "81.34",
    change: -0.43,
    icon: (
      <div
        style={{
          width: 14, height: 14,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1a1a2e, #4a4a6a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, fontWeight: 900, color: "#aaa",
          fontFamily: "monospace",
        }}
      >OIL</div>
    ),
  },
  {
    id: "xrp",
    label: "XRP/USDT",
    price: "0.5812",
    change: 3.21,
    icon: (
      <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#00AAE4"/>
        <path d="M21 9h2.5l-5.2 5.2a3.3 3.3 0 01-4.6 0L8.5 9H11l3.7 3.7a1.5 1.5 0 002.1 0L21 9zM11 23H8.5l5.2-5.2a3.3 3.3 0 014.6 0L23.5 23H21l-3.7-3.7a1.5 1.5 0 00-2.1 0L11 23z" fill="white"/>
      </svg>
    ),
  },
];

/* ── Composant item ticker ───────────────────────────────────────────────────── */
function TickerItem({ asset }: { asset: Asset }) {
  const positive = asset.change >= 0;
  const color = positive ? "var(--bullish)" : "var(--bearish)";
  return (
    <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0 px-4">
      <span className="flex-shrink-0">{asset.icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
        {asset.label}
      </span>
      <span className="font-data" style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>
        {asset.price}
      </span>
      <span className="font-data" style={{ fontSize: 11, fontWeight: 700, color }}>
        {positive ? "+" : ""}{asset.change.toFixed(2)}%
      </span>
    </div>
  );
}

/* ── Composant principal ─────────────────────────────────────────────────────── */
export default function LiveTicker() {
  return (
    <div
      className="w-full overflow-hidden relative"
      style={{
        background: "var(--surface-low)",
        borderBottom: "1px solid var(--border)",
        height: 34,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Fade gauche */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--surface-low), transparent)" }}
        aria-hidden="true"
      />
      {/* Fade droite */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--surface-low), transparent)" }}
        aria-hidden="true"
      />

      {/* Track défilant */}
      <div
        style={{
          display: "flex",
          animation: "ticker-scroll 35s linear infinite",
          willChange: "transform",
        }}
      >
        {/* Double pour loop parfait */}
        {[...ASSETS, ...ASSETS].map((asset, i) => (
          <TickerItem key={`${asset.id}-${i}`} asset={asset} />
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
