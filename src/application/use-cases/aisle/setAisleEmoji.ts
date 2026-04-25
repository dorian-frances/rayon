import type { AisleId } from '@domain/aisle';
import type { UserId } from '@domain/user';
import type { AisleRepository } from '@application/ports/AisleRepository';

export const setAisleEmoji =
  (repo: AisleRepository) =>
  async (userId: UserId, id: AisleId, emoji: string): Promise<void> => {
    await repo.setEmoji(userId, id, emoji.trim() || '🛒');
  };
