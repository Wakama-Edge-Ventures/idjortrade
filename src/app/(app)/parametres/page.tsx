import { CreditCard } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import SettingsTabs from "@/components/parametres/SettingsTabs";
import { getT, LANG_COOKIE, type Lang } from "@/lib/i18n";

export default async function ParametresPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get(LANG_COOKIE)?.value ?? "fr") as Lang;
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-display font-semibold text-2xl text-white">{t("page.parametres.title")}</h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          {t("page.parametres.sub")}
        </p>
      </div>

      {/* Card plan actuel */}
      <div
        className="flex items-center justify-between px-5 py-3.5 rounded-2xl"
        style={{
          background: "var(--surface-high)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <CreditCard size={16} style={{ color: "var(--text-secondary)" }} />
          <span className="text-sm text-white font-semibold">{t("page.parametres.plan")}</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ background: "var(--surface-highest)", color: "var(--text-secondary)" }}
          >
            {t("page.parametres.remaining")}
          </span>
        </div>
        <Link
          href="/plans"
          className="text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(20,241,149,0.12)", color: "var(--bullish)" }}
        >
          {t("page.parametres.upgrade")}
        </Link>
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <SettingsTabs />
      </div>

    </div>
  );
}
