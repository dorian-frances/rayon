import type { Recipe } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { RecipeRepository } from '@application/ports/RecipeRepository';

export const listRecipes =
  (repo: RecipeRepository) =>
  (userId: UserId): Promise<Recipe[]> =>
    repo.listByUser(userId);
