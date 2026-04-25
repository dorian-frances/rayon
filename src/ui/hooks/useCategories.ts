import { useCallback } from 'react';
import { useUseCases } from '@composition/ContainerProvider';
import { useRayonStore } from '@/ui/store';
import type { Category, CategoryId } from '@domain/category';
import { useRequireUser } from './useRequireUser';

export function useCategories() {
  const uc = useUseCases();
  const userId = useRequireUser();
  const categories = useRayonStore((s) => s.categories);
  const upsertCategory = useRayonStore((s) => s.upsertCategory);
  const removeCategory = useRayonStore((s) => s.removeCategory);

  const create = useCallback(
    async (label: string, color?: string): Promise<Category> => {
      const c = await uc.categories.create(userId, { label, color });
      upsertCategory(c);
      return c;
    },
    [uc, userId, upsertCategory]
  );

  const rename = useCallback(
    async (id: CategoryId, label: string) => {
      await uc.categories.rename(userId, id, label);
      const current = useRayonStore.getState().categories.find((c) => c.id === id);
      if (current) upsertCategory({ ...current, label: label.trim() });
    },
    [uc, userId, upsertCategory]
  );

  const remove = useCallback(
    async (id: CategoryId) => {
      await uc.categories.delete(userId, id);
      removeCategory(id);
    },
    [uc, userId, removeCategory]
  );

  return { categories, create, rename, remove };
}
