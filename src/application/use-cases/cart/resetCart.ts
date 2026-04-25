import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';

export const resetCart =
  (repo: CartRepository) =>
  (userId: UserId): Promise<void> =>
    repo.reset(userId);
