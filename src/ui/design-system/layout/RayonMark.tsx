import { cn } from '../utils/cn';

export interface RayonMarkProps {
  size?: number;
  className?: string;
}

export function RayonMark({ size = 26, className }: RayonMarkProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center bg-ink text-ink-contrast',
        'font-serif font-medium tracking-[-0.04em]',
        className
      )}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(6, Math.floor(size * 0.27)),
        fontSize: Math.floor(size * 0.58),
      }}
      aria-label="Rayon"
    >
      R
    </div>
  );
}
