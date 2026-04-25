import type { Recipe, RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';

export interface RecipeRepository {
  listByUser(userId: UserId): Promise<Recipe[]>;
  getById(userId: UserId, id: RecipeId): Promise<Recipe | null>;
  upsert(userId: UserId, recipe: Recipe): Promise<void>;
  delete(userId: UserId, id: RecipeId): Promise<void>;
}
