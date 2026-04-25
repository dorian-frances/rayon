import type { RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { RecipeRepository } from '@application/ports/RecipeRepository';

export const deleteRecipe =
  (repo: RecipeRepository) =>
  (userId: UserId, id: RecipeId): Promise<void> =>
    repo.delete(userId, id);
