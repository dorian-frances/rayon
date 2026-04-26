import type { TagId } from '@domain/tag';
import { ValidationError } from '@domain/shared';
import type { UserId } from '@domain/user';
import type { TagRepository } from '@application/ports/TagRepository';

export const renameTag =
  (repo: TagRepository) =>
  async (userId: UserId, id: TagId, label: string): Promise<void> => {
    if (!label.trim()) throw new ValidationError('Le libellé ne peut pas être vide');
    await repo.rename(userId, id, label.trim());
  };
