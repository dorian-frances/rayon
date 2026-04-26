import { useCallback } from 'react';
import { useUseCases } from '@composition/ContainerProvider';
import { useRayonStore } from '@/ui/store';
import type { Tag, TagId } from '@domain/tag';
import { useRequireUser } from './useRequireUser';

export function useTags() {
  const uc = useUseCases();
  const userId = useRequireUser();
  const tags = useRayonStore((s) => s.tags);
  const upsertTag = useRayonStore((s) => s.upsertTag);
  const removeTag = useRayonStore((s) => s.removeTag);

  const create = useCallback(
    async (label: string): Promise<Tag> => {
      const t = await uc.tags.create(userId, { label });
      upsertTag(t);
      return t;
    },
    [uc, userId, upsertTag]
  );

  const rename = useCallback(
    async (id: TagId, label: string) => {
      await uc.tags.rename(userId, id, label);
      const current = useRayonStore.getState().tags.find((t) => t.id === id);
      if (current) upsertTag({ ...current, label: label.trim() });
    },
    [uc, userId, upsertTag]
  );

  const remove = useCallback(
    async (id: TagId) => {
      await uc.tags.delete(userId, id);
      removeTag(id);
    },
    [uc, userId, removeTag]
  );

  return { tags, create, rename, remove };
}
