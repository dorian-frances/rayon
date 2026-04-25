import { useMemo, useState, type ReactNode } from 'react';
import { angleFor, foodEmojiFor, paletteFor } from '../utils/hashHue';
import { cn } from '../utils/cn';

export interface FoodImageProps {
  name: string;
  src?: string | null;
  className?: string;
  children?: ReactNode;
}

export function FoodImage({ name, src, className, children }: FoodImageProps) {
  const [failed, setFailed] = useState(false);
  const usingSrc = src && !failed;

  const background = useMemo(() => {
    if (usingSrc) return undefined;
    const [c1, c2] = paletteFor(name);
    const angle = angleFor(name);
    return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  }, [name, usingSrc]);

  const emoji = useMemo(() => foodEmojiFor(name), [name]);

  return (
    <div
      className={cn('relative overflow-hidden flex items-center justify-center', className)}
      style={usingSrc ? { background: '#FFFCF6' } : { background }}
    >
      {usingSrc ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          <div
            className="relative z-0"
            style={{ fontSize: '38%', opacity: 0.55, filter: 'saturate(.8)' }}
          >
            {emoji}
          </div>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
            style={{
              opacity: 0.2,
              backgroundImage:
                'radial-gradient(rgba(255,255,255,.5) 1px, transparent 1px), radial-gradient(rgba(0,0,0,.4) 1px, transparent 1px)',
              backgroundSize: '6px 6px, 9px 9px',
              backgroundPosition: '0 0, 3px 4px',
            }}
          />
        </>
      )}
      {children}
    </div>
  );
}
