import type { SupabaseClient } from '@supabase/supabase-js';
import { Aisle, type AisleId } from '@domain/aisle';
import type { UserId } from '@domain/user';
import type { AisleRepository } from '@application/ports/AisleRepository';
import { Mappers, type AisleRow } from './mappers';

export class SupabaseAisleRepository implements AisleRepository {
  constructor(private readonly db: SupabaseClient) {}

  async listByUser(userId: UserId): Promise<Aisle[]> {
    const { data, error } = await this.db
      .from('aisles')
      .select('id, name, emoji, position')
      .eq('user_id', userId)
      .order('position', { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => Mappers.aisle(r as AisleRow));
  }

  async create(userId: UserId, aisle: Aisle): Promise<void> {
    const { error } = await this.db.from('aisles').insert({
      id: aisle.id,
      user_id: userId,
      name: aisle.name,
      emoji: aisle.emoji,
      position: aisle.position,
    });
    if (error) throw error;
  }

  async rename(_userId: UserId, id: AisleId, name: string): Promise<void> {
    const { error } = await this.db.from('aisles').update({ name }).eq('id', id);
    if (error) throw error;
  }

  async setEmoji(_userId: UserId, id: AisleId, emoji: string): Promise<void> {
    const { error } = await this.db.from('aisles').update({ emoji }).eq('id', id);
    if (error) throw error;
  }

  async reorder(userId: UserId, orderedIds: readonly AisleId[]): Promise<void> {
    // Transaction simple : N updates parallèles. Pour < 30 rayons c'est OK.
    await Promise.all(
      orderedIds.map((id, position) =>
        this.db.from('aisles').update({ position }).eq('id', id).eq('user_id', userId)
      )
    );
  }

  async delete(_userId: UserId, id: AisleId): Promise<void> {
    const { error } = await this.db.from('aisles').delete().eq('id', id);
    if (error) throw error;
  }
}
