import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  emoji,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('py-20 px-8 text-center text-[var(--muted)]', className)}>
      {emoji ? (
        <div className="text-[42px] mb-3 opacity-50">{emoji}</div>
      ) : null}
      <div className="font-serif text-ink text-base font-medium mb-1.5">{title}</div>
      {description ? (
        <div className="text-[13.5px] max-w-[280px] mx-auto">{description}</div>
      ) : null}
      {action ? <div className="mt-5 inline-flex">{action}</div> : null}
    </div>
  );
}
