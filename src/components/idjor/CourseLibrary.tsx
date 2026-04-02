import type { Course } from '@/lib/mock-idjor';
import CourseCard from './CourseCard';

const filterChips = [
  { label: 'Tous', emoji: '' },
  { label: 'Débutant', emoji: '📗' },
  { label: 'Technique', emoji: '📊' },
  { label: 'Risk', emoji: '🛡️' },
  { label: 'Psycho', emoji: '🧠' },
];

export default function CourseLibrary({ courses }: { courses: Course[] }) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ background: 'var(--surface-high)' }}
      >
        <span className="text-sm">🔍</span>
        <input
          type="text"
          placeholder="Rechercher un concept..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--on-surface)' }}
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {filterChips.map((chip, i) => (
          <button
            key={chip.label}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={
              i === 0
                ? {
                    background: 'rgba(0,255,136,0.15)',
                    color: '#00FF88',
                    border: '1px solid rgba(0,255,136,0.2)',
                  }
                : {
                    background: 'var(--surface-high)',
                    color: 'var(--on-surface-dim)',
                    border: '1px solid transparent',
                  }
            }
          >
            {chip.emoji && `${chip.emoji} `}{chip.label}
          </button>
        ))}
      </div>

      {/* Course list */}
      <div className="space-y-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Free tier notice */}
      <div
        className="rounded-xl px-4 py-3 space-y-1"
        style={{
          background: 'rgba(245,166,35,0.05)',
          border: '1px solid rgba(245,166,35,0.15)',
        }}
      >
        <p className="text-xs font-semibold text-white">
          3/5 messages utilisés aujourd&apos;hui
        </p>
        <p className="text-xs" style={{ color: '#F5A623' }}>
          Passez Pro pour un accès Idjor illimité →
        </p>
      </div>
    </div>
  );
}
