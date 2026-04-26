import { Tag, type TagId } from '@domain/tag';
import type { UserId } from '@domain/user';
import type { TagRepository } from '@application/ports/TagRepository';
import type { InMemoryDatabase } from './InMemoryDatabase';

export class InMemoryTagRepository implements TagRepository {
  constructor(private readonly db: InMemoryDatabase) {}

  async listByUser(userId: UserId) {
    this.db.ensureUser(userId);
    return [...this.db.tags.get(userId)!.values()];
  }

  async create(userId: UserId, tag: Tag) {
    this.db.ensureUser(userId);
    this.db.tags.get(userId)!.set(tag.id, tag);
  }

  async rename(userId: UserId, id: TagId, label: string) {
    this.db.ensureUser(userId);
    const map = this.db.tags.get(userId)!;
    const curr = map.get(id);
    if (!curr) return;
    map.set(id, Tag.rename(curr, label));
  }

  async delete(userId: UserId, id: TagId) {
    this.db.ensureUser(userId);
    this.db.tags.get(userId)!.delete(id);
    // strip from recipes
    const recipes = this.db.recipes.get(userId);
    if (!recipes) return;
    for (const [rid, r] of recipes) {
      if (r.tags.includes(id)) {
        recipes.set(rid, { ...r, tags: r.tags.filter((t) => t !== id) });
      }
    }
  }
}
