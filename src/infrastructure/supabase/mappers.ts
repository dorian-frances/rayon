import { Aisle, AisleId } from '@domain/aisle';
import { Category, CategoryId } from '@domain/category';
import { Ingredient, IngredientId } from '@domain/ingredient';
import { Recipe, RecipeId, type RecipeStep, type RecipeStepKind } from '@domain/recipe';
import { CartExtraId, type CartExtra } from '@domain/cart';

export interface AisleRow {
  id: string;
  name: string;
  emoji: string;
  position: number;
}

export interface CategoryRow {
  id: string;
  label: string;
  color: string;
}

export interface IngredientRow {
  id: string;
  name: string;
  aisle_id: string;
}

export interface RecipeRow {
  id: string;
  name: string;
  image: string | null;
  origin: string | null;
  link: string | null;
  categories: string[] | null;
  steps: unknown;
  created_at: string;
  updated_at: string;
}

export interface RecipeWithIngredientsRow extends RecipeRow {
  recipe_ingredients?: { ingredient_id: string; position: number }[];
}

export interface CartExtraRow {
  id: string;
  name: string;
  aisle_id: string | null;
  checked: boolean;
}

export const Mappers = {
  aisle(row: AisleRow): Aisle {
    return {
      id: AisleId.of(row.id),
      name: row.name,
      emoji: row.emoji,
      position: row.position,
    };
  },
  category(row: CategoryRow): Category {
    return { id: CategoryId.of(row.id), label: row.label, color: row.color };
  },
  ingredient(row: IngredientRow): Ingredient {
    return {
      id: IngredientId.of(row.id),
      name: row.name,
      aisleId: AisleId.of(row.aisle_id),
    };
  },
  recipe(row: RecipeWithIngredientsRow): Recipe {
    const ingredientIds: IngredientId[] = (row.recipe_ingredients ?? [])
      .sort((a, b) => a.position - b.position)
      .map((ri) => IngredientId.of(ri.ingredient_id));
    const stepsRaw = Array.isArray(row.steps) ? (row.steps as unknown[]) : [];
    const steps: RecipeStep[] = stepsRaw
      .map((s) => normalizeStep(s))
      .filter(Boolean) as RecipeStep[];
    return {
      id: RecipeId.of(row.id),
      name: row.name,
      image: row.image,
      origin: row.origin,
      link: row.link,
      categories: (row.categories ?? []).map((c) => CategoryId.of(c)),
      ingredients: ingredientIds,
      steps,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  },
  cartExtra(row: CartExtraRow): CartExtra | null {
    if (!row.aisle_id) return null;
    return {
      id: CartExtraId.of(row.id),
      name: row.name,
      aisleId: AisleId.of(row.aisle_id),
      checked: row.checked,
    };
  },
};

function normalizeStep(value: unknown): RecipeStep | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as { t?: string; kind?: string; v?: string; value?: string };
  const kind = (v.kind ?? v.t) as RecipeStepKind | undefined;
  const text = v.value ?? v.v ?? '';
  if (kind !== 'h' && kind !== 'li' && kind !== 'p') return null;
  return { kind, value: text };
}

export function recipeStepsToJson(steps: readonly RecipeStep[]): unknown {
  return steps.map((s) => ({ kind: s.kind, value: s.value }));
}
