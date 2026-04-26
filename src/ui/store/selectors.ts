import { sortByPosition, type Aisle } from '@domain/aisle';
import type { Ingredient, IngredientId } from '@domain/ingredient';
import type { Recipe, RecipeId } from '@domain/recipe';
import type { CartExtra } from '@domain/cart';
import type { RayonState } from './types';

export interface ShoppingItemRow {
  readonly id: string;
  readonly name: string;
  readonly checked: boolean;
  readonly source: 'recipe' | 'extra';
  /** Noms des recettes du panier qui requièrent cet ingrédient (vide pour les extras). */
  readonly recipeNames: readonly string[];
}

export interface AisleSectionView {
  readonly aisle: Aisle;
  readonly items: ShoppingItemRow[];
}

/**
 * Pure selectors — prennent uniquement les slices dont ils dépendent.
 * Doivent être appelés dans un `useMemo` côté hook UI : leur sortie est
 * un nouvel objet à chaque appel, donc inutilisable directement comme selector
 * de `useSyncExternalStore` (zustand) — boucle infinie sinon.
 */

export function buildCartItemsByAisle(
  aisles: readonly Aisle[],
  ingredients: readonly Ingredient[],
  cartItems: Record<string, { checked: boolean }>,
  cartExtras: readonly CartExtra[],
  recipes: readonly Recipe[],
  cartRecipeIds: readonly RecipeId[]
): AisleSectionView[] {
  const ingById = new Map<IngredientId, Ingredient>();
  for (const i of ingredients) ingById.set(i.id, i);

  const cartRecipeIdSet = new Set<RecipeId>(cartRecipeIds);
  const recipeNamesByIngredient = new Map<IngredientId, string[]>();
  for (const recipe of recipes) {
    if (!cartRecipeIdSet.has(recipe.id)) continue;
    for (const ingId of recipe.ingredients) {
      const arr = recipeNamesByIngredient.get(ingId) ?? [];
      arr.push(recipe.name);
      recipeNamesByIngredient.set(ingId, arr);
    }
  }

  const byAisle = new Map<string, ShoppingItemRow[]>();

  for (const [ingredientId, info] of Object.entries(cartItems)) {
    const ing = ingById.get(ingredientId as IngredientId);
    if (!ing) continue;
    const aid = ing.aisleId as string;
    const arr = byAisle.get(aid) ?? [];
    const recipeNames = (recipeNamesByIngredient.get(ing.id) ?? [])
      .slice()
      .sort((a, b) => a.localeCompare(b));
    arr.push({
      id: ing.id,
      name: ing.name,
      checked: info.checked,
      source: 'recipe',
      recipeNames,
    });
    byAisle.set(aid, arr);
  }

  for (const extra of cartExtras) {
    const aid = extra.aisleId as string;
    const arr = byAisle.get(aid) ?? [];
    arr.push({
      id: extra.id,
      name: extra.name,
      checked: extra.checked,
      source: 'extra',
      recipeNames: [],
    });
    byAisle.set(aid, arr);
  }

  return sortByPosition(aisles)
    .filter((a) => byAisle.get(a.id)?.length)
    .map((a) => ({
      aisle: a,
      items: (byAisle.get(a.id) ?? []).sort((x, y) => x.name.localeCompare(y.name)),
    }));
}

export interface CartStats {
  readonly total: number;
  readonly done: number;
  readonly pct: number;
  readonly recipeCount: number;
}

export function buildCartStats(
  groups: readonly AisleSectionView[],
  recipeCount: number
): CartStats {
  let total = 0;
  let done = 0;
  for (const g of groups) {
    for (const i of g.items) {
      total += 1;
      if (i.checked) done += 1;
    }
  }
  return {
    total,
    done,
    pct: total === 0 ? 0 : done / total,
    recipeCount,
  };
}

export function buildSortedAisles(aisles: readonly Aisle[]): Aisle[] {
  return sortByPosition(aisles);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Lookups O(n) — sûrs comme selectors zustand car retournent une référence
 * stable (l'élément du tableau ne change pas tant que le tableau lui-même
 * n'a pas été réassigné).
 * ──────────────────────────────────────────────────────────────────────── */

export function selectRecipeById(state: RayonState, id: string): Recipe | undefined {
  return state.recipes.find((r) => r.id === id);
}

export function selectIngredientById(
  state: RayonState,
  id: string
): Ingredient | undefined {
  return state.ingredients.find((i) => i.id === id);
}

export function selectAisleById(state: RayonState, id: string): Aisle | undefined {
  return state.aisles.find((a) => a.id === id);
}
