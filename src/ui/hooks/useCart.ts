import { useCallback, useMemo } from 'react';
import { useUseCases } from '@composition/ContainerProvider';
import { useRayonStore } from '@/ui/store';
import { buildCartItemsByAisle, buildCartStats } from '@/ui/store/selectors';
import type { AisleId } from '@domain/aisle';
import type { CartExtraId } from '@domain/cart';
import type { IngredientId } from '@domain/ingredient';
import type { RecipeId } from '@domain/recipe';
import { useRequireUser } from './useRequireUser';

export function useCart() {
  const uc = useUseCases();
  const userId = useRequireUser();

  const aisles = useRayonStore((s) => s.aisles);
  const ingredients = useRayonStore((s) => s.ingredients);
  const recipes = useRayonStore((s) => s.recipes);
  const cartRecipeIds = useRayonStore((s) => s.cartRecipeIds);
  const cartItems = useRayonStore((s) => s.cartItems);
  const cartExtras = useRayonStore((s) => s.cartExtras);

  const groups = useMemo(
    () =>
      buildCartItemsByAisle(
        aisles,
        ingredients,
        cartItems,
        cartExtras,
        recipes,
        cartRecipeIds
      ),
    [aisles, ingredients, cartItems, cartExtras, recipes, cartRecipeIds]
  );
  const stats = useMemo(
    () => buildCartStats(groups, cartRecipeIds.length),
    [groups, cartRecipeIds.length]
  );

  const inCart = useCallback(
    (recipeId: RecipeId) => cartRecipeIds.includes(recipeId),
    [cartRecipeIds]
  );

  const toggleRecipe = useCallback(
    async (recipeId: RecipeId) => {
      const state = useRayonStore.getState();
      const recipe = state.recipes.find((r) => r.id === recipeId);
      if (!recipe) return;
      const wasIn = state.cartRecipeIds.includes(recipeId);

      if (wasIn) {
        const stillNeeded = new Set<IngredientId>();
        for (const r of state.recipes) {
          if (r.id !== recipeId && state.cartRecipeIds.includes(r.id)) {
            for (const ing of r.ingredients) stillNeeded.add(ing);
          }
        }
        const orphans = recipe.ingredients.filter((i) => !stillNeeded.has(i));
        state.removeCartRecipe(recipeId, orphans);
      } else {
        const newIngredientIds = recipe.ingredients.filter((i) => !cartItems[i]);
        state.addCartRecipe(recipeId, newIngredientIds);
      }

      await uc.cart.toggleRecipe(userId, recipeId);
    },
    [uc, userId, cartItems]
  );

  const toggleItem = useCallback(
    async (ingredientId: IngredientId) => {
      const curr = useRayonStore.getState().cartItems[ingredientId];
      const next = !(curr?.checked ?? false);
      useRayonStore.getState().setItemChecked(ingredientId, next);
      await uc.cart.toggleItem(userId, ingredientId);
    },
    [uc, userId]
  );

  const toggleExtra = useCallback(
    async (id: CartExtraId) => {
      const state = useRayonStore.getState();
      const curr = state.cartExtras.find((e) => e.id === id);
      if (!curr) return;
      state.setExtraChecked(id, !curr.checked);
      await uc.cart.toggleExtra(userId, id);
    },
    [uc, userId]
  );

  const addExtra = useCallback(
    async (name: string, aisleId: AisleId) => {
      const extra = await uc.cart.addExtra(userId, { name, aisleId });
      useRayonStore.getState().addExtra(extra);
      return extra;
    },
    [uc, userId]
  );

  const removeExtra = useCallback(
    async (id: CartExtraId) => {
      useRayonStore.getState().removeExtra(id);
      await uc.cart.removeExtra(userId, id);
    },
    [uc, userId]
  );

  const reset = useCallback(async () => {
    useRayonStore.getState().resetCart();
    await uc.cart.reset(userId);
  }, [uc, userId]);

  return useMemo(
    () => ({
      cartRecipeIds,
      cartItems,
      cartExtras,
      groups,
      stats,
      inCart,
      toggleRecipe,
      toggleItem,
      toggleExtra,
      addExtra,
      removeExtra,
      reset,
    }),
    [
      cartRecipeIds,
      cartItems,
      cartExtras,
      groups,
      stats,
      inCart,
      toggleRecipe,
      toggleItem,
      toggleExtra,
      addExtra,
      removeExtra,
      reset,
    ]
  );
}
