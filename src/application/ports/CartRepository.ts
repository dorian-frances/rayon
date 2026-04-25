import type { Cart, CartExtra, CartExtraId } from '@domain/cart';
import type { IngredientId } from '@domain/ingredient';
import type { RecipeId } from '@domain/recipe';
import type { UserId } from '@domain/user';

export interface CartRepository {
  load(userId: UserId): Promise<Cart>;
  addRecipe(userId: UserId, recipeId: RecipeId, ingredientIds: readonly IngredientId[]): Promise<void>;
  removeRecipe(userId: UserId, recipeId: RecipeId, orphanIngredientIds: readonly IngredientId[]): Promise<void>;
  setItemChecked(userId: UserId, ingredientId: IngredientId, checked: boolean): Promise<void>;
  addExtra(userId: UserId, extra: CartExtra): Promise<void>;
  removeExtra(userId: UserId, extraId: CartExtraId): Promise<void>;
  setExtraChecked(userId: UserId, extraId: CartExtraId, checked: boolean): Promise<void>;
  reset(userId: UserId): Promise<void>;
}
