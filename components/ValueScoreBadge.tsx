import { getScoreGrade, getScoreLabel, formatValueScore } from '@/lib/calc/value-score';
import type { ScoreGrade } from '@/lib/types';

interface ValueScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1',
  lg: 'text-base px-3 py-1.5 gap-1.5',
} as const;

const GRADE_CLASSES: Record<ScoreGrade, string> = {
  excellent: 'badge-excellent',
  good: 'badge-good',
  fair: 'badge-fair',
  poor: 'badge-poor',
};

export function ValueScoreBadge({
  score,
  size = 'md',
  showLabel = true,
}: ValueScoreBadgeProps) {
  const grade = getScoreGrade(score);
  const label = getScoreLabel(grade);
  const display = formatValueScore(score);

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono font-semibold ${GRADE_CLASSES[grade]} ${SIZE_CLASSES[size]}`}
      title={`Value Score: ${display} (${label})`}
    >
      <span className="font-bold">{display}</span>
      {showLabel && (
        <span className="font-sans font-medium opacity-80">{label}</span>
      )}
    </span>
  );
}
