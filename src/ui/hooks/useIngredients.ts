import { useCallback } from 'react';
import { useUseCases } from '@composition/ContainerProvider';
import { useRayonStore } from '@/ui/store';
import type { Ingredient, IngredientId } from '@domain/ingredient';
import type { AisleId } from '@domain/aisle';
import { useRequireUser } from './useRequireUser';

export function useIngredients() {
  const uc = useUseCases();
  const userId = useRequireUser();
  const ingredients = useRayonStore((s) => s.ingredients);
  const upsertIngredient = useRayonStore((s) => s.upsertIngredient);
  const removeIngredient = useRayonStore((s) => s.removeIngredient);

  const create = useCallback(
    async (name: string, aisleId: AisleId): Promise<Ingredient> => {
      const ing = await uc.ingredients.create(userId, { name, aisleId });
      upsertIngredient(ing);
      return ing;
    },
    [uc, userId, upsertIngredient]
  );

  const move = useCallback(
    async (id: IngredientId, aisleId: AisleId) => {
      await uc.ingredients.move(userId, id, aisleId);
      const current = useRayonStore.getState().ingredients.find((i) => i.id === id);
      if (current) upsertIngredient({ ...current, aisleId });
    },
    [uc, userId, upsertIngredient]
  );

  const rename = useCallback(
    async (id: IngredientId, name: string) => {
      await uc.ingredients.rename(userId, id, name);
      const current = useRayonStore.getState().ingredients.find((i) => i.id === id);
      if (current) upsertIngredient({ ...current, name: name.trim() });
    },
    [uc, userId, upsertIngredient]
  );

  const remove = useCallback(
    async (id: IngredientId) => {
      await uc.ingredients.delete(userId, id);
      removeIngredient(id);
    },
    [uc, userId, removeIngredient]
  );

  return { ingredients, create, move, rename, remove };
}
