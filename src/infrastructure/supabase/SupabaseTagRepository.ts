import type { SupabaseClient } from '@supabase/supabase-js';
import { Tag, type TagId } from '@domain/tag';
import type { UserId } from '@domain/user';
import type { TagRepository } from '@application/ports/TagRepository';
import { Mappers, type TagRow } from './mappers';

export class SupabaseTagRepository implements TagRepository {
  constructor(private readonly db: SupabaseClient) {}

  async listByUser(userId: UserId): Promise<Tag[]> {
    const { data, error } = await this.db
      .from('tags')
      .select('id, label')
      .eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).map((r) => Mappers.tag(r as TagRow));
  }

  async create(userId: UserId, tag: Tag): Promise<void> {
    const { error } = await this.db.from('tags').insert({
      id: tag.id,
      user_id: userId,
      label: tag.label,
    });
    if (error) throw error;
  }

  async rename(_userId: UserId, id: TagId, label: string): Promise<void> {
    const { error } = await this.db.from('tags').update({ label }).eq('id', id);
    if (error) throw error;
  }

  async delete(_userId: UserId, id: TagId): Promise<void> {
    const { error } = await this.db.from('tags').delete().eq('id', id);
    if (error) throw error;
  }
}
