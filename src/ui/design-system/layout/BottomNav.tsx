import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  badge?: number;
  onClick: () => void;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        'fixed z-50 left-2.5 right-2.5 bottom-3 md:hidden',
        'rounded-[22px] p-1.5 flex gap-1',
        'bg-[rgba(250,248,243,0.85)] backdrop-blur-[20px] backdrop-saturate-[180%]',
        'border border-[rgba(28,26,22,0.08)] shadow-[0_10px_30px_rgba(28,26,22,0.1)]',
        'pb-[max(6px,env(safe-area-inset-bottom))]',
        className
      )}
    >
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={it.onClick}
          className={cn(
            'flex-1 h-[52px] rounded-[17px] border-0 cursor-pointer',
            'flex flex-col items-center justify-center gap-0.5',
            'text-[11px] font-medium relative transition-colors',
            it.active ? 'bg-ink text-ink-contrast' : 'bg-transparent text-ink'
          )}
        >
          {it.icon}
          <span>{it.label}</span>
          {typeof it.badge === 'number' && it.badge > 0 ? (
            <span className="absolute top-2 right-[25%] inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full px-1 bg-accent text-white text-[10px] font-semibold">
              {it.badge}
            </span>
          ) : null}
        </button>
      ))}
    </nav>
  );
}
