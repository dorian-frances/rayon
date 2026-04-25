import type { IngredientId } from '../ingredient/IngredientId';

/**
 * Un ingrédient à acheter, dérivé d'une recette du panier.
 * `checked` indique s'il a été attrapé en rayon.
 */
export interface CartItem {
  readonly ingredientId: IngredientId;
  readonly checked: boolean;
}
