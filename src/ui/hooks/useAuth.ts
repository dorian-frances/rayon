import { useCallback, useEffect } from 'react';
import { useUseCases } from '@composition/ContainerProvider';
import { useRayonStore } from '@/ui/store';

/**
 * Observe la session Supabase (ou l'adapter in-memory) et hydrate le store.
 * Retourne les actions d'auth usuelles.
 */
export function useAuth() {
  const uc = useUseCases();
  const user = useRayonStore((s) => s.user);
  const sessionReady = useRayonStore((s) => s.sessionReady);
  const setUser = useRayonStore((s) => s.setUser);
  const setSessionReady = useRayonStore((s) => s.setSessionReady);

  useEffect(() => {
    const unsub = uc.auth.observe((session) => {
      setUser(session?.user ?? null);
      setSessionReady(true);
    });
    return unsub;
  }, [uc, setUser, setSessionReady]);

  const signInWithEmail = useCallback(
    (email: string) =>
      uc.auth.signInWithEmail(email, window.location.origin),
    [uc]
  );
  const signInWithGoogle = useCallback(
    () => uc.auth.signInWithGoogle(window.location.origin),
    [uc]
  );
  const signOut = useCallback(() => uc.auth.signOut(), [uc]);

  return {
    user,
    sessionReady,
    isAuthenticated: !!user,
    signInWithEmail,
    signInWithGoogle,
    signOut,
  };
}
