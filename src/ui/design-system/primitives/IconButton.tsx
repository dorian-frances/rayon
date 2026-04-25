import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
  active?: boolean;
  children: ReactNode;
}

export function IconButton({
  children,
  className,
  size = 36,
  active = false,
  type = 'button',
  style,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full border-0 cursor-pointer transition-colors',
        active
          ? 'bg-[rgba(28,26,22,0.08)]'
          : 'bg-transparent hover:bg-[rgba(28,26,22,0.05)]',
        'text-ink',
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
