import type { IngredientId } from '@domain/ingredient';
import type { UserId } from '@domain/user';
import type { IngredientRepository } from '@application/ports/IngredientRepository';

export const deleteIngredient =
  (repo: IngredientRepository) =>
  (userId: UserId, id: IngredientId): Promise<void> =>
    repo.delete(userId, id);
