import type { Ingredient } from '@domain/ingredient';
import type { UserId } from '@domain/user';
import type { IngredientRepository } from '@application/ports/IngredientRepository';

export const listIngredients =
  (repo: IngredientRepository) =>
  (userId: UserId): Promise<Ingredient[]> =>
    repo.listByUser(userId);
