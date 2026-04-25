import type { Recipe, RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { RecipeRepository } from '@application/ports/RecipeRepository';
import type { InMemoryDatabase } from './InMemoryDatabase';

export class InMemoryRecipeRepository implements RecipeRepository {
  constructor(private readonly db: InMemoryDatabase) {}

  async listByUser(userId: UserId) {
    this.db.ensureUser(userId);
    return [...this.db.recipes.get(userId)!.values()];
  }

  async getById(userId: UserId, id: RecipeId) {
    this.db.ensureUser(userId);
    return this.db.recipes.get(userId)!.get(id) ?? null;
  }

  async upsert(userId: UserId, recipe: Recipe) {
    this.db.ensureUser(userId);
    this.db.recipes.get(userId)!.set(recipe.id, recipe);
  }

  async delete(userId: UserId, id: RecipeId) {
    this.db.ensureUser(userId);
    this.db.recipes.get(userId)!.delete(id);
    // remove from cart if present
    const cart = this.db.carts.get(userId);
    if (cart && cart.recipeIds.has(id)) {
      const nextIds = new Set(cart.recipeIds);
      nextIds.delete(id);
      this.db.carts.set(userId, { ...cart, recipeIds: nextIds });
    }
  }
}
