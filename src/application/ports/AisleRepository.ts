import type { Aisle, AisleId } from '@domain/aisle';
import type { UserId } from '@domain/user';

export interface AisleRepository {
  listByUser(userId: UserId): Promise<Aisle[]>;
  create(userId: UserId, aisle: Aisle): Promise<void>;
  rename(userId: UserId, id: AisleId, name: string): Promise<void>;
  setEmoji(userId: UserId, id: AisleId, emoji: string): Promise<void>;
  reorder(userId: UserId, orderedIds: readonly AisleId[]): Promise<void>;
  delete(userId: UserId, id: AisleId): Promise<void>;
}
