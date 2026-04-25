import type { CategoryId } from '@domain/category';
import type { UserId } from '@domain/user';
import type { CategoryRepository } from '@application/ports/CategoryRepository';

export const deleteCategory =
  (repo: CategoryRepository) =>
  (userId: UserId, id: CategoryId): Promise<void> =>
    repo.delete(userId, id);
