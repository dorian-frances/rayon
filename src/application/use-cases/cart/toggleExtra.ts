import { Cart, type CartExtraId } from '@domain/cart';
import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';

export const toggleExtra =
  (repo: CartRepository) =>
  async (userId: UserId, extraId: CartExtraId): Promise<Cart> => {
    const cart = await repo.load(userId);
    const next = Cart.toggleExtra(cart, extraId);
    const updated = next.extras.find((e) => e.id === extraId);
    if (updated) {
      await repo.setExtraChecked(userId, extraId, updated.checked);
    }
    return next;
  };
