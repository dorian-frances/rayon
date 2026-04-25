import { UnauthorizedError } from '@domain/shared';
import type { UserId } from '@domain/user';
import { useRayonStore } from '@/ui/store';

/**
 * Guarde d'appel de use case : lève si aucun user n'est présent dans le store.
 * Retourne l'id de l'utilisateur courant.
 */
export function useRequireUser(): UserId {
  const user = useRayonStore((s) => s.user);
  if (!user) throw new UnauthorizedError('Aucun utilisateur connecté');
  return user.id;
}
