import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string;
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Tag({
  children,
  color = '#E8DCC4',
  size = 'md',
  className,
  style,
  ...rest
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full whitespace-nowrap font-medium',
        'tracking-[0.02em]',
        size === 'sm' ? 'h-5 px-2 text-[10.5px]' : 'h-[22px] px-2 text-[11.5px]',
        className
      )}
      style={{ background: color, color: '#3D321E', ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}
