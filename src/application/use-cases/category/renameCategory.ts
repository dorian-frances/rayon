import type { CategoryId } from '@domain/category';
import { ValidationError } from '@domain/shared';
import type { UserId } from '@domain/user';
import type { CategoryRepository } from '@application/ports/CategoryRepository';

export const renameCategory =
  (repo: CategoryRepository) =>
  async (userId: UserId, id: CategoryId, label: string): Promise<void> => {
    if (!label.trim()) {
      throw new ValidationError('Le libellé ne peut pas être vide');
    }
    await repo.rename(userId, id, label.trim());
  };
