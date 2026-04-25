import type { SupabaseClient } from '@supabase/supabase-js';
import {
  CartExtraId,
  type Cart,
  type CartExtra,
  type CartItem,
} from '@domain/cart';
import { IngredientId } from '@domain/ingredient';
import { RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';
import { Mappers, type CartExtraRow } from './mappers';

export class SupabaseCartRepository implements CartRepository {
  constructor(private readonly db: SupabaseClient) {}

  async load(userId: UserId): Promise<Cart> {
    const [recipesRes, itemsRes, extrasRes] = await Promise.all([
      this.db.from('cart_recipes').select('recipe_id').eq('user_id', userId),
      this.db.from('cart_items').select('ingredient_id, checked').eq('user_id', userId),
      this.db
        .from('cart_extras')
        .select('id, name, aisle_id, checked')
        .eq('user_id', userId),
    ]);

    if (recipesRes.error) throw recipesRes.error;
    if (itemsRes.error) throw itemsRes.error;
    if (extrasRes.error) throw extrasRes.error;

    const recipeIds = new Set<RecipeId>(
      (recipesRes.data ?? []).map((r) => RecipeId.of(r.recipe_id as string))
    );
    const items = new Map<IngredientId, CartItem>();
    for (const r of itemsRes.data ?? []) {
      const id = IngredientId.of((r as { ingredient_id: string }).ingredient_id);
      items.set(id, { ingredientId: id, checked: (r as { checked: boolean }).checked });
    }
    const extras: CartExtra[] = (extrasRes.data ?? [])
      .map((row) => Mappers.cartExtra(row as CartExtraRow))
      .filter((x): x is CartExtra => Boolean(x));
    return { recipeIds, items, extras };
  }

  async addRecipe(
    userId: UserId,
    recipeId: RecipeId,
    ingredientIds: readonly IngredientId[]
  ): Promise<void> {
    const { error: e1 } = await this.db
      .from('cart_recipes')
      .upsert({ user_id: userId, recipe_id: recipeId });
    if (e1) throw e1;
    if (ingredientIds.length > 0) {
      const rows = ingredientIds.map((iid) => ({
        user_id: userId,
        ingredient_id: iid,
        checked: false,
      }));
      const { error } = await this.db
        .from('cart_items')
        .upsert(rows, { onConflict: 'user_id,ingredient_id', ignoreDuplicates: true });
      if (error) throw error;
    }
  }

  async removeRecipe(
    userId: UserId,
    recipeId: RecipeId,
    orphanIngredientIds: readonly IngredientId[]
  ): Promise<void> {
    const { error: e1 } = await this.db
      .from('cart_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);
    if (e1) throw e1;
    if (orphanIngredientIds.length > 0) {
      const { error } = await this.db
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .in('ingredient_id', orphanIngredientIds as unknown as string[]);
      if (error) throw error;
    }
  }

  async setItemChecked(
    userId: UserId,
    ingredientId: IngredientId,
    checked: boolean
  ): Promise<void> {
    const { error } = await this.db
      .from('cart_items')
      .update({ checked })
      .eq('user_id', userId)
      .eq('ingredient_id', ingredientId);
    if (error) throw error;
  }

  async addExtra(userId: UserId, extra: CartExtra): Promise<void> {
    const { error } = await this.db.from('cart_extras').insert({
      id: extra.id,
      user_id: userId,
      name: extra.name,
      aisle_id: extra.aisleId,
      checked: extra.checked,
    });
    if (error) throw error;
  }

  async removeExtra(userId: UserId, extraId: CartExtraId): Promise<void> {
    const { error } = await this.db
      .from('cart_extras')
      .delete()
      .eq('user_id', userId)
      .eq('id', extraId);
    if (error) throw error;
  }

  async setExtraChecked(
    userId: UserId,
    extraId: CartExtraId,
    checked: boolean
  ): Promise<void> {
    const { error } = await this.db
      .from('cart_extras')
      .update({ checked })
      .eq('user_id', userId)
      .eq('id', extraId);
    if (error) throw error;
  }

  async reset(userId: UserId): Promise<void> {
    await Promise.all([
      this.db.from('cart_recipes').delete().eq('user_id', userId),
      this.db.from('cart_items').delete().eq('user_id', userId),
      this.db.from('cart_extras').delete().eq('user_id', userId),
    ]);
  }
}
