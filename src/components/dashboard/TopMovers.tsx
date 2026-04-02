import { fetchMultipleQuotes, SYMBOLS } from "@/lib/twelvedata";
import TopMoverItem from "./TopMoverItem";

export default async function TopMovers() {
  const quotes = await fetchMultipleQuotes([...SYMBOLS.crypto]);
  const list = Object.values(quotes).sort((a, b) => b.percent_change - a.percent_change);

  const fmtPrice = (p: number) => {
    if (p >= 1000) return "$" + p.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (p >= 1)    return "$" + p.toFixed(2);
    return "$" + p.toFixed(4);
  };

  return (
    <div className="card overflow-hidden divide-y divide-white/5">
      {list.slice(0, 5).map((q) => (
        <TopMoverItem
          key={q.symbol}
          symbol={q.symbol.split("/")[0]}
          price={fmtPrice(q.price)}
          change={q.percent_change}
        />
      ))}
    </div>
  );
}
