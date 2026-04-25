import type { CartExtraId } from '@domain/cart';
import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';

export const removeExtra =
  (repo: CartRepository) =>
  (userId: UserId, id: CartExtraId): Promise<void> =>
    repo.removeExtra(userId, id);
