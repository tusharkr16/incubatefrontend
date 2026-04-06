import { clsx } from 'clsx';

interface ScoreBarProps {
  score: number; // 0-100
  label?: string;
  showValue?: boolean;
}

function getColor(score: number) {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

export function ScoreBar({ score, label, showValue = true }: ScoreBarProps) {
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          {label && <span>{label}</span>}
          {showValue && <span className="font-semibold text-slate-700">{score}/100</span>}
        </div>
      )}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', getColor(score))}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
