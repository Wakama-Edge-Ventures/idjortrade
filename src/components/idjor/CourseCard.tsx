import { Lock, PlayCircle } from 'lucide-react';
import type { Course } from '@/lib/mock-idjor';
import { levelColors, levelBorderColors } from '@/lib/mock-idjor';

export default function CourseCard({ course }: { course: Course }) {
  const borderColor = levelBorderColors[course.level];
  const levelStyle = levelColors[course.level];

  return (
    <div
      className="card card-hover flex items-start justify-between gap-3 p-4"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        opacity: course.locked ? 0.6 : 1,
        cursor: course.locked ? 'not-allowed' : 'pointer',
      }}
    >
      {/* Left */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: levelStyle.bg, color: levelStyle.text }}
          >
            {course.level}
          </span>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'var(--surface-highest)', color: 'var(--on-surface-dim)' }}
          >
            {course.duration}
          </span>
        </div>
        <p className="text-sm font-bold text-white leading-snug">
          {course.emoji} {course.title}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--on-surface-dim)' }}>
          {course.description}
        </p>
      </div>

      {/* Right icon */}
      <div className="flex-shrink-0 mt-1">
        {course.locked ? (
          <Lock size={16} style={{ color: '#F5A623' }} />
        ) : (
          <PlayCircle size={16} style={{ color: 'var(--on-surface-dim)' }} />
        )}
      </div>
    </div>
  );
}
