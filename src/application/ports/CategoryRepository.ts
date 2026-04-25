import type { Category, CategoryId } from '@domain/category';
import type { UserId } from '@domain/user';

export interface CategoryRepository {
  listByUser(userId: UserId): Promise<Category[]>;
  create(userId: UserId, category: Category): Promise<void>;
  rename(userId: UserId, id: CategoryId, label: string): Promise<void>;
  delete(userId: UserId, id: CategoryId): Promise<void>;
}
