import { Sparkles } from 'lucide-react';
import { cookies } from 'next/headers';
import { courses, quickPrompts } from '@/lib/mock-idjor';
import CourseLibrary from '@/components/idjor/CourseLibrary';
import IdjorChat from '@/components/idjor/IdjorChat';
import { getT, LANG_COOKIE, type Lang } from '@/lib/i18n';

export default async function IdjorPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get(LANG_COOKIE)?.value ?? 'fr') as Lang;
  const t = getT(lang);

  const welcomeMessage = {
    id: 'welcome',
    role: 'assistant' as const,
    content: lang === 'en'
      ? `Hello! I'm **Idjor**, your AI trading advisor.\n\nI can help you:\n- Understand indicators (RSI, MACD, Bollinger)\n- Analyse your trading journal\n- Suggest strategies adapted to your profile\n- Answer all your trading questions\n\nHow can I help you today?`
      : `Bonjour ! Je suis **Idjor**, ton conseiller IA en trading.\n\nJe peux t'aider à :\n- Comprendre les indicateurs (RSI, MACD, Bollinger)\n- Analyser ton journal de trading\n- Te proposer des stratégies adaptées à ton profil\n- Répondre à toutes tes questions en français\n\nComment puis-je t'aider aujourd'hui ?`,
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #F5A623, #E8940F)',
              boxShadow: '0 0 20px rgba(245,166,35,0.3)',
            }}
          >
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-xl">
              <span style={{ color: '#F5A623' }}>Idjor</span>
              <span style={{ color: 'var(--text-primary)' }}> — {t("page.idjor.adviser")}</span>
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--sol-gradient)' }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t("page.idjor.status")}</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--border)' }}>•</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {t("page.idjor.desc")}
              </span>
            </div>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-2">
          <div className="card px-3 py-1.5 rounded-full text-xs font-semibold">
            <span style={{ color: 'var(--bullish)' }}>847</span>
            <span style={{ color: 'var(--text-secondary)' }}> {t("page.idjor.trained")}</span>
          </div>
          <div className="card px-3 py-1.5 rounded-full text-xs" style={{ color: 'var(--text-primary)' }}>
            ⭐ 4.9
          </div>
          <div className="card px-3 py-1.5 rounded-full text-xs" style={{ color: 'var(--text-primary)' }}>
            🇫🇷 Français
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}
      >
        {/* Bibliothèque */}
        <div className="card p-5 overflow-y-auto flex flex-col gap-4">
          <h2
            className="font-display font-semibold text-lg sticky top-0 pb-2 z-10"
            style={{ background: 'var(--surface-mid)' }}
          >
            {t("page.idjor.library")}
          </h2>
          <CourseLibrary courses={courses} />
        </div>

        {/* Chat */}
        <div className="card flex flex-col overflow-hidden">
          <IdjorChat initialMessages={[welcomeMessage]} quickPrompts={quickPrompts} />
        </div>
      </div>
    </div>
  );
}
