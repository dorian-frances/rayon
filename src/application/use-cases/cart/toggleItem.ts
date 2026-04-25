import { Cart } from '@domain/cart';
import type { IngredientId } from '@domain/ingredient';
import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';

export const toggleItem =
  (repo: CartRepository) =>
  async (userId: UserId, ingredientId: IngredientId): Promise<Cart> => {
    const cart = await repo.load(userId);
    const next = Cart.toggleItem(cart, ingredientId);
    const updated = next.items.get(ingredientId);
    if (updated) {
      await repo.setItemChecked(userId, ingredientId, updated.checked);
    }
    return next;
  };
