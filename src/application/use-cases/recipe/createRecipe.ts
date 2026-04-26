import type { CategoryId } from '@domain/category';
import type { TagId } from '@domain/tag';
import type { IngredientId } from '@domain/ingredient';
import { Recipe, RecipeId, type RecipeStep } from '@domain/recipe';
import type { UserId } from '@domain/user';
import type { RecipeRepository } from '@application/ports/RecipeRepository';
import type { IdGenerator } from '@application/ports/IdGenerator';
import type { Clock } from '@application/ports/Clock';

export interface CreateRecipeInput {
  name: string;
  image?: string | null;
  link?: string | null;
  categories?: readonly CategoryId[];
  tags?: readonly TagId[];
  ingredients?: readonly IngredientId[];
  steps?: readonly RecipeStep[];
}

export const createRecipe =
  (repo: RecipeRepository, ids: IdGenerator, clock: Clock) =>
  async (userId: UserId, input: CreateRecipeInput): Promise<Recipe> => {
    const recipe = Recipe.create({
      id: RecipeId.of(ids.newId()),
      name: input.name,
      image: input.image ?? null,
      link: input.link ?? null,
      categories: input.categories ?? [],
      tags: input.tags ?? [],
      ingredients: input.ingredients ?? [],
      steps: input.steps ?? [{ kind: 'li', value: '' }],
      now: clock.now(),
    });
    await repo.upsert(userId, recipe);
    return recipe;
  };
