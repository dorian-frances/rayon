import { Category, CategoryId, DEFAULT_CATEGORY_COLOR } from '@domain/category';
import type { UserId } from '@domain/user';
import type { CategoryRepository } from '@application/ports/CategoryRepository';
import type { IdGenerator } from '@application/ports/IdGenerator';

export interface CreateCategoryInput {
  label: string;
  color?: string;
}

export const createCategory =
  (repo: CategoryRepository, ids: IdGenerator) =>
  async (userId: UserId, input: CreateCategoryInput): Promise<Category> => {
    const cat = Category.create({
      id: CategoryId.of(ids.newId()),
      label: input.label,
      color: input.color ?? DEFAULT_CATEGORY_COLOR,
    });
    await repo.create(userId, cat);
    return cat;
  };
