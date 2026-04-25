import type { AisleId } from '@domain/aisle';
import { Ingredient, type IngredientId } from '@domain/ingredient';
import type { UserId } from '@domain/user';
import type { IngredientRepository } from '@application/ports/IngredientRepository';
import type { InMemoryDatabase } from './InMemoryDatabase';

export class InMemoryIngredientRepository implements IngredientRepository {
  constructor(private readonly db: InMemoryDatabase) {}

  async listByUser(userId: UserId) {
    this.db.ensureUser(userId);
    return [...this.db.ingredients.get(userId)!.values()];
  }

  async create(userId: UserId, ingredient: Ingredient) {
    this.db.ensureUser(userId);
    this.db.ingredients.get(userId)!.set(ingredient.id, ingredient);
  }

  async rename(userId: UserId, id: IngredientId, name: string) {
    this.db.ensureUser(userId);
    const map = this.db.ingredients.get(userId)!;
    const curr = map.get(id);
    if (!curr) return;
    map.set(id, Ingredient.rename(curr, name));
  }

  async move(userId: UserId, id: IngredientId, aisleId: AisleId) {
    this.db.ensureUser(userId);
    const map = this.db.ingredients.get(userId)!;
    const curr = map.get(id);
    if (!curr) return;
    map.set(id, Ingredient.moveToAisle(curr, aisleId));
  }

  async delete(userId: UserId, id: IngredientId) {
    this.db.ensureUser(userId);
    this.db.ingredients.get(userId)!.delete(id);
    // remove from recipes
    const recipes = this.db.recipes.get(userId);
    if (recipes) {
      for (const [rid, r] of recipes) {
        if (r.ingredients.includes(id)) {
          recipes.set(rid, {
            ...r,
            ingredients: r.ingredients.filter((x) => x !== id),
          });
        }
      }
    }
  }
}
