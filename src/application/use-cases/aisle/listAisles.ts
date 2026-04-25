import { sortByPosition, type Aisle } from '@domain/aisle';
import type { UserId } from '@domain/user';
import type { AisleRepository } from '@application/ports/AisleRepository';

export const listAisles =
  (repo: AisleRepository) =>
  async (userId: UserId): Promise<Aisle[]> => {
    const all = await repo.listByUser(userId);
    return sortByPosition(all);
  };
