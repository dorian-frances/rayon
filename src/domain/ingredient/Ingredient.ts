import { ValidationError } from '../shared/errors';
import type { AisleId } from '../aisle/AisleId';
import type { IngredientId } from './IngredientId';

export interface Ingredient {
  readonly id: IngredientId;
  readonly name: string;
  readonly aisleId: AisleId;
}

export const Ingredient = {
  create(input: {
    id: IngredientId;
    name: string;
    aisleId: AisleId;
  }): Ingredient {
    if (!input.name.trim()) {
      throw new ValidationError("Le nom de l'ingrédient ne peut pas être vide");
    }
    return { id: input.id, name: input.name.trim(), aisleId: input.aisleId };
  },
  rename(ing: Ingredient, name: string): Ingredient {
    if (!name.trim()) {
      throw new ValidationError("Le nom de l'ingrédient ne peut pas être vide");
    }
    return { ...ing, name: name.trim() };
  },
  moveToAisle(ing: Ingredient, aisleId: AisleId): Ingredient {
    return { ...ing, aisleId };
  },
  matches(ing: Ingredient, query: string): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    return ing.name.toLowerCase().includes(q);
  },
};
