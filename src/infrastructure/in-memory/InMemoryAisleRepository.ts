import { Aisle, type AisleId } from '@domain/aisle';
import type { UserId } from '@domain/user';
import type { AisleRepository } from '@application/ports/AisleRepository';
import type { InMemoryDatabase } from './InMemoryDatabase';

export class InMemoryAisleRepository implements AisleRepository {
  constructor(private readonly db: InMemoryDatabase) {}

  async listByUser(userId: UserId) {
    this.db.ensureUser(userId);
    return [...this.db.aisles.get(userId)!.values()];
  }

  async create(userId: UserId, aisle: Aisle) {
    this.db.ensureUser(userId);
    this.db.aisles.get(userId)!.set(aisle.id, aisle);
  }

  async rename(userId: UserId, id: AisleId, name: string) {
    this.db.ensureUser(userId);
    const map = this.db.aisles.get(userId)!;
    const curr = map.get(id);
    if (!curr) return;
    map.set(id, Aisle.rename(curr, name));
  }

  async setEmoji(userId: UserId, id: AisleId, emoji: string) {
    this.db.ensureUser(userId);
    const map = this.db.aisles.get(userId)!;
    const curr = map.get(id);
    if (!curr) return;
    map.set(id, Aisle.setEmoji(curr, emoji));
  }

  async reorder(userId: UserId, orderedIds: readonly AisleId[]) {
    this.db.ensureUser(userId);
    const map = this.db.aisles.get(userId)!;
    orderedIds.forEach((id, idx) => {
      const curr = map.get(id);
      if (curr) map.set(id, Aisle.at(curr, idx));
    });
  }

  async delete(userId: UserId, id: AisleId) {
    this.db.ensureUser(userId);
    this.db.aisles.get(userId)!.delete(id);
  }
}
