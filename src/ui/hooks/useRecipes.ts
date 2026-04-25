import { useCallback } from 'react';
import { useUseCases } from '@composition/ContainerProvider';
import { useRayonStore } from '@/ui/store';
import type { Recipe, RecipeId } from '@domain/recipe';
import type { CreateRecipeInput } from '@application/use-cases/recipe/createRecipe';
import type { UpdateRecipeInput } from '@application/use-cases/recipe/updateRecipe';
import type { RecipeStep } from '@domain/recipe';
import { useRequireUser } from './useRequireUser';

export function useRecipes() {
  const uc = useUseCases();
  const userId = useRequireUser();
  const recipes = useRayonStore((s) => s.recipes);
  const upsertRecipe = useRayonStore((s) => s.upsertRecipe);
  const removeRecipe = useRayonStore((s) => s.removeRecipe);

  const create = useCallback(
    async (input: CreateRecipeInput): Promise<Recipe> => {
      const recipe = await uc.recipes.create(userId, input);
      upsertRecipe(recipe);
      return recipe;
    },
    [uc, userId, upsertRecipe]
  );

  const update = useCallback(
    async (id: RecipeId, patch: UpdateRecipeInput): Promise<Recipe> => {
      const recipe = await uc.recipes.update(userId, id, patch);
      upsertRecipe(recipe);
      return recipe;
    },
    [uc, userId, upsertRecipe]
  );

  const remove = useCallback(
    async (id: RecipeId) => {
      await uc.recipes.delete(userId, id);
      removeRecipe(id);
    },
    [uc, userId, removeRecipe]
  );

  const updateSteps = useCallback(
    async (id: RecipeId, steps: readonly RecipeStep[]) => {
      await uc.recipes.updateSteps(userId, id, steps);
      const current = useRayonStore.getState().recipes.find((r) => r.id === id);
      if (current) upsertRecipe({ ...current, steps: [...steps], updatedAt: new Date() });
    },
    [uc, userId, upsertRecipe]
  );

  return { recipes, create, update, remove, updateSteps };
}
