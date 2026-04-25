import { cn } from '../utils/cn';

export interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedMap = {
  sm: 'rounded-[10px]',
  md: 'rounded-[12px]',
  lg: 'rounded-[20px]',
  full: 'rounded-full',
} as const;

export function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse bg-[rgba(28,26,22,0.06)]',
        roundedMap[rounded],
        className
      )}
    />
  );
}
