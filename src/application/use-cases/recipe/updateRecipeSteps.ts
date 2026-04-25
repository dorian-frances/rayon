import { NotFoundError } from '@domain/shared';
import { Recipe, type RecipeId, type RecipeStep } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { RecipeRepository } from '@application/ports/RecipeRepository';
import type { Clock } from '@application/ports/Clock';

export const updateRecipeSteps =
  (repo: RecipeRepository, clock: Clock) =>
  async (userId: UserId, id: RecipeId, steps: readonly RecipeStep[]): Promise<void> => {
    const recipe = await repo.getById(userId, id);
    if (!recipe) throw new NotFoundError('Recipe', id);
    await repo.upsert(userId, Recipe.setSteps(recipe, steps, clock.now()));
  };
