import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: 'narrow' | 'default' | 'wide';
  children: ReactNode;
}

const widthMap: Record<NonNullable<ContainerProps['width']>, string> = {
  narrow: 'max-w-[640px]',
  default: 'max-w-[780px]',
  wide: 'max-w-[1100px]',
};

export function Container({
  children,
  className,
  width = 'default',
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 md:px-10', widthMap[width], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
