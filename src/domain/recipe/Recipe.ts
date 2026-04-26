import { ValidationError } from '../shared/errors';
import type { IngredientId } from '../ingredient/IngredientId';
import type { CategoryId } from '../category/CategoryId';
import type { TagId } from '../tag/TagId';
import type { RecipeId } from './RecipeId';
import type { RecipeStep } from './RecipeStep';

export interface Recipe {
  readonly id: RecipeId;
  readonly name: string;
  /** URL externe vers l'image (optionnelle) */
  readonly image: string | null;
  /** URL de la recette d'origine (Marmiton, 750g...) */
  readonly link: string | null;
  readonly categories: readonly CategoryId[];
  /** Tags multi-valeur : origines, régimes, saisons, textures... */
  readonly tags: readonly TagId[];
  readonly ingredients: readonly IngredientId[];
  readonly steps: readonly RecipeStep[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const Recipe = {
  create(input: {
    id: RecipeId;
    name: string;
    image?: string | null;
    link?: string | null;
    categories?: readonly CategoryId[];
    tags?: readonly TagId[];
    ingredients?: readonly IngredientId[];
    steps?: readonly RecipeStep[];
    now?: Date;
  }): Recipe {
    if (!input.name.trim()) {
      throw new ValidationError('Le nom de la recette ne peut pas être vide');
    }
    const now = input.now ?? new Date();
    return {
      id: input.id,
      name: input.name.trim(),
      image: input.image ?? null,
      link: input.link ?? null,
      categories: input.categories ?? [],
      tags: input.tags ?? [],
      ingredients: input.ingredients ?? [],
      steps: input.steps ?? [],
      createdAt: now,
      updatedAt: now,
    };
  },
  update(
    recipe: Recipe,
    patch: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>,
    now = new Date()
  ): Recipe {
    return { ...recipe, ...patch, updatedAt: now };
  },
  addIngredient(recipe: Recipe, ingredientId: IngredientId, now = new Date()): Recipe {
    if (recipe.ingredients.includes(ingredientId)) return recipe;
    return { ...recipe, ingredients: [...recipe.ingredients, ingredientId], updatedAt: now };
  },
  removeIngredient(recipe: Recipe, ingredientId: IngredientId, now = new Date()): Recipe {
    return {
      ...recipe,
      ingredients: recipe.ingredients.filter((x) => x !== ingredientId),
      updatedAt: now,
    };
  },
  setSteps(recipe: Recipe, steps: readonly RecipeStep[], now = new Date()): Recipe {
    return { ...recipe, steps, updatedAt: now };
  },
};
