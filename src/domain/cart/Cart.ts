import type { IngredientId } from '../ingredient/IngredientId';
import type { Recipe } from '../recipe/Recipe';
import type { RecipeId } from '../recipe/RecipeId';
import type { CartExtra } from './CartExtra';
import type { CartItem } from './CartItem';

/**
 * Panier de courses. Projection de 3 listes persistées :
 * - recipeIds : recettes sélectionnées pour la semaine
 * - items : ingrédients cochables (dérivés des recettes)
 * - extras : articles hors recette
 */
export interface Cart {
  readonly recipeIds: ReadonlySet<RecipeId>;
  readonly items: ReadonlyMap<IngredientId, CartItem>;
  readonly extras: readonly CartExtra[];
}

export const Cart = {
  empty(): Cart {
    return {
      recipeIds: new Set(),
      items: new Map(),
      extras: [],
    };
  },

  hasRecipe(cart: Cart, recipeId: RecipeId): boolean {
    return cart.recipeIds.has(recipeId);
  },

  addRecipe(cart: Cart, recipe: Recipe): Cart {
    if (cart.recipeIds.has(recipe.id)) return cart;
    const nextIds = new Set(cart.recipeIds);
    nextIds.add(recipe.id);
    const nextItems = new Map(cart.items);
    for (const ingId of recipe.ingredients) {
      if (!nextItems.has(ingId)) {
        nextItems.set(ingId, { ingredientId: ingId, checked: false });
      }
    }
    return { ...cart, recipeIds: nextIds, items: nextItems };
  },

  /**
   * Retire une recette du panier et tous les ingrédients qu'aucune autre recette
   * ne requiert plus.
   */
  removeRecipe(cart: Cart, recipe: Recipe, allRecipes: readonly Recipe[]): Cart {
    if (!cart.recipeIds.has(recipe.id)) return cart;
    const nextIds = new Set(cart.recipeIds);
    nextIds.delete(recipe.id);

    const stillNeeded = new Set<IngredientId>();
    for (const r of allRecipes) {
      if (nextIds.has(r.id)) {
        for (const ing of r.ingredients) stillNeeded.add(ing);
      }
    }

    const nextItems = new Map(cart.items);
    for (const ing of recipe.ingredients) {
      if (!stillNeeded.has(ing)) nextItems.delete(ing);
    }

    return { ...cart, recipeIds: nextIds, items: nextItems };
  },

  toggleItem(cart: Cart, ingredientId: IngredientId): Cart {
    const current = cart.items.get(ingredientId);
    if (!current) return cart;
    const nextItems = new Map(cart.items);
    nextItems.set(ingredientId, { ...current, checked: !current.checked });
    return { ...cart, items: nextItems };
  },

  toggleExtra(cart: Cart, extraId: CartExtra['id']): Cart {
    return {
      ...cart,
      extras: cart.extras.map((e) =>
        e.id === extraId ? { ...e, checked: !e.checked } : e
      ),
    };
  },

  addExtra(cart: Cart, extra: CartExtra): Cart {
    return { ...cart, extras: [...cart.extras, extra] };
  },

  removeExtra(cart: Cart, extraId: CartExtra['id']): Cart {
    return { ...cart, extras: cart.extras.filter((e) => e.id !== extraId) };
  },

  reset(): Cart {
    return Cart.empty();
  },
};
