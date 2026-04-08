import Link from "next/link";
import { Sparkles } from "lucide-react";
import { courses } from "@/lib/mock-idjor";
import CourseCard from "@/components/idjor/CourseCard";

const filterChips = [
  "Tous",
  "📗 Débutant",
  "📊 Technique",
  "🛡️ Risk Management",
  "🧠 Psychologie",
  "₿ Crypto",
  "💱 Forex",
];

export default function FormationPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-display font-semibold text-3xl text-white">
          Formation Trading
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Apprends à trader pas à pas, en français
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap text-xs" style={{ color: "var(--text-secondary)" }}>
          <span>
            <span className="font-bold text-white">8</span> cours disponibles
          </span>
          <span style={{ color: "var(--border)" }}>·</span>
          <span>
            <span className="font-bold" style={{ color: "var(--bullish)" }}>Gratuit</span> pour 3 cours
          </span>
          <span style={{ color: "var(--border)" }}>·</span>
          <span>⭐ 4.9/5</span>
        </div>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl"
        style={{
          background: "var(--surface-high)",
          borderBottom: "2px solid transparent",
          transition: "border-color 0.2s",
        }}
      >
        <span className="text-sm">🔍</span>
        <input
          type="text"
          placeholder="Rechercher: RSI, MACD, scalping..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {filterChips.map((chip, i) => (
          <button
            key={chip}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={
              i === 0
                ? {
                    background: "rgba(20,241,149,0.15)",
                    color: "var(--bullish)",
                    border: "1px solid rgba(20,241,149,0.2)",
                  }
                : {
                    background: "var(--surface-high)",
                    color: "var(--text-secondary)",
                    border: "1px solid transparent",
                  }
            }
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Banner Idjor */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
        style={{
          background: "linear-gradient(135deg, #1A1200, #1A1208)",
          border: "1px solid rgba(245,166,35,0.2)",
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #F5A623, #E8940F)" }}
        >
          <Sparkles size={22} color="white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold text-white">
            Tu as des questions sur ces cours ?
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Idjor IA peut t&apos;expliquer n&apos;importe quel concept en détail.
          </p>
        </div>
        <Link
          href="/idjor"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: "#F5A623", color: "white" }}
        >
          <Sparkles size={14} />
          Demander à Idjor →
        </Link>
      </div>

    </div>
  );
}
