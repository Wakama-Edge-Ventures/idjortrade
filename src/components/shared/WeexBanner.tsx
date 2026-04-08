import Link from "next/link";
import Image from "next/image";

const WEEX_URL = process.env.NEXT_PUBLIC_WEEX_AFFILIATE_URL ?? "";

export default function WeexBanner() {
  if (!WEEX_URL) return null;

  return (
    <Link
      href={WEEX_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl group transition-all hover:opacity-90"
      style={{
        background: "linear-gradient(90deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.04) 100%)",
        border: "1px solid rgba(201,168,76,0.22)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Image
          src="/weex.png"
          alt="Weex"
          width={24}
          height={24}
          className="rounded-md flex-shrink-0"
          style={{ height: "auto" }}
        />
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          Ouvre ton compte Weex avec le code{" "}
          <span className="font-bold" style={{ color: "#C9A84C" }}>0ajwh</span>
          {" "}et trade dès maintenant →
        </p>
      </div>

      <div
        className="flex-shrink-0 flex items-center gap-1 text-xs font-bold"
        style={{ color: "#C9A84C" }}
      >
        <span className="hidden sm:inline whitespace-nowrap">Ouvrir</span>
        {/* external link icon */}
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5">
          <path d="M5 2H2v9h9V8M8 2h3v3M11 2L5.5 7.5"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
