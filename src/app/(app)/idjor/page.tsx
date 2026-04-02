import { Sparkles } from 'lucide-react';
import { courses, initialMessages, quickPrompts } from '@/lib/mock-idjor';
import CourseLibrary from '@/components/idjor/CourseLibrary';
import IdjorChat from '@/components/idjor/IdjorChat';

export default function IdjorPage() {
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
            <h1 className="font-headline font-bold text-xl">
              <span style={{ color: '#F5A623' }}>Idjor</span>
              <span style={{ color: 'var(--on-surface)' }}> — Conseiller IA</span>
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00FF88' }} />
                <span className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>En ligne</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--outline)' }}>•</span>
              <span className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>
                Formation · Analyse · Coaching
              </span>
            </div>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-2">
          <div className="card px-3 py-1.5 rounded-full text-xs font-semibold">
            <span style={{ color: '#00FF88' }}>847</span>
            <span style={{ color: 'var(--on-surface-dim)' }}> traders formés</span>
          </div>
          <div className="card px-3 py-1.5 rounded-full text-xs" style={{ color: 'var(--on-surface)' }}>
            ⭐ 4.9
          </div>
          <div className="card px-3 py-1.5 rounded-full text-xs" style={{ color: 'var(--on-surface)' }}>
            🇫🇷 Français
          </div>
        </div>
      </div>

      {/* Main grid — Library on left, Chat on right */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}
      >
        {/* Bibliothèque */}
        <div className="card p-5 overflow-y-auto flex flex-col gap-4">
          <h2
            className="font-headline font-bold text-lg sticky top-0 pb-2 z-10"
            style={{ background: 'var(--surface-mid)' }}
          >
            📚 Bibliothèque de Formation
          </h2>
          <CourseLibrary courses={courses} />
        </div>

        {/* Chat */}
        <div className="card flex flex-col overflow-hidden">
          <IdjorChat initialMessages={initialMessages} quickPrompts={quickPrompts} />
        </div>
      </div>
    </div>
  );
}
