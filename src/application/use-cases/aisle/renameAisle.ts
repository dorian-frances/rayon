import type { AisleId } from '@domain/aisle';
import type { UserId } from '@domain/user';
import { ValidationError } from '@domain/shared';
import type { AisleRepository } from '@application/ports/AisleRepository';

export const renameAisle =
  (repo: AisleRepository) =>
  async (userId: UserId, id: AisleId, name: string): Promise<void> => {
    if (!name.trim()) {
      throw new ValidationError('Le nom du rayon ne peut pas être vide');
    }
    await repo.rename(userId, id, name.trim());
  };
