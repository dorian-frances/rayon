import type { CartExtra, CartExtraId } from '@domain/cart';
import type { IngredientId } from '@domain/ingredient';
import type { RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';
import type { InMemoryDatabase } from './InMemoryDatabase';

export class InMemoryCartRepository implements CartRepository {
  constructor(private readonly db: InMemoryDatabase) {}

  async load(userId: UserId) {
    this.db.ensureUser(userId);
    return this.db.carts.get(userId)!;
  }

  async addRecipe(userId: UserId, recipeId: RecipeId, ingredientIds: readonly IngredientId[]) {
    this.db.ensureUser(userId);
    const cart = this.db.carts.get(userId)!;
    const nextIds = new Set(cart.recipeIds);
    nextIds.add(recipeId);
    const nextItems = new Map(cart.items);
    for (const ing of ingredientIds) {
      if (!nextItems.has(ing)) {
        nextItems.set(ing, { ingredientId: ing, checked: false });
      }
    }
    this.db.carts.set(userId, { ...cart, recipeIds: nextIds, items: nextItems });
  }

  async removeRecipe(userId: UserId, recipeId: RecipeId, orphanIngredientIds: readonly IngredientId[]) {
    this.db.ensureUser(userId);
    const cart = this.db.carts.get(userId)!;
    const nextIds = new Set(cart.recipeIds);
    nextIds.delete(recipeId);
    const nextItems = new Map(cart.items);
    for (const ing of orphanIngredientIds) nextItems.delete(ing);
    this.db.carts.set(userId, { ...cart, recipeIds: nextIds, items: nextItems });
  }

  async setItemChecked(userId: UserId, ingredientId: IngredientId, checked: boolean) {
    this.db.ensureUser(userId);
    const cart = this.db.carts.get(userId)!;
    const curr = cart.items.get(ingredientId);
    if (!curr) return;
    const nextItems = new Map(cart.items);
    nextItems.set(ingredientId, { ...curr, checked });
    this.db.carts.set(userId, { ...cart, items: nextItems });
  }

  async addExtra(userId: UserId, extra: CartExtra) {
    this.db.ensureUser(userId);
    const cart = this.db.carts.get(userId)!;
    this.db.carts.set(userId, { ...cart, extras: [...cart.extras, extra] });
  }

  async removeExtra(userId: UserId, extraId: CartExtraId) {
    this.db.ensureUser(userId);
    const cart = this.db.carts.get(userId)!;
    this.db.carts.set(userId, {
      ...cart,
      extras: cart.extras.filter((e) => e.id !== extraId),
    });
  }

  async setExtraChecked(userId: UserId, extraId: CartExtraId, checked: boolean) {
    this.db.ensureUser(userId);
    const cart = this.db.carts.get(userId)!;
    this.db.carts.set(userId, {
      ...cart,
      extras: cart.extras.map((e) => (e.id === extraId ? { ...e, checked } : e)),
    });
  }

  async reset(userId: UserId) {
    this.db.ensureUser(userId);
    this.db.carts.set(userId, {
      recipeIds: new Set(),
      items: new Map(),
      extras: [],
    });
  }
}
