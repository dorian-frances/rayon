import { Aisle, AisleId } from '@domain/aisle';
import type { UserId } from '@domain/user';
import type { AisleRepository } from '@application/ports/AisleRepository';
import type { IdGenerator } from '@application/ports/IdGenerator';

export interface CreateAisleInput {
  name: string;
  emoji?: string;
}

export const createAisle =
  (repo: AisleRepository, ids: IdGenerator) =>
  async (userId: UserId, input: CreateAisleInput): Promise<Aisle> => {
    const existing = await repo.listByUser(userId);
    const aisle = Aisle.create({
      id: AisleId.of(ids.newId()),
      name: input.name,
      emoji: input.emoji,
      position: existing.length,
    });
    await repo.create(userId, aisle);
    return aisle;
  };
