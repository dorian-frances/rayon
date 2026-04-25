import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { PlusIcon } from '../icons/icons';

export interface DashedAddButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function DashedAddButton({
  children,
  className,
  size = 'md',
  type = 'button',
  ...rest
}: DashedAddButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-transparent cursor-pointer',
        'border border-dashed border-[rgba(28,26,22,0.2)] text-[var(--muted-strong)]',
        'hover:border-[rgba(28,26,22,0.4)] hover:text-ink transition-colors',
        size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-[34px] px-3 text-xs',
        className
      )}
      {...rest}
    >
      <PlusIcon size={size === 'sm' ? 11 : 12} sw={2} />
      {children}
    </button>
  );
}
