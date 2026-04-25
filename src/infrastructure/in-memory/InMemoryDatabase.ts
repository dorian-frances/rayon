import type { Aisle, AisleId } from '@domain/aisle';
import type { Category, CategoryId } from '@domain/category';
import type { Ingredient, IngredientId } from '@domain/ingredient';
import type { Recipe, RecipeId } from '@domain/recipe';
import type { Cart, CartExtra, CartExtraId } from '@domain/cart';
import type { UserId } from '@domain/user';

/**
 * Stockage en mémoire partagé par tous les adaptateurs in-memory.
 * Une seule instance pour la durée de l'app (permet aux tests et au dev offline
 * d'avoir un état cohérent entre repositories).
 */
export class InMemoryDatabase {
  readonly aisles = new Map<UserId, Map<AisleId, Aisle>>();
  readonly categories = new Map<UserId, Map<CategoryId, Category>>();
  readonly ingredients = new Map<UserId, Map<IngredientId, Ingredient>>();
  readonly recipes = new Map<UserId, Map<RecipeId, Recipe>>();
  readonly carts = new Map<UserId, Cart>();
  readonly extras = new Map<UserId, Map<CartExtraId, CartExtra>>();

  ensureUser(userId: UserId): void {
    if (!this.aisles.has(userId)) this.aisles.set(userId, new Map());
    if (!this.categories.has(userId)) this.categories.set(userId, new Map());
    if (!this.ingredients.has(userId)) this.ingredients.set(userId, new Map());
    if (!this.recipes.has(userId)) this.recipes.set(userId, new Map());
    if (!this.carts.has(userId)) {
      this.carts.set(userId, {
        recipeIds: new Set(),
        items: new Map(),
        extras: [],
      });
    }
    if (!this.extras.has(userId)) this.extras.set(userId, new Map());
  }
}
