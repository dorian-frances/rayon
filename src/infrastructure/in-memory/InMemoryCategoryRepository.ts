import { Category, type CategoryId } from '@domain/category';
import type { UserId } from '@domain/user';
import type { CategoryRepository } from '@application/ports/CategoryRepository';
import type { InMemoryDatabase } from './InMemoryDatabase';

export class InMemoryCategoryRepository implements CategoryRepository {
  constructor(private readonly db: InMemoryDatabase) {}

  async listByUser(userId: UserId) {
    this.db.ensureUser(userId);
    return [...this.db.categories.get(userId)!.values()];
  }

  async create(userId: UserId, category: Category) {
    this.db.ensureUser(userId);
    this.db.categories.get(userId)!.set(category.id, category);
  }

  async rename(userId: UserId, id: CategoryId, label: string) {
    this.db.ensureUser(userId);
    const map = this.db.categories.get(userId)!;
    const curr = map.get(id);
    if (!curr) return;
    map.set(id, Category.rename(curr, label));
  }

  async delete(userId: UserId, id: CategoryId) {
    this.db.ensureUser(userId);
    this.db.categories.get(userId)!.delete(id);
    // remove this category from all recipes
    const recipes = this.db.recipes.get(userId);
    if (!recipes) return;
    for (const [rid, r] of recipes) {
      if (r.categories.includes(id)) {
        recipes.set(rid, {
          ...r,
          categories: r.categories.filter((c) => c !== id),
        });
      }
    }
  }
}
