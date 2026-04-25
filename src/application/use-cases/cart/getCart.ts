import type { Cart } from '@domain/cart';
import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';

export const getCart =
  (repo: CartRepository) =>
  (userId: UserId): Promise<Cart> =>
    repo.load(userId);
