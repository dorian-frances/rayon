import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string;
  size?: 'sm' | 'md';
  children: ReactNode;
}

/**
 * Pastille label : taille fixe par variante, indépendante du contenu.
 * - `sm` (24×11.5px) : meta dans les cartes / listes denses
 * - `md` (28×12.5px) : sur les écrans de détail
 *
 * `leading-none` + alignement vertical strict évitent que les emojis
 * (drapeaux, plats) ne déforment la hauteur du tag.
 */
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
        'inline-flex items-center gap-1 rounded-full whitespace-nowrap font-medium leading-none',
        'tracking-[0.02em]',
        size === 'sm' ? 'h-6 px-2.5 text-[11.5px]' : 'h-7 px-3 text-[12.5px]',
        className
      )}
      style={{ background: color, color: '#3D321E', ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}
