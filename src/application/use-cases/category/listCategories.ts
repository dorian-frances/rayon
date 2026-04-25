import type { Category } from '@domain/category';
import type { UserId } from '@domain/user';
import type { CategoryRepository } from '@application/ports/CategoryRepository';

export const listCategories =
  (repo: CategoryRepository) =>
  (userId: UserId): Promise<Category[]> =>
    repo.listByUser(userId);
