import { Cart } from '@domain/cart';
import type { IngredientId } from '@domain/ingredient';
import type { RecipeId } from '@domain/recipe';
import { NotFoundError } from '@domain/shared';
import type { UserId } from '@domain/user';
import type { CartRepository } from '@application/ports/CartRepository';
import type { RecipeRepository } from '@application/ports/RecipeRepository';

export const toggleRecipeInCart =
  (cartRepo: CartRepository, recipeRepo: RecipeRepository) =>
  async (userId: UserId, recipeId: RecipeId): Promise<Cart> => {
    const recipe = await recipeRepo.getById(userId, recipeId);
    if (!recipe) throw new NotFoundError('Recipe', recipeId);

    const cart = await cartRepo.load(userId);

    if (cart.recipeIds.has(recipeId)) {
      const allRecipes = await recipeRepo.listByUser(userId);
      const next = Cart.removeRecipe(cart, recipe, allRecipes);
      const orphans = recipe.ingredients.filter((i) => !next.items.has(i));
      await cartRepo.removeRecipe(userId, recipeId, orphans);
      return next;
    }

    const next = Cart.addRecipe(cart, recipe);
    const newIngredientIds: IngredientId[] = recipe.ingredients.filter(
      (i) => !cart.items.has(i)
    );
    await cartRepo.addRecipe(userId, recipeId, newIngredientIds);
    return next;
  };
