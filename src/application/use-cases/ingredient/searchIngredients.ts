import { Ingredient, type Ingredient as IngredientEntity } from '@domain/ingredient';
import type { UserId } from '@domain/user';
import type { IngredientRepository } from '@application/ports/IngredientRepository';

export const searchIngredients =
  (repo: IngredientRepository) =>
  async (userId: UserId, query: string, limit = 40): Promise<IngredientEntity[]> => {
    const q = query.trim();
    if (!q) return [];
    const all = await repo.listByUser(userId);
    return all.filter((i) => Ingredient.matches(i, q)).slice(0, limit);
  };
