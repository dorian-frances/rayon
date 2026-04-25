import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-[10px] gap-1.5',
  md: 'h-10 px-4 text-sm rounded-[12px] gap-2',
  lg: 'h-[52px] px-[22px] text-[15px] rounded-[14px] gap-2',
};

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    'bg-ink text-ink-contrast border border-ink hover:opacity-90 active:scale-[.98]',
  outline:
    'bg-transparent text-ink border border-[var(--hairline-strong)] hover:bg-[rgba(28,26,22,0.04)] active:scale-[.98]',
  ghost:
    'bg-transparent text-ink border border-transparent hover:bg-[rgba(28,26,22,0.05)]',
  accent:
    'bg-accent text-white border border-accent hover:opacity-90 active:scale-[.98]',
};

export function Button({
  children,
  className,
  variant = 'solid',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-medium whitespace-nowrap select-none',
        'tracking-[-0.01em] transition-[transform,opacity,background-color,box-shadow] duration-150',
        'disabled:opacity-45 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      <span className="inline-flex items-center">{children}</span>
      {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
    </button>
  );
}
