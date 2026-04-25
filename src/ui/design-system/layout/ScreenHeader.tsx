import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ScreenHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  actions?: ReactNode;
  sticky?: boolean;
  className?: string;
  below?: ReactNode;
}

export function ScreenHeader({
  eyebrow,
  title,
  actions,
  sticky = false,
  className,
  below,
}: ScreenHeaderProps) {
  return (
    <div
      className={cn(
        sticky &&
          'sticky top-0 z-20 bg-[rgba(250,248,243,0.92)] backdrop-blur-[12px] border-b border-[var(--hairline)]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap pt-5 md:pt-8 px-4 md:px-10 pb-3.5">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="text-[11px] tracking-[0.14em] uppercase text-[var(--muted)] mb-1">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="m-0 font-serif font-medium tracking-[-0.025em] text-[28px] md:text-[38px] leading-[1.05]">
            {title}
          </h1>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {below ? <div className="px-4 md:px-10 pb-3">{below}</div> : null}
    </div>
  );
}
