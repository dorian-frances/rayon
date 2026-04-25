import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useIsDesktop } from '../utils/useMediaQuery';

export interface AppShellProps {
  sidebar: ReactNode;
  bottomNav: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AppShell({ sidebar, bottomNav, children, className }: AppShellProps) {
  const isDesktop = useIsDesktop();

  return (
    <div className={cn('min-h-dvh bg-bg text-ink', className)}>
      {isDesktop ? (
        <div className="flex h-dvh min-h-0">
          {sidebar}
          <main className="flex-1 min-w-0 overflow-auto relative">{children}</main>
        </div>
      ) : (
        <>
          <main className="min-h-dvh pb-[100px]">{children}</main>
          {bottomNav}
        </>
      )}
    </div>
  );
}
