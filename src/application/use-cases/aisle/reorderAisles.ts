import type { AisleId } from '@domain/aisle';
import type { UserId } from '@domain/user';
import type { AisleRepository } from '@application/ports/AisleRepository';

export const reorderAisles =
  (repo: AisleRepository) =>
  async (userId: UserId, orderedIds: readonly AisleId[]): Promise<void> => {
    await repo.reorder(userId, orderedIds);
  };
