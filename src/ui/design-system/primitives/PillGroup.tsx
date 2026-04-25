import { cn } from '../utils/cn';

export interface PillOption {
  id: string;
  label: string;
  count?: number;
}

export interface PillGroupProps {
  options: PillOption[];
  value: string | string[];
  onChange: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md';
  multi?: boolean;
}

export function PillGroup({
  options,
  value,
  onChange,
  className,
  size = 'md',
  multi = false,
}: PillGroupProps) {
  const isActive = (id: string) =>
    multi ? (value as string[]).includes(id) : value === id;

  return (
    <div className={cn('flex gap-1 flex-wrap', className)}>
      {options.map((opt) => {
        const active = isActive(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full font-medium cursor-pointer',
              'transition-[background-color,border-color,color] duration-150',
              size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-3.5 text-[13px]',
              active
                ? 'bg-ink text-ink-contrast border-0'
                : 'bg-transparent text-ink border border-[var(--hairline-strong)] hover:bg-[rgba(28,26,22,0.04)]'
            )}
          >
            {opt.label}
            {typeof opt.count === 'number' ? (
              <span className="opacity-60 text-[11px]">{opt.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
