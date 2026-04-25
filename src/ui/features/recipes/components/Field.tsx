import type { ReactNode } from 'react';
import { cn } from '@ds/utils/cn';

export interface FieldProps {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <div className={cn('block', className)}>
      <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--muted)] font-semibold mb-2.5">
        {label}
      </div>
      {children}
      {hint ? (
        <div className="text-[11px] text-[var(--muted)] mt-1.5">{hint}</div>
      ) : null}
    </div>
  );
}
