import type { ReactNode } from 'react';
import { useAuth } from '@/ui/hooks/useAuth';
import { useBootstrap } from '@/ui/hooks/useBootstrap';
import { useTheme } from '@/ui/hooks/useTheme';
import { SignInScreen } from './SignInScreen';

export interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { isAuthenticated, sessionReady } = useAuth();
  // Apply theme regardless of auth state
  useTheme();
  // Hydrate user data after login
  useBootstrap();

  if (!sessionReady) {
    return <FullSplash />;
  }
  if (!isAuthenticated) {
    return <SignInScreen />;
  }
  return <>{children}</>;
}

function FullSplash() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg">
      <div className="w-9 h-9 rounded-full border-2 border-[var(--hairline-strong)] border-t-ink animate-spin" />
    </div>
  );
}
