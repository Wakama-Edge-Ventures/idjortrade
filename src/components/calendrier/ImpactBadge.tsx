interface ImpactBadgeProps {
  impact: 'low' | 'medium' | 'high';
}

/** Displays a 3-bar impact indicator styled by impact level */
export default function ImpactBadge({ impact }: ImpactBadgeProps) {
  const bars = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;
  const color = impact === 'high' ? '#FF3B5C' : impact === 'medium' ? '#F5A623' : '#00FF88';

  return (
    <div
      className="flex items-end gap-0.5"
      title={impact === 'high' ? 'Impact fort' : impact === 'medium' ? 'Impact moyen' : 'Impact faible'}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-1 rounded-sm"
          style={{
            height: `${i * 4 + 4}px`,
            background: i <= bars ? color : "var(--outline)",
          }}
        />
      ))}
    </div>
  );
}
