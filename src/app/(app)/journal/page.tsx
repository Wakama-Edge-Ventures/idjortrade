import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import JournalStats from '@/components/journal/JournalStats';
import EquityCurve from '@/components/journal/EquityCurve';
import HeatmapCalendar from '@/components/journal/HeatmapCalendar';
import TradeTable from '@/components/journal/TradeTable';
import TradeCards from '@/components/journal/TradeCards';
import AssetPerf from '@/components/journal/AssetPerf';
import { getT, LANG_COOKIE, type Lang } from "@/lib/i18n";

export default async function JournalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cookieStore = await cookies();
  const lang = (cookieStore.get(LANG_COOKIE)?.value ?? "fr") as Lang;
  const t = getT(lang);

  const trades = await prisma.trade.findMany({
    where: { userId: session.user.id },
    orderBy: { openedAt: "desc" },
  });

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

  const filters = [
    t("page.journal.filter.month"),
    t("page.journal.filter.30"),
    t("page.journal.filter.90"),
    t("page.journal.filter.all"),
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-semibold text-2xl text-white">
            {t("page.journal.title")}
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {t("page.journal.sub")}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              border: '1px solid rgba(20,241,149,0.3)',
              color: 'var(--bullish)',
            }}
          >
            {t("page.journal.export")}
          </button>
          <button
            className="px-4 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: 'var(--sol-gradient)', color: 'var(--surface)' }}
          >
            {t("page.journal.add")}
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <JournalStats stats={stats} />

      {/* Charts row */}
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
                  ? { background: 'var(--surface-highest)', color: 'var(--text-primary)' }
                  : { color: 'var(--text-secondary)' }
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
            color: 'var(--text-secondary)',
          }}
        >
          <option>{t("page.journal.all.assets")}</option>
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
            color: 'var(--text-secondary)',
          }}
        >
          <option>{t("page.journal.all.results")}</option>
          <option>{t("page.journal.gains")}</option>
          <option>{t("page.journal.losses")}</option>
        </select>
      </div>

      {/* Trade table — desktop */}
      <TradeTable trades={tradeEntries} />

      {/* Trade cards — mobile */}
      <TradeCards trades={tradeEntries} />

    </div>
  );
}
