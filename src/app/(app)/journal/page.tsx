import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import JournalStats from '@/components/journal/JournalStats';
import EquityCurve from '@/components/journal/EquityCurve';
import HeatmapCalendar from '@/components/journal/HeatmapCalendar';
import TradeTable from '@/components/journal/TradeTable';
import TradeCards from '@/components/journal/TradeCards';
import AssetPerf from '@/components/journal/AssetPerf';

const filters = ['Ce mois', '30j', '90j', 'Tout'];

export default async function JournalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch all trades for the current user
  const trades = await prisma.trade.findMany({
    where: { userId: session.user.id },
    orderBy: { openedAt: "desc" },
  });

  // Calculate stats from real data
  const closedTrades = trades.filter((t) => t.status === "closed" && t.pnlFCFA !== null);
  const winners = closedTrades.filter((t) => (t.pnlFCFA ?? 0) > 0);
  const losers = closedTrades.filter((t) => (t.pnlFCFA ?? 0) < 0);
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnlFCFA ?? 0), 0);
  const totalGains = winners.reduce((sum, t) => sum + (t.pnlFCFA ?? 0), 0);
  const totalLosses = Math.abs(losers.reduce((sum, t) => sum + (t.pnlFCFA ?? 0), 0));
  const bestTrade = closedTrades.reduce(
    (best, t) => ((t.pnlFCFA ?? 0) > (best?.pnlFCFA ?? -Infinity) ? t : best),
    closedTrades[0] ?? null
  );

  const stats = {
    totalTrades: closedTrades.length,
    winRate: closedTrades.length > 0 ? Math.round((winners.length / closedTrades.length) * 100) : 0,
    profitFactor: totalLosses > 0 ? parseFloat((totalGains / totalLosses).toFixed(2)) : totalGains > 0 ? 999 : 0,
    totalPnlFCFA: totalPnl,
    bestTradeFCFA: bestTrade?.pnlFCFA ?? 0,
    bestTradeAsset: bestTrade?.asset ?? "—",
  };

  // Map trades to the TradeEntry shape expected by child components
  const tradeEntries = trades.map((t) => ({
    id: t.id,
    date: new Date(t.openedAt).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    asset: t.asset,
    direction: t.direction as "BUY" | "SELL",
    entry: t.entry,
    exit: t.exit ?? null,
    pnlFCFA: t.pnlFCFA ?? null,
    rRealized: t.rRealized ?? null,
    source: (t.source as "IA" | "Manuel"),
    status: t.status as "open" | "closed",
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline font-bold text-2xl text-white">
            Mon Journal de Trading
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--on-surface-dim)' }}>
            Suivez vos performances et apprenez de chaque trade
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              border: '1px solid rgba(0,255,136,0.3)',
              color: '#00FF88',
            }}
          >
            📥 Exporter CSV
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: '#00FF88', color: 'var(--surface)' }}
          >
            ➕ Ajouter un trade
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <JournalStats stats={stats} />

      {/* Charts row — equity curve + asset perf */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <EquityCurve trades={trades} />
        </div>
        <AssetPerf trades={trades} />
      </div>

      {/* Performance heatmap */}
      <HeatmapCalendar trades={trades} />

      {/* Filters bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div
          className="flex gap-1 p-1 rounded-lg"
          style={{ background: 'var(--surface-high)' }}
        >
          {filters.map((f, i) => (
            <button
              key={f}
              className="px-3 py-1.5 rounded-md text-xs font-semibold"
              style={
                i === 0
                  ? { background: 'var(--surface-highest)', color: 'var(--on-surface)' }
                  : { color: 'var(--on-surface-dim)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
        <select
          className="px-3 py-2 text-xs rounded-lg outline-none cursor-pointer"
          style={{
            background: 'var(--surface-high)',
            border: 'none',
            color: 'var(--on-surface-dim)',
          }}
        >
          <option>Tous les actifs</option>
          <option>SOL/USDT</option>
          <option>BTC/USDT</option>
          <option>EUR/USD</option>
          <option>ETH/USDT</option>
        </select>
        <select
          className="px-3 py-2 text-xs rounded-lg outline-none cursor-pointer"
          style={{
            background: 'var(--surface-high)',
            border: 'none',
            color: 'var(--on-surface-dim)',
          }}
        >
          <option>Tous résultats</option>
          <option>Gains</option>
          <option>Pertes</option>
        </select>
      </div>

      {/* Trade table — desktop */}
      <TradeTable trades={tradeEntries} />

      {/* Trade cards — mobile */}
      <TradeCards trades={tradeEntries} />

    </div>
  );
}
