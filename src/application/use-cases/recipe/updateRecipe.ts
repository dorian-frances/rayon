import { NotFoundError } from '@domain/shared';
import { Recipe, type RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { RecipeRepository } from '@application/ports/RecipeRepository';
import type { Clock } from '@application/ports/Clock';
import type { CategoryId } from '@domain/category';
import type { IngredientId } from '@domain/ingredient';
import type { RecipeStep } from '@domain/recipe';

export interface UpdateRecipeInput {
  name?: string;
  image?: string | null;
  origin?: string | null;
  link?: string | null;
  categories?: readonly CategoryId[];
  ingredients?: readonly IngredientId[];
  steps?: readonly RecipeStep[];
}

export const updateRecipe =
  (repo: RecipeRepository, clock: Clock) =>
  async (userId: UserId, id: RecipeId, patch: UpdateRecipeInput): Promise<Recipe> => {
    const existing = await repo.getById(userId, id);
    if (!existing) throw new NotFoundError('Recipe', id);
    const updated = Recipe.update(existing, patch, clock.now());
    await repo.upsert(userId, updated);
    return updated;
  };
