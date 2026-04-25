import type { Recipe, RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { RecipeRepository } from '@application/ports/RecipeRepository';

export const getRecipe =
  (repo: RecipeRepository) =>
  (userId: UserId, id: RecipeId): Promise<Recipe | null> =>
    repo.getById(userId, id);
