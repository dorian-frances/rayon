import { useCallback, useMemo } from 'react';
import { useUseCases } from '@composition/ContainerProvider';
import { useRayonStore } from '@/ui/store';
import { buildSortedAisles } from '@/ui/store/selectors';
import type { AisleId } from '@domain/aisle';
import { useRequireUser } from './useRequireUser';

export function useAisles() {
  const uc = useUseCases();
  const userId = useRequireUser();
  const rawAisles = useRayonStore((s) => s.aisles);
  const aisles = useMemo(() => buildSortedAisles(rawAisles), [rawAisles]);
  const upsertAisle = useRayonStore((s) => s.upsertAisle);
  const setAisles = useRayonStore((s) => s.setAisles);

  const create = useCallback(
    async (name: string, emoji?: string) => {
      const aisle = await uc.aisles.create(userId, { name, emoji });
      upsertAisle(aisle);
      return aisle;
    },
    [uc, userId, upsertAisle]
  );

  const rename = useCallback(
    async (id: AisleId, name: string) => {
      await uc.aisles.rename(userId, id, name);
      const current = useRayonStore.getState().aisles.find((a) => a.id === id);
      if (current) upsertAisle({ ...current, name: name.trim() });
    },
    [uc, userId, upsertAisle]
  );

  const setEmoji = useCallback(
    async (id: AisleId, emoji: string) => {
      await uc.aisles.setEmoji(userId, id, emoji);
      const current = useRayonStore.getState().aisles.find((a) => a.id === id);
      if (current) upsertAisle({ ...current, emoji: emoji.trim() || '🛒' });
    },
    [uc, userId, upsertAisle]
  );

  const reorder = useCallback(
    async (orderedIds: readonly AisleId[]) => {
      await uc.aisles.reorder(userId, orderedIds);
      const next = useRayonStore.getState().aisles.map((a) => {
        const idx = orderedIds.indexOf(a.id);
        return idx < 0 ? a : { ...a, position: idx };
      });
      setAisles(next);
    },
    [uc, userId, setAisles]
  );

  return { aisles, create, rename, setEmoji, reorder };
}
