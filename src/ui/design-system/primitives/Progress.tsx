import { cn } from '../utils/cn';

export interface ProgressProps {
  value: number;
  height?: number;
  className?: string;
  tone?: 'ink' | 'accent' | 'success';
}

const toneColors: Record<NonNullable<ProgressProps['tone']>, string> = {
  ink: 'var(--ink)',
  accent: 'var(--accent)',
  success: 'var(--success)',
};

export function Progress({
  value,
  height = 4,
  className,
  tone = 'ink',
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full overflow-hidden bg-[rgba(28,26,22,0.08)]', className)}
      style={{ height, borderRadius: height }}
    >
      <div
        className="h-full transition-[width] duration-300 ease-[var(--ease-out)]"
        style={{ width: `${clamped * 100}%`, background: toneColors[tone] }}
      />
    </div>
  );
}
