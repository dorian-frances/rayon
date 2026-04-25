import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { RayonMark } from './RayonMark';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  badge?: number;
  onClick: () => void;
}

export interface SidebarProps {
  items: SidebarNavItem[];
  footer?: ReactNode;
  className?: string;
}

export function Sidebar({ items, footer, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'w-[230px] shrink-0 h-full flex flex-col bg-card',
        'border-r border-[var(--hairline)] px-3.5 py-5',
        className
      )}
    >
      <div className="flex items-center gap-2.5 px-2 pb-5">
        <RayonMark size={26} />
        <div className="text-base font-medium tracking-[-0.015em] font-serif">
          Rayon
        </div>
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={it.onClick}
            className={cn(
              'h-[38px] px-3 rounded-[10px] border-0 cursor-pointer text-left',
              'flex items-center gap-3 text-sm text-ink transition-colors',
              it.active
                ? 'bg-[rgba(28,26,22,0.06)] font-medium'
                : 'bg-transparent hover:bg-[rgba(28,26,22,0.04)] font-normal'
            )}
          >
            <span
              className={cn(
                'inline-flex shrink-0',
                it.active ? 'text-ink' : 'text-[rgba(28,26,22,0.65)]'
              )}
            >
              {it.icon}
            </span>
            <span className="flex-1">{it.label}</span>
            {typeof it.badge === 'number' && it.badge > 0 ? (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 bg-accent text-white text-[11px] font-semibold">
                {it.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>
      {footer ? <div className="mt-auto pt-4">{footer}</div> : null}
    </aside>
  );
}
